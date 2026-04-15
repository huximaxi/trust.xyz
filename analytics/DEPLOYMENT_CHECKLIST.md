# Deployment Checklist — Trust.xyz Analytics Stack

A step-by-step checklist to take the analytics stack from zero to production in under 30 minutes.

---

## Pre-Deployment (5 minutes)

- [ ] VPS is running (Ubuntu 20.04+ or Debian 11+)
- [ ] SSH access confirmed
- [ ] Domain `analytics.trust.xyz` is registered and ready
- [ ] DNS A/AAAA records pointing to server IP
- [ ] Minimum 512MB RAM available
- [ ] At least 2GB free disk space
- [ ] Have `.env` values ready (or will auto-generate)

---

## Phase 1: Automated Setup (10 minutes)

### 1.1 SSH to Server
```bash
ssh root@your-vps-ip
cd /path/to/analytics  # Navigate to the analytics directory
```

- [ ] Connected to server
- [ ] In correct directory (verify: `ls -la` shows `setup.sh`, `docker-compose.yml`, etc.)

### 1.2 Run Setup Script
```bash
sudo ./setup.sh
```

- [ ] Script executes without errors
- [ ] Docker installed (check: `docker --version`)
- [ ] Docker Compose installed (check: `docker compose --version`)
- [ ] `.env` file created with random secrets
- [ ] `docker compose up -d` completes successfully
- [ ] `trust-xyz-crawler-log` systemd service created and running
- [ ] Containers are healthy (check: `docker compose ps`)

### 1.3 Verify Services
```bash
docker compose ps
systemctl status trust-xyz-crawler-log
curl http://127.0.0.1:3000/api/heartbeat  # Should return JSON
```

- [ ] PostgreSQL container is "healthy"
- [ ] Umami container is "healthy"
- [ ] Crawler logger service shows "active (running)"
- [ ] Heartbeat curl returns 200 OK

---

## Phase 2: SSL Certificate (5 minutes)

### 2.1 Install Certbot
```bash
sudo apt-get update && sudo apt-get install certbot python3-certbot-nginx -y
```

- [ ] Certbot installed

### 2.2 Obtain Certificate
```bash
sudo certbot certonly --standalone -d analytics.trust.xyz
```

- [ ] Certificate obtained (check: `/etc/letsencrypt/live/analytics.trust.xyz/`)
- [ ] fullchain.pem exists
- [ ] privkey.pem exists

---

## Phase 3: Nginx Reverse Proxy (5 minutes)

### 3.1 Copy Nginx Config
```bash
sudo mkdir -p /etc/nginx/sites-available
sudo cp ./nginx.conf /etc/nginx/sites-available/analytics.trust.xyz
```

- [ ] nginx.conf copied to `/etc/nginx/sites-available/`

### 3.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/analytics.trust.xyz /etc/nginx/sites-enabled/
```

- [ ] Symlink created in `sites-enabled/`

### 3.3 Test and Reload
```bash
sudo nginx -t  # Should say "syntax is ok"
sudo systemctl restart nginx
```

- [ ] `nginx -t` returns "syntax is ok"
- [ ] Nginx restart succeeds
- [ ] Check status: `sudo systemctl status nginx` shows "active (running)"

### 3.4 Verify Proxy
```bash
curl -k https://localhost/api/heartbeat
```

- [ ] Returns JSON from Umami (even with SSL warning on localhost)

---

## Phase 4: DNS & Initial Access (2 minutes)

### 4.1 Verify DNS
```bash
nslookup analytics.trust.xyz  # Should return your server IP
dig analytics.trust.xyz
```

- [ ] DNS resolves to your server IP
- [ ] Both A and AAAA records (if IPv6) are correct

### 4.2 Test HTTPS Access
```bash
curl https://analytics.trust.xyz/api/heartbeat
```

- [ ] Returns 200 OK
- [ ] No SSL warnings in logs

### 4.3 Access Dashboard
Open browser: `https://analytics.trust.xyz`

- [ ] Page loads without SSL warnings
- [ ] Umami login page visible
- [ ] Default credentials work: `admin` / `umami`

---

## Phase 5: Initial Configuration (3 minutes)

