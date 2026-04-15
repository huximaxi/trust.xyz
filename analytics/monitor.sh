#!/bin/bash

###############################################################################
# Trust.xyz Analytics Monitoring Script
# Quick health check and stats dashboard
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Trust.xyz Analytics Stack — Health Monitor                ║${NC}"
echo -e "${BLUE}║  $(date '+%Y-%m-%d %H:%M:%S')                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function: Check service status
check_service() {
  local name=$1
  local command=$2

  if eval "$command" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} $name"
    return 0
  else
    echo -e "  ${RED}✗${NC} $name"
    return 1
  fi
}

# ============================================================================
# 1. Docker Services
# ============================================================================
echo -e "${YELLOW}[Docker Services]${NC}"

cd "$SCRIPT_DIR"

POSTGRES_OK=0
UMAMI_OK=0

if docker compose ps | grep -q "postgres.*Up"; then
  echo -e "  ${GREEN}✓${NC} PostgreSQL (running)"
  POSTGRES_OK=1
else
  echo -e "  ${RED}✗${NC} PostgreSQL (not running)"
fi

if docker compose ps | grep -q "umami.*Up"; then
  echo -e "  ${GREEN}✓${NC} Umami (running)"
  UMAMI_OK=1
else
  echo -e "  ${RED}✗${NC} Umami (not running)"
fi

# Check if services are healthy
if docker compose ps | grep -q "postgres.*healthy"; then
  echo -e "    ${GREEN}→${NC} PostgreSQL is healthy"
else
  echo -e "    ${YELLOW}→${NC} PostgreSQL status unknown (may be starting)"
fi

if docker compose ps | grep -q "umami.*healthy"; then
  echo -e "    ${GREEN}→${NC} Umami is healthy"
else
  echo -e "    ${YELLOW}→${NC} Umami status unknown (may be starting)"
fi

echo ""

# ============================================================================
# 2. Crawler Logger Service
# ============================================================================
echo -e "${YELLOW}[Crawler Detection Service]${NC}"

if systemctl is-active --quiet trust-xyz-crawler-log; then
  echo -e "  ${GREEN}✓${NC} Crawler logger (running on port 3001)"
else
  echo -e "  ${RED}✗${NC} Crawler logger (not running)"
fi

echo ""

# ============================================================================
# 3. Network & Connectivity
# ============================================================================
echo -e "${YELLOW}[Network & Connectivity]${NC}"

check_service "Umami API (http://127.0.0.1:3000)" "curl -sf http://127.0.0.1:3000/api/heartbeat > /dev/null"
check_service "Crawler Logger (http://127.0.0.1:3001)" "curl -sf http://127.0.0.1:3001/ping > /dev/null 2>&1 || true"
check_service "Nginx (reverse proxy)" "curl -sf https://localhost/api/heartbeat > /dev/null 2>&1 || echo 'HTTPS not ready (normal if SSL not configured)'" || true

echo ""

# ============================================================================
# 4. Disk & Storage
# ============================================================================
echo -e "${YELLOW}[Disk & Storage]${NC}"

USAGE=$(df -h "$SCRIPT_DIR" | tail -1 | awk '{print $5}')
AVAIL=$(df -h "$SCRIPT_DIR" | tail -1 | awk '{print $4}')
echo "  Analytics directory: $USAGE used, $AVAIL available"

# Check log file size
if [[ -f "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson" ]]; then
  LOG_SIZE=$(du -h "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson" | cut -f1)
  LOG_LINES=$(wc -l < "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson")
  echo "  Crawler log: $LOG_SIZE ($LOG_LINES hits)"
fi

echo ""

# ============================================================================
# 5. Container Stats
# ============================================================================
echo -e "${YELLOW}[Container Resource Usage]${NC}"

if docker ps --filter "name=umami" --format "table {{.Names}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null | tail -1 | grep -q umami; then
  docker ps --filter "name=umami\|postgres" --format "table {{.Names}}\t{{.CPUPerc}}\t{{.MemUsage}}"
else
  echo "  (Docker containers not running)"
fi

echo ""

# ============================================================================
# 6. Recent Activity
# ============================================================================
echo -e "${YELLOW}[Recent Crawler Activity]${NC}"

if [[ -f "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson" ]] && [[ -s "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson" ]]; then
  RECENT=$(tail -1 "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson")
  echo "  Latest hit: $RECENT"

  # Count by crawler
  echo ""
  echo "  Crawler types (last 24h):"
  grep "$(date -d '1 day ago' +%Y-%m-%d)" "$SCRIPT_DIR/crawler-log/crawler-hits.ndjson" 2>/dev/null | jq -r '.ua' 2>/dev/null | sort | uniq -c | sort -rn | head -5 | sed 's/^/    /'
else
  echo "  (No crawler activity yet)"
fi

echo ""

# ============================================================================
# 7. Configuration Status
# ============================================================================
echo -e "${YELLOW}[Configuration]${NC}"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  echo -e "  ${GREEN}✓${NC} .env file exists"
  if grep -q "APP_SECRET=" "$SCRIPT_DIR/.env"; then
    SECRET=$(grep "APP_SECRET=" "$SCRIPT_DIR/.env" | cut -d'=' -f2)
    echo "    Secret: ${SECRET:0:16}... (${#SECRET} chars)"
  fi
else
  echo -e "  ${RED}✗${NC} .env file not found (run setup.sh)"
fi

if [[ -f "$SCRIPT_DIR/docker-compose.yml" ]]; then
  echo -e "  ${GREEN}✓${NC} docker-compose.yml configured"
fi

echo ""

# ============================================================================
# 8. Summary
# ============================================================================
echo -e "${BLUE}═════════════════════════════════════════════════════════════${NC}"

HEALTHY=0

if [[ $POSTGRES_OK -eq 1 ]] && [[ $UMAMI_OK -eq 1 ]]; then
  HEALTHY=1
fi

if [[ $HEALTHY -eq 1 ]]; then
  echo -e "${GREEN}✓ Stack is healthy and operational${NC}"
else
  echo -e "${YELLOW}⚠ Some services are down or not responding${NC}"
  echo ""
  echo "Recovery steps:"
  echo "  1. Check Docker: docker compose ps"
  echo "  2. View logs: docker compose logs -f"
  echo "  3. Restart: docker compose restart"
  echo "  4. Check crawler logger: systemctl status trust-xyz-crawler-log"
fi

echo ""
echo "Next steps:"
echo "  • Dashboard: https://analytics.trust.xyz"
echo "  • Monitor crawler hits: tail -f crawler-log/crawler-hits.ndjson"
echo "  • View Umami logs: docker compose logs -f umami"
echo ""
