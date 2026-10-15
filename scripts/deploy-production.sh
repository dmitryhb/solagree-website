#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/.output/public/"
LEGACY_REDIRECTS_SNIPPET="$ROOT_DIR/config/nginx/legacy-redirects.conf"
CO_BRANDED_NOINDEX_SNIPPET="$ROOT_DIR/config/nginx/co-branded-noindex.conf"

SSH_USER="${SSH_USER:-ubuntu}"
SSH_HOST="${SSH_HOST:-15.204.253.205}"
REMOTE_PATH="${REMOTE_PATH:-/home/solagree/public_html/}"
REMOTE_OWNER="${REMOTE_OWNER:-solagree:solagree}"
REMOTE_LEGACY_REDIRECTS_SNIPPET="${REMOTE_LEGACY_REDIRECTS_SNIPPET:-/etc/nginx/snippets/solagree-legacy-redirects.conf}"
REMOTE_CO_BRANDED_NOINDEX_SNIPPET="${REMOTE_CO_BRANDED_NOINDEX_SNIPPET:-/etc/nginx/snippets/solagree-co-branded-noindex.conf}"
REMOTE_NGINX_SITE_CONFIG="${REMOTE_NGINX_SITE_CONFIG:-/etc/nginx/sites-available/solagree-website}"

PRODUCTION_SITE_URL="${NUXT_PUBLIC_SITE_URL-https://www.solagree.com}"
PRODUCTION_PORTAL_URL="${NUXT_PUBLIC_PORTAL_URL-https://portal.solagree.com}"
PRODUCTION_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL-https://portal.solagree.com}"
PRODUCTION_GA_MEASUREMENT_ID="${NUXT_PUBLIC_GA_MEASUREMENT_ID-}"
PRODUCTION_CALCOM_FIRST_AVAILABLE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH:-initial-consults/initial-consult}"
PRODUCTION_CALCOM_TAJ_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH:-initial-consults/initial-consult-taj}"
PRODUCTION_CALCOM_STACIE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH:-initial-consults/initial-consult-stacie}"
PRODUCTION_CALCOM_JESSICA_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH:-initial-consults/initial-consult-jessica}"
PRODUCTION_CALCOM_JAMES_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH:-initial-consults/initial-consult-james}"

# Route probes use the production hostname for certificate verification, with
# --resolve pinning the connection to the deployment server even before DNS changes.
ROUTE_CHECK_HOST="${ROUTE_CHECK_HOST:-www.solagree.com}"
ROUTE_CHECK_RESOLVE_IP="${ROUTE_CHECK_RESOLVE_IP:-$SSH_HOST}"

DRY_RUN=false
SKIP_BUILD=false
SKIP_ROUTE_CHECK=false
CONFIRM_PRODUCTION="${DEPLOY_CONFIRM_PRODUCTION:-}"

for arg in "$@"; do
  case "$arg" in
    --i-confirm-production-deploy) CONFIRM_PRODUCTION=yes ;;
    --dry-run) DRY_RUN=true ;;
    --skip-build) SKIP_BUILD=true ;;
    --skip-route-check) SKIP_ROUTE_CHECK=true ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Supported options: --i-confirm-production-deploy, --dry-run, --skip-build, --skip-route-check" >&2
      exit 1
      ;;
  esac
done

if [ "$CONFIRM_PRODUCTION" != yes ]; then
  echo "Production deployment requires --i-confirm-production-deploy or DEPLOY_CONFIRM_PRODUCTION=yes (including dry runs)." >&2
  exit 1
fi

export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE-mixed}"
node "$ROOT_DIR/scripts/verify-production-booking.mjs" --policy-only

# Resolve and validate destination even when reusing an existing build.
export NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT="production"
export NUXT_PUBLIC_SITE_URL="$PRODUCTION_SITE_URL"
export NUXT_PUBLIC_PORTAL_URL="$PRODUCTION_PORTAL_URL"
export NUXT_PUBLIC_PORTAL_API_BASE_URL="$PRODUCTION_PORTAL_API_BASE_URL"
export NUXT_PUBLIC_GA_MEASUREMENT_ID="$PRODUCTION_GA_MEASUREMENT_ID"
node "$ROOT_DIR/scripts/verify-release-artifact.mjs" --policy-only --require-explicit-analytics

