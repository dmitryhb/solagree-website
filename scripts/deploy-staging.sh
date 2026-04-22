#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/.output/public/"

SSH_USER="${SSH_USER:-qa_solagree}"
SSH_HOST="${SSH_HOST:-solagree.qamachine.com}"
REMOTE_PATH="${REMOTE_PATH:-/home/qa_solagree/public_html/}"
STAGING_SITE_URL="${NUXT_PUBLIC_SITE_URL:-https://solagree.qamachine.com}"
STAGING_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL:-https://solagree-portal.qamachine.com}"

DRY_RUN=false
SKIP_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
    --skip-build)
      SKIP_BUILD=true
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Supported options: --dry-run, --skip-build" >&2
      exit 1
      ;;
  esac
done

if [ "$SKIP_BUILD" = false ]; then
  echo "Generating static output..."
  export NUXT_PUBLIC_SITE_URL="$STAGING_SITE_URL"
  export NUXT_PUBLIC_PORTAL_API_BASE_URL="$STAGING_PORTAL_API_BASE_URL"
  echo "Using site URL: $NUXT_PUBLIC_SITE_URL"
  echo "Using portal API base URL: $NUXT_PUBLIC_PORTAL_API_BASE_URL"
  npm run generate
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Expected output directory not found: $OUTPUT_DIR" >&2
  exit 1
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
