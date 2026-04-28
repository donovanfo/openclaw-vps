# OpenClaw VPS — Security Framework

Docker environment for OpenClaw on Hostinger VPS (`srv1516187.hstgr.cloud`).

## Services

- **openclaw** — Security framework & isolation guardrails
- **traefik** — Reverse proxy (shared infrastructure)

## Deployment

1. **Pull latest code:** `git pull origin main`
2. **Set secrets:** Copy `.env.example` → `.env` with production secrets
3. **Deploy:** 
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```
4. **Health check:** `docker-compose ps`

## Configuration

- **Docker Compose:** `docker-compose.yml`
- **Secrets:** `.env` (NOT in repo; stored in Hostinger Secret Manager)
- **Port:** 443 (reverse proxy via Traefik)

## Related Services

- Hermes Agent: routes queries → OpenClaw isolates execution
- Paperclip: coordinates via OpenClaw security layer

## Monitoring

```bash
docker-compose logs -f openclaw
docker-compose exec openclaw health-check
```

## Restore from Backup

```bash
git clone https://github.com/symbicore/openclaw-vps.git
cd openclaw-vps
cp .env.production .env  # From Secret Manager
docker-compose up -d
```

**Last Updated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")
