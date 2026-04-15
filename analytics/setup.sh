#!/bin/bash

###############################################################################
# Trust.xyz Analytics Stack Setup
# Automated deployment for privacy-first analytics with crawler detection
# Tested on Ubuntu 20.04 LTS and Debian 11+
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Trust.xyz Analytics Stack Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use: sudo ./setup.sh)${NC}"
   exit 1
fi

# Detect OS
if [[ ! -f /etc/os-release ]]; then
  echo -e "${RED}Could not detect OS. Supported: Ubuntu 20.04+, Debian 11+${NC}"
  exit 1
fi

source /etc/os-release
OS_NAME=$ID

if [[ "$OS_NAME" != "ubuntu" && "$OS_NAME" != "debian" ]]; then
  echo -e "${RED}Unsupported OS: $OS_NAME (supported: ubuntu, debian)${NC}"
  exit 1
fi

echo -e "${GREEN}Detected OS: $OS_NAME${NC}"
echo ""

# Step 1: Install Docker and Docker Compose
echo -e "${YELLOW}[1/6] Installing Docker and Docker Compose...${NC}"

# Update package manager
apt-get update -qq > /dev/null

# Check if Docker is already installed
if ! command -v docker &> /dev/null; then
  echo "  Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh > /dev/null 2>&1
  rm get-docker.sh

  # Add current user to docker group (optional)
  if [[ -n "$SUDO_USER" ]]; then
    usermod -aG docker "$SUDO_USER"
    echo -e "${BLUE}  Note: User '$SUDO_USER' added to docker group. You may need to log out and back in.${NC}"
  fi
else
  echo -e "${BLUE}  Docker already installed: $(docker --version)${NC}"
fi

# Check if Docker Compose is already installed
if ! command -v docker compose &> /dev/null; then
  echo "  Installing Docker Compose..."
  curl -fsSL https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
else
  echo -e "${BLUE}  Docker Compose already installed: $(docker compose version)${NC}"
fi

echo ""

# Step 2: Create required directories
echo -e "${YELLOW}[2/6] Creating directory structure...${NC}"

ANALYTICS_DIR="$(pwd)"
CRAWLER_LOG_DIR="$ANALYTICS_DIR/crawler-log"

mkdir -p "$CRAWLER_LOG_DIR"
chmod 755 "$ANALYTICS_DIR" "$CRAWLER_LOG_DIR"

echo -e "${BLUE}  Analytics directory: $ANALYTICS_DIR${NC}"
echo -e "${BLUE}  Crawler log directory: $CRAWLER_LOG_DIR${NC}"
echo ""

# Step 3: Generate .env file with random APP_SECRET
echo -e "${YELLOW}[3/6] Generating .env configuration...${NC}"

if [[ -f "$ANALYTICS_DIR/.env" ]]; then
  echo -e "${BLUE}  .env already exists, skipping...${NC}"
else
  # Generate random APP_SECRET (32 chars from base64)
  APP_SECRET=$(openssl rand -base64 24 | tr -d '\n')

  # Generate random DB password
  DB_PASSWORD=$(openssl rand -base64 16 | tr -d '\n')

  cp "$ANALYTICS_DIR/.env.example" "$ANALYTICS_DIR/.env"

  # Update .env with generated values (compatible with sed on macOS and Linux)
  sed -i.bak "s|APP_SECRET=change_me_32_char_random_secret|APP_SECRET=$APP_SECRET|g" "$ANALYTICS_DIR/.env"
  sed -i.bak "s|DB_PASSWORD=umami_secure_pass_change_me|DB_PASSWORD=$DB_PASSWORD|g" "$ANALYTICS_DIR/.env"
  sed -i.bak "s|postgresql://umami:umami_secure_pass_change_me@postgres:5432/umami|postgresql://umami:$DB_PASSWORD@postgres:5432/umami|g" "$ANALYTICS_DIR/.env"

  rm -f "$ANALYTICS_DIR/.env.bak"

  echo -e "${GREEN}  .env created with secure random secrets${NC}"
  echo -e "${BLUE}  APP_SECRET: ${APP_SECRET:0:16}... (${#APP_SECRET} chars)${NC}"
  echo -e "${BLUE}  DB_PASSWORD: ${DB_PASSWORD:0:16}... (${#DB_PASSWORD} chars)${NC}"
fi
echo ""

# Step 4: Start Docker Compose
echo -e "${YELLOW}[4/6] Starting Docker containers...${NC}"

cd "$ANALYTICS_DIR"

if docker compose ps | grep -q "postgres\|umami"; then
  echo -e "${BLUE}  Containers already running, restarting...${NC}"
  docker compose restart
