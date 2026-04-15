# Quick Reference — Trust.xyz Analytics

## First-Time Setup (5 minutes)

```bash
sudo ./setup.sh
sudo certbot certonly --standalone -d analytics.trust.xyz
sudo cp nginx.conf /etc/nginx/sites-available/analytics.trust.xyz
sudo ln -s /etc/nginx/sites-available/analytics.trust.xyz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## Daily Operations

| Task | Command |
|------|---------|
| **Check all services** | `docker compose ps && systemctl status trust-xyz-crawler-log` |
| **View Umami logs** | `docker compose logs -f umami` |
| **View crawler hits** | `tail -f crawler-log/crawler-hits.ndjson` |
| **Count crawlers** | `wc -l crawler-log/crawler-hits.ndjson` |
| **Restart all** | `docker compose restart && systemctl restart trust-xyz-crawler-log` |

## Monitoring

### Dashboard
- **URL**: `https://analytics.trust.xyz`
- **Default creds**: `admin` / `umami` (change immediately!)
- **Key metrics**: pageviews, unique visitors, top pages, referrers, countries

### Crawler Activity
```bash
# Recent crawler hits (last 10)
tail -10 crawler-log/crawler-hits.ndjson | jq '.'

# Crawlers by UA
cat crawler-log/crawler-hits.ndjson | jq -r '.ua' | sort | uniq -c | sort -rn

# Hits per day
cat crawler-log/crawler-hits.ndjson | jq -r '.ts[:10]' | sort | uniq -c

# Filter for one crawler
cat crawler-log/crawler-hits.ndjson | jq 'select(.ua | contains("ClaudeBot"))'
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 3000 in use** | `sudo lsof -i :3000 && kill <PID>` |
| **Database won't start** | `docker compose logs postgres`, wait 30s |
| **Tracker script 404** | Verify `nginx.conf`, SSL cert, `TRACKER_SCRIPT_NAME` |
| **Crawler logger not running** | `systemctl status trust-xyz-crawler-log`, check logs with `journalctl -u trust-xyz-crawler-log -n 50` |
| **Disk full** | Archive old logs: `gzip crawler-log/crawler-hits.ndjson.{old}` |

## Backup & Recovery

```bash
# Backup database
docker compose exec postgres pg_dump -U umami umami | gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Restore database
zcat backup-YYYYMMDD-HHMMSS.sql.gz | docker compose exec -T postgres psql -U umami umami

# Backup crawler logs
cp crawler-log/crawler-hits.ndjson crawler-log/crawler-hits.ndjson.$(date +%Y%m%d)
gzip crawler-log/crawler-hits.ndjson.$(date +%Y%m%d)
```

## Environment Variables

Critical variables in `.env`:

```
DATABASE_URL=postgresql://umami:PASSWORD@postgres:5432/umami
APP_SECRET=<your-random-32-char-secret>
TRACKER_SCRIPT_NAME=beacon
DISABLE_TELEMETRY=1
```

## Service Control

```bash
# Start all
docker compose up -d
systemctl start trust-xyz-crawler-log

# Stop all
docker compose stop
systemctl stop trust-xyz-crawler-log

# Restart all
docker compose restart
systemctl restart trust-xyz-crawler-log

# View status
docker compose ps
systemctl status trust-xyz-crawler-log
```

## Port Reference

| Service | Port | Access |
|---------|------|--------|
| Umami UI | 3000 | 127.0.0.1 (nginx proxies) |
| PostgreSQL | 5432 | 127.0.0.1 (Docker internal) |
| Crawler Logger | 3001 | 127.0.0.1 (nginx would proxy) |
| **Nginx (HTTP)** | **80** | **Public (redirects to HTTPS)** |
| **Nginx (HTTPS)** | **443** | **Public (analytics.trust.xyz)** |

## HTML Embedding

### Main tracking script (all pages)
```html
<script async
  src="https://analytics.trust.xyz/beacon.js"
  data-website-id="YOUR_WEBSITE_ID">
</script>
```

### Crawler detection (all pages)
```html
<script src="https://analytics.trust.xyz/your-domain/crawler-beacon.js"></script>
```

## Logs Location

- **Umami application**: `docker compose logs umami`
- **PostgreSQL**: `docker compose logs postgres`
- **Crawler logger**: `journalctl -u trust-xyz-crawler-log -f`
- **Nginx access**: `/var/log/nginx/analytics.trust.xyz.access.log`
- **Nginx error**: `/var/log/nginx/analytics.trust.xyz.error.log`
- **Crawler hits**: `crawler-log/crawler-hits.ndjson`

## SSL Certificate Renewal

Automatic with certbot (runs daily via cron). Manual:

```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

## Scaling Notes

- **Current setup handles**: 1M+ pageviews/month on $6/month VPS
- **Bottleneck**: PostgreSQL (add read replicas for large scale)
- **Crawler logs**: NDJSON file grows ~1MB per 10k hits (rotate quarterly)
- **Memory**: Typical usage 200-300MB (Umami ~150MB, PostgreSQL ~100-150MB)

---

**Last updated**: 2026-04-15
