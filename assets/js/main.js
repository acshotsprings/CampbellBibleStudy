/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v5.0
   Admin persistence · Guest notes · Silent EmailJS
   ============================================================ */

const OWNER = 'acshotsprings';
const REPO  = 'CampbellBibleStudy';

// ── EMAILJS CONFIG ────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = '2duGE838Bx6BcJXTF';
const EMAILJS_SERVICE_ID  = 'service_6mi6r6r';
const EMAILJS_TEMPLATE_ID = 'template_275v5hl';

// ── ADMIN PASSWORD ────────────────────────────────────────
const ADMIN_PASSWORD = 'Campbell2026';

// ── COMPLETION KEY MAP ────────────────────────────────────
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
};

// ── ADMIN STATE ───────────────────────────────────────────
// sessionStorage persists across page navigations within the same
// browser tab/session, but clears when the browser is closed.

function isAdminUnlocked() {
  return sessionStorage.getItem('cbsg-admin') === 'true';
}

function applyAdminUI() {
  const unlocked   = isAdminUnlocked();
  const btnAdmin   = document.getElementById('btn-admin');
  const btnSave    = document.getElementById('btn-save');
  const btnLoad    = document.getElementById('btn-load');
  const btnStamp   = document.getElementById('btn-timestamp');
  const tokenInput = document.getElementById('gh-token');

  if (btnAdmin)   btnAdmin.textContent      = unlocked ? '🔓 Admin ON' : '🔒 Admin';
  if (btnSave)    btnSave.style.display     = unlocked ? 'inline-block' : 'none';
  if (btnLoad)    btnLoad.style.display     = unlocked ? 'inline-block' : 'none';
  if (btnStamp)   btnStamp.style.display    = unlocked ? 'inline-block' : 'none';
  if (tokenInput) tokenInput.style.display  = unlocked ? 'inline-block' : 'none';

  if (unlocked) {
    document.body.classList.add('admin-mode');
    document.body.classList.remove('readonly');
    const saved = localStorage.getItem('cbsg-gh-token');
    if (saved && tokenInput) tokenInput.value = saved;
    // Hide guest panel if admin unlocks mid-session
    const gp = document.getElementById('cbsg-guest-panel');
    if (gp) gp.style.display = 'none';
  } else {
    document.body.classList.remove('admin-mode');
    document.body.classList.add('readonly');
    if (tokenInput) tokenInput.value = '';
  }
}

function toggleAdminMode() {
  if (isAdminUnlocked()) {
    sessionStorage.removeItem('cbsg-admin');
    applyAdminUI();
  } else {
    openAdminModal();
  }
}

// ── ADMIN MODAL ───────────────────────────────────────────
function openAdminModal() {
  injectAdminModal();
  const modal = document.getElementById('cbsg-admin-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      const inp = document.getElementById('cbsg-admin-pw');
      if (inp) inp.focus();
    }, 80);
  }
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
  if (inp.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('cbsg-admin', 'true');
    closeAdminModal();
    applyAdminUI();
  } else {
    if (err) err.style.display = 'block';
    inp.value = '';
    inp.focus();
  }
}

