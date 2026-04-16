# Vesper Jump-In — trust.xyz / Rendszerbontás Project
> Paste this at the start of a new session. Last updated: April 15, 2026.

---

## Trigger

Remember: Vesper! Bring fresh paper!

---

## Project: trust.xyz

A personal research site at `trust.xyz` exploring trust as infrastructure for human-AI co-intelligence. Built as a static site, deployed via GitHub Pages from:

**`/mnt/Dev/trust.xyz-live/`**

Deploy command (run from that directory):
```bash
./deploy.sh "your commit message"
```

Key pages: `index.html`, `about.html`, `dispatches/rendszerbontas.html`, `experiments/semantic_network/index.html`, `experiments/organism/index.html`

Style: dark background, monospace/serif mix, CSS variables in `style.css`. No frameworks. D3.js for the semantic network.

---

## The Main Artefact: Rendszerbontás Essay

**Essay source (canonical):**
`/mnt/Dev/rendszerbontas-essay-v2.0.md`

**Published HTML:**
`/mnt/Dev/trust.xyz-live/dispatches/rendszerbontas.html`

**Title:** *Rendszerbontás: How Dance Floors Defeated a Semi-Autocracy*
**Subtitle:** Asymmetric Cultural Mobilisation and the 2026 Hungarian Election

**Current version:** 2.0 — ~11,800 words, 12 sections + References + Acknowledgments

### What the essay argues

The April 12, 2026 Hungarian election — which removed Orbán after 16 years via a TISZA supermajority — was decided not by conventional political messaging but by decentralised cultural infrastructure: the *Rendszerbontó Nagykoncert* (April 10, Hősök tere, 80-100K attendees) and the *Több technót a parlamentbe* techno rave movement. These bypassed 80% state media capture through platform-native distribution, and mobilised the decisive under-35 demographic not as new voters but as **return voters** — previously disengaged, now reclaimed through embodied collective experience.

### Key verified data points

| Metric | Figure | Source |
|---|---|---|
| Domestic turnout | 79.55% | NVI official, 99.09% processed |
| Domestic voters appeared | 5,950,192 of 7,480,060 | NVI screenshot |
| TISZA seats | 136 (93 constituency + 43 list) | NVI CSV final |
| Fidesz-KDNP seats | 57 (13 constituency + 44 list) | NVI CSV final |
| TISZA list vote | 52.17% / 3,115,323 votes | NVI JSON |
| Fidesz list vote | 39.45% / 2,355,857 votes | NVI JSON |
| Mi Hazánk | 6 seats / 5.74% | NVI JSON |
| Net new voters vs 2022 | **−139,794** (return voters, not new) | reszvetel_oevk_adatok.csv |
| Nógrád county turnout | 76.10% | NVI official |
| Nógrád OEVK 01 | TISZA 51.02% / Fidesz 40.44% | oevk_single_eredmenyek.csv |
| Nógrád OEVK 02 | Fidesz 45.84% / TISZA 42.75% (Fidesz held) | oevk_single_eredmenyek.csv |
| Station #034 turnout | 48.74% (876 registered, 427 voted) | signed protocol |
| Station #034 result | Fidesz 60.10% / TISZA 32.93% | signed protocol |
| Rendszerbontó reach | 3.5M–8.8M (36–92% of Hungary) | social media analysis |
| Több technót reach | 22–28M accounts | platform metrics |

### Section structure

