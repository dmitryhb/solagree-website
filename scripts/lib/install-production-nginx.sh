#!/usr/bin/env bash

set -euo pipefail

# Re-apply ownership to the app user in case rsync ran as root via sudo.
sudo -n chown -R "$REMOTE_OWNER" "$REMOTE_PATH"

# Snapshot all managed nginx files once, before either include or snippet changes.
# Unique, private backups cannot be overwritten by a second include insertion.
BACKUP_DIR="$(sudo -n mktemp -d /etc/nginx/.solagree-deploy.XXXXXX)"
MANAGED_FILES=("$REMOTE_NGINX_SITE_CONFIG" "$REMOTE_LEGACY_REDIRECTS_SNIPPET" "$REMOTE_CO_BRANDED_NOINDEX_SNIPPET")
for index in "${!MANAGED_FILES[@]}"; do
  if sudo -n test -e "${MANAGED_FILES[$index]}" || sudo -n test -L "${MANAGED_FILES[$index]}"; then
    sudo -n cp -a "${MANAGED_FILES[$index]}" "$BACKUP_DIR/$index"
  fi
done

restore_on_failure() {
  local status=$?
  trap - EXIT
  if [ "$status" -ne 0 ]; then
    echo "nginx installation failed; restoring the original site config and snippets." >&2
    local restored=true
    for index in "${!MANAGED_FILES[@]}"; do
      if sudo -n test -e "$BACKUP_DIR/$index" || sudo -n test -L "$BACKUP_DIR/$index"; then
        sudo -n cp -a "$BACKUP_DIR/$index" "${MANAGED_FILES[$index]}" || restored=false
      else
        sudo -n rm -f "${MANAGED_FILES[$index]}" || restored=false
      fi
      sudo -n rm -f "${MANAGED_FILES[$index]}.tmp" || restored=false
    done
    if [ "$restored" = true ] && sudo -n nginx -t && sudo -n systemctl reload nginx; then
      echo "Original nginx files restored and reloaded." >&2
    else
      echo "nginx recovery failed; original files retained in $BACKUP_DIR for manual recovery." >&2
      exit "$status"
    fi
  fi
  sudo -n rm -rf "$BACKUP_DIR"
  exit "$status"
}
trap restore_on_failure EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

install_snippet() {
  local snippet_path="$1"
  local snippet_b64="$2"

  sudo -n install -d -m 755 "$(dirname "$snippet_path")"
  printf '%s' "$snippet_b64" \
    | base64 --decode \
    | sudo -n tee "${snippet_path}.tmp" >/dev/null
  # Replace the path itself so an existing symlink target remains untouched.
  sudo -n mv "${snippet_path}.tmp" "$snippet_path"
}

# Inserts an include before the root directive of the www server block.
ensure_include_in_www_server_block() {
  local include_line="include $1;"

  if sudo -n grep -Fq "$include_line" "$REMOTE_NGINX_SITE_CONFIG"; then
    return 0
  fi

  echo "Adding ${include_line} to ${REMOTE_NGINX_SITE_CONFIG}"
  sudo -n awk -v snippet="    ${include_line}" '
    /^[[:space:]]*server_name[[:space:]]+www[.]solagree[.]com;/ {
      in_www_server = 1
    }

    in_www_server && !inserted && /^[[:space:]]*root[[:space:]]/ {
      print snippet
      inserted = 1
    }

    {
      print
    }

    END {
      if (!inserted) {
        exit 2
      }
    }
  ' "$REMOTE_NGINX_SITE_CONFIG" | sudo -n tee "${REMOTE_NGINX_SITE_CONFIG}.tmp" >/dev/null
  sudo -n mv "${REMOTE_NGINX_SITE_CONFIG}.tmp" "$REMOTE_NGINX_SITE_CONFIG"
}

install_snippet "$REMOTE_LEGACY_REDIRECTS_SNIPPET" "$LEGACY_REDIRECTS_SNIPPET_B64"
install_snippet "$REMOTE_CO_BRANDED_NOINDEX_SNIPPET" "$CO_BRANDED_NOINDEX_SNIPPET_B64"
ensure_include_in_www_server_block "$REMOTE_LEGACY_REDIRECTS_SNIPPET"
ensure_include_in_www_server_block "$REMOTE_CO_BRANDED_NOINDEX_SNIPPET"

sudo -n nginx -t
sudo -n systemctl reload nginx