function injectAdminModal() {
  if (document.getElementById('cbsg-admin-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'cbsg-admin-modal';
  modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;' +
    'background:rgba(0,0,0,0.55);z-index:9999;align-items:center;justify-content:center;' +
    'font-family:Arial,sans-serif;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:10px;padding:28px 32px;width:300px;
                box-shadow:0 8px 32px rgba(0,0,0,0.3);">
      <h3 style="margin:0 0 6px;font-size:16px;color:#1F3864;">🔒 Admin Access</h3>
      <p style="margin:0 0 16px;font-size:12px;color:#888;">
        Enter your password to enable editing and GitHub sync.
      </p>
      <input id="cbsg-admin-pw" type="password" placeholder="Password..."
        onkeydown="if(event.key==='Enter')checkAdminPw()"
        style="width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;
               padding:9px 12px;font-size:14px;margin-bottom:10px;">
      <div id="cbsg-admin-err"
        style="display:none;font-size:12px;color:#cc0000;margin-bottom:10px;">
        Incorrect password. Try again.
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button onclick="closeAdminModal()"
          style="background:#f0f0f0;color:#444;border:none;border-radius:4px;
                 padding:8px 16px;font-size:13px;cursor:pointer;">Cancel</button>
        <button onclick="checkAdminPw()"
          style="background:#1F3864;color:#FFD700;border:none;border-radius:4px;
                 padding:8px 18px;font-size:13px;font-weight:bold;cursor:pointer;">Unlock</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) closeAdminModal(); });
}

// ── GUEST WELCOME MODAL ───────────────────────────────────
// Shown once on first visit. Name stored in localStorage permanently
// so every return visit on that device is already identified.

function getGuestName() {
  return localStorage.getItem('cbsg-guest-name') || '';
}

function showWelcomeModal() {
  if (document.getElementById('cbsg-welcome-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'cbsg-welcome-modal';
  modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;right:0;bottom:0;' +
    'background:rgba(0,0,0,0.65);z-index:9998;align-items:center;justify-content:center;' +
    'font-family:Arial,sans-serif;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:32px 36px;width:340px;
                box-shadow:0 12px 40px rgba(0,0,0,0.35);text-align:center;">
      <div style="font-size:36px;margin-bottom:10px;">✝️</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#1F3864;">Welcome!</h2>
      <p style="margin:0 0 6px;font-size:13px;color:#555;line-height:1.6;">
        This is the Campbell Family Biblical Study Guide — a personal resource for growing in the knowledge of Christ.
      </p>
      <p style="margin:0 0 20px;font-size:13px;color:#555;line-height:1.6;">
        What's your name? We'd love to know who's studying with us.
      </p>
      <input id="cbsg-welcome-name" type="text" placeholder="Your name..."
        onkeydown="if(event.key==='Enter')saveWelcomeName()"
        style="width:100%;box-sizing:border-box;border:2px solid #1F3864;border-radius:6px;
               padding:10px 14px;font-size:15px;margin-bottom:16px;text-align:center;
               font-family:Arial,sans-serif;">
      <button onclick="saveWelcomeName()"
        style="width:100%;background:#1F3864;color:#FFD700;border:none;border-radius:6px;
               padding:11px;font-size:14px;font-weight:bold;cursor:pointer;
               font-family:Arial,sans-serif;letter-spacing:0.03em;">
        Let's Study ✝
      </button>
      <p style="margin:12px 0 0;font-size:11px;color:#aaa;">
        You can leave this blank — just press the button.
      </p>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => {
    const inp = document.getElementById('cbsg-welcome-name');
    if (inp) inp.focus();
  }, 150);
}

function saveWelcomeName() {
  const inp  = document.getElementById('cbsg-welcome-name');
  const name = inp ? inp.value.trim() : '';
  // Store name permanently on this device
  localStorage.setItem('cbsg-guest-name', name || 'Guest');
  localStorage.setItem('cbsg-guest-welcomed', 'true');
  const modal = document.getElementById('cbsg-welcome-modal');
  if (modal) modal.remove();
  // Now inject the guest panel with the name pre-filled
  injectGuestPanel();
}

function checkFirstVisit() {
  if (isAdminUnlocked()) return;
  const welcomed = localStorage.getItem('cbsg-guest-welcomed');
  if (!welcomed) {
    showWelcomeModal();
  } else {
    injectGuestPanel();
  }
}

// ── GUEST NOTES ───────────────────────────────────────────
// Saves to guest's localStorage. On save, silently emails Chris.
// Guest sees nothing about the email — it just saves for them.

function getGuestPageKey() {
  const path = window.location.pathname
    .replace(/^\/CampbellBibleStudy\/?/, '')
    .replace(/\.html$/, '') || 'index';
  return 'cbsg-guest-' + path;
}

function silentEmailGuest() {
  try {
    if (typeof emailjs === 'undefined') return;
    const notesEl = document.getElementById('cbsg-guest-textarea');
    const nameEl  = document.getElementById('cbsg-guest-name');
    if (!notesEl) return;
    const notes = notesEl.value.trim();
    if (notes.length < 5) return;
    const name     = (nameEl ? nameEl.value.trim() : '') || 'Guest';
    const pageName = document.title.replace(' — Campbell Bible Study', '').trim()
                   || window.location.pathname;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name:       name,
      from_email: '(not provided)',
      page_name:  pageName,
      message:    notes,
    }).catch(() => {});
  } catch(e) {}
}

function saveGuestNotes() {
  const notesEl = document.getElementById('cbsg-guest-textarea');
  const nameEl  = document.getElementById('cbsg-guest-name');
  if (!notesEl) return;

  // Save locally
  localStorage.setItem(getGuestPageKey(), notesEl.value);
  if (nameEl && nameEl.value.trim()) {
    localStorage.setItem('cbsg-guest-name', nameEl.value.trim());
  }

  // Brief button feedback
  const btn = document.getElementById('cbsg-guest-save-btn');
  if (btn) {
    btn.textContent = '✓ Saved';
    btn.style.background = '#2E6B0E';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.textContent = 'Save My Notes';
      btn.style.background = '#FFD700';
      btn.style.color = '#1F3864';
    }, 1800);
  }

  // Silently notify Chris in the background
  silentEmailGuest();
}

