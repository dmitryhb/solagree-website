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

if [ "$SKIP_BUILD" = false ]; then
  echo "Generating static output..."
  export NUXT_PUBLIC_SITE_URL="$STAGING_SITE_URL"
  export NUXT_PUBLIC_PORTAL_URL="$STAGING_PORTAL_URL"
  export NUXT_PUBLIC_PORTAL_API_BASE_URL="$STAGING_PORTAL_API_BASE_URL"
  echo "Using site URL: $NUXT_PUBLIC_SITE_URL"
  echo "Using portal URL: $NUXT_PUBLIC_PORTAL_URL"
  echo "Using portal API base URL: $NUXT_PUBLIC_PORTAL_API_BASE_URL"
  npm run generate
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Expected output directory not found: $OUTPUT_DIR" >&2
  exit 1
fi

# Fail the deployment before rsync when the static sitemap is missing or invalid.
node "$ROOT_DIR/scripts/verify-sitemap.mjs"

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
  )

  for route_check_path in "${ROUTE_CHECK_PATHS[@]}"; do
    ROUTE_CHECK_URL="${STAGING_SITE_URL%/}${route_check_path}"
    ROUTE_CHECK_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" "$ROUTE_CHECK_URL" || true)"

    if [ "$ROUTE_CHECK_STATUS" = "404" ]; then
      cat >&2 <<MESSAGE
Staging route check failed: $ROUTE_CHECK_URL returned HTTP 404.

The generated static website must route dynamic Nuxt paths such as /go/:slug
and /cdfa/go/:slug to /200.html. Update the nginx server block for $STAGING_SITE_URL with:

  location / {
      try_files \$uri \$uri/ /200.html;
  }

Then reload nginx and rerun this deployment.
MESSAGE
      exit 1
    fi

    echo "Route check passed: $ROUTE_CHECK_URL returned HTTP $ROUTE_CHECK_STATUS"
  done
fi
