/* ============================================================
   CAMPBELL BIBLE STUDY — ANALYTICS & NOTIFICATIONS
   File: assets/js/analytics.js
   Updated: April 24, 2026 (v1.3 — name-key fix + diagnostic logging + test hook)

   HANDLES TWO SYSTEMS:
   1. Google Analytics 4 (GA4) page tracking
   2. EmailJS silent email notifications to Chris

   EMAIL TRIGGERS:
   • Visitor lands on site (first page view this session, after 8s dwell + 1 interaction)
   • Visitor saves their notes (fires when saveVisitorNotes() runs)

   OWNER SUPPRESSION (v1.1):
   • Visit https://acshotsprings.github.io/CampbellBibleStudy/?owner=true
     to mark this device as the owner (Chris).
   • Owner visits and note-saves will NOT trigger emails.
   • Google Analytics tracking still runs (so you see your own traffic).
   • Flag persists in localStorage as 'cbsg-is-owner' = 'true'.
   • To disable: visit ?owner=false OR clear localStorage manually.
   • To check status anytime: open browser console and type CBSG_isOwner()

   BOT / BLANK-EMAIL GUARDS (v1.2):
   • Hit emails require the page to stay open for 8 seconds (bots leave fast).
   • Hit emails also require at least one real human interaction (mousemove,
     click, scroll, or keypress) — pure prefetchers never trigger them.
   • Note-save emails require a non-empty note context string.
   • All templateParams are sanitized so no field is blank/undefined.

   V1.3 CHANGES (2026-04-24):
   • FIXED: name-key mismatch. main.js writes visitor name to 'cbsg-guest-name'
     but this file previously read 'cbsg-visitor-name' (never set), so every
     email arrived as "Anonymous Visitor". Now reads cbsg-guest-name first.
   • ADDED: diagnostic console.log at every decision point in the hit-email
     flow (isOwner check, dwell elapsed, human interaction, EmailJS load,
     send success/failure). All tagged [CBSG Analytics] for easy filtering.
   • ADDED: window.CBSG_testEmail() — manual trigger from browser console to
     test EmailJS pipeline independently of visitor-detection gates. Still
     respects owner suppression.
   ============================================================ */