function injectGuestPanel() {
  if (isAdminUnlocked()) return;
  if (document.getElementById('cbsg-guest-panel')) return;

  const savedNotes = localStorage.getItem(getGuestPageKey()) || '';
  const savedName  = getGuestName(); // always reads stored name — pre-fills on every page

  const panel = document.createElement('div');
  panel.id = 'cbsg-guest-panel';
  panel.style.cssText = 'position:fixed;bottom:0;right:0;width:310px;' +
    'background:#1F3864;border-top:2px solid #FFD700;border-left:2px solid #FFD700;' +
    'border-radius:8px 0 0 0;font-family:Arial,sans-serif;z-index:1000;' +
    'box-shadow:-4px -4px 16px rgba(0,0,0,0.3);';

  // Safely encode stored values for HTML attribute
  const safeName  = savedName.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const safeNotes = savedNotes.replace(/</g,'&lt;').replace(/&/g,'&amp;');

  panel.innerHTML = `
    <div id="cbsg-guest-header" onclick="toggleGuestPanel()"
      style="display:flex;align-items:center;justify-content:space-between;
             padding:8px 14px;cursor:pointer;user-select:none;">
      <span style="font-size:12px;font-weight:bold;color:#FFD700;letter-spacing:0.04em;">
        📝 My Notes
      </span>
      <span id="cbsg-guest-chevron" style="font-size:10px;color:rgba(255,255,255,0.5);">▲</span>
    </div>
    <div id="cbsg-guest-body" style="padding:0 12px 12px;">
      <input id="cbsg-guest-name" type="text" placeholder="Your name (optional)"
        value="${safeName}"
        style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.1);color:white;
               border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:5px 8px;
               font-size:11px;margin-bottom:6px;font-family:Arial,sans-serif;"
        oninput="localStorage.setItem('cbsg-guest-name',this.value)">
      <textarea id="cbsg-guest-textarea"
        placeholder="Add your thoughts, questions, or reflections on this page..."
        style="width:100%;box-sizing:border-box;height:110px;resize:vertical;
               background:rgba(255,255,255,0.08);color:white;
               border:1px solid rgba(255,255,255,0.2);border-radius:4px;
               padding:7px 8px;font-size:12px;font-family:Arial,sans-serif;
               line-height:1.5;margin-bottom:8px;"
        oninput="localStorage.setItem('${getGuestPageKey()}',this.value)"
      >${safeNotes}</textarea>
      <button id="cbsg-guest-save-btn" onclick="saveGuestNotes()"
        style="width:100%;background:#FFD700;color:#1F3864;border:none;border-radius:4px;
               padding:7px;font-size:12px;font-weight:bold;cursor:pointer;
               font-family:Arial,sans-serif;">
        Save My Notes
      </button>
    </div>`;

  document.body.appendChild(panel);
}

let guestPanelOpen = true;
function toggleGuestPanel() {
  const body    = document.getElementById('cbsg-guest-body');
  const chevron = document.getElementById('cbsg-guest-chevron');
  guestPanelOpen = !guestPanelOpen;
  if (body)    body.style.display      = guestPanelOpen ? 'block' : 'none';
  if (chevron) chevron.textContent     = guestPanelOpen ? '▲' : '▼';
}

// ── COMPLETION ────────────────────────────────────────────
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
  const wasComplete = localStorage.getItem('cbsg-' + key) === 'true';
  const nowComplete = !wasComplete;
  localStorage.setItem('cbsg-' + key, nowComplete ? 'true' : 'false');

  const btn     = document.getElementById('complete-btn');
  const btnText = document.getElementById('complete-btn-text');
  if (btn && btnText) {
    btnText.textContent    = nowComplete ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
    btn.style.background   = nowComplete ? '#2E6B0E' : 'transparent';
    btn.style.borderColor  = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.3)';
    btn.style.color        = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.7)';
  }

  if (typeof buildSidebar === 'function') {
    const root = window.location.pathname.includes('/theme') ? '..' : '.';
    buildSidebar(root);
  }

  setStatus(nowComplete ? '✅ Module marked complete!' : '↩️ Marked incomplete.', 'ok');
}