### 5.1 Change Admin Password
1. Log in with `admin` / `umami`
2. Click your avatar (top-right)
3. Settings → Account → Change Password
4. Enter new secure password

- [ ] Password changed successfully
- [ ] Can log back in with new password
- [ ] Clear browser cache or new incognito window to test

### 5.2 Create a Website Profile
1. Dashboard → Add Website
2. Name: `trust.xyz` (or your domain)
3. Domain: `trust.xyz`
4. Click "Add"

- [ ] Website created
- [ ] Website ID visible (looks like a UUID)
- [ ] Copy this ID for HTML embedding

### 5.3 Copy Tracking Script Code
1. Click the website card
2. Click "Get Tracking Code"
3. Copy the `<script>` tag

- [ ] Script tag looks like: `<script async src="https://analytics.trust.xyz/beacon.js" data-website-id="YOUR_ID"></script>`

---

## Phase 6: Embed Analytics in Pages (2 minutes)

### 6.1 Add Umami Tracking to All Pages
In `trust.xyz` HTML (in `<head>` or end of `<body>`):

```html
<script async
  src="https://analytics.trust.xyz/beacon.js"
  data-website-id="YOUR_WEBSITE_ID_HERE">
</script>
```

- [ ] Script added to all pages
- [ ] Website ID replaced with actual value
- [ ] No console errors in browser DevTools

### 6.2 Add Crawler Detection
Also add this to all pages:

```html
<script src="https://analytics.trust.xyz/your-domain/crawler-beacon.js"></script>
```

- [ ] Script added to all pages
- [ ] Domain path updated (if needed)
- [ ] No console errors in browser DevTools

### 6.3 Test Tracking
1. Visit `https://trust.xyz` in browser
2. Check Umami dashboard in real-time
3. Refresh a few times

- [ ] New page views appear in dashboard within 30 seconds
- [ ] Visitor count increments
- [ ] Time on page tracking shows activity

---

## Phase 7: Verify Crawler Detection (2 minutes)

### 7.1 Check Crawler Logs
```bash
tail -f crawler-log/crawler-hits.ndjson
```

- [ ] File exists and is writable
- [ ] Format is valid NDJSON (each line is valid JSON)

### 7.2 (Optional) Simulate Crawler Request
```bash
curl -X POST http://127.0.0.1:3001/log \
  -H 'Content-Type: application/json' \
  -d '{"page":"https://trust.xyz","ua":"ClaudeBot"}'
```

- [ ] Request succeeds (curl returns JSON or exits cleanly)
- [ ] New entry appears in `crawler-hits.ndjson` with ClaudeBot

### 7.3 View Crawler Data
```bash
cat crawler-log/crawler-hits.ndjson | jq '.'
```

- [ ] NDJSON is valid and readable
- [ ] Fields: `ts`, `page`, `referrer`, `ua`, `ip` are present

---

## Phase 8: Backup & Monitoring (2 minutes)

### 8.1 Create Initial Backup
```bash
docker compose exec postgres pg_dump -U umami umami | gzip > backup-init.sql.gz
```

- [ ] Backup file created (`backup-init.sql.gz` exists)
- [ ] File is > 100KB (has data)

### 8.2 Set Up Monitoring
```bash
chmod +x ./monitor.sh
./monitor.sh
```

- [ ] Monitor script runs without errors
- [ ] All services show green checkmarks
- [ ] Disk and resource usage looks reasonable

### 8.3 Set Cron for Regular Backups (Optional)
```bash
sudo crontab -e
# Add: 0 2 * * * cd /path/to/analytics && docker compose exec -T postgres pg_dump -U umami umami | gzip > backup-$(date +\%Y\%m\%d).sql.gz
```

- [ ] Daily backup cronjob created (optional but recommended)

---

## Phase 9: Documentation & Handoff (2 minutes)

### 9.1 Document Your Setup
Create a `DEPLOYMENT_LOG.md` for future reference:

```markdown
## Trust.xyz Analytics Deployment

**Date**: [TODAY]
**Server IP**: [YOUR_IP]
**Domain**: analytics.trust.xyz
**Admin User**: admin
**Website ID**: [YOUR_WEBSITE_ID]
**Initial Backup**: backup-init.sql.gz

### Credentials (stored securely elsewhere)
- DB Password: [SAVED]
- Admin Password: [SAVED]
- APP_SECRET: [IN .env]

### Next Steps
1. Monitor crawler activity weekly
2. Rotate logs quarterly
3. Review backups monthly
4. Update Docker images quarterly
```

