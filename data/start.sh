#!/bin/bash
set -e

# Claude CLI OAuth config — keep credentials in mounted volume so they survive restarts
export CLAUDE_CONFIG_DIR=/data/.claude
export PATH="/data/.npm-global/bin:$PATH"

# Fix acpx plugin permissions (reset on image updates)
chmod 755 /usr/local/lib/node_modules/openclaw/dist/extensions/acpx 2>/dev/null || true
chmod 755 /usr/local/lib/node_modules/openclaw/dist/extensions/browser 2>/dev/null || true
(cd /usr/local/lib/node_modules/openclaw/dist/extensions/acpx && npm install --prefer-offline --quiet 2>/dev/null || true)

# Patch mcp-atlassian: Atlassian removed /rest/api/3/search, replace with /rest/api/3/search/jql
# Re-applied on every startup so it survives npm reinstalls
HANDLERS=/data/node_modules/mcp-atlassian/dist/jira/handlers.js
if [ -f "$HANDLERS" ] && grep -q "/rest/api/3/search'" "$HANDLERS" 2>/dev/null; then
  python3 -c "
import re, sys
path = '$HANDLERS'
with open(path) as f:
    content = f.read()
patched = re.sub(r'/rest/api/3/search(?!/jql)', '/rest/api/3/search/jql', content)
with open(path, 'w') as f:
    f.write(patched)
print('[startup] mcp-atlassian: patched search endpoint to /jql')
"
fi

# Start gateway proxy: forward 0.0.0.0:18790 -> 127.0.0.1:18789 for Paperclip
node /data/gateway-proxy.js >> /tmp/gateway-proxy.log 2>&1 &

# Run the real OpenClaw entrypoint
exec /entrypoint.sh node server.mjs