else
  echo "  Starting Umami and PostgreSQL..."
  docker compose up -d > /dev/null 2>&1

  # Wait for health checks
  echo "  Waiting for services to be healthy..."
  sleep 10

  # Check if services are running
  if docker compose ps | grep -q "postgres.*healthy"; then
    echo -e "${GREEN}  PostgreSQL is healthy${NC}"
  else
    echo -e "${YELLOW}  PostgreSQL may still be starting, this is normal${NC}"
  fi
fi

echo -e "${BLUE}  Docker Compose running:${NC}"
docker compose ps --format "table {{.Service}}\t{{.Status}}"
echo ""

# Step 5: Set up crawler-log Node.js service (systemd)
echo -e "${YELLOW}[5/6] Setting up crawler detection service...${NC}"

# Make the index.js executable
chmod +x "$CRAWLER_LOG_DIR/index.js"

# Create systemd service file
SYSTEMD_SERVICE="/etc/systemd/system/trust-xyz-crawler-log.service"

if [[ ! -f "$SYSTEMD_SERVICE" ]]; then
  cat > "$SYSTEMD_SERVICE" << 'EOF'
[Unit]
Description=Trust.xyz Crawler Detection & Logging Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=__CRAWLER_LOG_DIR__
ExecStart=__CRAWLER_LOG_DIR__/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=crawler-log

[Install]
WantedBy=multi-user.target
EOF

  # Replace placeholders
  sed -i "s|__CRAWLER_LOG_DIR__|$CRAWLER_LOG_DIR|g" "$SYSTEMD_SERVICE"

  # Reload systemd and enable service
  systemctl daemon-reload
  systemctl enable trust-xyz-crawler-log.service
  systemctl start trust-xyz-crawler-log.service

  echo -e "${GREEN}  Service installed and started${NC}"
  echo -e "${BLUE}  Service file: $SYSTEMD_SERVICE${NC}"
  echo -e "${BLUE}  Check status: systemctl status trust-xyz-crawler-log${NC}"
else
  echo -e "${BLUE}  Service already installed, ensuring it's running...${NC}"
  systemctl restart trust-xyz-crawler-log.service 2>/dev/null || systemctl start trust-xyz-crawler-log.service 2>/dev/null
fi

# Verify service is running
if systemctl is-active --quiet trust-xyz-crawler-log; then
  echo -e "${GREEN}  Crawler logger is running on port 3001${NC}"
else
  echo -e "${YELLOW}  Warning: Crawler logger service status unknown, check: systemctl status trust-xyz-crawler-log${NC}"
fi
echo ""

# Step 6: Print next steps
echo -e "${YELLOW}[6/6] Deployment summary${NC}"
echo ""
echo -e "${GREEN}===== SETUP COMPLETE =====${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. ${YELLOW}Point your domain to this server:${NC}"
echo "   - analytics.trust.xyz → $(hostname -I | awk '{print $1}')"
echo ""
echo "2. ${YELLOW}Install SSL certificate (Let's Encrypt):${NC}"
echo "   sudo apt-get install certbot python3-certbot-nginx -y"
echo "   sudo certbot certonly --standalone -d analytics.trust.xyz"
echo ""
echo "3. ${YELLOW}Configure nginx reverse proxy:${NC}"
echo "   sudo mkdir -p /etc/nginx/sites-available"
echo "   sudo cp $ANALYTICS_DIR/nginx.conf /etc/nginx/sites-available/analytics.trust.xyz"
echo "   sudo ln -s /etc/nginx/sites-available/analytics.trust.xyz /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl restart nginx"
echo ""
echo "4. ${YELLOW}Access Umami dashboard:${NC}"
echo "   https://analytics.trust.xyz"
echo "   Default login: admin / umami"
echo "   ${RED}Change password immediately!${NC}"
echo ""
echo "5. ${YELLOW}Embed tracking script in your pages:${NC}"
echo "   <script async src=\"https://analytics.trust.xyz/beacon.js\" data-website-id=\"YOUR_SITE_ID\"></script>"
echo ""
echo "6. ${YELLOW}Embed crawler detection in your pages:${NC}"
echo "   <script src=\"/crawler-beacon.js\"></script>"
echo ""
echo "7. ${YELLOW}View crawler activity:${NC}"
echo "   tail -f $CRAWLER_LOG_DIR/crawler-hits.ndjson"
echo "   cat $CRAWLER_LOG_DIR/crawler-hits.ndjson | jq '.'"
echo ""
echo -e "${BLUE}Service status:${NC}"
echo "   docker compose ps     (Umami & PostgreSQL)"
echo "   systemctl status trust-xyz-crawler-log"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo "   docker compose logs -f umami"
echo "   journalctl -u trust-xyz-crawler-log -f"
echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "   .env file: $ANALYTICS_DIR/.env"
echo "   docker-compose.yml: $ANALYTICS_DIR/docker-compose.yml"
echo "   nginx config: $ANALYTICS_DIR/nginx.conf"
echo ""
echo -e "${GREEN}Happy analyzing!${NC}"
echo ""
