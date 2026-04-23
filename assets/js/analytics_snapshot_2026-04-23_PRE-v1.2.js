/* ============================================================
   CAMPBELL BIBLE STUDY — ANALYTICS & NOTIFICATIONS
   File: assets/js/analytics.js
   Updated: April 22, 2026 (v1.1 — added owner suppression)

   HANDLES TWO SYSTEMS:
   1. Google Analytics 4 (GA4) page tracking
   2. EmailJS silent email notifications to Chris

   EMAIL TRIGGERS:
   • Visitor lands on site (first page view this session)
   • Visitor saves their notes (fires when saveVisitorNotes() runs)

   OWNER SUPPRESSION (NEW in v1.1):
   • Visit https://acshotsprings.github.io/CampbellBibleStudy/?owner=true
     to mark this device as the owner (Chris).
   • Owner visits and note-saves will NOT trigger emails.
   • Google Analytics tracking still runs (so you see your own traffic).
   • Flag persists in localStorage as 'cbsg-is-owner' = 'true'.
   • To disable: visit ?owner=false OR clear localStorage manually.
   • To check status anytime: open browser console and type CBSG_isOwner()
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
    // OWNER SUPPRESSION — skip all emails if this device is marked as owner
    if (isOwner()) {
      console.log(`[CBSG Analytics] Owner mode — email suppressed: ${eventType}`);
      return;
    }

    try {
      await loadEmailJS();

      const visitorName = localStorage.getItem('cbsg-visitor-name') || 'Unknown Visitor';
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      });

      const templateParams = {
        to_email: NOTIFY_EMAIL,
        visitor_name: visitorName,
        event_type: eventType,
        page_url: window.location.href,
        page_title: document.title,
        timestamp: timestamp,
        extra_info: extraInfo || '',
        user_agent: navigator.userAgent
      };

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log(`[CBSG Analytics] Email sent: ${eventType}`);
    } catch (err) {
      console.warn('[CBSG Analytics] Email notification failed:', err.message);
    }
  }

  // ─── VISITOR HIT TRIGGER ───────────────────────────────────
  function fireVisitorHitEmail() {
    if (sessionStorage.getItem(SESSION_HIT_KEY)) {
      return;
    }
    sessionStorage.setItem(SESSION_HIT_KEY, 'true');

    setTimeout(() => {
      sendNotificationEmail('Visitor hit site', `Landing page: ${window.location.pathname}`);
    }, 1500);
  }

  // ─── NOTE SAVE TRIGGER (exposed globally) ──────────────────
  window.CBSG_notifyNoteSave = function(noteContext) {
    sendNotificationEmail('Notes saved', noteContext || 'Notes saved on ' + window.location.pathname);
  };

  // ─── OWNER STATUS CHECK (exposed globally for debugging) ───
  window.CBSG_isOwner = function() {
    return isOwner();
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
