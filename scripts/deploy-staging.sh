#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

STAGING_SITE_URL="${NUXT_PUBLIC_SITE_URL-https://solagree.qamachine.com}"
STAGING_PORTAL_URL="${NUXT_PUBLIC_PORTAL_URL-https://solagree-portal.qamachine.com/}"
STAGING_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL-https://solagree-portal.qamachine.com/}"
STAGING_CALCOM_FIRST_AVAILABLE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH:-initial-consults/initial-consult}"
STAGING_CALCOM_TAJ_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH:-initial-consults/initial-consult-taj}"
STAGING_CALCOM_STACIE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH:-initial-consults/initial-consult-stacie}"
STAGING_CALCOM_JESSICA_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH:-initial-consults/initial-consult-jessica}"
STAGING_CALCOM_JAMES_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH:-initial-consults/initial-consult-james}"
SKIP_BUILD=false
RELEASE_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) RELEASE_ARGS+=(--dry-run) ;;
    --skip-build) SKIP_BUILD=true ;;
    --inspect) SKIP_BUILD=true; RELEASE_ARGS+=(--inspect) ;;
    --rollback=*) SKIP_BUILD=true; RELEASE_ARGS+=("$arg") ;;
    --skip-route-check) echo "Route checks are mandatory for immutable promotion and rollback." >&2; exit 1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done
if { [ -n "${STAGING_BASIC_AUTH_USER:-}" ] && [ -z "${STAGING_BASIC_AUTH_PASSWORD:-}" ]; } \
  || { [ -z "${STAGING_BASIC_AUTH_USER:-}" ] && [ -n "${STAGING_BASIC_AUTH_PASSWORD:-}" ]; }; then
  echo "STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASSWORD must be set together." >&2
  exit 1
fi

# Resolve and validate destination even when reusing an existing build.
export NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT="staging"
export NUXT_PUBLIC_SITE_URL="$STAGING_SITE_URL"
export NUXT_PUBLIC_PORTAL_URL="$STAGING_PORTAL_URL"
export NUXT_PUBLIC_PORTAL_API_BASE_URL="$STAGING_PORTAL_API_BASE_URL"
export NUXT_PUBLIC_GA_MEASUREMENT_ID="${NUXT_PUBLIC_GA_MEASUREMENT_ID-}"
node "$ROOT_DIR/scripts/verify-release-artifact.mjs" --policy-only

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
  node "$ROOT_DIR/scripts/prepare-release.mjs" staging
fi

# config/nginx/co-branded-noindex.conf must already be installed on the host.
# scripts/verify-deployed-routes.mjs shares its acceptance contract with the
# private candidate and post-switch checks in scripts/release-upload.mjs.
node "$ROOT_DIR/scripts/release-upload.mjs" "${RELEASE_ARGS[@]}"
