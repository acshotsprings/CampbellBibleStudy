/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v5.0
   Admin persistence · Guest notes · Silent EmailJS
   ============================================================ */

const OWNER = 'acshotsprings';
const REPO  = 'CampbellBibleStudy';

const EMAILJS_PUBLIC_KEY  = '2duGE838Bx6BcJXTF';
const EMAILJS_SERVICE_ID  = 'service_6mi6r6r';
const EMAILJS_TEMPLATE_ID = 'template_275v5hl';

/* ---- GOOGLE ANALYTICS --------------------------------------
   Property: Campbell Bible Study (CBS)
   Added 2026-04-21: Tracks all page visits with visitor name
   as user_id, enabling per-person page-view + dwell time
   analytics in the GA4 dashboard.
   ------------------------------------------------------------ */
const GA_MEASUREMENT_ID = 'G-P44J6HEJYG';

const ADMIN_PASSWORD = 'Campbell2026';

const COMPLETION_KEYS = {
  'theme1/module1':  'complete-t1m1',
  'theme1/module2':  'complete-t1m2',
  'theme1/module3':  'complete-t1m3',
  'theme1/module4':  'complete-t1m4',
  'theme1/module5':  'complete-t1m5',
  'theme1/module6':  'complete-t1m6',
  'theme1/module7':  'complete-t1m7',
  'theme1/module8':  'complete-t1m8',
  'theme1/module9':  'complete-t1m9',
  'theme1/module10': 'complete-t1m10',
  'theme1/module11': 'complete-t1m11',
  'theme1/module12': 'complete-t1m12',
  'theme1/module13': 'complete-t1m13',
  'theme1/module14': 'complete-t1m14',
  'theme1/module15': 'complete-t1m15',
  'theme2/module1':  'complete-t2m1',
  'theme2/module2':  'complete-t2m2',
  'theme2/module3':  'complete-t2m3',
  'theme2/module4':  'complete-t2m4',
};

function isAdminUnlocked() { return sessionStorage.getItem('cbsg-admin') === 'true'; }

function applyAdminUI() {
  const unlocked   = isAdminUnlocked();
  const btnAdmin   = document.getElementById('btn-admin');
  const btnSave    = document.getElementById('btn-save')    || document.querySelector('.btn-save');
  const btnLoad    = document.getElementById('btn-load')    || document.querySelector('.btn-load');
  const btnStamp   = document.getElementById('btn-timestamp');
  const tokenInput = document.getElementById('gh-token');
  if (btnAdmin)   btnAdmin.textContent     = unlocked ? '🔓 Admin ON' : '🔒 Admin';
  if (btnSave)    btnSave.style.display    = unlocked ? 'inline-block' : 'none';
  if (btnLoad)    btnLoad.style.display    = unlocked ? 'inline-block' : 'none';
  if (btnStamp)   btnStamp.style.display   = unlocked ? 'inline-block' : 'none';
  if (tokenInput) tokenInput.style.display = unlocked ? 'inline-block' : 'none';
  if (unlocked) {
    document.body.classList.add('admin-mode');
    document.body.classList.remove('readonly');
    const saved = localStorage.getItem('cbsg-gh-token');
    if (saved && tokenInput) tokenInput.value = saved;
    const gp = document.getElementById('cbsg-guest-panel');
    if (gp) gp.style.display = 'none';
  } else {
    document.body.classList.remove('admin-mode');
    document.body.classList.add('readonly');
    if (tokenInput) tokenInput.value = '';
  }
  if (typeof buildSidebar === 'function') {
    const root = window.location.pathname.includes('/theme') ? '..' : '.';
    buildSidebar(root);
  }
}

function toggleAdminMode() {
  if (isAdminUnlocked()) { sessionStorage.removeItem('cbsg-admin'); applyAdminUI(); }
  else openAdminModal();
}

function openAdminModal() {
  injectAdminModal();
  const modal = document.getElementById('cbsg-admin-modal');
  if (modal) { modal.style.display = 'flex'; setTimeout(() => { const inp = document.getElementById('cbsg-admin-pw'); if (inp) inp.focus(); }, 80); }
}

function closeAdminModal() {
  const modal = document.getElementById('cbsg-admin-modal');
  if (modal) modal.style.display = 'none';
  const inp = document.getElementById('cbsg-admin-pw');
  const err = document.getElementById('cbsg-admin-err');
  if (inp) inp.value = '';
  if (err) err.style.display = 'none';
}

function checkAdminPw() {
  const inp = document.getElementById('cbsg-admin-pw');
  const err = document.getElementById('cbsg-admin-err');
  if (!inp) return;
  if (inp.value === ADMIN_PASSWORD) { sessionStorage.setItem('cbsg-admin', 'true'); closeAdminModal(); applyAdminUI(); }
  else { if (err) err.style.display = 'block'; inp.value = ''; inp.focus(); }
}