function injectCompleteButton() {
  const key = getCompleteKey();
  if (!key) return;

  const bottomNav = document.querySelector('#main > div[style*="justify-content:space-between"]');
  const main      = document.getElementById('main');
  if (!main) return;

  const isDone  = localStorage.getItem('cbsg-' + key) === 'true';
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'margin:32px 0 8px;text-align:center;';
  wrapper.innerHTML = `
    <div style="border-top:1px solid #ddd;padding-top:28px;margin-bottom:8px;">
      <p style="font-size:13px;color:#888;font-family:Arial,sans-serif;margin-bottom:14px;">
        Finished studying this module? Mark it complete to track your progress in the sidebar.
      </p>
      <button id="complete-btn" onclick="toggleCompletion()" style="
        background:${isDone ? '#2E6B0E' : '#1F3864'};
        color:${isDone ? '#90EE90' : 'rgba(255,255,255,0.7)'};
        border:2px solid ${isDone ? '#90EE90' : 'rgba(255,255,255,0.3)'};
        border-radius:6px;padding:10px 28px;font-size:13px;
        font-family:Arial,sans-serif;font-weight:bold;cursor:pointer;transition:all 0.2s;">
        <span id="complete-btn-text">${isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete'}</span>
      </button>
    </div>`;

  if (bottomNav) main.insertBefore(wrapper, bottomNav);
  else           main.appendChild(wrapper);
}

// ── PAGE IDENTITY ─────────────────────────────────────────
function getPageKey() {
  const path = window.location.pathname
    .replace(/^\/CampbellBibleStudy\/?/, '')
    .replace(/\.html$/, '');
  return 'timer-' + (path || 'index');
}

function getPageLabel() {
  return document.title.replace(' — Campbell Bible Study', '').trim() || 'This page';
}

// ── STUDY TIMER ───────────────────────────────────────────
let sessionStart   = null;
let sessionSeconds = 0;
let timerInterval  = null;

function getStoredSeconds() {
  return parseInt(localStorage.getItem('cbsg-' + getPageKey()) || '0', 10);
}

function addStoredSeconds(s) {
  const prev = getStoredSeconds();
  localStorage.setItem('cbsg-' + getPageKey(), String(prev + s));
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function startTimer() {
  sessionStart   = Date.now();
  sessionSeconds = 0;
  timerInterval  = setInterval(() => {
    sessionSeconds  = Math.floor((Date.now() - sessionStart) / 1000);
    const total     = getStoredSeconds() + sessionSeconds;
    const sessionEl = document.getElementById('bar-session-time');
    const totalEl   = document.getElementById('bar-total-time');
    if (sessionEl) sessionEl.textContent = formatTime(sessionSeconds);
    if (totalEl)   totalEl.textContent   = formatTime(total);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  if (sessionSeconds > 2) addStoredSeconds(sessionSeconds);
}

window.addEventListener('beforeunload', stopTimer);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopTimer();
  } else {
    sessionStart = Date.now() - (sessionSeconds * 1000);
    if (!timerInterval) startTimer();
  }
});

