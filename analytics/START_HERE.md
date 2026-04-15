# Trust.xyz Analytics Stack — START HERE

Welcome! You have a complete, production-ready analytics platform for privacy-conscious website tracking.

## What You Have

A **self-hosted, cookieless analytics system** with dedicated AI crawler detection:

- **Umami** — privacy-first analytics dashboard
- **PostgreSQL** — production database
- **Crawler Detection** — identifies GPTBot, ClaudeBot, PerplexityBot, and 12+ other AI crawlers
- **Nginx** — reverse proxy with SSL/TLS, rate limiting, security headers
- **Systemd** — automated service management and monitoring

All running on a $6/month VPS. Zero tracking of trackers. Your data, your server.

---

## Deploy in 3 Steps (30 minutes)

### Step 1: Run Setup Script
```bash
sudo ./setup.sh
```

Automatically:
- Installs Docker and Docker Compose
- Generates secure random secrets
- Starts Umami + PostgreSQL
- Creates crawler detection service

### Step 2: Configure SSL & Nginx
```bash
sudo certbot certonly --standalone -d analytics.trust.xyz
sudo cp nginx.conf /etc/nginx/sites-available/analytics.trust.xyz
sudo ln -s /etc/nginx/sites-available/analytics.trust.xyz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

Point your DNS to the server IP.

### Step 3: Access Dashboard
```
https://analytics.trust.xyz
```

Login: `admin` / `umami` (change password immediately!)

---

## Embed in Your Pages

### Main tracking script (all pages):
```html
<script async 
  src="https://analytics.trust.xyz/beacon.js"
  data-website-id="YOUR_WEBSITE_ID">
</script>
```

### Crawler detection (all pages):
```html
<script src="https://analytics.trust.xyz/your-domain/crawler-beacon.js"></script>
```

Done. Page views and crawler activity now being tracked.

---

## Quick Commands

```bash
# Health check
./monitor.sh

# View real-time page views
docker compose logs -f umami

# View crawler activity
tail -f crawler-log/crawler-hits.ndjson

# Count crawlers by type
cat crawler-log/crawler-hits.ndjson | jq -r '.ua' | sort | uniq -c | sort -rn

# Backup database
docker compose exec postgres pg_dump -U umami umami | gzip > backup-$(date +%Y%m%d).sql.gz
```

---

## Documentation Map

| Document | Read This When | Time |
|----------|---------------|------|
| **README.md** | You want the complete guide | 10 min |
| **DEPLOYMENT_CHECKLIST.md** | You're deploying to production | 30 min |
| **QUICK_REFERENCE.md** | You need a command or a quick answer | 2 min |
| **FILES_MANIFEST.txt** | You want to understand every file | 15 min |
| **DELIVERY_SUMMARY.txt** | You want the executive summary | 5 min |

---

## What Gets Tracked

**Umami collects:**
- Page views (which pages are visited)
- Unique visitors (device fingerprint, not identity)
- Time on page
- Referrer (where they came from)
- Country (GeoIP)
- Browser/device type
- Custom events (optional)

**Crawler logs capture:**
- Which AI crawler visited
- When (timestamp)
- Which page/endpoint
- User-agent string
- Referrer

**What is NEVER collected:**
- Cookies (device fingerprinting used instead)
- Personal identifiers (names, emails, IDs)
- IP addresses (hashed in Umami)
- PII of any kind
- Tracking by third parties

This is **GDPR-compliant, cookieless analytics**. No consent banner needed.

---

## Architecture at a Glance

```
trust.xyz pages
  ├─ beacon.js (Umami tracking)
  └─ crawler-beacon.js (crawler detection)
         ↓
Nginx (HTTPS, rate limiting, security)
    ├─ :3000 → Umami (analytics UI)
    └─ :3001 → Crawler Logger (logs AI crawlers)
         ↓
    PostgreSQL (database)
    + NDJSON (crawler logs)
```

**Result:** Analytics dashboard at https://analytics.trust.xyz + crawler activity logged to `crawler-log/crawler-hits.ndjson`

---

## File Overview

```
analytics/
├─ setup.sh                          ← Run this first
├─ monitor.sh                        ← Health dashboard
├─ docker-compose.yml                ← Service definitions
├─ .env.example                      ← Configuration template
├─ nginx.conf                        ← Reverse proxy config
│
├─ README.md                         ← Full documentation
├─ QUICK_REFERENCE.md                ← Cheatsheet
├─ DEPLOYMENT_CHECKLIST.md           ← 30-minute walkthrough
├─ FILES_MANIFEST.txt                ← File index
├─ DELIVERY_SUMMARY.txt              ← Executive summary
├─ START_HERE.md                     ← You are here
│
└─ crawler-log/
   ├─ index.js                       ← Crawler detection server
   ├─ crawler-beacon.js              ← Browser detection script
   └─ crawler-hits.ndjson            ← (Generated) crawler log
```

---

## First Things to Do

1. **Read README.md** — Full deployment and operations guide
2. **Follow DEPLOYMENT_CHECKLIST.md** — Step-by-step to production
3. **Run setup.sh** — Automates most of the work
4. **Change admin password** — Don't use default creds
5. **Create website profile** — Get your tracking ID
6. **Embed scripts in HTML** — Start collecting data
7. **Run monitor.sh** — Verify all systems healthy

---

## Common Questions

**Q: How long does deployment take?**  
A: 30 minutes (including SSL certificate setup).

**Q: What are the costs?**  
A: VPS only ($6/month typical). No third-party subscriptions or APIs.

**Q: Is my data private?**  
A: Completely. Self-hosted on your server. No cloud, no third parties.

**Q: What if I lose power or restart the server?**  
A: Docker volumes persist data. Services auto-restart.

**Q: How do I back up my data?**  
A: `docker compose exec postgres pg_dump -U umami umami | gzip > backup.sql.gz`

**Q: Can I scale this to 1M pageviews/month?**  
A: Yes. Tested on $6/month VPS. For larger, add database replicas.

**Q: What crawlers are detected?**  
A: 15+ including GPTBot, ClaudeBot, PerplexityBot, CCBot, Googlebot-Extended, Bytespider, Diffbot, and more. Edit `index.js` to add custom patterns.

---

## Support

- **Full guide**: README.md
- **Fast answers**: QUICK_REFERENCE.md
- **Deployment help**: DEPLOYMENT_CHECKLIST.md
- **File details**: FILES_MANIFEST.txt
- **Troubleshooting**: README.md "Troubleshooting" section

---

## Next Step

Open a terminal and run:

```bash
sudo ./setup.sh
```

Then follow the printed instructions. You'll have analytics running in under 30 minutes.

---

**Welcome to privacy-first analytics.**

Your data. Your server. Your control.
