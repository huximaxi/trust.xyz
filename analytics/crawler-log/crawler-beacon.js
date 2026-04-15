/**
 * Crawler Detection Beacon
 * Embeds in trust.xyz pages to detect and log AI crawler activity
 * Under 1KB minified
 * No dependencies, no errors logged to console
 */

(function() {
  'use strict';

  // Configuration
  var ENDPOINT = 'https://analytics.trust.xyz/crawlers/log'; // update to your subdomain
  var PAGE = window.location.href;
  var REFERRER = document.referrer || 'direct';
  var UA = navigator.userAgent || 'unknown';
  var START_TIME = Date.now();

  /**
   * Send beacon with current page metrics
   */
  function sendBeacon() {
    var timeOnPage = Math.round((Date.now() - START_TIME) / 1000);
    var data = {
      page: PAGE,
      referrer: REFERRER,
      ua: UA,
      ts: new Date().toISOString(),
      timeOnPage: timeOnPage,
    };

    try {
      // Try navigator.sendBeacon first (preferred for exit pings)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, JSON.stringify(data));
      } else {
        // Fallback to fetch (with no-cors to avoid CORS issues)
        fetch(ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(data),
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        }).catch(function() {
          // Silently fail
        });
      }
    } catch (e) {
      // Silently fail - no console errors
    }
  }

  /**
   * Initialize beacon on page load
   */
  function init() {
    // Send initial beacon
    sendBeacon();

    // Send beacon on visibility change (user tabs away or returns)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        sendBeacon();
      }
    });

    // Send beacon before unload (exit tracking)
    window.addEventListener('beforeunload', function() {
      sendBeacon();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