// ── UNIFORM BAR INJECTION ─────────────────────────────────
function injectBarExtras() {
  const bar = document.getElementById('github-bar');
  if (!bar || document.getElementById('bar-session-time')) return;

  const stored = getStoredSeconds();
  const extras = document.createElement('div');
  extras.id    = 'bar-extras';
  extras.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:8px;';
  extras.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;
                background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);
                border-radius:4px;padding:3px 10px;min-width:72px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;
                   letter-spacing:0.07em;font-family:Arial,sans-serif;">Session</span>
      <span id="bar-session-time" style="font-size:12px;color:#FFD700;
             font-family:Arial,sans-serif;font-weight:bold;">0s</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;
                background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);
                border-radius:4px;padding:3px 10px;min-width:72px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;
                   letter-spacing:0.07em;font-family:Arial,sans-serif;">Total</span>
      <span id="bar-total-time" style="font-size:12px;color:rgba(255,255,255,0.8);
             font-family:Arial,sans-serif;font-weight:bold;">${formatTime(stored)}</span>
    </div>
    <button onclick="logAndStamp()" title="Stamp current notes + log session time"
      style="background:rgba(255,215,0,0.15);color:#FFD700;
             border:1px solid rgba(255,215,0,0.4);border-radius:4px;padding:4px 12px;
             font-size:11px;font-family:Arial,sans-serif;font-weight:bold;
             cursor:pointer;white-space:nowrap;">📅 Log &amp; Stamp</button>
  `;

  // Hamburger for mobile
  if (!document.getElementById('hamburger-btn')) {
    const hbtn = document.createElement('button');
    hbtn.id = 'hamburger-btn';
    hbtn.innerHTML = '&#9776;';
    hbtn.title = 'Open navigation menu';
    hbtn.addEventListener('click', openSidebar);
    bar.insertBefore(hbtn, bar.firstChild);
  }

  const barRight = bar.querySelector('.bar-right');
  if (barRight) bar.insertBefore(extras, barRight);
  else          bar.appendChild(extras);

  // Restore admin state from sessionStorage immediately
  applyAdminUI();
}

// ── MOBILE SIDEBAR ────────────────────────────────────────
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) {
    overlay.style.display = 'block';
    requestAnimationFrame(() => overlay.classList.add('visible'));
  }
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }
  document.body.style.overflow = '';
}

function injectMobileOverlay() {
  if (document.getElementById('sidebar-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.style.display = 'none';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
}

// ── LOG STUDY TIME ────────────────────────────────────────
function logStudyTime() {
  const now     = new Date();
  const date    = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const label   = getPageLabel();
  const total   = getStoredSeconds() + sessionSeconds;
  const divider = '─'.repeat(40);
  const entry   = `\n${divider}\n📚 ${date} at ${time}\nPage: ${label}\nThis session: ${formatTime(sessionSeconds)} | Page total: ${formatTime(total)}\n${divider}\n`;

  const journalEl = document.getElementById('n-journal-new');
  if (journalEl) {
    journalEl.value += entry;
    localStorage.setItem('cbsg-n-journal-new', journalEl.value);
    setStatus('📋 Logged to journal!', 'ok');
    return;
  }
  const ids = window.PAGE_NOTE_IDS || [];
  if (ids.length > 0) {
    const el = document.getElementById(ids[0]);
    if (el) {
      el.value += entry;
      localStorage.setItem('cbsg-' + ids[0], el.value);
      setStatus('📋 Logged to notes!', 'ok');
      return;
    }
  }
  setStatus('Session: ' + formatTime(sessionSeconds) + ' | Total: ' + formatTime(total), 'ok');
}

// ── TIMESTAMP INSERT ──────────────────────────────────────
function insertTimestamp() {
  const now     = new Date();
  const date    = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const divider = '─'.repeat(40);
  const stamp   = `\n${divider}\n${date} at ${time}\n${divider}\n`;

  const active = document.activeElement;
  if (active && active.tagName === 'TEXTAREA' && active.id) {
    active.value += stamp;
    active.scrollTop = active.scrollHeight;
    localStorage.setItem('cbsg-' + active.id, active.value);
    return;
  }
  const journalEl = document.getElementById('n-journal-new');
  if (journalEl) {
    journalEl.value += stamp;
    journalEl.focus();
    journalEl.scrollTop = journalEl.scrollHeight;
    localStorage.setItem('cbsg-n-journal-new', journalEl.value);
    return;
  }
  const ids = window.PAGE_NOTE_IDS || [];
  if (ids.length > 0) {
    const el = document.getElementById(ids[0]);
    if (el) {
      el.value += stamp;
      el.focus();
      el.scrollTop = el.scrollHeight;
      localStorage.setItem('cbsg-' + ids[0], el.value);
    }
  }
}

// ── LOG AND STAMP ─────────────────────────────────────────
function logAndStamp() {
  const now      = new Date();
  const date     = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time     = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const label    = getPageLabel();
  const total    = getStoredSeconds() + sessionSeconds;
  const divider  = '─'.repeat(40);
  const stamp    = `\n${divider}\n${date} at ${time}\n${divider}\n`;
  const logEntry = `\n${divider}\n📚 ${date} at ${time}\nPage: ${label}\nSession: ${formatTime(sessionSeconds)} | Total: ${formatTime(total)}\n${divider}\n`;

  const active = document.activeElement;
  if (active && active.tagName === 'TEXTAREA' && active.id) {
    active.value += stamp;
    active.scrollTop = active.scrollHeight;
    localStorage.setItem('cbsg-' + active.id, active.value);
  } else {
    const ids = window.PAGE_NOTE_IDS || [];
    if (ids.length > 0) {
      const el = document.getElementById(ids[0]);
      if (el) { el.value += stamp; el.scrollTop = el.scrollHeight; localStorage.setItem('cbsg-' + ids[0], el.value); }
    }
  }

  const journalEl = document.getElementById('n-journal-new');
  if (journalEl) {
    journalEl.value += logEntry;
    localStorage.setItem('cbsg-n-journal-new', journalEl.value);
  }

  setStatus('📅 Stamped & logged!', 'ok');
}

// ── GITHUB FILE OPS ───────────────────────────────────────
async function putFile(token, filePath, content) {
  const getRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
    { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!getRes.ok) throw new Error(`Could not fetch ${filePath} (${getRes.status})`);
  const { sha } = await getRes.json();
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const putRes  = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Update ${filePath} — ${new Date().toLocaleDateString()}`, content: encoded, sha })
    }
  );
  if (!putRes.ok) { const e = await putRes.json(); throw new Error(e.message || 'Save failed'); }
}

