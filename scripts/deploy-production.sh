#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRODUCTION_SITE_URL="${NUXT_PUBLIC_SITE_URL-https://www.solagree.com}"
PRODUCTION_PORTAL_URL="${NUXT_PUBLIC_PORTAL_URL-https://portal.solagree.com}"
PRODUCTION_PORTAL_API_BASE_URL="${NUXT_PUBLIC_PORTAL_API_BASE_URL-https://portal.solagree.com}"
PRODUCTION_GA_MEASUREMENT_ID="${NUXT_PUBLIC_GA_MEASUREMENT_ID-}"
PRODUCTION_CALCOM_FIRST_AVAILABLE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH:-initial-consults/initial-consult}"
PRODUCTION_CALCOM_TAJ_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH:-initial-consults/initial-consult-taj}"
PRODUCTION_CALCOM_STACIE_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH:-initial-consults/initial-consult-stacie}"
PRODUCTION_CALCOM_JESSICA_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH:-initial-consults/initial-consult-jessica}"
PRODUCTION_CALCOM_JAMES_EVENT_PATH="${NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH:-initial-consults/initial-consult-james}"

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

# Resolve and validate destination even when reusing an existing build.
export NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT="production"
export NUXT_PUBLIC_SITE_URL="$PRODUCTION_SITE_URL"
export NUXT_PUBLIC_PORTAL_URL="$PRODUCTION_PORTAL_URL"
export NUXT_PUBLIC_PORTAL_API_BASE_URL="$PRODUCTION_PORTAL_API_BASE_URL"
export NUXT_PUBLIC_GA_MEASUREMENT_ID="$PRODUCTION_GA_MEASUREMENT_ID"
node "$ROOT_DIR/scripts/verify-release-artifact.mjs" --policy-only

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
  node "$ROOT_DIR/scripts/prepare-release.mjs" production
fi

# config/nginx/co-branded-noindex.conf must already be installed on the host.
# scripts/verify-deployed-routes.mjs shares its acceptance contract with the
# private candidate and post-switch checks in scripts/release-upload.mjs.
node "$ROOT_DIR/scripts/release-upload.mjs" "${RELEASE_ARGS[@]}"