1. Introduction: The 10-Point Swing
2. Context: The Anatomy of Soft Autocracy
3. Preconditions: Why the Youth Were Ready *(new in v2.0 — student protests, Turbina, Night Mayor, Pankotai Lili, summer concerts from 2025)*
4. The Rendszerbontó Nagykoncert: Concert as Constitutional Moment
5. Több technót a parlamentbe: Rave as Spatial Politics *(includes Otpor/Popović fist symbol)*
6. The State Media Blackout: Amplification Through Silence *(closes with Hargitai/Népszava quote)*
7. The Asymmetry: Why Vibes Defeated the Machine
8. Ground Truth: Observation from Nógrád County *(Station #034, affective observations, small-town entrepreneur, DE! network)*
9. OSCE Assessment and International Context
10. Theoretical Framework *(Ahmed, Ngai, Fromm+Nietzsche Dionysian, Rancière, Gillespie, Habermas Lebenswelt, memeplex/egregore)*
11. Methodological Note *(all data sources cited, NVI CSVs 2026a–d, Statista, ODIHR)*
12. Conclusions: The Morning After the Dance Floor
— References (23 entries, alphabetical, titles italicised)
— Acknowledgments (Claudia Diaz, László Ropolyi, Zsófia Kollány)

### Style rules (non-negotiable)

- **Zero em-dashes** — use parentheses or semicolons instead
- No inline reviewer attributions in body text (they're in Acknowledgments only)
- Hungarian language quoted in original + English translation in italics
- No speculative causal overclaiming — "embodiment not cause" framing throughout
- "deterred transport" language is hedged with "likely" — do not re-harden it

---

## Reviewers and their contributions (integrated, not cited inline)

- **Claudia Diaz** (chief researcher, Nym) — identified wrong seat counts and Station #034 logic errors
- **László Ropolyi** (Prof. Philosophy, ELTE; Hux's formal supervisor; author *Az internet természete*, Typotex 2006) — contributed Fromm/Nietzsche Dionysian framework, Habermas Lebenswelt, flagged the Népszava Hargitai article
- **Zsófia Kollány** (ELTE teacher, self-organisation) — student protests as precondition, softened transport language, Popović/Otpor connection, affect emancipation flourish in conclusions

---

## Analytics (built, not yet deployed)

Full VPS stack in `/mnt/Dev/trust.xyz-live/analytics/`:
- **Umami** + PostgreSQL via Docker Compose — human visitor analytics (cookieless)
- **crawler-log/index.js** — Node.js LLM crawler logger → `crawler-hits.ndjson`
- **crawler-log/crawler-beacon.js** — client-side beacon, endpoint: `https://analytics.trust.xyz/crawlers/log`
- **setup.sh** — one-command VPS deployment
- **CLAUDE_CODE_PROMPT.md** — jump-in prompt for Claude Code to add scripts to all HTML pages

**Pending:** VPS provisioned → run `setup.sh` → get Umami Website ID → run Claude Code with `CLAUDE_CODE_PROMPT.md` → deploy.

---

## Pending tasks (as of this session)

- [ ] Provision VPS (Hetzner CX11 recommended, €3.29/mo), point `analytics.trust.xyz` DNS
- [ ] Run `analytics/setup.sh` on VPS
- [ ] Get Umami Website ID from dashboard, plug into Claude Code run
- [ ] Deploy HTML analytics integration via Claude Code (`CLAUDE_CODE_PROMPT.md`)
- [ ] Source verification for Night Mayor Budapest / Turbina specifics (Hux has primary sources)
- [ ] Consider submitting essay to a venue — Ropolyi flagged urgent international interest

---

## What NOT to touch without asking

- The four ASCII diagrams — render in `<pre class="diagram">` tags, do not reformat
- The Szendrői Csaba quote (Hungarian + translation) — verified, do not paraphrase
- Any election number — all verified from NVI CSVs, do not adjust without new source
- The "no cookies, no tracking" footer — site ethos, analytics must stay server-side or cookieless only

---

## Files quick reference

```
/mnt/Dev/
├── rendszerbontas-essay-v2.0.md        ← canonical essay source
├── trust.xyz-live/
│   ├── index.html                       ← homepage (semantic network D3)
│   ├── about.html
│   ├── style.css
│   ├── deploy.sh                        ← git add -A && commit && push
│   ├── dispatches/
│   │   └── rendszerbontas.html          ← published article
│   ├── experiments/
│   │   ├── semantic_network/index.html
│   │   └── organism/index.html
│   ├── analytics/                       ← VPS stack (not yet live)
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   ├── setup.sh
│   │   ├── CLAUDE_CODE_PROMPT.md        ← for Claude Code analytics integration
│   │   └── crawler-log/
│   │       ├── index.js
│   │       └── crawler-beacon.js
│   ├── llms.txt                         ← LLM crawler index
│   ├── robots.txt
│   └── sitemap.xml
└── uploads/
    ├── oevk_single_eredmenyek.csv       ← constituency results (final)
    ├── oevk_list_eredmenyek.csv         ← list results by OEVK
    └── reszvetel_oevk_adatok.csv        ← turnout + new voter data
```