async function putFileNew(token, filePath, content) {
  let sha = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
    if (r.ok) sha = (await r.json()).sha;
  } catch(e) {}
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const body    = { message: `Update ${filePath} — ${new Date().toLocaleDateString()}`, content: encoded };
  if (sha) body.sha = sha;
  const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
    { method: 'PUT', headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!putRes.ok) { const e = await putRes.json(); throw new Error(e.message || 'Notes save failed'); }
}

// ── GITHUB SAVE ───────────────────────────────────────────
async function saveToGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) { setStatus('⚠️ Paste your GitHub token first.', 'warn'); return; }
  localStorage.setItem('cbsg-gh-token', token);
  saveAllNotes();

  const rawPath  = window.location.pathname.replace(/^\/CampbellBibleStudy\//, '');
  const filePath = rawPath || 'index.html';

  setStatus('📡 Saving...', 'info');

  // Scrub sensitive fields before capturing HTML
  const sensitiveIds = ['gh-token', 'gemini-key'];
  const savedValues  = {};
  sensitiveIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) { savedValues[id] = el.value; el.value = ''; }
  });
  document.querySelectorAll('input[type="password"]').forEach(el => {
    if (el.id && !savedValues[el.id]) { savedValues[el.id] = el.value; el.value = ''; }
  });

  const html = document.documentElement.outerHTML;

  Object.entries(savedValues).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  try {
    await putFile(token, filePath, html);
    await saveNotesJson(token);
    setStatus('✅ Saved! Live in ~30 seconds.', 'ok');
    updateVersionTimestamp();
  } catch(e) {
    setStatus('❌ ' + e.message, 'error');
  }
}

// ── GITHUB LOAD ───────────────────────────────────────────
async function loadFromGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) { setStatus('⚠️ Paste your GitHub token first.', 'warn'); return; }
  localStorage.setItem('cbsg-gh-token', token);
  setStatus('📡 Loading your notes...', 'info');

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/my-notes.json?t=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      setStatus(res.status === 404 ? '⚠️ No saved notes found yet.' : `❌ Could not load (${res.status})`, 'warn');
      return;
    }
    const data  = await res.json();
    const notes = data.notes || {};
    if (Object.keys(notes).length === 0) { setStatus('⚠️ Notes file is empty.', 'warn'); return; }

    let loaded = 0;
    for (const [key, value] of Object.entries(notes)) {
      if (value && value.trim()) { localStorage.setItem('cbsg-' + key, value); loaded++; }
    }
    loadNotes();

    const root = window.location.pathname.includes('/theme') ? '..' : '.';
    if (typeof buildSidebar === 'function') buildSidebar(root);
    refreshCompleteButton();

    setStatus(`✅ Loaded ${loaded} notes from GitHub.`, 'ok');
  } catch(e) {
    setStatus('❌ ' + e.message, 'error');
  }
}

function refreshCompleteButton() {
  const key     = getCompleteKey();
  const btn     = document.getElementById('complete-btn');
  const btnText = document.getElementById('complete-btn-text');
  if (!key || !btn || !btnText) return;
  const isDone = localStorage.getItem('cbsg-' + key) === 'true';
  btnText.textContent   = isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
  btn.style.background  = isDone ? '#2E6B0E' : '#1F3864';
  btn.style.borderColor = isDone ? '#90EE90'  : 'rgba(255,255,255,0.3)';
  btn.style.color       = isDone ? '#90EE90'  : 'rgba(255,255,255,0.7)';
}

