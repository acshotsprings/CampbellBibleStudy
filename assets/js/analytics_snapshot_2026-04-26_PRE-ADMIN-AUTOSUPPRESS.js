/* ============================================================
   CAMPBELL BIBLE STUDY — ANALYTICS & NOTIFICATIONS
   File: assets/js/analytics.js
   Updated: April 26, 2026 (v1.6 — GA4 custom event tracking)

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

   V1.4 CHANGES (2026-04-26):
   • FIXED: "The public key is required" send() failure. When sermons.html
     (and other pages) preloaded the EmailJS CDN via a <script> tag in <head>,
     window.emailjs already existed when loadEmailJS() ran, so the early-return
     path skipped init() entirely — leaving the SDK uninitialized. Two fixes:
     (1) loadEmailJS() now always calls init({publicKey}) even when SDK was
     pre-loaded by another script; (2) send() now passes {publicKey} as its
     4th argument as a belt-and-suspenders fallback. Either fix alone resolves
     the bug; together they're robust against future page-load order changes.

   V1.5 CHANGES (2026-04-26):
   • TEMPLATE-AGNOSTIC PARAMS. The EmailJS dashboard kept reverting save
     attempts to the original "Contact Us" template variables ({{name}},
     {{message}}, {{from_name}}, etc.), so we stopped fighting the UI.
     sendNotificationEmail() now sends BOTH the old template's variables
     AND the new v1.4 ones in every request. The {{message}} field carries
     a fully-formatted multi-line summary built in JS — visitor, event,
     timestamp, page, URL, details, browser/device — so the email body is
     readable as-is in the existing template, no dashboard edit required.
   • The new v1.4 names ({{visitor_name}}, {{event_type}}, etc.) still go
     out in case a future template uses the cleaner names.
   • Net result: one analytics.js change, zero EmailJS dashboard changes,
     readable emails forever.

   V1.6 CHANGES (2026-04-26):
   • GA4 CUSTOM EVENT TRACKING. Five behavioral events now fire to GA4
     in addition to default page_view tracking:
       (1) strongs_link_click  — anchor clicks to blueletterbible.org
       (2) scripture_link_click — anchor clicks to bible.com
       (3) module_complete     — when cbsg-complete-* localStorage flips true
       (4) notes_saved          — when window.CBSG_notifyNoteSave() runs
       (5) sermon_search       — what visitors search for in the sermon log
     All events go through the helper window.CBSG_trackEvent(name, params)
     which calls gtag('event', name, params) when GA is loaded.
   • PASSIVE OBSERVER PATTERN: events 1, 2, 3 are auto-detected without
     touching main.js, nav.js, or per-module pages. Document-level click
     listener catches anchor URLs; localStorage.setItem is wrapped to
     detect completion flips. Locked contracts preserved.
   • DEBUG: window.CBSG_testTrackEvent() fires a sample event for testing.
     All tracking honors owner suppression (your own clicks won't pollute
     GA reports unless owner mode is off).
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
  // FIXED 2026-04-26: When sermons.html (and other pages) preload the EmailJS
  // CDN script via a <script> tag in <head>, window.emailjs exists by the time
  // this loader runs — so the previous "if (window.emailjs) resolve()" path
  // skipped init() entirely, leaving the SDK uninitialized. Now we ALWAYS call
  // init() once we have window.emailjs, regardless of how it loaded. init() is
  // idempotent in v4 (safe to call multiple times). Belt-and-suspenders: send()
  // calls below also pass {publicKey} explicitly to handle any edge case where
  // init didn't take.
  function loadEmailJS() {
    return new Promise((resolve, reject) => {
      if (window.emailjs) {
        try { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) { /* ignore */ }
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
      // v1.3 (2026-04-24): FIXED name-key mismatch — read 'cbsg-guest-name' first.
      // v1.5 (2026-04-26): TEMPLATE-AGNOSTIC PARAMS. The EmailJS dashboard was
      // fighting save attempts, so instead of forcing the template to match our
      // variable names, we now populate BOTH naming conventions:
      //   • Old template fields ({{name}}, {{message}}, {{from_name}}, etc.)
      //     get sensible values, with {{message}} carrying the full readable
      //     summary as multi-line text.
      //   • New v1.4 fields ({{visitor_name}}, {{event_type}}, etc.) still go
      //     out for any future template that uses the cleaner names.
      // This way the email is readable no matter which template version is
      // active in the EmailJS dashboard. We never have to touch the UI again.
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

      // Build the rich message body. This is what {{message}} renders as in
      // the existing "Contact Us" template. Plain-text formatting that holds
      // up in any email client.
      const messageBody =
        '🔔 New activity on the Campbell Bible Study site\n' +
        '\n' +
        'Visitor:  ' + visitorName + '\n' +
        'Event:    ' + safeEvent + '\n' +
        'When:     ' + timestamp + '\n' +
        '\n' +
        'Page:     ' + pageTitle + '\n' +
        'URL:      ' + pageUrl + '\n' +
        '\n' +
        'Details:  ' + safeExtra + '\n' +
        '\n' +
        '────────────────────────────────────────\n' +
        'Browser / device info:\n' +
        userAgent;

      const templateParams = {
        // === OLD TEMPLATE VARIABLES (the "Contact Us" defaults) ===
        // These map to {{name}}, {{time}}, {{message}}, {{from_name}},
        // {{from_email}}, {{page_name}}, {{email}} in the dashboard template.
        name:         visitorName,
        time:         timestamp,
        message:      messageBody,
        from_name:    'Campbell Bible Study Site',
        from_email:   'noreply@cbs2026.com',
        page_name:    pageTitle,
        email:        NOTIFY_EMAIL,

        // === NEW v1.4 VARIABLES (cleaner names, for future template) ===
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
      // FIXED 2026-04-26: Pass {publicKey} as 4th argument to send() so the
      // SDK has the credential even if init() didn't fully take (e.g. when
      // a preloaded <script> tag created window.emailjs before our init ran).
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
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
    // Fire GA event (v1.6) — aggregate behavioral analytics
    trackEvent('notes_saved', {
      note_context: noteContext || '(no context)',
      page_path:    window.location.pathname,
      page_title:   document.title
    });
    // Fire EmailJS notification (existing behavior)
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

  // ─── GA4 CUSTOM EVENT TRACKING (v1.6) ──────────────────────
  // Generic helper: fires a custom event into GA4 via gtag(). Honors owner
  // suppression so your own clicks don't pollute reports (unless you've
  // turned owner mode off via ?owner=false). Silently no-ops if gtag is
  // not yet loaded — events that arrive before GA finishes initializing
  // are simply lost (acceptable for behavioral analytics).
  function trackEvent(eventName, params) {
    if (isOwner()) {
      console.log('[CBSG Analytics] Owner mode — GA event suppressed: ' + eventName);
      return;
    }
    if (typeof window.gtag !== 'function') {
      console.log('[CBSG Analytics] gtag not ready — event dropped: ' + eventName);
      return;
    }
    const safeParams = Object.assign({
      page_path:  window.location.pathname,
      page_title: document.title
    }, params || {});
    try {
      window.gtag('event', eventName, safeParams);
      console.log('[CBSG Analytics] ✓ GA event: ' + eventName, safeParams);
    } catch (err) {
      console.warn('[CBSG Analytics] ✗ GA event failed: ' + eventName, err);
    }
  }

  // Expose globally so per-page code (e.g. sermons.html toggleRow) can fire.
  window.CBSG_trackEvent = trackEvent;

  // Convenience wrapper for sermon search — sermons.html calls this when
  // the visitor types a search query (debounced). Tells you what topics
  // people are looking for across the sermon library.
  window.CBSG_trackSermonSearch = function(query) {
    const q = (query || '').trim();
    if (q.length < 2) return; // Skip empty / single-char noise
    trackEvent('sermon_search', {
      query: q.slice(0, 100)
    });
  };

  // ─── DEBUG TEST HOOK (v1.6) ────────────────────────────────
  // Run CBSG_testTrackEvent() from console to verify GA event pipeline.
  window.CBSG_testTrackEvent = function() {
    console.log('[CBSG Analytics] CBSG_testTrackEvent() triggered manually.');
    trackEvent('debug_test_event', {
      note: 'Manual test from console',
      timestamp: new Date().toISOString()
    });
  };

  // ─── PASSIVE OBSERVER 1: Strong's & Scripture link clicks ──
  // Single document-level click listener catches every anchor click on the
  // site without per-page hooks. Routes by destination domain.
  function setupLinkClickTracking() {
    document.addEventListener('click', function(evt) {
      const anchor = evt.target.closest('a');
      if (!anchor || !anchor.href) return;
      const url = anchor.href;

      // Strong's lexicon clicks → blueletterbible.org/lexicon/h*/ or g*/
      if (/blueletterbible\.org\/lexicon\//i.test(url)) {
        const match = url.match(/lexicon\/([hg]\d+)/i);
        const strongsId = match ? match[1].toUpperCase() : '(unknown)';
        trackEvent('strongs_link_click', {
          strongs_id:  strongsId,
          link_url:    url,
          link_text:   (anchor.textContent || '').trim().slice(0, 100)
        });
        return;
      }

      // Scripture clicks → bible.com (any sub-path; all your NASB links live here)
      if (/(?:^|\/\/)(?:www\.)?bible\.com\//i.test(url)) {
        // Try to extract the verse reference from URL like .../GEN.6.9.NASB1995
        const match = url.match(/\/(\d+)\/([A-Z0-9]+\.\d+(?:\.\d+(?:-\d+)?)?)\./);
        const verseRef = match ? match[2] : '(unknown)';
        trackEvent('scripture_link_click', {
          verse_ref:   verseRef,
          link_url:    url,
          link_text:   (anchor.textContent || '').trim().slice(0, 100)
        });
      }
    }, { passive: true, capture: true });
  }

  // ─── PASSIVE OBSERVER 2: Module completion ─────────────────
  // We wrap localStorage.setItem to detect when any 'cbsg-complete-*' key
  // flips from non-true to true. This catches main.js's toggleCompletion()
  // without modifying main.js (locked contract preserved).
  function setupCompletionTracking() {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      // Always do the real write first
      const result = nativeSetItem.apply(this, arguments);
      try {
        if (typeof key === 'string' && /^cbsg-complete-/.test(key) && value === 'true') {
          // Module just got marked complete (not unmarked)
          const completeKey = key.replace(/^cbsg-/, '');
          trackEvent('module_complete', {
            complete_key:  completeKey,
            module_path:   window.location.pathname,
            module_title:  document.title
          });
        }
      } catch (e) {
        // Never let our observer break the original setItem
      }
      return result;
    };
  }

  // ─── INITIALIZE ON PAGE LOAD ───────────────────────────────
  function init() {
    handleOwnerFlag();           // Check URL for ?owner=true/false first
    loadGoogleAnalytics();       // GA always runs (tracks your own visits too)
    setupLinkClickTracking();    // v1.6: Strong's & scripture click tracking
    setupCompletionTracking();   // v1.6: localStorage observer for completions
    fireVisitorHitEmail();       // Email fires only if not owner
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