function injectAdminModal() {
  if (document.getElementById('cbsg-admin-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'cbsg-admin-modal';
  modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;align-items:center;justify-content:center;font-family:Arial,sans-serif;';
  modal.innerHTML = `<div style="background:#fff;border-radius:10px;padding:28px 32px;width:300px;box-shadow:0 8px 32px rgba(0,0,0,0.3);"><h3 style="margin:0 0 6px;font-size:16px;color:#1F3864;">🔒 Admin Access</h3><p style="margin:0 0 16px;font-size:12px;color:#888;">Enter your password to enable editing and GitHub sync.</p><input id="cbsg-admin-pw" type="password" placeholder="Password..." onkeydown="if(event.key==='Enter')checkAdminPw()" style="width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;padding:9px 12px;font-size:14px;margin-bottom:10px;"><div id="cbsg-admin-err" style="display:none;font-size:12px;color:#cc0000;margin-bottom:10px;">Incorrect password. Try again.</div><div style="display:flex;justify-content:flex-end;gap:10px;"><button onclick="closeAdminModal()" style="background:#f0f0f0;color:#444;border:none;border-radius:4px;padding:8px 16px;font-size:13px;cursor:pointer;">Cancel</button><button onclick="checkAdminPw()" style="background:#1F3864;color:#FFD700;border:none;border-radius:4px;padding:8px 18px;font-size:13px;font-weight:bold;cursor:pointer;">Unlock</button></div></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) closeAdminModal(); });
}

function getGuestName() { return localStorage.getItem('cbsg-guest-name') || ''; }

/* ---- NAME VALIDATION ---------------------------------------
   Blocks obvious junk entries. Cannot verify a name is "real"
   (e.g., block "Bob" but allow "Danielle") — that would require
   a massive database. Instead, blocks patterns that clearly
   aren't names: too short, no letters, all-same-character,
   common junk strings, pure numbers.
   ------------------------------------------------------------ */
const CBSG_JUNK_NAMES = [
  'test','testing','tester','asdf','asdfasdf','qwerty','qwertyuiop',
  'anonymous','anon','user','visitor','guest','admin','name',
  'none','na','nope','xxx','yyy','zzz','abc','abcabc','hello',
  'fuck','fuckyou','shit','poop','butt','dick','ass','sex',
  'xyz','aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii',
  'jjj','kkk','lll','mmm','nnn','ooo','ppp','qqq','rrr','sss',
  'ttt','uuu','vvv','www','xxxx','yyyy','zzzz'
];
function validateGuestName(raw) {
  const n = (raw || '').trim();
  if (n.length < 3) return { ok:false, reason:'Please enter at least 3 characters.' };
  if (n.length > 40) return { ok:false, reason:'That name is too long.' };
  const letters = (n.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (letters < 2) return { ok:false, reason:'Please enter a real name (letters required).' };
  if (/^(.)\1+$/.test(n)) return { ok:false, reason:'Please enter a real name.' };
  if (/^\d+$/.test(n)) return { ok:false, reason:'Please enter a real name, not numbers.' };
  const lc = n.toLowerCase().replace(/[^a-z0-9]/g,'');
  if (CBSG_JUNK_NAMES.includes(lc)) return { ok:false, reason:'Please enter your real name.' };
  if (/^[a-z]{1,3}(\d+)?$/i.test(n)) return { ok:false, reason:'Please enter your real name.' };
  return { ok:true, name:n };
}

function showWelcomeModal() {
  if (document.getElementById('cbsg-welcome-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'cbsg-welcome-modal';
  modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9998;align-items:center;justify-content:center;font-family:Arial,sans-serif;backdrop-filter:blur(3px);';
  modal.innerHTML = `<div style="background:#fff;border-radius:12px;padding:32px 36px;width:360px;box-shadow:0 12px 40px rgba(0,0,0,0.45);text-align:center;">
    <div style="font-size:36px;margin-bottom:10px;">✝️</div>
    <h2 style="margin:0 0 8px;font-size:20px;color:#1F3864;">Welcome!</h2>
    <p style="margin:0 0 6px;font-size:13px;color:#555;line-height:1.6;">This is the Campbell Family Biblical Study Guide — a personal resource for growing in the knowledge of Christ.</p>
    <p style="margin:0 0 20px;font-size:13px;color:#555;line-height:1.6;">Please enter your name to continue.</p>
    <input id="cbsg-welcome-name" type="text" placeholder="Your name..." autocomplete="off" oninput="cbsgValidateLive()" onkeydown="if(event.key==='Enter')saveWelcomeName()" style="width:100%;box-sizing:border-box;border:2px solid #1F3864;border-radius:6px;padding:10px 14px;font-size:15px;margin-bottom:8px;text-align:center;font-family:Arial,sans-serif;">
    <div id="cbsg-welcome-err" style="font-size:11px;color:#C62828;min-height:14px;margin-bottom:10px;font-family:Arial,sans-serif;"></div>
    <button id="cbsg-welcome-btn" onclick="saveWelcomeName()" disabled style="width:100%;background:#888;color:#ddd;border:none;border-radius:6px;padding:11px;font-size:14px;font-weight:bold;cursor:not-allowed;font-family:Arial,sans-serif;letter-spacing:0.03em;transition:all 0.2s;">Let's Study ✝</button>
    <p style="margin:12px 0 0;font-size:11px;color:#aaa;">Your name is required to continue.</p>
  </div>`;
  document.body.appendChild(modal);
  setTimeout(() => { const inp = document.getElementById('cbsg-welcome-name'); if (inp) inp.focus(); }, 150);
}

function cbsgValidateLive() {
  const inp = document.getElementById('cbsg-welcome-name');
  const btn = document.getElementById('cbsg-welcome-btn');
  const err = document.getElementById('cbsg-welcome-err');
  if (!inp || !btn) return;
  const r = validateGuestName(inp.value);
  if (r.ok) {
    btn.disabled = false;
    btn.style.background = '#1F3864';
    btn.style.color = '#FFD700';
    btn.style.cursor = 'pointer';
    if (err) err.textContent = '';
  } else {
    btn.disabled = true;
    btn.style.background = '#888';
    btn.style.color = '#ddd';
    btn.style.cursor = 'not-allowed';
    if (err) err.textContent = (inp.value.trim().length > 0) ? r.reason : '';
  }
}

function saveWelcomeName() {
  const inp = document.getElementById('cbsg-welcome-name');
  if (!inp) return;
  const r = validateGuestName(inp.value);
  if (!r.ok) { cbsgValidateLive(); return; }
  localStorage.setItem('cbsg-guest-name', r.name);
  localStorage.setItem('cbsg-guest-welcomed', 'true');
  const modal = document.getElementById('cbsg-welcome-modal');
  if (modal) modal.remove();
  // Guest panel removed 2026-04-21 — visitors use the embedded Quill boxes on each page instead.
  // Now that we have a name, (re)configure GA with user_id and start the session
  cbsgConfigureGAUser();
  cbsgSessionStart();
  cbsgSessionRecordPageEntry();
}

function checkFirstVisit() {
  if (isAdminUnlocked()) return;
  const welcomed = localStorage.getItem('cbsg-guest-welcomed');
  if (!welcomed) {
    showWelcomeModal();
  } else {
    // Guest panel removed 2026-04-21 — visitors use embedded Quill boxes.
    // Existing visitor — GA user_id already configured at init; just record the page entry
    cbsgSessionRecordPageEntry();
  }
}

/* ============================================================
   GOOGLE ANALYTICS + SESSION TRACKING
   Added 2026-04-21. Two layers of tracking:

   1. Google Analytics (gtag.js) — loads on every page, silently
      tracks pageviews. When a visitor name is set, it's used as
      the GA user_id so all pageviews are tied to that person in
      the GA dashboard.

   2. Session tracking — builds a list of {page, seconds} entries
      across the visitor's browsing session. When they close the
      tab OR go idle for 15 minutes, ONE email summary is sent
      with the full session (start time, pages visited, dwell
      time per page, total session duration).

   Session data lives in sessionStorage (survives page navigation
   within the same tab) under key 'cbsg-session'. Shape:
   {
     name: "Matt",
     sessionId: "abc123",
     startTs: 1729500000000,
     lastActiveTs: 1729500120000,
     pages: [{page:"index", path:"/", enterTs:..., seconds:45}, ...]
   }
   ============================================================ */

const CBSG_IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

function cbsgInitGA() {
  if (window.cbsgGALoaded) return;
  window.cbsgGALoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  gtag('js', new Date());
  cbsgConfigureGAUser();
}

function cbsgConfigureGAUser() {
  if (typeof gtag !== 'function') return;
  const cfg = { send_page_view: true };
  const name = getGuestName();
  if (name) cfg.user_id = name;
  gtag('config', GA_MEASUREMENT_ID, cfg);
}

function cbsgSessionGet() {
  try {
    const raw = sessionStorage.getItem('cbsg-session');
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}
function cbsgSessionSet(s) {
  try { sessionStorage.setItem('cbsg-session', JSON.stringify(s)); } catch(e) {}
}
function cbsgSessionClear() {
  try { sessionStorage.removeItem('cbsg-session'); } catch(e) {}
}

function cbsgSessionStart() {
  const name = getGuestName();
  if (!name) return;
  const now = Date.now();
  const s = {
    name: name,
    sessionId: 's_' + now.toString(36) + Math.random().toString(36).slice(2,6),
    startTs: now,
    lastActiveTs: now,
    pages: []
  };
  cbsgSessionSet(s);
}

/* Records the current page as a new entry in the session.
   Called on every page load (once a name is present). Before
   adding, it closes out any previous page's timer (finalizing
   its seconds). Also starts a new session if none exists or
   the last one went idle past the timeout. */
function cbsgSessionRecordPageEntry() {
  const name = getGuestName();
  if (!name) return;
  if (typeof gtag === 'function') {
    gtag('event', 'page_view_named', {
      visitor_name: name,
      page_title: document.title,
      page_path: window.location.pathname
    });
  }
  let s = cbsgSessionGet();
  const now = Date.now();
  // If no session or stale (idle past timeout), close previous and start new
  if (!s || (now - (s.lastActiveTs || s.startTs)) > CBSG_IDLE_TIMEOUT_MS) {
    if (s) cbsgSessionFinalizeAndSend(s, 'idle_timeout_on_new_visit');
    cbsgSessionStart();
    s = cbsgSessionGet();
    if (!s) return;
  }
  // Close out the previous page's timer (if any)
  if (s.pages.length) {
    const last = s.pages[s.pages.length - 1];
    if (last && !last.closed) {
      last.seconds = Math.max(0, Math.round((now - last.enterTs) / 1000));
      last.closed = true;
    }
  }
  // Add this page
  const pageName = document.title.replace(' — Campbell Bible Study', '').trim() || window.location.pathname;
  s.pages.push({
    page: pageName,
    path: window.location.pathname,
    enterTs: now,
    seconds: 0,
    closed: false
  });
  s.lastActiveTs = now;
  cbsgSessionSet(s);
}

/* Updates the current (open) page's seconds count. Called
   periodically by the heartbeat and on visibility/unload. */
function cbsgSessionTickCurrentPage() {
  const s = cbsgSessionGet();
  if (!s || !s.pages.length) return;
  const last = s.pages[s.pages.length - 1];
  if (!last || last.closed) return;
  const now = Date.now();
  last.seconds = Math.max(0, Math.round((now - last.enterTs) / 1000));
  s.lastActiveTs = now;
  cbsgSessionSet(s);
}

/* Closes the current page (marks as closed, finalizes its
   seconds). Called on pagehide/beforeunload. */
function cbsgSessionClosePage() {
  const s = cbsgSessionGet();
  if (!s || !s.pages.length) return;
  const last = s.pages[s.pages.length - 1];
  if (!last || last.closed) return;
  const now = Date.now();
  last.seconds = Math.max(0, Math.round((now - last.enterTs) / 1000));
  last.closed = true;
  s.lastActiveTs = now;
  cbsgSessionSet(s);
}

/* Formats seconds as "Nm Ss" or "Ss" */
function cbsgFmtSecs(sec) {
  sec = Math.max(0, Math.round(sec));
  if (sec < 60) return sec + 's';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? m + 'm ' + s + 's' : m + 'm';
}

/* Finalizes the session and emails a summary to Chris.
   Uses emailjs.send with the existing template. The message
   body is a formatted session report. Also clears the session
   from sessionStorage so a new one starts on next visit. */
function cbsgSessionFinalizeAndSend(session, reason) {
  try {
    const s = session || cbsgSessionGet();
    if (!s || !s.pages.length) { cbsgSessionClear(); return; }
    // Ensure last page is closed
    const last = s.pages[s.pages.length - 1];
    if (last && !last.closed) {
      last.seconds = Math.max(0, Math.round((Date.now() - last.enterTs) / 1000));
      last.closed = true;
    }
    const start = new Date(s.startTs);
    const end   = new Date(s.lastActiveTs || Date.now());
    const totalSecs = s.pages.reduce((a,p) => a + (p.seconds || 0), 0);
    const lines = [];
    lines.push('Visitor: ' + s.name);
    lines.push('Session start: ' + start.toLocaleString());
    lines.push('Session end:   ' + end.toLocaleString());
    lines.push('Total time:    ' + cbsgFmtSecs(totalSecs));
    lines.push('Pages visited: ' + s.pages.length);
    lines.push('End reason:    ' + (reason || 'unload'));
    lines.push('');
    lines.push('--- PAGES ---');
    s.pages.forEach((p,i) => {
      lines.push((i+1) + '. ' + p.page + '  (' + cbsgFmtSecs(p.seconds || 0) + ')  [' + p.path + ']');
    });
    const body = lines.join('\n');
    const params = {
      name: s.name,
      from_email: '(visitor session)',
      page_name: 'SESSION SUMMARY — ' + s.pages.length + ' pages, ' + cbsgFmtSecs(totalSecs),
      message: body
    };
    // Use sendBeacon-friendly approach: try emailjs normally, but we can't
    // truly guarantee delivery on unload. This is a best-effort send.
    if (typeof emailjs !== 'undefined') {
      try { emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params).catch(()=>{}); } catch(e) {}
    }
    // Also fire a GA event capturing the total session
    if (typeof gtag === 'function') {
      gtag('event', 'session_summary', {
        visitor_name: s.name,
        total_seconds: totalSecs,
        pages_count: s.pages.length,
        end_reason: reason || 'unload'
      });
    }
    cbsgSessionClear();
  } catch(e) {}
}

/* Heartbeat: every 30s while page is active, ticks the current
   page's timer. Also checks for idle timeout (if the user has
   been away for 15+ min, finalize the session). */
function cbsgStartHeartbeat() {
  if (window.cbsgHeartbeatStarted) return;
  window.cbsgHeartbeatStarted = true;
  setInterval(() => {
    if (document.hidden) return;
    const s = cbsgSessionGet();
    if (!s) return;
    const now = Date.now();
    // Idle check: if last activity was over timeout ago, finalize
    if ((now - (s.lastActiveTs || s.startTs)) > CBSG_IDLE_TIMEOUT_MS) {
      cbsgSessionFinalizeAndSend(s, 'idle_timeout');
      return;
    }
    cbsgSessionTickCurrentPage();
  }, 30000);

  // pagehide fires on tab close / navigation away — most reliable unload event
  window.addEventListener('pagehide', () => {
    cbsgSessionClosePage();
    const s = cbsgSessionGet();
    if (s) cbsgSessionFinalizeAndSend(s, 'pagehide');
  });

  // visibilitychange to 'hidden' — fires on mobile when user switches apps
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cbsgSessionTickCurrentPage();
    } else {
      // Came back — check if session went idle
      const s = cbsgSessionGet();
      if (s && (Date.now() - (s.lastActiveTs || s.startTs)) > CBSG_IDLE_TIMEOUT_MS) {
        cbsgSessionFinalizeAndSend(s, 'idle_timeout_on_return');
      }
    }
  });

  // Activity listeners to keep lastActiveTs fresh (detects real engagement)
  ['mousemove','keydown','click','scroll','touchstart'].forEach(ev => {
    window.addEventListener(ev, () => {
      const s = cbsgSessionGet();
      if (s) { s.lastActiveTs = Date.now(); cbsgSessionSet(s); }
    }, { passive: true });
  });
}

function getGuestPageKey() {
  const path = window.location.pathname.replace(/^\/CampbellBibleStudy\/?/, '').replace(/\.html$/, '') || 'index';
  return 'cbsg-guest-' + path;
}

function silentEmailGuest() {
  try {
    const notesEl = document.getElementById('cbsg-guest-textarea');
    const nameEl  = document.getElementById('cbsg-guest-name');
    if (!notesEl) return;
    const notes = notesEl.value.trim();
    if (notes.length < 5) return;
    const name     = (nameEl ? nameEl.value.trim() : '') || getGuestName() || 'Guest';
    const pageName = document.title.replace(' — Campbell Bible Study', '').trim() || window.location.pathname;
    const doSend = () => { try { emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, from_email: '(not provided)', page_name: pageName, message: notes }).catch(() => {}); } catch(e) {} };
    if (typeof emailjs !== 'undefined') { doSend(); }
    else { let a = 0; const r = setInterval(() => { a++; if (typeof emailjs !== 'undefined') { clearInterval(r); doSend(); } else if (a > 10) clearInterval(r); }, 500); }
  } catch(e) {}
}

function saveGuestNotes() {
  const notesEl = document.getElementById('cbsg-guest-textarea');
  const nameEl  = document.getElementById('cbsg-guest-name');
  if (!notesEl) return;
  localStorage.setItem(getGuestPageKey(), notesEl.value);
  if (nameEl && nameEl.value.trim()) localStorage.setItem('cbsg-guest-name', nameEl.value.trim());
  const btn = document.getElementById('cbsg-guest-save-btn');
  if (btn) { btn.textContent = '✓ Saved'; btn.style.background = '#2E6B0E'; btn.style.color = 'white'; setTimeout(() => { btn.textContent = 'Save My Notes'; btn.style.background = '#FFD700'; btn.style.color = '#1F3864'; }, 1800); }
  silentEmailGuest();
}

function injectGuestPanel() {
  if (isAdminUnlocked()) return;
  if (document.getElementById('cbsg-guest-panel')) return;
  const savedNotes = localStorage.getItem(getGuestPageKey()) || '';
  const savedName  = getGuestName();
  const panel = document.createElement('div');
  panel.id = 'cbsg-guest-panel';
  panel.style.cssText = 'position:fixed;bottom:0;right:0;width:310px;background:#1F3864;border-top:2px solid #FFD700;border-left:2px solid #FFD700;border-radius:8px 0 0 0;font-family:Arial,sans-serif;z-index:1000;box-shadow:-4px -4px 16px rgba(0,0,0,0.3);';
  const safeName  = savedName.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const safeNotes = savedNotes.replace(/</g,'&lt;').replace(/&/g,'&amp;');
  panel.innerHTML = `<div id="cbsg-guest-header" onclick="toggleGuestPanel()" style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;cursor:pointer;user-select:none;"><span style="font-size:12px;font-weight:bold;color:#FFD700;letter-spacing:0.04em;">📝 My Notes</span><span id="cbsg-guest-chevron" style="font-size:10px;color:rgba(255,255,255,0.5);">▲</span></div><div id="cbsg-guest-body" style="padding:0 12px 12px;"><input id="cbsg-guest-name" type="text" placeholder="Your name (optional)" value="${safeName}" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:5px 8px;font-size:11px;margin-bottom:6px;font-family:Arial,sans-serif;" oninput="localStorage.setItem('cbsg-guest-name',this.value)"><textarea id="cbsg-guest-textarea" placeholder="Add your thoughts, questions, or reflections on this page..." style="width:100%;box-sizing:border-box;height:110px;resize:vertical;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:7px 8px;font-size:12px;font-family:Arial,sans-serif;line-height:1.5;margin-bottom:8px;" oninput="localStorage.setItem('${getGuestPageKey()}',this.value)">${safeNotes}</textarea><button id="cbsg-guest-save-btn" style="width:100%;background:#FFD700;color:#1F3864;border:none;border-radius:4px;padding:7px;font-size:12px;font-weight:bold;cursor:pointer;font-family:Arial,sans-serif;">Save My Notes</button></div>`;
  document.body.appendChild(panel);
  document.getElementById('cbsg-guest-save-btn').addEventListener('click', saveGuestNotes);
}

let guestPanelOpen = true;
function toggleGuestPanel() {
  const body    = document.getElementById('cbsg-guest-body');
  const chevron = document.getElementById('cbsg-guest-chevron');
  guestPanelOpen = !guestPanelOpen;
  if (body)    body.style.display  = guestPanelOpen ? 'block' : 'none';
  if (chevron) chevron.textContent = guestPanelOpen ? '▲' : '▼';
}

function getCompleteKey() {
  const path = window.location.pathname.replace(/^\/CampbellBibleStudy\//, '').replace(/\.html$/, '');
  return COMPLETION_KEYS[path] || null;
}

function isCurrentPageComplete() {
  const key = getCompleteKey();
  return key ? localStorage.getItem('cbsg-' + key) === 'true' : false;
}

function toggleCompletion() {
  const key = getCompleteKey();
  if (!key) return;
  const nowComplete = localStorage.getItem('cbsg-' + key) !== 'true';
  localStorage.setItem('cbsg-' + key, nowComplete ? 'true' : 'false');
  const btn     = document.getElementById('complete-btn');
  const btnText = document.getElementById('complete-btn-text');
  if (btn && btnText) {
    btnText.textContent   = nowComplete ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
    btn.style.background  = nowComplete ? '#2E6B0E' : '#1F3864';
    btn.style.borderColor = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.3)';
    btn.style.color       = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.7)';
  }
  if (typeof buildSidebar === 'function') { const root = window.location.pathname.includes('/theme') ? '..' : '.'; buildSidebar(root); }
  setStatus(nowComplete ? '✅ Module marked complete!' : '↩️ Marked incomplete.', 'ok');
}

function injectCompleteButton() {
  const key = getCompleteKey();
  if (!key) return;
  const main = document.getElementById('main');
  if (!main) return;
  const isDone  = localStorage.getItem('cbsg-' + key) === 'true';
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'margin:32px 0 8px;text-align:center;';
  wrapper.innerHTML = `<div style="border-top:1px solid #ddd;padding-top:28px;margin-bottom:8px;"><p style="font-size:13px;color:#888;font-family:Arial,sans-serif;margin-bottom:14px;">Finished studying this module? Mark it complete to track your progress in the sidebar.</p><button id="complete-btn" onclick="toggleCompletion()" style="background:${isDone ? '#2E6B0E' : '#1F3864'};color:${isDone ? '#90EE90' : 'rgba(255,255,255,0.7)'};border:2px solid ${isDone ? '#90EE90' : 'rgba(255,255,255,0.3)'};border-radius:6px;padding:10px 28px;font-size:13px;font-family:Arial,sans-serif;font-weight:bold;cursor:pointer;transition:all 0.2s;"><span id="complete-btn-text">${isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete'}</span></button></div>`;
  const bottomNav = document.querySelector('#main > div[style*="justify-content:space-between"]');
  if (bottomNav) main.insertBefore(wrapper, bottomNav); else main.appendChild(wrapper);
}

function getPageKey() {
  const path = window.location.pathname.replace(/^\/CampbellBibleStudy\/?/, '').replace(/\.html$/, '');
  return 'timer-' + (path || 'index');
}

function getPageLabel() { return document.title.replace(' — Campbell Bible Study', '').trim() || 'This page'; }

let sessionStart = null, sessionSeconds = 0, timerInterval = null;

function getStoredSeconds() { return parseInt(localStorage.getItem('cbsg-' + getPageKey()) || '0', 10); }
function addStoredSeconds(s) { const prev = getStoredSeconds(); localStorage.setItem('cbsg-' + getPageKey(), String(prev + s)); }

function formatTime(t) {
  const h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function startTimer() {
  sessionStart = Date.now(); sessionSeconds = 0;
  timerInterval = setInterval(() => {
    sessionSeconds = Math.floor((Date.now() - sessionStart) / 1000);
    const total = getStoredSeconds() + sessionSeconds;
    const sEl = document.getElementById('bar-session-time');
    const tEl = document.getElementById('bar-total-time');
    if (sEl) sEl.textContent = formatTime(sessionSeconds);
    if (tEl) tEl.textContent = formatTime(total);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  if (sessionSeconds > 2) addStoredSeconds(sessionSeconds);
}

window.addEventListener('beforeunload', stopTimer);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopTimer(); }
  else { sessionStart = Date.now() - (sessionSeconds * 1000); if (!timerInterval) startTimer(); }
});

function injectBarExtras() {
  const bar = document.getElementById('github-bar');
  if (!bar || document.getElementById('bar-session-time')) return;
  const stored = getStoredSeconds();
  const extras = document.createElement('div');
  extras.id = 'bar-extras';
  extras.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:8px;';
  extras.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:72px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Session</span>
      <span id="bar-session-time" style="font-size:12px;color:#FFD700;font-family:Arial,sans-serif;font-weight:bold;">0s</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:72px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Total</span>
      <span id="bar-total-time" style="font-size:12px;color:rgba(255,255,255,0.8);font-family:Arial,sans-serif;font-weight:bold;">${formatTime(stored)}</span>
    </div>
    <button onclick="logAndStamp()" title="Stamp current notes + log session time" style="background:rgba(255,215,0,0.15);color:#FFD700;border:1px solid rgba(255,215,0,0.4);border-radius:4px;padding:4px 12px;font-size:11px;font-family:Arial,sans-serif;font-weight:bold;cursor:pointer;white-space:nowrap;">📅 Log &amp; Stamp</button>
  `;
  if (!document.getElementById('hamburger-btn')) {
    const hbtn = document.createElement('button');
    hbtn.id = 'hamburger-btn'; hbtn.innerHTML = '&#9776;'; hbtn.title = 'Open navigation menu';
    hbtn.addEventListener('click', openSidebar);
    bar.insertBefore(hbtn, bar.firstChild);
  }
  const barRight = bar.querySelector('.bar-right');
  if (barRight) bar.insertBefore(extras, barRight); else bar.appendChild(extras);
  if (!document.getElementById('btn-admin')) {
    const adminBtn = document.createElement('button');
    adminBtn.id = 'btn-admin'; adminBtn.textContent = '🔒 Admin'; adminBtn.onclick = toggleAdminMode;
    adminBtn.style.cssText = 'background:rgba(255,255,255,0.1);color:#FFD700;border:1px solid rgba(255,215,0,0.4);border-radius:4px;padding:5px 12px;font-size:11px;font-weight:bold;cursor:pointer;font-family:Arial,sans-serif;';
    if (barRight) bar.insertBefore(adminBtn, barRight); else bar.insertBefore(adminBtn, extras);
  }
  applyAdminUI();
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) { overlay.style.display = 'block'; requestAnimationFrame(() => overlay.classList.add('visible')); }
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) { overlay.classList.remove('visible'); setTimeout(() => { overlay.style.display = 'none'; }, 300); }
  document.body.style.overflow = '';
}

function injectMobileOverlay() {
  if (document.getElementById('sidebar-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay'; overlay.style.display = 'none';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
}

function logStudyTime() {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const total = getStoredSeconds() + sessionSeconds;
  const divider = '─'.repeat(40);
  const entry = `\n${divider}\n📚 ${date} at ${time}\nPage: ${getPageLabel()}\nThis session: ${formatTime(sessionSeconds)} | Page total: ${formatTime(total)}\n${divider}\n`;
  const jEl = document.getElementById('n-journal-new');
  if (jEl) { jEl.value += entry; localStorage.setItem('cbsg-n-journal-new', jEl.value); setStatus('📋 Logged to journal!', 'ok'); return; }
  const ids = window.PAGE_NOTE_IDS || [];
  if (ids.length > 0) { const el = document.getElementById(ids[0]); if (el) { el.value += entry; localStorage.setItem('cbsg-' + ids[0], el.value); setStatus('📋 Logged to notes!', 'ok'); return; } }
  setStatus('Session: ' + formatTime(sessionSeconds) + ' | Total: ' + formatTime(total), 'ok');
}

function insertTimestamp() {
  const now      = new Date();
  const date     = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time     = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const todayStr = now.toDateString();

  function buildStamp(editorId) {
    const lastKey = 'cbsg-laststamp-' + editorId;
    const sameDay = localStorage.getItem(lastKey) === todayStr;
    localStorage.setItem(lastKey, todayStr);
    return sameDay
      ? `\n${'·'.repeat(30)}\n${time}\n${'·'.repeat(30)}\n`
      : `\n${'─'.repeat(40)}\n${date} at ${time}\n${'─'.repeat(40)}\n`;
  }

  const active = document.activeElement;
  if (active && active.tagName === 'TEXTAREA' && active.id) {
    const stamp = buildStamp(active.id);
    active.value += stamp; active.scrollTop = active.scrollHeight; localStorage.setItem('cbsg-' + active.id, active.value); return;
  }
  const jEl = document.getElementById('n-journal-new');
  if (jEl) { const stamp = buildStamp('n-journal-new'); jEl.value += stamp; jEl.focus(); jEl.scrollTop = jEl.scrollHeight; localStorage.setItem('cbsg-n-journal-new', jEl.value); return; }
  const ids = window.PAGE_NOTE_IDS || [];
  if (ids.length > 0) { const el = document.getElementById(ids[0]); if (el) { const stamp = buildStamp(ids[0]); el.value += stamp; el.focus(); el.scrollTop = el.scrollHeight; localStorage.setItem('cbsg-' + ids[0], el.value); } }
}

function logAndStamp() {
  const now      = new Date();
  const date     = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time     = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const todayStr = now.toDateString();
  const total    = getStoredSeconds() + sessionSeconds;

  function buildStamp(editorId) {
    const lastKey = 'cbsg-laststamp-' + editorId;
    const sameDay = localStorage.getItem(lastKey) === todayStr;
    localStorage.setItem(lastKey, todayStr);
    return sameDay
      ? `\n${'·'.repeat(30)}\n${time}\n${'·'.repeat(30)}\n`
      : `\n${'─'.repeat(40)}\n${date} at ${time}\n${'─'.repeat(40)}\n`;
  }

  const logEntry = `\n${'─'.repeat(40)}\n📚 ${date} at ${time}\nPage: ${getPageLabel()}\nSession: ${formatTime(sessionSeconds)} | Total: ${formatTime(total)}\n${'─'.repeat(40)}\n`;

  // --- Quill-aware target resolution (fix 2026-04-18) -----------------
  // Priority:
  //   1. If focus is inside a Quill editor → stamp THAT editor
  //   2. Else if any Quill editors exist on this page → stamp the first
  //   3. Else if active element is a textarea → stamp it
  //   4. Else fall back to PAGE_NOTE_IDS[0] textarea
  // --------------------------------------------------------------------
  let stamped = false;
  const active = document.activeElement;

  // (1) focus inside a Quill editor?
  if (!stamped && active && quillInstances) {
    for (const [editorId, quill] of Object.entries(quillInstances)) {
      const editorEl = document.getElementById(editorId);
      if (editorEl && editorEl.contains(active)) {
        _insertQuillStamp(quill, editorId);
        stamped = true;
        break;
      }
    }
  }

  // (2) any Quill editors present on the page?
  if (!stamped && quillInstances && Object.keys(quillInstances).length > 0) {
    const [editorId, quill] = Object.entries(quillInstances)[0];
    _insertQuillStamp(quill, editorId);
    stamped = true;
  }

  // (3) active textarea?
  if (!stamped && active && active.tagName === 'TEXTAREA' && active.id) {
    const stamp = buildStamp(active.id);
    active.value += stamp;
    active.scrollTop = active.scrollHeight;
    localStorage.setItem('cbsg-' + active.id, active.value);
    stamped = true;
  }

  // (4) fallback to PAGE_NOTE_IDS[0]
  if (!stamped) {
    const ids = window.PAGE_NOTE_IDS || [];
    if (ids.length > 0) {
      const el = document.getElementById(ids[0]);
      if (el && el.tagName === 'TEXTAREA') {
        const stamp = buildStamp(ids[0]);
        el.value += stamp;
        el.scrollTop = el.scrollHeight;
        localStorage.setItem('cbsg-' + ids[0], el.value);
      }
    }
  }

  // Journal log entry (unchanged — only applies where n-journal-new textarea exists)
  const jEl = document.getElementById('n-journal-new');
  if (jEl) { jEl.value += logEntry; localStorage.setItem('cbsg-n-journal-new', jEl.value); }
  setStatus('📅 Stamped & logged!', 'ok');
}

async function putFile(token, filePath, content) {
  const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
  if (!getRes.ok) throw new Error(`Could not fetch ${filePath} (${getRes.status})`);
  const { sha } = await getRes.json();
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const putRes  = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`, { method: 'PUT', headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Update ${filePath} — ${new Date().toLocaleDateString()}`, content: encoded, sha }) });
  if (!putRes.ok) { const e = await putRes.json(); throw new Error(e.message || 'Save failed'); }
}

async function putFileNew(token, filePath, content) {
  let sha = null;
  try { const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }); if (r.ok) sha = (await r.json()).sha; } catch(e) {}
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const body = { message: `Update ${filePath} — ${new Date().toLocaleDateString()}`, content: encoded };
  if (sha) body.sha = sha;
  const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`, { method: 'PUT', headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!putRes.ok) { const e = await putRes.json(); throw new Error(e.message || 'Notes save failed'); }
}

async function saveToGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) { setStatus('⚠️ Paste your GitHub token first.', 'warn'); return; }
  localStorage.setItem('cbsg-gh-token', token);
  saveAllNotes();
  const rawPath  = window.location.pathname.replace(/^\/CampbellBibleStudy\//, '');
  const filePath = rawPath || 'index.html';
  setStatus('📡 Saving...', 'info');
  const sensitiveIds = ['gh-token', 'gemini-key'];
  const savedValues  = {};
  sensitiveIds.forEach(id => { const el = document.getElementById(id); if (el) { savedValues[id] = el.value; el.value = ''; } });
  document.querySelectorAll('input[type="password"]').forEach(el => { if (el.id && !savedValues[el.id]) { savedValues[el.id] = el.value; el.value = ''; } });
  const elementsToStrip = ['bar-extras','cbsg-admin-modal','cbsg-welcome-modal','cbsg-guest-panel','complete-wrapper'];
  const stripped = [];
  elementsToStrip.forEach(id => { const el = document.getElementById(id); if (el) { stripped.push({ parent: el.parentNode, el, next: el.nextSibling }); el.remove(); } });
  const aiOut = document.getElementById('ai-response-text'); const aiOutBackup = aiOut ? aiOut.innerHTML : ''; if (aiOut) aiOut.innerHTML = '';
  const aiBox = document.getElementById('ai-response'); const aiBoxHadVisible = aiBox ? aiBox.classList.contains('visible') : false; if (aiBox) aiBox.classList.remove('visible');
  const adminBtn = document.getElementById('btn-admin'); if (adminBtn) { stripped.push({ parent: adminBtn.parentNode, el: adminBtn, next: adminBtn.nextSibling }); adminBtn.remove(); }
  const hbtn = document.getElementById('hamburger-btn'); if (hbtn) { stripped.push({ parent: hbtn.parentNode, el: hbtn, next: hbtn.nextSibling }); hbtn.remove(); }
  const tsBtn = document.getElementById('btn-timestamp'); if (tsBtn) { stripped.push({ parent: tsBtn.parentNode, el: tsBtn, next: tsBtn.nextSibling }); tsBtn.remove(); }
  const sidebar = document.getElementById('sidebar'); const sidebarBackup = sidebar ? sidebar.innerHTML : ''; if (sidebar) sidebar.innerHTML = '';
  const ghStatus = document.getElementById('gh-status'); const statusBackup = ghStatus ? ghStatus.innerHTML : ''; if (ghStatus) { ghStatus.innerHTML = ''; ghStatus.removeAttribute('style'); }
  const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  Object.entries(savedValues).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
  if (sidebar) sidebar.innerHTML = sidebarBackup;
  if (ghStatus) ghStatus.innerHTML = statusBackup;
  if (aiOut) aiOut.innerHTML = aiOutBackup;
  if (aiBox && aiBoxHadVisible) aiBox.classList.add('visible');
  stripped.reverse().forEach(({ parent, el, next }) => { if (parent) parent.insertBefore(el, next); });
  try { await putFile(token, filePath, html); await saveNotesJson(token); setStatus('✅ Saved! Live in ~30 seconds.', 'ok'); updateVersionTimestamp(); }
  catch(e) { setStatus('❌ ' + e.message, 'error'); }
}

async function loadFromGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) { setStatus('⚠️ Paste your GitHub token first.', 'warn'); return; }
  localStorage.setItem('cbsg-gh-token', token);
  setStatus('📡 Loading your notes...', 'info');
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/my-notes.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) { setStatus(res.status === 404 ? '⚠️ No saved notes found yet.' : `❌ Could not load (${res.status})`, 'warn'); return; }
    const data = await res.json(); const notes = data.notes || {};
    if (Object.keys(notes).length === 0) { setStatus('⚠️ Notes file is empty.', 'warn'); return; }
    let loaded = 0;
    for (const [key, value] of Object.entries(notes)) { if (value && value.trim()) { localStorage.setItem('cbsg-' + key, value); loaded++; } }
    loadNotes();
    const root = window.location.pathname.includes('/theme') ? '..' : '.';
    if (typeof buildSidebar === 'function') buildSidebar(root);
    refreshCompleteButton();
    setStatus(`✅ Loaded ${loaded} notes from GitHub.`, 'ok');
  } catch(e) { setStatus('❌ ' + e.message, 'error'); }
}