// ── CHANGE SUMMARY ────────────────────────────────────────
function buildChangeSummary(previousNotes, currentNotes) {
  const NOTE_LABELS = {
    'n-intro':       'Introduction notes',
    'n-journal-new': 'Personal Journal',
    'n-sermons':     'Sermon log',
    'c-prophecy':    'Conviction — Prophecy',
    'c-israel':      'Conviction — Israel',
    'c-rapture':     'Conviction — Rapture',
    'c-millennium':  'Conviction — Millennium',
    'c-calendar':    'Conviction — Calendar',
    'c-grace':       'Conviction — Grace & Holiness',
    'c-live':        'Conviction — How study changes my life',
    'c-snapshots':   'Conviction Snapshots',
    'n-cl-general':  'Prophecy Checklist notes',
  };
  for (let i = 1; i <= 15; i++) NOTE_LABELS[`n-m${i}`]   = `Theme 1 Module ${i} notes`;
  for (let i = 1; i <= 3;  i++) NOTE_LABELS[`n-t2m${i}`] = `Theme 2 Module ${i} notes`;

  const changed      = [];
  const pagesChanged = new Set();

  for (const [key, newVal] of Object.entries(currentNotes)) {
    if (key.startsWith('complete-') || key.startsWith('nav-') || key.startsWith('timer-')) continue;
    const oldVal = previousNotes[key] || '';
    if (newVal !== oldVal) {
      const label = NOTE_LABELS[key] || key;
      changed.push(label);
      if      (key === 'n-journal-new') pagesChanged.add('Journal');
      else if (key.startsWith('c-'))    pagesChanged.add('Convictions');
      else if (key === 'n-sermons')     pagesChanged.add('Sermons');
      else if (key.startsWith('n-t2'))  pagesChanged.add('Theme 2 Modules');
      else if (key.startsWith('n-m'))   pagesChanged.add('Modules');
      else                              pagesChanged.add('Study Guide');
    }
  }
  for (const key of Object.keys(currentNotes)) {
    if (!previousNotes.hasOwnProperty(key) && !key.startsWith('complete-') && !key.startsWith('nav-') && !key.startsWith('timer-')) {
      const label = NOTE_LABELS[key] || key;
      if (!changed.includes(label)) changed.push(label + ' (new)');
    }
  }

  let summary = '';
  if      (changed.length === 0) summary = 'No note changes detected — page HTML saved.';
  else if (changed.length === 1) summary = `Updated: ${changed[0]}.`;
  else if (changed.length <= 4)  summary = `Updated: ${changed.join(', ')}.`;
  else summary = `Updated ${changed.length} note fields including ${changed.slice(0,3).join(', ')}, and more.`;

  return { summary, pagesChanged: Array.from(pagesChanged) };
}

