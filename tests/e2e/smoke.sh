#!/usr/bin/env bash
# Smoke test of a throwaway app instance driven through agent-browser.
# Requires: Docker (testcontainers), agent-browser (npm i -g agent-browser && agent-browser install --with-deps).
set -euo pipefail

cd "$(dirname "$0")/../.."

PORT="${PORT:-8765}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="var/log/ephemeral-app.log"
mkdir -p "$(dirname "${LOG_FILE}")" var/e2e

php bin/ephemeral-app --port="${PORT}" >"${LOG_FILE}" 2>&1 &
APP_PID=$!

cleanup() {
    agent-browser close >/dev/null 2>&1 || true
    kill -TERM "${APP_PID}" 2>/dev/null || true
    wait "${APP_PID}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for ${BASE_URL}/health/ready ..."
for _ in $(seq 1 180); do
    if curl -fsS "${BASE_URL}/health/ready" >/dev/null 2>&1; then
        ready=1
        break
    fi
    if ! kill -0 "${APP_PID}" 2>/dev/null; then
        echo "Ephemeral app exited early:" >&2
        cat "${LOG_FILE}" >&2
        exit 1
    fi
    sleep 1
done
if [ "${ready:-0}" != "1" ]; then
    echo "Ephemeral app did not become ready in time:" >&2
    cat "${LOG_FILE}" >&2
    exit 1
fi

fail() {
    echo "SMOKE FAILED: $1" >&2
    agent-browser screenshot var/e2e/failure.png >/dev/null 2>&1 || true
    exit 1
}

agent-browser open "${BASE_URL}/"
agent-browser wait --load load
agent-browser get title | grep -q "Hello DefaultController!" || fail "unexpected title on /"
agent-browser get text h1 | grep -q "Hello DefaultController!" || fail "missing <h1> on /"
agent-browser screenshot var/e2e/home.png >/dev/null

agent-browser open "${BASE_URL}/health/ready"
agent-browser get text body | grep -q '"database":"up"' || fail "readiness does not report the database as up"

echo "Smoke test passed."
