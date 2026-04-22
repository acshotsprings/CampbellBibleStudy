/* ============================================================
   CAMPBELL BIBLE STUDY — ANALYTICS & NOTIFICATIONS
   File: assets/js/analytics.js
   Created: April 22, 2026

   HANDLES TWO SYSTEMS:
   1. Google Analytics 4 (GA4) page tracking
   2. EmailJS silent email notifications to Chris

   EMAIL TRIGGERS:
   • Visitor lands on site (first page view this session)
   • Visitor saves their notes (fires when saveVisitorNotes() runs)

   SETUP REQUIREMENTS:
   • Add this ONE line to the <head> of every page:
     <script src="[PATH]/assets/js/analytics.js"></script>
     where [PATH] is the correct relative path:
     - index.html → src="assets/js/analytics.js"
     - theme1/module*.html → src="../assets/js/analytics.js"
     - theme2/module*.html → src="../assets/js/analytics.js"
   ============================================================ */

(function() {
  'use strict';

  // ─── CONFIGURATION ─────────────────────────────────────────
  const GA_MEASUREMENT_ID = 'G-P44J6HEJYG';
  const EMAILJS_PUBLIC_KEY = '2duGE838Bx6BcJXTF';
  const EMAILJS_SERVICE_ID = 'service_6mi6r6r';
  const EMAILJS_TEMPLATE_ID = 'template_275v5hl';
  const NOTIFY_EMAIL = 'acshotsprings@gmail.com';

  // Session tracking — prevent duplicate "visitor hit" emails in same session
  const SESSION_HIT_KEY = 'cbsg-session-hit-sent';

  // ─── LOAD GOOGLE ANALYTICS ─────────────────────────────────
  function loadGoogleAnalytics() {
    // Inject gtag.js script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    // Initialize gtag
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
      // Check if already loaded
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
      // Silent failure — don't interrupt user experience if email fails
      console.warn('[CBSG Analytics] Email notification failed:', err.message);
    }
  }

  // ─── VISITOR HIT TRIGGER ───────────────────────────────────
  function fireVisitorHitEmail() {
    // Only fire once per session (uses sessionStorage, so clearing browser
    // or opening new tab will fire again — that's intentional)
    if (sessionStorage.getItem(SESSION_HIT_KEY)) {
      return;
    }
    sessionStorage.setItem(SESSION_HIT_KEY, 'true');

    // Small delay so GA loads first + page is rendered
    setTimeout(() => {
      sendNotificationEmail('Visitor hit site', `Landing page: ${window.location.pathname}`);
    }, 1500);
  }

  // ─── NOTE SAVE TRIGGER (exposed globally) ──────────────────
  // Call this from main.js when notes are saved:
  //   if (window.CBSG_notifyNoteSave) window.CBSG_notifyNoteSave('context info');
  window.CBSG_notifyNoteSave = function(noteContext) {
    sendNotificationEmail('Notes saved', noteContext || 'Notes saved on ' + window.location.pathname);
  };

  // ─── INITIALIZE ON PAGE LOAD ───────────────────────────────
  function init() {
    loadGoogleAnalytics();
    fireVisitorHitEmail();
  }

  // Run init when DOM is ready (or immediately if already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