// ── SHARED NOTES JSON ─────────────────────────────────────
async function saveNotesJson(token) {
  const notes    = {};
  const excluded = new Set(['cbsg-gh-token', 'cbsg-gemini-key']);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cbsg-'))  continue;
    if (excluded.has(key))                 continue;
    if (key.startsWith('cbsg-nav-'))       continue;
    if (key.startsWith('cbsg-timer-'))     continue;
    if (key.startsWith('cbsg-guest-'))     continue; // never push guest notes to GitHub
    const value = localStorage.getItem(key);
    if (value && value.trim()) notes[key.replace('cbsg-', '')] = value;
  }

  let previousNotes      = {};
  let existingHistory    = [];
  let existingOriginDate = 'March 30, 2026';
  try {
    const prevRes = await fetch(
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/my-notes.json?t=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (prevRes.ok) {
      const prevData      = await prevRes.json();
      previousNotes       = prevData.notes       || {};
      existingHistory     = prevData.saveHistory || [];
      existingOriginDate  = prevData.originDate  || existingOriginDate;
    }
  } catch(e) {}

  const now       = new Date();
  const timestamp = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) +
                    ' at ' + now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
  const { summary, pagesChanged } = buildChangeSummary(previousNotes, notes);
  const newEntry  = { timestamp, summary, pagesChanged, isoTime: now.toISOString() };
  const updatedHistory = [...existingHistory, newEntry].slice(-500);

  const payload = {
    lastUpdated: now.toISOString(),
    originDate:  existingOriginDate,
    saveHistory: updatedHistory,
    noteLabels: {
      'n-intro':       'Introduction — What I currently believe & hope to discover',
      'n-m1':          'Module 1 — Daniel\'s 70 Weeks',
      'n-m2':          'Module 2 — Israel in Prophecy',
      'n-m3':          'Module 3 — Day of the Lord',
      'n-m4':          'Module 4 — Watchman Principle',
      'n-m5':          'Module 5 — New Covenant',
      'n-m6':          'Module 6 — Rapture',
      'n-m7':          'Module 7 — Antichrist',
      'n-m8':          'Module 8 — Rebuilt Temple',
      'n-m9':          'Module 9 — Gog-Magog',
      'n-m10':         'Module 10 — Signs of the Times',
      'n-m11':         'Module 11 — False Prophets',
      'n-m12':         'Module 12 — Millennium',
      'n-m13':         'Module 13 — Second Coming',
      'n-m14':         'Module 14 — Matt 24 vs Revelation',
      'n-m15':         'Module 15 — Armageddon',
      'n-t2m1':        'Theme 2 Module 1 — Calendar History',
      'n-t2m2':        'Theme 2 Module 2 — Calendar Timeline',
      'n-t2m3':        'Theme 2 Module 3 — Book of Jubilees',
      'n-journal-new': 'Personal Journal',
      'n-sermons':     'Sermon log notes',
      'c-prophecy':    'Conviction — Prophecy',
      'c-israel':      'Conviction — Israel',
      'c-rapture':     'Conviction — Rapture',
      'c-millennium':  'Conviction — Millennium',
      'c-calendar':    'Conviction — Calendar',
      'c-grace':       'Conviction — Grace & holiness',
      'c-live':        'Conviction — How study changes my life',
      'c-snapshots':   'Conviction snapshots',
      'c-gog-session-apr9': 'Study Session — Gog-Magog April 9 2026',
      'n-cl-general':  'Prophecy Checklist — General notes',
      'complete-t1m1':  'Completion — Module 1',  'complete-t1m2':  'Completion — Module 2',
      'complete-t1m3':  'Completion — Module 3',  'complete-t1m4':  'Completion — Module 4',
      'complete-t1m5':  'Completion — Module 5',  'complete-t1m6':  'Completion — Module 6',
      'complete-t1m7':  'Completion — Module 7',  'complete-t1m8':  'Completion — Module 8',
      'complete-t1m9':  'Completion — Module 9',  'complete-t1m10': 'Completion — Module 10',
      'complete-t1m11': 'Completion — Module 11', 'complete-t1m12': 'Completion — Module 12',
      'complete-t1m13': 'Completion — Module 13', 'complete-t1m14': 'Completion — Module 14',
      'complete-t1m15': 'Completion — Module 15',
      'complete-t2m1':  'Completion — Theme 2 Module 1',
      'complete-t2m2':  'Completion — Theme 2 Module 2',
      'complete-t2m3':  'Completion — Theme 2 Module 3',
    },
    notes
  };

  await putFileNew(token, 'my-notes.json', JSON.stringify(payload, null, 2));
}

// ── STATUS ────────────────────────────────────────────────
function setStatus(msg, type) {
  const el = document.getElementById('gh-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'ok'    ? '#90EE90'
                 : type === 'error' ? '#FF8888'
                 : type === 'warn'  ? '#FFD700'
                 : 'rgba(255,255,255,0.7)';
}

function updateVersionTimestamp() {
  const label = new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const vEl   = document.getElementById('gh-bar-version');
  if (vEl) vEl.textContent = 'Version: ' + label;
  const sEl   = document.getElementById('sidebar-version');
  if (sEl) sEl.textContent = 'Version: ' + label;
}

// ── LOCAL STORAGE NOTES (admin) ───────────────────────────
function saveAllNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('cbsg-' + id, el.value);
  });
}

function loadNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const el  = document.getElementById(id);
    const val = localStorage.getItem('cbsg-' + id);
    if (el && val) el.value = val;
  });
}

function wireAutoSave() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => localStorage.setItem('cbsg-' + id, el.value));
  });

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

// ── SIDEBAR ACTIVE STATE ──────────────────────────────────
function markActivePage() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const tail = href.split('/').pop();
    if (tail && currentPath.endsWith(tail)) item.classList.add('active');
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  wireAutoSave();
  injectMobileOverlay();
  markActivePage();
  injectBarExtras();     // restores admin UI state from sessionStorage
  injectCompleteButton();
  startTimer();

  // Guest welcome + panel — only for non-admin visitors
  // Small delay so page is fully rendered first
  setTimeout(() => {
    if (!isAdminUnlocked()) checkFirstVisit();
  }, 400);

  // Load EmailJS if not already on the page
  if (typeof emailjs === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {} };
    document.head.appendChild(s);
  } else {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}
  }
});