if [ "$SKIP_BUILD" = false ]; then
  echo "Generating static output for production..."
  export NUXT_PUBLIC_SITE_URL="$PRODUCTION_SITE_URL"
  export NUXT_PUBLIC_PORTAL_URL="$PRODUCTION_PORTAL_URL"
  export NUXT_PUBLIC_PORTAL_API_BASE_URL="$PRODUCTION_PORTAL_API_BASE_URL"
  export NUXT_PUBLIC_GA_MEASUREMENT_ID="$PRODUCTION_GA_MEASUREMENT_ID"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH="$PRODUCTION_CALCOM_FIRST_AVAILABLE_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH="$PRODUCTION_CALCOM_TAJ_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH="$PRODUCTION_CALCOM_STACIE_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH="$PRODUCTION_CALCOM_JESSICA_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH="$PRODUCTION_CALCOM_JAMES_EVENT_PATH"
  echo "  Site URL:            $NUXT_PUBLIC_SITE_URL"
  echo "  Portal URL:          $NUXT_PUBLIC_PORTAL_URL"
  echo "  Portal API base URL: $NUXT_PUBLIC_PORTAL_API_BASE_URL"
  echo "  GA Measurement ID:   $NUXT_PUBLIC_GA_MEASUREMENT_ID"
  echo "  Cal.com booking:      configured for Solagree Initial Consults"
  npm run generate
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Expected output directory not found: $OUTPUT_DIR" >&2
  exit 1
fi

# Fail the deployment before rsync when the static sitemap is missing or invalid.
node "$ROOT_DIR/scripts/verify-release-artifact.mjs"
node "$ROOT_DIR/scripts/verify-sitemap.mjs"
node "$ROOT_DIR/scripts/verify-production-booking.mjs"

RSYNC_ARGS=(
  -avz
  --delete
  --filter='P /legal/partner-terms/***'
  --filter='P /.well-known/***'
  --filter='R /release-manifest.json'
  --filter='R /.htaccess'
  --exclude=release-manifest.json
  --include='/.well-known/***'
  --exclude='.*'
  --rsync-path="sudo -n rsync"
)

if [ "$DRY_RUN" = true ]; then
  RSYNC_ARGS+=(--dry-run)
fi

SSH_TARGET="${SSH_USER}@${SSH_HOST}"

echo "Deploying $OUTPUT_DIR to ${SSH_TARGET}:${REMOTE_PATH}"
rsync "${RSYNC_ARGS[@]}" "$OUTPUT_DIR" "${SSH_TARGET}:${REMOTE_PATH}"

if [ "$DRY_RUN" = false ]; then
  LEGACY_REDIRECTS_SNIPPET_B64="$(base64 < "$LEGACY_REDIRECTS_SNIPPET" | tr -d '\n')"
  CO_BRANDED_NOINDEX_SNIPPET_B64="$(base64 < "$CO_BRANDED_NOINDEX_SNIPPET" | tr -d '\n')"

  echo "Installing nginx snippets at ${REMOTE_LEGACY_REDIRECTS_SNIPPET} and ${REMOTE_CO_BRANDED_NOINDEX_SNIPPET}"
  printf -v REMOTE_COMMAND '%q ' env \
    "REMOTE_OWNER=$REMOTE_OWNER" "REMOTE_PATH=$REMOTE_PATH" \
    "REMOTE_NGINX_SITE_CONFIG=$REMOTE_NGINX_SITE_CONFIG" \
    "REMOTE_LEGACY_REDIRECTS_SNIPPET=$REMOTE_LEGACY_REDIRECTS_SNIPPET" \
    "REMOTE_CO_BRANDED_NOINDEX_SNIPPET=$REMOTE_CO_BRANDED_NOINDEX_SNIPPET" \
    "LEGACY_REDIRECTS_SNIPPET_B64=$LEGACY_REDIRECTS_SNIPPET_B64" \
    "CO_BRANDED_NOINDEX_SNIPPET_B64=$CO_BRANDED_NOINDEX_SNIPPET_B64" bash -s
  # Values are deliberately expanded and shell-quoted on the client.
  # shellcheck disable=SC2029
  ssh "$SSH_TARGET" "$REMOTE_COMMAND" < "$ROOT_DIR/scripts/lib/install-production-nginx.sh"
fi

if [ "$DRY_RUN" = false ] && [ "$SKIP_ROUTE_CHECK" = false ]; then
  node "$ROOT_DIR/scripts/verify-deployed-routes.mjs" \
    --site-url "https://${ROUTE_CHECK_HOST}" \
    --resolve "${ROUTE_CHECK_HOST}:443:${ROUTE_CHECK_RESOLVE_IP}"

  LEGACY_REDIRECT_CHECK_URL="https://${ROUTE_CHECK_HOST}/about/"
  LEGACY_REDIRECT_CHECK_RESULT="$(curl -sS -o /dev/null \
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
