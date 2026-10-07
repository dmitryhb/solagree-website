"""Restricted SSH inventory/backup helper. JSON output contains hashes, never file bodies."""
import base64
import hashlib
import json
import os
import shutil
import stat
import sys


def inventory(root):
    if not os.path.isabs(root) or os.path.realpath(root) != root or not os.path.isdir(root):
        raise ValueError("target must be an existing absolute directory without symlink parents")
    files = {}
    directories = []
    for directory, folders, names in os.walk(root, followlinks=False):
        folders.sort()
        names.sort()
        for name in folders + names:
            path = os.path.join(directory, name)
            relative = os.path.relpath(path, root).replace(os.sep, "/")
            if any(ord(character) < 32 for character in relative):
                raise ValueError("target contains unsupported control characters")
            mode = os.lstat(path).st_mode
            if stat.S_ISDIR(mode):
                directories.append(relative)
            elif stat.S_ISREG(mode):
                with open(path, "rb") as source:
                    files[relative] = hashlib.sha256(source.read()).hexdigest()
            else:
                raise ValueError("target contains a symlink or non-regular entry")
    data = {"files": files, "directories": sorted(directories)}
    data["sha256"] = hashlib.sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return data


try:
    request = json.loads(base64.b64decode(sys.argv[1]))
    root = request["root"].rstrip("/")
    before = inventory(root)
    if request["mode"] == "backup":
        if before["sha256"] != request["expected"]:
            raise ValueError("target changed after the reviewed inventory; no backup or upload allowed")
        backup = request["backup"]
        parent = os.path.dirname(backup)
        if not os.path.isabs(backup) or os.path.commonpath([root, backup]) == root:
            raise ValueError("backup must be outside the served root")
        os.makedirs(parent, mode=0o700, exist_ok=True)
        if os.path.realpath(parent) != parent or os.lstat(parent).st_mode & 0o077:
            raise ValueError("backup parent must be private and have no symlink parents")
        if os.path.lexists(backup):
            raise ValueError("backup destination already exists")
        os.mkdir(backup, mode=0o700)
        shutil.copytree(root, os.path.join(backup, "public"), symlinks=True)
        if inventory(os.path.join(backup, "public"))["sha256"] != before["sha256"] or inventory(root)["sha256"] != before["sha256"]:
            raise ValueError("target changed during backup; upload refused")
        with open(os.path.join(backup, "inventory.json"), "x") as handle:
            json.dump(before, handle, sort_keys=True)
        before["backup"] = backup
    elif request["mode"] != "inventory":
        raise ValueError("unsupported target operation")
    print(json.dumps(before, sort_keys=True))
except Exception as error:
    print("Staging target check failed: " + str(error), file=sys.stderr)
    sys.exit(1)
