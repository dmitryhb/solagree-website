"""Private static release store. Invoked over SSH with a base64 JSON request.

No nginx configuration is installed or reloaded. All writes are under the
reviewed store, except the final atomic replacement of the webroot symlink.
"""
import base64
import contextlib
import fcntl
import hashlib
import json
import os
import re
import shutil
import socket
import stat
import subprocess
import sys
import tempfile
import uuid

GATES = ["npm run lint", "npm run typecheck", "npm test", "npm run test:release-host", "npm run generate", "node scripts/verify-release-artifact.mjs", "node scripts/verify-sitemap.mjs"]
RUNTIME = ["scripts/lib/route-http-contract.mjs", "scripts/lib/release-candidate.mjs", "config/nginx/co-branded-noindex.conf", "config/nginx/legacy-redirects.conf"]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical(data):
    return json.dumps(data, sort_keys=True, separators=(",", ":")).encode()


def load(path):
    with open(path, "rb") as source:
        return json.load(source)


def bytes_at(path):
    with open(path, "rb") as source:
        return source.read()


def safe_path(path):
    if not isinstance(path, str) or not path or path.startswith("/") or "\\" in path or any(part in ("", ".", "..") for part in path.split("/")) or any(ord(c) < 32 for c in path):
        raise ValueError("unsafe inventory path")
    return path


def inventory(root):
    if os.path.realpath(root) != root or not os.path.isdir(root):
        raise ValueError("inventory root must be an absolute real directory")
    files, directories = {}, []
    for folder, folders, names in os.walk(root, followlinks=False):
        for name in sorted(folders + names):
            path = os.path.join(folder, name)
            relative = safe_path(os.path.relpath(path, root))
            mode = os.lstat(path).st_mode
            if stat.S_ISDIR(mode):
                directories.append(relative)
            elif stat.S_ISREG(mode):
                files[relative] = digest(bytes_at(path))
            else:
                raise ValueError("symlinks and non-regular entries are forbidden")
    return {"files": files, "directories": sorted(directories)}


def preserved(path):
    hidden = any(part.startswith(".") for part in path.split("/"))
    generated_legal = path == "legal/index.html" or re.fullmatch(r"legal/(terms-of-service|privacy-policy|accessibility)/(index\.html|_payload\.json)", path)
    immutable_legal = path.startswith("legal/") and not generated_legal
    retained_asset = path.startswith("_nuxt/") and path != "_nuxt/builds/latest.json"
    return bool(hidden or immutable_legal or retained_asset)


def verify_bundle(bundle, policy):
    artifact = os.path.join(bundle, "artifact")
    manifest_bytes = bytes_at(os.path.join(artifact, "release-manifest.json"))
    manifest = json.loads(manifest_bytes)
    proof = load(os.path.join(bundle, "release-proof.json"))
    if manifest.get("schemaVersion") != 1 or not re.fullmatch(r"[a-f0-9]{40}", manifest.get("commit", "")):
        raise ValueError("invalid artifact identity")
    if any(manifest.get(key) != value for key, value in policy.items()):
        raise ValueError("artifact environment or GA policy does not match destination")
    actual = inventory(artifact)["files"]
    del actual["release-manifest.json"]
    if actual != manifest.get("files") or any(path not in actual for path in ["index.html", "200.html", "webinars/index.html", "sitemap.xml"]):
        raise ValueError("uploaded artifact hashes do not match manifest")
    for path in actual:
        if any(part.startswith(".") for part in path.split("/")) or re.search(r"\.(conf|ini|php)$", path, re.I):
            raise ValueError("static artifact contains protected configuration or executable files")
    if proof.get("schemaVersion") != 1 or proof.get("commit") != manifest["commit"] or proof.get("manifestSha256") != digest(manifest_bytes) or proof.get("files") != actual:
        raise ValueError("release proof does not match complete artifact")
    if proof.get("gates") != [{"command": command, "exitCode": 0} for command in GATES] or not re.fullmatch(r"[a-f0-9]{40}", proof.get("tree", "")) or not re.fullmatch(r"[a-f0-9]{64}", proof.get("lockSha256", "")):
        raise ValueError("release proof lacks successful preflight gates or source identity")
    runtime = inventory(os.path.join(bundle, "runtime"))["files"]
    if set(runtime) != set(RUNTIME) or runtime != proof.get("runtime"):
        raise ValueError("candidate runtime does not match verified preflight contract")
    return manifest


