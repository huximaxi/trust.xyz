#!/usr/bin/env node

/**
 * Crawler Detection & Logging Server
 * Listens on port 3001 and logs AI crawler activity to NDJSON
 * No external dependencies - pure Node.js http module
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Known AI crawler user-agent patterns
const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'CCBot',
  'Applebot-Extended',
  'Googlebot-Extended',
  'Bytespider',
  'PetalBot',
  'Diffbot',
  'ImagesiftBot',
  'YouBot',
  'cohere-ai',
  'anthropic-ai',
  'HuggingFace',
  'Anthropic',
  'OpenAI',
];

// NDJSON log file path
const LOG_FILE = path.join(__dirname, 'crawler-hits.ndjson');

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

/**
 * Check if user-agent matches known AI crawlers
 * @param {string} ua - User-Agent header
 * @returns {boolean}
 */
function isAiCrawler(ua) {
  if (!ua) return false;
  return AI_CRAWLERS.some(crawler => ua.includes(crawler));
}

/**
 * Log a crawler hit to NDJSON
 * @param {object} data - Event data
 */
function logCrawlerHit(data) {
  const record = {
    ts: data.ts || new Date().toISOString(),
    page: data.page || 'unknown',
    referrer: data.referrer || 'direct',
    ua: data.ua || 'unknown',
    ip: data.ip || 'unknown',
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + '\n', 'utf8');
}

/**
 * Parse POST body
 * @param {http.IncomingMessage} req
 * @returns {Promise<object>}
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Prevent DoS: limit body to 10KB
      if (body.length > 10240) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Handle CORS preflight
 * @param {http.ServerResponse} res
 */
function handleCors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://trust.xyz');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '3600');
}

/**
 * Main request handler
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    handleCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // Only accept POST to /log
  if (req.method !== 'POST' || parsedUrl.pathname !== '/log') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  try {
    const body = await parseBody(req);
    const ua = body.ua || req.headers['user-agent'] || '';
    const isCrawler = isAiCrawler(ua);

    if (isCrawler) {
      // Log AI crawler activity
      logCrawlerHit({
        page: body.page,
        referrer: body.referrer,
        ua: ua,
        ts: body.ts,
        ip: clientIp,
      });

      // Return 200 for crawlers
      handleCors(res);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ logged: true, crawler: true }));
    } else {
      // Return 204 for humans (no content)
      handleCors(res);
      res.writeHead(204);
      res.end();
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    handleCors(res);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request' }));
  }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[${new Date().toISOString()}] Crawler logger listening on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Logging to: ${LOG_FILE}`);
  console.log(`[${new Date().toISOString()}] Ready to receive POST requests to /log`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] SIGTERM received, closing server...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed`);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] SIGINT received, closing server...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed`);
    process.exit(0);
  });
});
