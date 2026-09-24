#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/.output/public/"

SSH_USER="${SSH_USER:-qa_solagree}"
SSH_HOST="${SSH_HOST:-solagree.qamachine.com}"
REMOTE_PATH="${REMOTE_PATH:-/home/qa_solagree/public_html/}"
STAGING_SITE_URL="${NUXT_PUBLIC_SITE_URL:-https://solagree.qamachine.com}"
STAGING_PORTAL_URL="${NUXT_PUBLIC_PORTAL_URL:-https://solagree-portal.qamachine.com/}"
STAGING_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL:-https://solagree-portal.qamachine.com/}"
STAGING_CALCOM_FIRST_AVAILABLE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH:-initial-consults/initial-consult}"
STAGING_CALCOM_TAJ_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH:-initial-consults/initial-consult-taj}"
STAGING_CALCOM_STACIE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH:-initial-consults/initial-consult-stacie}"
STAGING_CALCOM_JESSICA_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH:-initial-consults/initial-consult-jessica}"
STAGING_CALCOM_JAMES_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH:-initial-consults/initial-consult-james}"
STAGING_BASIC_AUTH_USER="${STAGING_BASIC_AUTH_USER:-}"
STAGING_BASIC_AUTH_PASSWORD="${STAGING_BASIC_AUTH_PASSWORD:-}"

DRY_RUN=false
SKIP_BUILD=false
SKIP_ROUTE_CHECK=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
    --skip-build)
      SKIP_BUILD=true
      ;;
    --skip-route-check)
      SKIP_ROUTE_CHECK=true
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Supported options: --dry-run, --skip-build, --skip-route-check" >&2
      exit 1
      ;;
  esac
done

if { [ -n "$STAGING_BASIC_AUTH_USER" ] && [ -z "$STAGING_BASIC_AUTH_PASSWORD" ]; } \
  || { [ -z "$STAGING_BASIC_AUTH_USER" ] && [ -n "$STAGING_BASIC_AUTH_PASSWORD" ]; }; then
  echo "STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASSWORD must be set together." >&2
  exit 1
fi

CURL_AUTH_CONFIG_FILE=""
CURL_AUTH_ARGS=()

cleanup() {
  if [ -n "$CURL_AUTH_CONFIG_FILE" ]; then
    rm -f "$CURL_AUTH_CONFIG_FILE"
  fi
}

trap cleanup EXIT

if [ -n "$STAGING_BASIC_AUTH_USER" ]; then
  case "$STAGING_BASIC_AUTH_USER$STAGING_BASIC_AUTH_PASSWORD" in
    *$'\n'*|*$'\r'*)
      echo "Staging BasicAuth credentials cannot contain newline characters." >&2
      exit 1
      ;;
  esac

  CURL_BASIC_AUTH_VALUE="${STAGING_BASIC_AUTH_USER}:${STAGING_BASIC_AUTH_PASSWORD}"
  CURL_BASIC_AUTH_VALUE="${CURL_BASIC_AUTH_VALUE//\\/\\\\}"
  CURL_BASIC_AUTH_VALUE="${CURL_BASIC_AUTH_VALUE//\"/\\\"}"
  CURL_AUTH_CONFIG_FILE="$(mktemp)"
  chmod 600 "$CURL_AUTH_CONFIG_FILE"
  printf 'user = "%s"\n' "$CURL_BASIC_AUTH_VALUE" > "$CURL_AUTH_CONFIG_FILE"
  CURL_AUTH_ARGS=(--config "$CURL_AUTH_CONFIG_FILE")
fi

curl_staging() {
  curl -sS "${CURL_AUTH_ARGS[@]}" "$@"
}

if [ "$SKIP_BUILD" = false ]; then
  echo "Generating static output..."
  export NUXT_PUBLIC_SITE_URL="$STAGING_SITE_URL"
  export NUXT_PUBLIC_PORTAL_URL="$STAGING_PORTAL_URL"
  export NUXT_PUBLIC_PORTAL_API_BASE_URL="$STAGING_PORTAL_API_BASE_URL"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH="$STAGING_CALCOM_FIRST_AVAILABLE_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH="$STAGING_CALCOM_TAJ_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH="$STAGING_CALCOM_STACIE_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH="$STAGING_CALCOM_JESSICA_EVENT_PATH"
  export NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH="$STAGING_CALCOM_JAMES_EVENT_PATH"
  echo "Using site URL: $NUXT_PUBLIC_SITE_URL"
  echo "Using portal URL: $NUXT_PUBLIC_PORTAL_URL"
  echo "Using portal API base URL: $NUXT_PUBLIC_PORTAL_API_BASE_URL"
  echo "Using Cal.com Initial Consult booking paths from staging configuration"
  npm run generate
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Expected output directory not found: $OUTPUT_DIR" >&2
  exit 1
fi

# Fail the deployment before rsync when the static sitemap is missing or invalid.
node "$ROOT_DIR/scripts/verify-sitemap.mjs"