class Host:
    def __init__(self, request):
        self.request = request
        self.root = request["root"]
        self.store = request["store"]
        for path in [self.root, self.store]:
            if not re.fullmatch(r"/[A-Za-z0-9_./-]+", path) or os.path.normpath(path) != path or os.path.realpath(os.path.dirname(path)) != os.path.dirname(path):
                raise ValueError("host paths must be absolute without symlink parents")
        if os.path.dirname(self.root) != os.path.dirname(self.store) or self.root == self.store:
            raise ValueError("release store must be a sibling of the webroot")
        if os.path.lexists(self.store) and (os.path.islink(self.store) or not os.path.isdir(self.store)):
            raise ValueError("release store is not a real directory")

    def active(self):
        if not os.path.lexists(self.root):
            return {"id": None, "inventory": {"files": {}, "directories": []}, "sha256": digest(b"absent")}
        if not os.path.islink(self.root):
            # Reading legacy content is useful for the reviewed migration plan,
            # but no script ever renames a live directory to create a symlink.
            return {"id": "legacy-directory", "inventory": inventory(self.root), "sha256": digest(canonical(inventory(self.root)))}
        target = os.readlink(self.root)
        match = re.fullmatch(re.escape(self.store) + r"/releases/([a-f0-9]{64})/public", target)
        if not match or os.path.realpath(target) != target:
            raise ValueError("webroot symlink escapes the immutable release store")
        release = os.path.dirname(target)
        self.verify_seal(release)
        data = inventory(target)
        accepted_path = os.path.join(release, "accepted.json")
        accepted = load(accepted_path) if os.path.isfile(accepted_path) else {}
        return {"id": match[1], "accepted": accepted.get("schemaVersion") == 1 and accepted.get("id") == match[1], "inventory": data, "sha256": digest(canonical({"id": match[1], **data}))}

    def verify_seal(self, release):
        if os.path.realpath(release) != release:
            raise ValueError("release escapes store")
        seal = load(os.path.join(release, "release.json"))
        if seal["public"] != inventory(os.path.join(release, "public")) or seal["bundle"] != inventory(os.path.join(release, "bundle")):
            raise ValueError("immutable release inventory has changed")
        if digest(canonical(seal)) != os.path.basename(release):
            raise ValueError("release identity does not match sealed inventories")

    @contextlib.contextmanager
    def locked(self):
        os.makedirs(self.store, mode=0o755, exist_ok=True)
        fd = os.open(os.path.join(self.store, ".lock"), os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600)
        try:
            try:
                fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise ValueError("another promotion or rollback holds the release lock") from None
            for part in ["incoming", "releases"]:
                path = os.path.join(self.store, part)
                if os.path.lexists(path) and (os.path.islink(path) or not os.path.isdir(path)):
                    raise ValueError("store directory is unsafe")
                os.makedirs(path, mode=0o700 if part == "incoming" else 0o755, exist_ok=True)
            yield
        finally:
            os.close(fd)

    def expected(self):
        before = self.active()
        if before["id"] == "legacy-directory":
            raise ValueError("legacy real-directory webroot requires separately approved maintenance migration; no files changed")
        if before["sha256"] != self.request.get("expected"):
            raise ValueError("active inventory changed since reviewed preflight")
        if before["id"] is None and not self.request.get("initialize"):
            raise ValueError("absent webroot requires explicit first-release initialization")
        if before["id"] and not before.get("accepted") and self.request["mode"] != "rollback":
            raise ValueError("active release lacks public acceptance; inspect and roll back to a retained accepted release")
        return before

    def candidate_http(self, release, public=False):
        runtime = os.path.join(release, "bundle", "runtime")
        artifact = os.path.join(release, "public")
        check = {"artifactDirectory": artifact, "legacyRedirect": self.request["policy"]["environment"] == "production"}
        if public:
            check.update(self.request["publicCheck"])
            # Credentials exist in stdin only. Neither proof nor release metadata
            # stores them. Public staging BasicAuth is never disabled.
            check["env"] = {**os.environ, **self.request.get("auth", {})}
            return subprocess.run(["node", os.path.join(runtime, "scripts/lib/release-candidate.mjs")], input=canonical(check), stdout=sys.stderr, check=True)
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        with tempfile.TemporaryDirectory(prefix="candidate-", dir=self.store) as nginx:
            config = os.path.join(nginx, "nginx.conf")
            with open(config, "w") as output:
                output.write(f'''pid {nginx}/nginx.pid;
error_log {nginx}/error.log;
events {{ worker_connections 64; }}
http {{ access_log off; default_type text/html; server {{
listen 127.0.0.1:{port}; server_name localhost; root {artifact};
include {runtime}/config/nginx/co-branded-noindex.conf;
include {runtime}/config/nginx/legacy-redirects.conf;
location / {{ try_files $uri $uri/ /200.html; }}
}} }}
''')
            started = False
            try:
                subprocess.run(["nginx", "-p", nginx + "/", "-c", config, "-t"], stdout=sys.stderr, stderr=sys.stderr, check=True)
                subprocess.run(["nginx", "-p", nginx + "/", "-c", config], stdout=sys.stderr, stderr=sys.stderr, check=True)
                started = True
                check.update({"baseUrl": f"http://127.0.0.1:{port}", "env": {**os.environ, "STAGING_BASIC_AUTH_USER": "", "STAGING_BASIC_AUTH_PASSWORD": ""}})
                subprocess.run(["node", os.path.join(runtime, "scripts/lib/release-candidate.mjs")], input=canonical(check), stdout=sys.stderr, check=True)
            finally:
                if started:
                    subprocess.run(["nginx", "-p", nginx + "/", "-c", config, "-s", "quit"], stdout=sys.stderr, stderr=sys.stderr, check=True)

    def activate(self, bundle, before):
        manifest = verify_bundle(bundle, self.request["policy"])
        previous = os.path.join(self.store, "releases", before["id"]) if before["id"] else None
        previous_manifest = load(os.path.join(previous, "bundle/artifact/release-manifest.json")) if previous else {"files": {}}
        candidate = tempfile.mkdtemp(prefix="compose-", dir=self.store)
        try:
            public = os.path.join(candidate, "public")
            if previous:
                shutil.copytree(os.path.join(previous, "public"), public)
            else:
                os.mkdir(public)
            # Drop obsolete files owned by the prior artifact. Preserve history,
            # remote-only content and old hashed lazy chunks for open tabs.
            for path in previous_manifest["files"]:
                if path not in manifest["files"] and not preserved(path):
                    os.unlink(os.path.join(public, path))
            for path, value in manifest["files"].items():
                if path in before["inventory"]["files"] and preserved(path) and before["inventory"]["files"][path] != value:
                    raise ValueError("artifact conflicts with protected legal history or retained asset")
            for path in [*manifest["files"], "release-manifest.json"]:
                destination = os.path.join(public, path)
                # Avoid replacing a directory or using a former file as parent.
                os.makedirs(os.path.dirname(destination), exist_ok=True)
                if os.path.isdir(destination):
                    raise ValueError("artifact file collides with existing directory")
                shutil.copyfile(os.path.join(bundle, "artifact", path), destination)
                os.chmod(destination, 0o644)
            shutil.copytree(bundle, os.path.join(candidate, "bundle"))
            verify_bundle(os.path.join(candidate, "bundle"), self.request["policy"])
            composed = inventory(public)["files"]
            if any(composed.get(path) != value for path, value in manifest["files"].items()) or composed.get("release-manifest.json") != digest(bytes_at(os.path.join(bundle, "artifact/release-manifest.json"))):
                raise ValueError("composed candidate does not match verified artifact")
            # The complete served tree and private original artifact are sealed.
            # Rollback uses the original bundle and never rebuilds or edits it.
            seal = {"schemaVersion": 1, "public": inventory(public), "bundle": inventory(os.path.join(candidate, "bundle"))}
            release_id = digest(canonical(seal))
            with open(os.path.join(candidate, "release.json"), "wb") as output:
                output.write(canonical(seal))
            os.chmod(candidate, 0o755)
            os.chmod(os.path.join(candidate, "bundle"), 0o700)
            self.candidate_http(candidate)
            # Verify both candidate and active bytes after health checks and
            # before switching. External target writers must be held separately.
            if inventory(public) != seal["public"] or inventory(os.path.join(candidate, "bundle")) != seal["bundle"]:
                raise ValueError("candidate changed during verification")
            if self.active() != before:
                raise ValueError("active site changed during candidate verification")
            destination = os.path.join(self.store, "releases", release_id)
            if os.path.exists(destination):
                self.verify_seal(destination)
                shutil.rmtree(candidate)
            else:
                os.rename(candidate, destination)
            self.switch(os.path.join(destination, "public"))
            try:
                self.candidate_http(destination, public=True)
                accepted = os.path.join(destination, "accepted.json")
                temporary_acceptance = accepted + ".pending"
                with open(temporary_acceptance, "wb") as output:
                    output.write(canonical({"schemaVersion": 1, "id": release_id, "commit": manifest["commit"]}))
                    output.flush()
                    os.fsync(output.fileno())
                os.replace(temporary_acceptance, accepted)
                active = self.active()
            except Exception:
                if previous:
                    self.switch(os.path.join(previous, "public"))
                else:
                    os.unlink(self.root)
                raise ValueError("public HTTP check failed; previous webroot restored") from None
            return {"id": release_id, "previous": before["id"], "commit": manifest["commit"], "sha256": active["sha256"]}
        finally:
            if os.path.isdir(candidate):
                shutil.rmtree(candidate)

    def switch(self, target):
        link = self.root + ".switch-" + uuid.uuid4().hex
        try:
            os.symlink(target, link)
            os.replace(link, self.root)
        finally:
            if os.path.lexists(link):
                os.unlink(link)

    def run(self):
        mode = self.request["mode"]
        if mode == "inspect":
            return self.active()
        with self.locked():
            before = self.expected()
            if mode == "begin":
                if before["id"]:
                    # Validate the already installed public hosting contract and
                    # BasicAuth before uploading a candidate or touching traffic.
                    self.candidate_http(os.path.join(self.store, "releases", before["id"]), public=True)
                token = uuid.uuid4().hex
                path = os.path.join(self.store, "incoming", token)
                os.mkdir(path, 0o700)
                return {"token": token, "path": path, "before": before["sha256"]}
            if mode == "promote":
                token = self.request.get("token", "")
                if not re.fullmatch(r"[a-f0-9]{32}", token):
                    raise ValueError("invalid incoming candidate token")
                bundle = os.path.join(self.store, "incoming", token)
                if os.path.realpath(bundle) != bundle:
                    raise ValueError("candidate escapes store")
                result = self.activate(bundle, before)
                shutil.rmtree(bundle)
                return result
            if mode == "rollback":
                release_id = self.request.get("release", "")
                if not re.fullmatch(r"[a-f0-9]{64}", release_id):
                    raise ValueError("rollback requires a full retained release id")
                release = os.path.join(self.store, "releases", release_id)
                self.verify_seal(release)
                accepted = load(os.path.join(release, "accepted.json"))
                if accepted.get("schemaVersion") != 1 or accepted.get("id") != release_id:
                    raise ValueError("rollback target has no successful HTTP acceptance record")
                return self.activate(os.path.join(release, "bundle"), before)
            raise ValueError("unsupported release operation")


try:
    request = json.loads(sys.stdin.buffer.read())
    print(json.dumps(Host(request).run(), sort_keys=True))
except Exception as error:
    print("Release operation refused/failed: " + str(error), file=sys.stderr)
    sys.exit(1)