function refreshCompleteButton() {
  const key = getCompleteKey(); const btn = document.getElementById('complete-btn'); const btnText = document.getElementById('complete-btn-text');
  if (!key || !btn || !btnText) return;
  const isDone = localStorage.getItem('cbsg-' + key) === 'true';
  btnText.textContent   = isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
  btn.style.background  = isDone ? '#2E6B0E' : '#1F3864';
  btn.style.borderColor = isDone ? '#90EE90' : 'rgba(255,255,255,0.3)';
  btn.style.color       = isDone ? '#90EE90' : 'rgba(255,255,255,0.7)';
}

async function saveNotesJson(token) {
  const notes = {}; const excluded = new Set(['cbsg-gh-token', 'cbsg-gemini-key']);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cbsg-')) continue;
    if (excluded.has(key) || key.startsWith('cbsg-nav-') || key.startsWith('cbsg-timer-') || key.startsWith('cbsg-guest-')) continue;
    const value = localStorage.getItem(key);
    if (value && value.trim()) notes[key.replace('cbsg-', '')] = value;
  }
  let previousNotes = {}, existingHistory = [], existingOriginDate = 'March 27, 2026';
  try { const r = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/my-notes.json?t=${Date.now()}`, { cache: 'no-store' }); if (r.ok) { const d = await r.json(); previousNotes = d.notes || {}; existingHistory = d.saveHistory || []; existingOriginDate = d.originDate || existingOriginDate; } } catch(e) {}
  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) + ' at ' + now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });

  // Build a meaningful summary of what changed
  const PAGE_KEY_LABELS = {
    'n-intro':'Introduction', 'n-m1':'T1 Module 1', 'n-m2':'T1 Module 2', 'n-m3':'T1 Module 3',
    'n-m4':'T1 Module 4', 'n-m5':'T1 Module 5', 'n-m6':'T1 Module 6', 'n-m7':'T1 Module 7',
    'n-m8':'T1 Module 8', 'n-m9':'T1 Module 9', 'n-m10':'T1 Module 10', 'n-m11':'T1 Module 11',
    'n-m12':'T1 Module 12', 'n-m13':'T1 Module 13', 'n-m14':'T1 Module 14', 'n-m15':'T1 Module 15',
    'n-t2m1':'T2 Module 1', 'n-t2m2':'T2 Module 2', 'n-t2m3':'T2 Module 3',
    'n-journal-new':'Journal', 'n-sermons':'Sermons', 'n-dd-willow':'Deep Dive: Willow',
    'n-dd-shabua':'Deep Dive: Shabua', 'n-dd-calendars':'Deep Dive: Calendars',
  };
  const PAGE_GROUPS = {
    'n-m':'Theme 1 Modules', 'n-t2':'Theme 2 Modules', 'q-m':'Reflection Questions',
    'c-':'Convictions', 'n-dd-':'Deep Dives',
  };
  const changedKeys = Object.keys(notes).filter(k => (notes[k] || '').trim() !== (previousNotes[k] || '').trim());
  const newKeys     = Object.keys(notes).filter(k => !previousNotes[k] && (notes[k] || '').trim());
  let summary, pagesChanged = [];
  if (changedKeys.length === 0 && newKeys.length === 0) {
    summary = 'No note changes — page HTML saved.';
  } else {
    const allChanged = [...new Set([...changedKeys, ...newKeys])];
    // Map to readable labels
    const labels = allChanged.map(k => PAGE_KEY_LABELS[k] || k);
    // Derive page group tags
    const groupSet = new Set();
    allChanged.forEach(k => {
      for (const [prefix, group] of Object.entries(PAGE_GROUPS)) { if (k.startsWith(prefix)) { groupSet.add(group); break; } }
      if (k === 'n-journal-new') groupSet.add('Journal');
      if (k === 'n-sermons')     groupSet.add('Sermon Log');
    });
    pagesChanged = [...groupSet];
    if (allChanged.length <= 3) {
      summary = `Updated: ${labels.join(', ')}.`;
    } else {
      summary = `Updated ${allChanged.length} note fields including ${labels.slice(0,3).join(', ')}, and more.`;
    }
  }

  const updatedHistory = [...existingHistory, { timestamp, summary, pagesChanged, isoTime: now.toISOString() }].slice(-500);
  const payload = { lastUpdated: now.toISOString(), originDate: existingOriginDate, saveHistory: updatedHistory, notes };
  await putFileNew(token, 'my-notes.json', JSON.stringify(payload, null, 2));
}

function setStatus(msg, type) {
  const el = document.getElementById('gh-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'ok' ? '#90EE90' : type === 'error' ? '#FF8888' : type === 'warn' ? '#FFD700' : 'rgba(255,255,255,0.7)';
}

function updateVersionTimestamp() {
  const now  = new Date();
  const date = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
  const vEl  = document.getElementById('gh-bar-version');
  if (vEl) vEl.innerHTML = '<span style="font-size:11px;">Version: ' + date + '</span><br><span style="font-size:9px;color:rgba(255,255,255,0.35);">Loaded ' + time + '</span>';
  const sEl  = document.getElementById('sidebar-version');
  if (sEl) sEl.textContent = 'Version: ' + date;
}

function saveAllNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => { const el = document.getElementById(id); if (el) localStorage.setItem('cbsg-' + id, el.value); });
  saveAllQuillNotes();
}

function loadNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => { const el = document.getElementById(id); const val = localStorage.getItem('cbsg-' + id); if (el && val) el.value = val; });
  loadAllQuillNotes();
}

function wireAutoSave() {
  (window.PAGE_NOTE_IDS || []).forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', () => localStorage.setItem('cbsg-' + id, el.value)); });
  document.querySelectorAll('textarea.notes-textarea').forEach(el => {
    if (el.id && !el.id.startsWith('ai-')) {
      el.addEventListener('input', () => localStorage.setItem('cbsg-' + el.id, el.value));
      const saved = localStorage.getItem('cbsg-' + el.id);
      if (saved) el.value = saved;
    }
  });
  const savedToken = localStorage.getItem('cbsg-gh-token');
  if (savedToken) { const t = document.getElementById('gh-token'); if (t) t.value = savedToken; }
}

function markActivePage() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const tail = href.split('/').pop();
    if (tail && currentPath.endsWith(tail)) item.classList.add('active');
  });
}


// ── QUILL EDITOR INITIALIZATION ──────────────────────────────────────────────
// Locked contract: CBSG_TOOLBAR — do not remove or reorder buttons
const CBSG_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'link', 'clean']
];

const quillInstances = {};

function _insertQuillStamp(quill, editorId) {
  const now     = new Date();
  const date    = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const lastKey = 'cbsg-laststamp-' + editorId;
  const lastDateStr = localStorage.getItem(lastKey);
  const todayStr    = now.toDateString();
  let   stamp;
  if (lastDateStr === todayStr) {
    // Same day — just insert time
    stamp = '\n' + '─'.repeat(40) + '\n' + time + '\n';
  } else {
    // New day — insert full date + time
    stamp = '\n' + '─'.repeat(40) + '\n' + date + ' at ' + time + '\n' + '─'.repeat(40) + '\n';
    localStorage.setItem(lastKey, todayStr);
  }
  const range = quill.getSelection(true);
  const pos   = range ? range.index : quill.getLength();
  quill.insertText(pos, stamp, 'user');
  quill.setSelection(pos + stamp.length);
}

function _saveQuillContent(editorId, quill) {
  const delta = JSON.stringify(quill.getContents());
  localStorage.setItem('cbsg-' + editorId, delta);
}

/* ---- VISITOR NOTES EMAIL ON SAVE ---------------------------
   When a visitor (non-admin) types in a Quill editor, after a
   30-second pause in typing, silently email the notes to Chris.
   Only one email per editor per session to avoid spam.
   ------------------------------------------------------------ */
const _quillEmailTimers = {};    // editorId → debounce timeout handle
const _quillEmailedThisSession = {}; // editorId → true once emailed

function _maybeEmailVisitorNotes(editorId, quill) {
  if (isAdminUnlocked()) return;               // Admin (you) — no self-email
  const name = getGuestName();
  if (!name) return;                            // No name yet — skip
  // Get plain text content
  let text = '';
  try { text = quill.getText().trim(); } catch(e) { return; }
  if (text.length < 10) return;                 // Too short to bother
  // Clear any existing timer for this editor
  if (_quillEmailTimers[editorId]) {
    clearTimeout(_quillEmailTimers[editorId]);
  }
  // Debounce — wait 30 seconds of inactivity, then email
  _quillEmailTimers[editorId] = setTimeout(() => {
    try {
      const pageName = document.title.replace(' — Campbell Bible Study', '').trim() || window.location.pathname;
      const params = {
        name: name,
        from_email: '(visitor notes)',
        page_name: pageName + ' — ' + editorId,
        message: text
      };
      if (typeof emailjs !== 'undefined') {
        try { emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params).catch(()=>{}); } catch(e) {}
      }
      _quillEmailedThisSession[editorId] = true;
    } catch(e) {}
  }, 30000); // 30 seconds
}

function _loadQuillContent(editorId, quill) {
  const saved = localStorage.getItem('cbsg-' + editorId);
  if (!saved) return;
  try {
    const delta = JSON.parse(saved);
    quill.setContents(delta, 'silent');
  } catch(e) {
    // Legacy plain text fallback
    try { quill.setText(saved, 'silent'); } catch(e2) {}
  }
}

function initQuillEditors() {
  if (typeof Quill === 'undefined') return;

  document.querySelectorAll('.quill-editor').forEach(el => {
    if (el._quillInitialized) return;
    el._quillInitialized = true;

    const editorId   = el.id;
    const placeholder = el.getAttribute('data-placeholder') || 'Write your notes here...';
    const minHeight   = el.style.minHeight || '180px';

    // Wrap in container for toolbar
    const wrapper = document.createElement('div');
    wrapper.className = 'quill-wrapper';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    const quill = new Quill(el, {
      theme: 'snow',
      placeholder: placeholder,
      modules: {
        toolbar: { container: CBSG_TOOLBAR }
      }
    });

    // Style the editor area
    el.querySelector('.ql-editor').style.minHeight = minHeight;

    // Inject 🕐 timestamp button into toolbar
    const toolbarEl = wrapper.querySelector('.ql-toolbar');
    if (toolbarEl) {
      const stampBtn = document.createElement('button');
      stampBtn.className = 'ql-stamp';
      stampBtn.title = 'Insert timestamp';
      stampBtn.innerHTML = '🕐';
      stampBtn.style.cssText = 'width:auto;padding:3px 7px;font-size:13px;cursor:pointer;border:none;background:none;';
      stampBtn.addEventListener('click', e => { e.preventDefault(); _insertQuillStamp(quill, editorId); });
      toolbarEl.appendChild(stampBtn);
    }

    // Load saved content
    _loadQuillContent(editorId, quill);

    // Auto-save on change (and email visitor notes after 30s of inactivity)
    quill.on('text-change', () => {
      _saveQuillContent(editorId, quill);
      _maybeEmailVisitorNotes(editorId, quill);
    });

    quillInstances[editorId] = quill;
  });
}

function saveAllQuillNotes() {
  Object.entries(quillInstances).forEach(([id, quill]) => {
    _saveQuillContent(id, quill);
  });
}

function loadAllQuillNotes() {
  Object.entries(quillInstances).forEach(([id, quill]) => {
    _loadQuillContent(id, quill);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  wireAutoSave();
  initQuillEditors();    // init all .quill-editor divs
  injectMobileOverlay();
  markActivePage();
  injectBarExtras();
  injectCompleteButton();
  startTimer();
  updateVersionTimestamp();
  document.querySelectorAll('.bar-originated').forEach(el => { el.textContent = 'Originated: March 27, 2026'; });
  // Initialize Google Analytics silently on every page load (fires before modal)
  cbsgInitGA();
  // Start the session heartbeat (tracks dwell time, handles unload/idle, sends summary email)
  cbsgStartHeartbeat();
  setTimeout(() => { if (!isAdminUnlocked()) checkFirstVisit(); }, 400);
  if (typeof emailjs === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {} };
    document.head.appendChild(s);
  } else { try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {} }
});