# Detect a protected staging host before replacing the current static output.
# Other status failures are left to the post-deployment route checks because a
# deploy can be the fix for an existing application or server error.
if [ "$DRY_RUN" = false ]; then
  BASIC_AUTH_PREFLIGHT_STATUS="$(curl_staging -o /dev/null -w "%{http_code}" "${STAGING_SITE_URL%/}/" || true)"
  if [ "$BASIC_AUTH_PREFLIGHT_STATUS" = "401" ] || [ "$BASIC_AUTH_PREFLIGHT_STATUS" = "403" ]; then
    if [ -z "$STAGING_BASIC_AUTH_USER" ]; then
      cat >&2 <<MESSAGE
Staging BasicAuth preflight failed: ${STAGING_SITE_URL%/}/ requires credentials (HTTP $BASIC_AUTH_PREFLIGHT_STATUS).

Set both STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASSWORD, then rerun the deployment. Credentials are not logged.
MESSAGE
      exit 1
    fi

    cat >&2 <<MESSAGE
Staging BasicAuth preflight failed: ${STAGING_SITE_URL%/}/ rejected the configured credentials with HTTP $BASIC_AUTH_PREFLIGHT_STATUS.

Set STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASSWORD to valid staging credentials, then rerun the deployment. Credentials are not logged.
MESSAGE
    exit 1
  fi
fi

RSYNC_ARGS=(
  -avz
  --delete
)

if [ "$DRY_RUN" = true ]; then
  RSYNC_ARGS+=(--dry-run)
fi

echo "Deploying $OUTPUT_DIR to ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"
rsync "${RSYNC_ARGS[@]}" "$OUTPUT_DIR" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

if [ "$DRY_RUN" = false ] && [ "$SKIP_ROUTE_CHECK" = false ]; then
  ROUTE_CHECK_PATHS=(
    "/go/__co-branded-route-check__"
    "/cdfa/go/__co-branded-route-check__"
    "/webinars/__webinar-route-check__"
  )

  for route_check_path in "${ROUTE_CHECK_PATHS[@]}"; do
    ROUTE_CHECK_URL="${STAGING_SITE_URL%/}${route_check_path}"
    ROUTE_CHECK_HEADER_FILE="$(mktemp)"
    ROUTE_CHECK_STATUS="$(curl_staging -o /dev/null \
      -D "$ROUTE_CHECK_HEADER_FILE" \
      -w "%{http_code}" "$ROUTE_CHECK_URL" || true)"

    if [ "$ROUTE_CHECK_STATUS" != "200" ]; then
      rm -f "$ROUTE_CHECK_HEADER_FILE"
      cat >&2 <<MESSAGE
Staging route check failed: $ROUTE_CHECK_URL returned HTTP $ROUTE_CHECK_STATUS; expected an authorized HTTP 200 response.

The generated static website must route dynamic Nuxt paths such as /go/:slug,
/cdfa/go/:slug, and /webinars/:id to /200.html. For the required fallback and
noindex locations, use the canonical config/nginx/co-branded-noindex.conf
configuration in the staging nginx server block before the SPA fallback.
MESSAGE
      exit 1
    fi

    if ! grep -iq '^x-robots-tag:.*noindex, nofollow' "$ROUTE_CHECK_HEADER_FILE"; then
      rm -f "$ROUTE_CHECK_HEADER_FILE"
      cat >&2 <<MESSAGE
Staging noindex check failed: $ROUTE_CHECK_URL responded without an
X-Robots-Tag: noindex, nofollow header.

Dynamic routes are client-only behind the static /200.html fallback, so the
initial HTTP response must carry the noindex signal as a response header. Add
the canonical config/nginx/co-branded-noindex.conf configuration to the staging
nginx server block before the SPA fallback, then reload nginx and rerun this
deployment.
MESSAGE
      exit 1
    fi

    rm -f "$ROUTE_CHECK_HEADER_FILE"
    echo "Route check passed: $ROUTE_CHECK_URL returned authorized HTTP 200 with X-Robots-Tag noindex"
  done

  WEBINAR_CATALOG_HEADER_FILE="$(mktemp)"
  WEBINAR_CATALOG_STATUS="$(curl_staging -o /dev/null \
    -D "$WEBINAR_CATALOG_HEADER_FILE" \
    -w "%{http_code}" "${STAGING_SITE_URL%/}/webinars" || true)"
  if [ "$WEBINAR_CATALOG_STATUS" != "200" ] \
    || grep -iq '^x-robots-tag:.*noindex' "$WEBINAR_CATALOG_HEADER_FILE"; then
    rm -f "$WEBINAR_CATALOG_HEADER_FILE"
    echo "Staging webinar catalogue check failed: /webinars must return HTTP 200 without noindex." >&2
    exit 1
  fi
  rm -f "$WEBINAR_CATALOG_HEADER_FILE"
fi
