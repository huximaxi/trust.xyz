# Claude Code Jump-In Prompt — trust.xyz Analytics Integration

Paste this entire prompt into a Claude Code session opened at the root of the `trust.xyz-live/` directory.

---

## PROMPT (copy from here)

You are working on a static site called trust.xyz located in the current directory. The site has the following HTML files:

- `index.html`
- `about.html`
- `dispatches/rendszerbontas.html`
- `experiments/semantic_network/index.html`
- `experiments/organism/index.html`

**Your task: integrate privacy-first analytics into all HTML pages.**

Two scripts need to be added to every HTML file, just before the closing `</body>` tag:

---

### Script 1 — Umami visitor analytics

Add this snippet (replace `YOUR_WEBSITE_ID` with the actual Umami website ID from the dashboard):

```html
<!-- Umami analytics — cookieless, no personal data -->
<script defer src="https://analytics.trust.xyz/beacon.js"
  data-website-id="YOUR_WEBSITE_ID"></script>
```

**Important:** the `src` points to the self-hosted Umami instance at `analytics.trust.xyz`. The script is renamed from `umami.js` to `beacon.js` via the `TRACKER_SCRIPT_NAME` env var in `.env` to avoid adblockers. If the subdomain is different, update accordingly.

---

### Script 2 — LLM crawler beacon

Inline the entire contents of `analytics/crawler-log/crawler-beacon.js` as an inline `<script>` block — do NOT use a `src` reference (the beacon server is not publicly browsable). Before inlining, update the `ENDPOINT` variable in the script:

Replace:
```javascript
var ENDPOINT = 'http://127.0.0.1:3001/log';
```

With:
```javascript
var ENDPOINT = 'https://analytics.trust.xyz/crawlers/log';
```

(This nginx route proxies to the crawler-log Node.js server on port 3001. The nginx.conf in analytics/ already includes this proxy rule — verify it is present, add it if missing.)

---

### Steps to complete

1. Read each HTML file
2. Check if analytics scripts are already present (look for `data-website-id` and `crawler-beacon` comments) — skip if already added
3. Insert both script blocks before `</body>` in each file
4. Run a final grep across all HTML files to confirm both scripts are present everywhere
5. Output a summary table: file | umami added | beacon added | status

**Do not:**
- Add any cookies or localStorage usage
- Modify any other part of the HTML (nav, styles, content)
- Add console.log statements

**Also do:**
- In `analytics/nginx.conf`, ensure there is a proxy block for `/crawlers/log` → `http://localhost:3001/log`. If it's missing, add it to the `analytics.trust.xyz` server block.
- Update `analytics/crawler-log/crawler-beacon.js` with the corrected ENDPOINT so the source file stays in sync.

---

## After running Claude Code

1. `./deploy.sh "analytics integration — Umami + crawler beacon"` to push to production
2. SSH to your VPS, navigate to the `analytics/` directory, run `sudo ./setup.sh`
3. Visit `https://analytics.trust.xyz` — create your first website, copy the Website ID
4. Re-run Claude Code with the actual Website ID to replace `YOUR_WEBSITE_ID`
5. Redeploy

## Querying crawler data (once live)

```bash
# On the VPS — most active crawlers
cat analytics/crawler-log/crawler-hits.ndjson | python3 -c "
import sys, json
from collections import Counter
hits = [json.loads(l) for l in sys.stdin]
crawlers = Counter(h.get('crawler','unknown') for h in hits)
for name, count in crawlers.most_common(10):
    print(f'{count:>6}  {name}')
"

# Hits per page
cat analytics/crawler-log/crawler-hits.ndjson | python3 -c "
import sys, json
from collections import Counter
hits = [json.loads(l) for l in sys.stdin]
pages = Counter(h.get('page','?').split('/')[-1] for h in hits)
for p, n in pages.most_common(): print(f'{n:>6}  {p}')
"

# Timeline
cat analytics/crawler-log/crawler-hits.ndjson | python3 -c "
import sys, json
hits = [json.loads(l) for l in sys.stdin]
for h in sorted(hits, key=lambda x: x.get('ts',''))[-20:]:
    print(h.get('ts','?')[:16], h.get('crawler','?')[:30], h.get('page','?')[-40:])
"
```