- [ ] Deployment log saved and backed up
- [ ] Credentials stored securely (not in repo, not in logs)
- [ ] Share deployment log with relevant team members (if applicable)

### 9.2 Create runbook for team
- [ ] README.md reviewed and understood
- [ ] QUICK_REFERENCE.md bookmarked or printed
- [ ] Team trained on dashboard access and log queries (if team exists)

---

## Phase 10: Post-Deployment Verification (2 minutes)

### 10.1 24-Hour Health Check (do tomorrow)
```bash
docker compose ps
systemctl status trust-xyz-crawler-log
curl https://analytics.trust.xyz/api/heartbeat
tail -100 crawler-log/crawler-hits.ndjson | wc -l  # Check activity
```

- [ ] All services still running
- [ ] Crawler logger is logging activity
- [ ] No error logs in Docker or systemd

### 10.2 Simulate Page Views
Visit `trust.xyz` from different locations/devices (or have friends do it)

- [ ] Page views appear in dashboard
- [ ] Visitor count shows unique visitors
- [ ] Referrer data is captured correctly

### 10.3 SSL Auto-Renewal Verification
```bash
sudo certbot renew --dry-run
```

- [ ] Dry-run succeeds (certificate would auto-renew)
- [ ] No renewal errors in logs

---

## Final Checklist

### Functionality
- [ ] Umami dashboard is accessible at `https://analytics.trust.xyz`
- [ ] Page views are being tracked in real-time
- [ ] Unique visitors are counted correctly
- [ ] Crawler activity is being logged to NDJSON
- [ ] SSL/HTTPS is working without warnings
- [ ] Database backups are created

### Security
- [ ] Admin password has been changed from default
- [ ] `.env` file is in `.gitignore` and not committed
- [ ] SSL certificate is valid (check browser security indicator)
- [ ] HSTS header is set (check browser developer tools)
- [ ] Rate limiting is active on nginx (check `nginx.conf`)

### Operations
- [ ] Systemd service for crawler-log is enabled and running
- [ ] Daily backup cron job is configured (optional but recommended)
- [ ] Monitor script runs and shows green status
- [ ] Team has access to documentation and procedures
- [ ] Emergency runbook is created (shutdown, restart, recovery)

### Documentation
- [ ] README.md has been read and understood
- [ ] QUICK_REFERENCE.md bookmarked or printed for ops team
- [ ] DEPLOYMENT_CHECKLIST.md is saved with completion date
- [ ] Team credentials are stored securely in password manager
- [ ] Deployment notes are backed up

---

## Troubleshooting Quick Links

| Problem | See Section | Command |
|---------|-------------|---------|
| Services won't start | Phase 1.3 | `docker compose logs` |
| SSL cert issues | Phase 2 | `sudo certbot renew --dry-run` |
| Nginx proxy failing | Phase 3.4 | `sudo nginx -t` |
| Tracking not working | Phase 6.3 | `curl https://analytics.trust.xyz/api/heartbeat` |
| Crawler logger down | Phase 7 | `systemctl status trust-xyz-crawler-log` |

---

## Deployment Complete!

**Estimated Total Time**: 30 minutes (with SSL and nginx setup)

You now have a production-grade, privacy-first analytics platform running on trust.xyz with:

✓ Cookieless, GDPR-compliant tracking  
✓ AI crawler detection and logging  
✓ Self-hosted on your VPS  
✓ SSL/TLS encryption  
✓ Automated backups (optional)  
✓ Monitoring and alerting ready  

**Next**: Start analyzing your traffic at `https://analytics.trust.xyz`

---

**Need Help?**
- Umami Docs: https://umami.is/docs
- Docker Docs: https://docs.docker.com
- Nginx Docs: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/getting-started/

**Questions?**
Refer to `README.md` Troubleshooting section or `QUICK_REFERENCE.md` for common tasks.

---

**Date Deployed**: ________________  
**Deployed By**: ________________  
**Approval**: ________________  

