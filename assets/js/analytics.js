/* ============================================================
   CAMPBELL BIBLE STUDY — ANALYTICS & NOTIFICATIONS
   File: assets/js/analytics.js
   Updated: May 29, 2026 (v2.3 — bot/automation email guard)

   HANDLES TWO SYSTEMS:
   1. Google Analytics 4 (GA4) page tracking
   2. EmailJS silent email notifications to Chris

   EMAIL TRIGGERS:
   • Visitor enters their name (fires onblur of name field — v1.8, every entry)
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

   V1.7 CHANGES (2026-04-26):
   • ADMIN-MODE AUTO-SUPPRESSION. Previously, owner suppression required
     visiting ?owner=true on every device + every browser to set a
     localStorage flag. Domain migration to cbs2026.com wiped all flags
     (localStorage is per-origin), causing self-emails to resume. Fix:
     isOwner() now also returns true if admin is unlocked (sessionStorage
     'cbsg-admin' === 'true' OR body.classList contains 'admin-mode'),
     AND when admin is detected the persistent owner flag is auto-set in
     localStorage. Net effect: any device Chris admin-logs into becomes
     permanently suppressed — surviving admin logout, browser restart,
     and even future domain changes (as long as he admin-logs in once on
     the new domain). The ?owner=true URL trick still works as a backup
     for non-admin scenarios.
   • New helper: isAdminMode() — internal-only, checks both signals
     defensively (sessionStorage + body class) so it works regardless of
     analytics.js vs main.js load order.

   V1.8 CHANGES (2026-05-02):
   • NAME-ENTRY EMAIL TRIGGER. New highest-confidence visitor signal: when
     a visitor types their name into the 👤 name field and clicks/tabs out
     (onblur), an email fires immediately with the name. No 8-second dwell,
     no interaction guard, no session dedup — every name entry/change emits
     a new email so Chris always knows who just identified themselves.
   • New exposed function: window.CBSG_notifyNameEntry(name) — called from
     main.js's onblur handler on the #cbsg-guest-name input. Empty/whitespace
     names are ignored (no email). Owner suppression still applies by default
     (so you don't email yourself while testing).
   • New session-scoped bypass: window.CBSG_bypassOwnerForName(true|false)
     — call from the browser console to force the name-entry email to fire
     even on owner-flagged devices, for testing the pipeline end-to-end
     without flipping URL params or clearing localStorage. Session-scoped
     so it auto-clears when the browser closes (can't accidentally stay on).
     Only affects name-entry emails — visit/note-save emails still respect
     owner suppression normally.

   V2.2 CHANGES (2026-05-11):
   • NEW ?clear-owner=true URL SWITCH. Any device that visits
     https://cbs2026.com/?clear-owner=true gets its persistent owner flag
     and session admin marker wiped, so the next visit acts like a fresh
     first-time visitor. Includes a visible alert() so non-technical users
     get confirmation without needing dev tools. Fixes the long-standing
     "stuck owner flag" problem: previously the only reset path was
     localStorage.removeItem('cbsg-is-owner') from the browser console,
     which isn't realistic on iPhone Safari or for non-technical visitors.
     Implementation lives inside handleOwnerFlag() alongside the legacy
     ?owner=true / ?owner=false handling.

   V2.3 CHANGES (2026-05-29):
   • BOT / AUTOMATION EMAIL GUARD. Notification emails ("visitor entered
     name", "notes saved", etc.) were firing for automated visitors — most
     visibly a spoofed Android user-agent (OPR/99 reporting Chrome/148, which
     is an impossible pairing: Opera 99 is built on Chromium 113, not 148)
     that also carried the WebView 'wv' token alongside the standalone Opera
     brand — two contradictions no real browser produces. New isLikelyBot()
     check now runs at the top of sendNotificationEmail() (the single point
     every email passes through), so ONE guard covers all event types.
   • Three signals, all low-false-positive. A real reader on a real
     phone/computer is never flagged:
       (1) navigator.webdriver === true  — set by Selenium/Puppeteer/
           Playwright-driven browsers (the most common name-field auto-fillers).
       (2) Self-declared crawler/scraper/monitor/HTTP-library tokens in the
           UA (googlebot, ahrefsbot, headless, curl/, python-requests, the
           social link-preview fetchers, etc.).
       (3) Self-contradictory UA: Android WebView ('wv') combined with a
           standalone desktop/cross-platform browser brand (Opera/Edge/
           Vivaldi/Brave/etc.). A genuine WebView is embedded in an app and
           never carries those brands; a real Opera/Edge is never a WebView.
           This is the exact rule that catches the OPR/99 + 'wv' string.
   • Suppressed sends are logged to console with the trigger reason but send
     NO email, so the inbox only sees real people.
   • New console helper: window.CBSG_isLikelyBot() — returns the bot reason
     string (or false). Run it in the browser console on any device to confirm
     your own browser is NOT flagged before trusting the filter.
   • ADD-only: no existing logic removed or reordered. GA4 tracking is
     untouched (bots still appear in GA reports; only the email is skipped).
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
  // SESSION_HIT_KEY removed 2026-05-07 — no longer needed since hit email was removed.

  // ─── OWNER DETECTION ───────────────────────────────────────
  function handleOwnerFlag() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ownerParam = urlParams.get('owner');
      const clearOwnerParam = urlParams.get('clear-owner');

      // v2.2 (2026-05-11): NEW ?clear-owner=true SWITCH.
      // The persistent owner flag has historically gotten "stuck" on
      // devices that admin-logged-in once and were then permanently
      // suppressed from email notifications. Pre-v2.2, the only fix
      // was to open browser dev tools and run a localStorage command —
      // not a workflow Chris could realistically explain to anyone else
      // (and a pain on iPhone Safari). This URL switch gives a one-tap
      // reset path for any device: just visit cbs2026.com/?clear-owner=true
      // and the flag is wiped + sessionStorage admin-mode is cleared too,
      // so the visit acts like a fresh first-time visitor.
      // Includes a visible alert() so non-technical users get confirmation
      // without needing to check the console.
      if (clearOwnerParam === 'true') {
        try { localStorage.removeItem(OWNER_FLAG_KEY); } catch (e) {}
        try { sessionStorage.removeItem('cbsg-admin'); } catch (e) {}
        console.log('[CBSG Analytics] ?clear-owner=true — owner flag cleared + admin session cleared. This device will now generate normal visitor emails.');
        try {
          alert('Owner flag cleared. This device will now behave as a normal visitor.\n\nTo restore admin mode, log in with the admin password as usual.');
        } catch (e) { /* alert can fail in some embeds */ }
        // Don't fall through to the legacy ?owner=true/false handling below
        return;
      }

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
      // Persistent owner flag (set via ?owner=true URL param OR by isAdminMode below)
      if (localStorage.getItem(OWNER_FLAG_KEY) === 'true') return true;

      // Admin mode auto-suppresses. If admin is currently unlocked, ALSO
      // promote this device to a persistent owner so future visits (even
      // after admin logout, even after browser restart) stay suppressed.
      // This is the durable fix for the "I keep getting emails from my own
      // devices" problem — every device Chris uses gets admin-unlocked at
      // some point, so this self-heals across phones, laptops, new browsers,
      // and even domain migrations.
      if (isAdminMode()) {
        try {
          localStorage.setItem(OWNER_FLAG_KEY, 'true');
          console.log('[CBSG Analytics] Admin detected — device auto-promoted to owner. Emails suppressed permanently on this device/browser.');
        } catch (e) { /* storage write fail — still return true for this session */ }
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  // Detect admin mode without depending on main.js load order.
  // 2026-05-06 FIX: Only sessionStorage is the source of truth. Some HTML
  // pages ship with class="admin-mode" baked into the <body> tag (artifact
  // of editing the source while admin was unlocked), which was causing every
  // first-time visitor to be auto-promoted to owner and have their hit email
  // silently suppressed. The body-class signal is unreliable — it's a UI hint
  // applied AFTER unlock, never a source of truth before it.
  function isAdminMode() {
    try {
      if (sessionStorage.getItem('cbsg-admin') === 'true') return true;
    } catch (e) { /* sessionStorage may throw in some privacy modes */ }
    return false;
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

  // ─── BOT / AUTOMATION DETECTION (v2.3) ─────────────────────
  // Returns a short reason string if the current visitor looks automated,
  // or false if it looks like a real human browser. Deliberately conservative
  // — every check targets an explicit automation signal or a self-contradictory
  // user-agent, so a real reader on a real phone/computer is never flagged.
  // Exposed as window.CBSG_isLikelyBot() so it can be tested from the console.
  function isLikelyBot() {
    var ua = (navigator.userAgent || '').toLowerCase();

    // (1) Automation flag — Selenium / Puppeteer / Playwright set this true.
    //     These are the tools that actually fill the name field and trip the
    //     "visitor entered name" email.
    try { if (navigator.webdriver === true) return 'navigator.webdriver=true'; }
    catch (e) { /* some privacy modes throw on access */ }

    // (2) Missing or absurdly short UA — no real browser sends this.
    if (!ua || ua.length < 16) return 'missing/short user-agent';

    // (3) Self-declared crawlers, scrapers, monitors, headless runners, HTTP
    //     libraries, and social link-preview fetchers. Explicit named bots plus
    //     a boundary-safe generic "...bot..." pattern (so real device brands
    //     like "Cubot" are NOT caught).
    var BOT_REGEX = new RegExp([
      'crawl', 'spider', 'slurp', 'headless', 'phantomjs', 'puppeteer',
      'playwright', 'selenium', 'scrapy', 'python-requests', 'python-urllib',
      'curl\\/', 'wget', 'libwww', 'okhttp', 'go-http-client',
      'apache-httpclient', 'java\\/', 'facebookexternalhit', 'embedly',
      'googlebot', 'bingbot', 'bingpreview', 'yandexbot', 'baiduspider',
      'duckduckbot', 'sogou', 'exabot', 'telegrambot', 'discordbot',
      'slackbot', 'twitterbot', 'linkedinbot', 'whatsapp\\/', 'ahrefsbot',
      'semrushbot', 'mj12bot', 'dotbot', 'petalbot', 'bytespider', 'gptbot',
      'claudebot', 'ccbot', 'amazonbot', 'applebot', 'lighthouse', 'gtmetrix',
      'pagespeed', 'pingdom', 'statuscake', 'uptimerobot', 'dataprovider',
      '[ /+_-]bot[ /;)]'
    ].join('|'), 'i');
    if (BOT_REGEX.test(ua)) return 'crawler/automation token in UA';

    // (4) Impossible UA — Android WebView ('wv') combined with a standalone
    //     desktop/cross-platform browser brand. A genuine WebView is embedded
    //     inside an app and never carries an Opera/Edge/Vivaldi/Brave token; a
    //     real one of those browsers is never a WebView. Both at once = spoof.
    //     This is the exact OPR/99 + 'wv' agent that caused the false alerts.
    if (ua.indexOf(';wv') !== -1 || ua.indexOf('; wv') !== -1 || ua.indexOf(' wv)') !== -1) {
      var STANDALONE_BRANDS = ['opr/', 'edg/', 'edga/', 'vivaldi', 'yabrowser', 'brave', 'maxthon'];
      for (var k = 0; k < STANDALONE_BRANDS.length; k++) {
        if (ua.indexOf(STANDALONE_BRANDS[k]) !== -1) {
          return 'impossible UA: WebView + ' + STANDALONE_BRANDS[k];
        }
      }
    }

    return false; // looks like a real human browser
  }
  window.CBSG_isLikelyBot = isLikelyBot;

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

    // BOT / AUTOMATION GUARD (v2.3) — skip emails from automated visitors
    // (headless browsers, crawlers, link-preview fetchers, spoofed agents).
    // Single chokepoint: covers name-entry AND note-save AND any future event.
    // GA4 tracking is unaffected — only the email is suppressed. See isLikelyBot().
    var botReason = isLikelyBot();
    if (botReason) {
      console.log('[CBSG Analytics] Bot suppressed — no email sent. Reason: ' + botReason + ' | eventType=' + eventType);
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
  // 2026-05-07 (v2.0): The 8-second-dwell-plus-interaction "hit email" was
  // removed. It was firing for any visitor who lingered 8+ seconds and moved
  // their mouse/scrolled, which produced "Anonymous Visitor" emails for
  // anyone who hadn't yet entered their name through the welcome modal —
  // including bots, prefetchers, and visitors mid-modal. The cleaner signal
  // is CBSG_notifyNameEntry below: it fires only when a real visitor types
  // and submits their actual name. No more anonymous noise.

  // ─── NOTE SAVE TRIGGER (exposed globally) ──────────────────
  // 2026-05-07 (v2.1): Now accepts a second arg `noteContent` containing
  // the actual notes the visitor typed. When provided, it gets included in
  // the email body so Chris can read the visitor's notes directly from the
  // notification — without this, the only signal was "someone saved" with
  // no idea what they wrote, which defeated the whole point of a family
  // Bible study site.
  window.CBSG_notifyNoteSave = function(noteContext, noteContent) {
    // Fire GA event (v1.6) — aggregate behavioral analytics
    trackEvent('notes_saved', {
      note_context: noteContext || '(no context)',
      page_path:    window.location.pathname,
      page_title:   document.title
    });
    // Build email body — context line + notes content if available.
    // Truncate at 8KB to stay well under EmailJS template field limits.
    let body = noteContext || ('Notes saved on ' + window.location.pathname);
    if (noteContent && typeof noteContent === 'string') {
      const cleaned = noteContent.trim();
      if (cleaned.length > 0) {
        const MAX_LEN = 8000;
        const truncated = cleaned.length > MAX_LEN
          ? cleaned.slice(0, MAX_LEN) + '\n\n[...notes truncated — too long for email. Full version is in visitor\'s browser localStorage.]'
          : cleaned;
        body += '\n\n--- NOTES ---\n' + truncated;
      }
    }
    sendNotificationEmail('Notes saved', body);
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

  // ─── NAME-ENTRY EMAIL TRIGGER (v1.8) ───────────────────────
  // Highest-confidence visitor signal. Called by main.js's onblur handler
  // on the #cbsg-guest-name input. Fires every time a non-empty name is
  // entered/changed — no dedup, no dwell guard, no interaction guard.
  // Owner suppression still applies UNLESS the session-scoped bypass is on
  // (see CBSG_bypassOwnerForName below).
  const NAME_BYPASS_KEY = 'cbsg-name-bypass-owner';

  window.CBSG_notifyNameEntry = function(name) {
    const cleanName = (name && String(name).trim()) || '';
    if (!cleanName) {
      console.log('[CBSG Analytics] Name-entry skipped: empty name');
      return;
    }
    console.log('[CBSG Analytics] CBSG_notifyNameEntry() fired. name="' + cleanName + '"');

    // Owner suppression — but allow session bypass for testing
    let bypassActive = false;
    try { bypassActive = sessionStorage.getItem(NAME_BYPASS_KEY) === 'true'; }
    catch (e) { /* sessionStorage may throw in some privacy modes */ }

    if (isOwner() && !bypassActive) {
      console.log('[CBSG Analytics] Owner mode — name-entry email suppressed. Run CBSG_bypassOwnerForName(true) to override for this session.');
      return;
    }
    if (isOwner() && bypassActive) {
      console.log('[CBSG Analytics] Owner mode active but bypass ON — name-entry email will fire.');
    }

    sendNotificationEmail('Visitor entered name', 'Name: ' + cleanName + ' | Page: ' + window.location.pathname);
  };

  // ─── OWNER BYPASS FOR NAME-ENTRY (v1.8) ────────────────────
  // Session-scoped bypass for testing the name-entry email pipeline from
  // an owner-flagged device. Auto-clears when the browser closes — can't
  // accidentally stay on forever. Only affects name-entry emails; visit
  // and note-save emails still respect owner suppression normally.
  //   CBSG_bypassOwnerForName(true)  — turn bypass ON for this session
  //   CBSG_bypassOwnerForName(false) — turn bypass OFF
  //   CBSG_bypassOwnerForName()      — read current state
  window.CBSG_bypassOwnerForName = function(enable) {
    try {
      if (enable === true) {
        sessionStorage.setItem(NAME_BYPASS_KEY, 'true');
        console.log('[CBSG Analytics] ✓ Owner bypass for name-entry: ON (this session only)');
        return true;
      }
      if (enable === false) {
        sessionStorage.removeItem(NAME_BYPASS_KEY);
        console.log('[CBSG Analytics] ✓ Owner bypass for name-entry: OFF');
        return false;
      }
      const current = sessionStorage.getItem(NAME_BYPASS_KEY) === 'true';
      console.log('[CBSG Analytics] Owner bypass for name-entry currently: ' + (current ? 'ON' : 'OFF'));
      return current;
    } catch (e) {
      console.log('[CBSG Analytics] sessionStorage unavailable: ' + e.message);
      return false;
    }
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

  // ─── ONE-TIME MIGRATION (2026-05-06) ───────────────────────
  // Until today, isAdminMode() trusted document.body.classList.contains('admin-mode')
  // as a signal that the user was admin-unlocked. But several HTML pages on the
  // site ship with class="admin-mode" baked into the <body> tag (an artifact of
  // editing source while admin was unlocked). That meant every visitor whose
  // first page was a "leaking" page got auto-promoted to owner permanently in
  // localStorage, which silently suppressed all their visitor-hit emails.
  //
  // This migration runs once per device. If cbsg-is-owner is set but the device
  // is not currently in admin sessionStorage, we conservatively clear the flag
  // — assuming it was written by the buggy auto-promote. Any real owner device
  // (i.e. you, Chris) will simply re-promote next time you unlock admin.
  function runOwnerFlagMigration() {
    const MIGRATION_KEY = 'cbsg-owner-migration-v2026-05-06';
    try {
      if (localStorage.getItem(MIGRATION_KEY) === 'done') return;
      const sessionAdmin = sessionStorage.getItem('cbsg-admin') === 'true';
      const ownerFlag    = localStorage.getItem(OWNER_FLAG_KEY) === 'true';
      if (ownerFlag && !sessionAdmin) {
        localStorage.removeItem(OWNER_FLAG_KEY);
        console.log('[CBSG Analytics] One-time migration: cleared stale owner flag (likely written by 2026-05-06 admin-class bug).');
      }
      localStorage.setItem(MIGRATION_KEY, 'done');
    } catch (e) { /* storage may throw in privacy modes */ }
  }

  // ─── INITIALIZE ON PAGE LOAD ───────────────────────────────
  function init() {
    runOwnerFlagMigration();     // 2026-05-06: clear stale owner flags
    handleOwnerFlag();           // Check URL for ?owner=true/false first
    loadGoogleAnalytics();       // GA always runs (tracks your own visits too)
    setupLinkClickTracking();    // v1.6: Strong's & scripture click tracking
    setupCompletionTracking();   // v1.6: localStorage observer for completions
    // 2026-05-07: hit email removed — see comment block above CBSG_notifyNameEntry.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