(function() {
  'use strict';

  // ─── CONFIGURATION ─────────────────────────────────────────
  const GA_MEASUREMENT_ID = 'G-P44J6HEJYG';
  const EMAILJS_PUBLIC_KEY = '2duGE838Bx6BcJXTF';
  const EMAILJS_SERVICE_ID = 'service_6mi6r6r';
  const EMAILJS_TEMPLATE_ID = 'template_275v5hl';
  const NOTIFY_EMAIL = 'acshotsprings@gmail.com';
  const OWNER_FLAG_KEY = 'cbsg-is-owner';
  const SESSION_HIT_KEY = 'cbsg-session-hit-sent';

  // ─── OWNER DETECTION ───────────────────────────────────────
  function handleOwnerFlag() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ownerParam = urlParams.get('owner');

      if (ownerParam === 'true') {
        localStorage.setItem(OWNER_FLAG_KEY, 'true');
        console.log('[CBSG Analytics] Owner mode ENABLED. Email notifications suppressed for this device.');
      } else if (ownerParam === 'false') {
        localStorage.removeItem(OWNER_FLAG_KEY);
        console.log('[CBSG Analytics] Owner mode DISABLED. Email notifications will fire normally.');
      }
    } catch (err) {
      // Silent fail
    }
  }

  function isOwner() {
    try {
      return localStorage.getItem(OWNER_FLAG_KEY) === 'true';
    } catch (err) {
      return false;
    }
  }

  // ─── LOAD GOOGLE ANALYTICS ─────────────────────────────────
  function loadGoogleAnalytics() {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      'page_path': window.location.pathname,
      'page_title': document.title
    });
  }

  // ─── LOAD EMAILJS ──────────────────────────────────────────
  function loadEmailJS() {
    return new Promise((resolve, reject) => {
      if (window.emailjs) {
        resolve();
        return;
      }

      const emailScript = document.createElement('script');
      emailScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      emailScript.onload = () => {
        if (window.emailjs) {
          window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
          resolve();
        } else {
          reject(new Error('EmailJS failed to initialize'));
        }
      };
      emailScript.onerror = () => reject(new Error('EmailJS CDN failed to load'));
      document.head.appendChild(emailScript);
    });
  }

  // ─── SEND EMAIL ────────────────────────────────────────────
  async function sendNotificationEmail(eventType, extraInfo) {
    console.log('[CBSG Analytics] sendNotificationEmail() called. eventType=' + eventType);

    // OWNER SUPPRESSION — skip all emails if this device is marked as owner
    if (isOwner()) {
      console.log(`[CBSG Analytics] Owner mode — email suppressed: ${eventType}`);
      return;
    }

    // BLANK-FIELD GUARD (v1.2) — if eventType is missing, don't send at all.
    // This prevents the "nobody / nobody / nobody" emails seen in v1.1.
    if (!eventType || typeof eventType !== 'string' || eventType.trim().length === 0) {
      console.log('[CBSG Analytics] Email skipped: missing eventType');
      return;
    }

    try {
      console.log('[CBSG Analytics] Loading EmailJS SDK...');
      await loadEmailJS();
      console.log('[CBSG Analytics] ✓ EmailJS SDK loaded.');

      // v1.2: sanitize every template field so nothing comes through as blank.
      // If a field is empty/undefined, substitute a labeled placeholder so
      // the email is at least informative instead of "nobody."
      // v1.3 (2026-04-24): FIXED name-key mismatch.
      // main.js writes visitor name to 'cbsg-guest-name' in the welcome modal.
      // Previously this read 'cbsg-visitor-name' which was never set, so every
      // email arrived as "Anonymous Visitor". Now reads cbsg-guest-name first,
      // falls back to cbsg-visitor-name (for any legacy data), then anonymous.
      const visitorName = (localStorage.getItem('cbsg-guest-name') || '').trim()
                       || (localStorage.getItem('cbsg-visitor-name') || '').trim()
                       || 'Anonymous Visitor';
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      const pageTitle = (document.title || '').trim() || '(untitled page)';
      const pageUrl   = window.location.href || '(no url)';
      const safeEvent = eventType.trim();
      const safeExtra = (extraInfo && String(extraInfo).trim()) || '(no details)';
      const userAgent = navigator.userAgent || '(unknown agent)';

      const templateParams = {
        to_email:     NOTIFY_EMAIL,
        visitor_name: visitorName,
        event_type:   safeEvent,
        page_url:     pageUrl,
        page_title:   pageTitle,
        timestamp:    timestamp,
        extra_info:   safeExtra,
        user_agent:   userAgent
      };

      console.log('[CBSG Analytics] Sending email with params:', templateParams);
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log(`[CBSG Analytics] ✓ Email sent: ${safeEvent}`);
    } catch (err) {
      console.warn('[CBSG Analytics] ✗ Email notification failed:', err && err.message ? err.message : err, err);
    }
  }

  // ─── VISITOR HIT TRIGGER ───────────────────────────────────
  // v1.2: This now requires BOTH (a) the page to stay open 8+ seconds AND
  // (b) at least one real human interaction (mousemove, click, scroll, key).
  // Bots and link-prefetchers rarely do either — this kills blank emails at
  // the source. If the visitor closes the tab before the thresholds are met,
  // no email is sent.
  function fireVisitorHitEmail() {
    console.log('[CBSG Analytics] fireVisitorHitEmail() called. isOwner=' + isOwner());

    if (sessionStorage.getItem(SESSION_HIT_KEY)) {
      console.log('[CBSG Analytics] Already fired this session — skipping.');
      return;
    }

    const DWELL_MS = 8000;
    let humanInteracted = false;
    let dwellElapsed = false;

    function markInteracted() {
      if (humanInteracted) return;
      humanInteracted = true;
      console.log('[CBSG Analytics] ✓ Human interaction detected (dwellElapsed=' + dwellElapsed + ')');
      maybeFire();
    }
    function markDwellDone() {
      dwellElapsed = true;
      console.log('[CBSG Analytics] ✓ 8-second dwell elapsed (humanInteracted=' + humanInteracted + ')');
      maybeFire();
    }
    function maybeFire() {
      if (!humanInteracted || !dwellElapsed) return;
      if (sessionStorage.getItem(SESSION_HIT_KEY)) return;
      sessionStorage.setItem(SESSION_HIT_KEY, 'true');
      console.log('[CBSG Analytics] ✓ Both gates passed — firing hit email.');
      sendNotificationEmail('Visitor hit site', `Landing page: ${window.location.pathname}`);
      cleanup();
    }
    function cleanup() {
      ['mousemove', 'click', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
        document.removeEventListener(evt, markInteracted, { passive: true });
      });
    }

    ['mousemove', 'click', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, markInteracted, { passive: true });
    });

    console.log('[CBSG Analytics] Waiting for 8s dwell + 1 human interaction...');
    setTimeout(markDwellDone, DWELL_MS);
  }

  // ─── NOTE SAVE TRIGGER (exposed globally) ──────────────────
  window.CBSG_notifyNoteSave = function(noteContext) {
    sendNotificationEmail('Notes saved', noteContext || 'Notes saved on ' + window.location.pathname);
  };

  // ─── OWNER STATUS CHECK (exposed globally for debugging) ───
  window.CBSG_isOwner = function() {
    return isOwner();
  };

  // ─── TEST EMAIL TRIGGER (exposed globally, v1.3) ───
  // Call CBSG_testEmail() from the browser console to fire a test email,
  // bypassing the dwell/interaction/session guards. Useful for verifying
  // that EmailJS credentials + template + quota all still work end-to-end
  // independent of the visitor-detection logic. Will still respect isOwner().
  window.CBSG_testEmail = function() {
    console.log('[CBSG Analytics] CBSG_testEmail() triggered manually.');
    sendNotificationEmail('Manual test email', 'Triggered by CBSG_testEmail() from console at ' + new Date().toISOString());
  };

  // ─── INITIALIZE ON PAGE LOAD ───────────────────────────────
  function init() {
    handleOwnerFlag();       // Check URL for ?owner=true/false first
    loadGoogleAnalytics();   // GA always runs (tracks your own visits too)
    fireVisitorHitEmail();   // Email fires only if not owner
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
