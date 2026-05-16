#!/usr/bin/env bash
# Symbicore Tools MCP wrapper.
# Credentials come from the container environment (loaded via env_file in docker-compose).
# openclaw.json has no secrets.
exec node /data/symbicore-tools-mcp.js
