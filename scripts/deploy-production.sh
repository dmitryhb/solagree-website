#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/.output/public/"
LEGACY_REDIRECTS_SNIPPET="$ROOT_DIR/config/nginx/legacy-redirects.conf"

SSH_USER="${SSH_USER:-ubuntu}"
SSH_HOST="${SSH_HOST:-15.204.253.205}"
REMOTE_PATH="${REMOTE_PATH:-/home/solagree/public_html/}"
REMOTE_OWNER="${REMOTE_OWNER:-solagree:solagree}"
REMOTE_LEGACY_REDIRECTS_SNIPPET="${REMOTE_LEGACY_REDIRECTS_SNIPPET:-/etc/nginx/snippets/solagree-legacy-redirects.conf}"

PRODUCTION_SITE_URL="${NUXT_PUBLIC_SITE_URL:-https://www.solagree.com}"
PRODUCTION_PORTAL_URL="${NUXT_PUBLIC_PORTAL_URL:-https://portal.solagree.com}"
PRODUCTION_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL:-https://portal.solagree.com}"

# Pre-DNS testing: when the DNS hasn't switched yet we still want to verify the
# deploy actually landed on the production server. ROUTE_CHECK_HOST overrides
# the hostname used in the post-deploy curl probe (paired with --resolve), and
# defaults to the IP so we can verify the server-side without needing /etc/hosts
# entries on the deploy machine.
ROUTE_CHECK_HOST="${ROUTE_CHECK_HOST:-www.solagree.com}"
ROUTE_CHECK_RESOLVE_IP="${ROUTE_CHECK_RESOLVE_IP:-$SSH_HOST}"

DRY_RUN=false
SKIP_BUILD=false
SKIP_ROUTE_CHECK=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --skip-build) SKIP_BUILD=true ;;
    --skip-route-check) SKIP_ROUTE_CHECK=true ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Supported options: --dry-run, --skip-build, --skip-route-check" >&2
      exit 1
      ;;
  esac
done

if [ "$SKIP_BUILD" = false ]; then
  echo "Generating static output for production..."
  export NUXT_PUBLIC_SITE_URL="$PRODUCTION_SITE_URL"
  export NUXT_PUBLIC_PORTAL_URL="$PRODUCTION_PORTAL_URL"
  export NUXT_PUBLIC_PORTAL_API_BASE_URL="$PRODUCTION_PORTAL_API_BASE_URL"
  echo "  Site URL:            $NUXT_PUBLIC_SITE_URL"
  echo "  Portal URL:          $NUXT_PUBLIC_PORTAL_URL"
  echo "  Portal API base URL: $NUXT_PUBLIC_PORTAL_API_BASE_URL"
  npm run generate
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Expected output directory not found: $OUTPUT_DIR" >&2
  exit 1
fi

RSYNC_ARGS=(
  -avz
  --delete
  --rsync-path="sudo -n rsync"
)

if [ "$DRY_RUN" = true ]; then
  RSYNC_ARGS+=(--dry-run)
fi

SSH_TARGET="${SSH_USER}@${SSH_HOST}"

echo "Deploying $OUTPUT_DIR to ${SSH_TARGET}:${REMOTE_PATH}"
rsync "${RSYNC_ARGS[@]}" "$OUTPUT_DIR" "${SSH_TARGET}:${REMOTE_PATH}"

if [ "$DRY_RUN" = false ]; then
  # Re-apply ownership to the app user in case rsync ran as root via sudo.
  ssh "$SSH_TARGET" "sudo -n chown -R ${REMOTE_OWNER} ${REMOTE_PATH}"

  echo "Installing nginx legacy redirect snippet at ${REMOTE_LEGACY_REDIRECTS_SNIPPET}"
  ssh "$SSH_TARGET" "sudo -n install -d -m 755 '$(dirname "$REMOTE_LEGACY_REDIRECTS_SNIPPET")'"
  ssh "$SSH_TARGET" "sudo -n tee '${REMOTE_LEGACY_REDIRECTS_SNIPPET}' >/dev/null" < "$LEGACY_REDIRECTS_SNIPPET"
  ssh "$SSH_TARGET" "sudo -n nginx -t && sudo -n systemctl reload nginx"
fi

if [ "$DRY_RUN" = false ] && [ "$SKIP_ROUTE_CHECK" = false ]; then
  ROUTE_CHECK_URL="https://${ROUTE_CHECK_HOST}/go/__co-branded-route-check__"
  ROUTE_CHECK_STATUS="$(curl -sS -o /dev/null -k \
    --resolve "${ROUTE_CHECK_HOST}:443:${ROUTE_CHECK_RESOLVE_IP}" \
    -w "%{http_code}" "$ROUTE_CHECK_URL" || true)"

  if [ "$ROUTE_CHECK_STATUS" = "404" ]; then
    cat >&2 <<MESSAGE
Production route check failed: $ROUTE_CHECK_URL returned HTTP 404.

The static website nginx server block for $ROUTE_CHECK_HOST must route dynamic
Nuxt paths such as /go/:slug to /200.html. Confirm the nginx config has:

  location / {
      try_files \$uri \$uri/ /200.html;
  }
MESSAGE
    exit 1
  fi

  echo "Route check passed: $ROUTE_CHECK_URL returned HTTP $ROUTE_CHECK_STATUS"

  LEGACY_REDIRECT_CHECK_URL="https://${ROUTE_CHECK_HOST}/about/"
  LEGACY_REDIRECT_CHECK_RESULT="$(curl -sS -o /dev/null -k \
    --resolve "${ROUTE_CHECK_HOST}:443:${ROUTE_CHECK_RESOLVE_IP}" \
    -w "%{http_code} %{redirect_url}" "$LEGACY_REDIRECT_CHECK_URL" || true)"
  LEGACY_REDIRECT_CHECK_STATUS="${LEGACY_REDIRECT_CHECK_RESULT%% *}"
  LEGACY_REDIRECT_CHECK_TARGET="${LEGACY_REDIRECT_CHECK_RESULT#* }"
  EXPECTED_LEGACY_REDIRECT_TARGET="https://${ROUTE_CHECK_HOST}/about-us"

  if [ "$LEGACY_REDIRECT_CHECK_STATUS" != "301" ] \
    || [ "$LEGACY_REDIRECT_CHECK_TARGET" != "$EXPECTED_LEGACY_REDIRECT_TARGET" ]; then
    cat >&2 <<MESSAGE
Production legacy redirect check failed: $LEGACY_REDIRECT_CHECK_URL returned
HTTP $LEGACY_REDIRECT_CHECK_STATUS with Location "$LEGACY_REDIRECT_CHECK_TARGET".

The nginx server block for $ROUTE_CHECK_HOST must include:

  include ${REMOTE_LEGACY_REDIRECTS_SNIPPET};

Place the include before the SPA fallback location.
MESSAGE
    exit 1
  fi

  echo "Legacy redirect check passed: $LEGACY_REDIRECT_CHECK_URL returned 301 to $LEGACY_REDIRECT_CHECK_TARGET"
fi
