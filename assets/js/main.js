/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v4.1 Uniform Bar + Timers + Completion
   ============================================================ */

const OWNER = 'acshotsprings';
const REPO  = 'CampbellBibleStudy';

// ── COMPLETION KEY MAP ────────────────────────────────────
// Maps URL path fragments to their completion storage key
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

  // Update button appearance
  const btn     = document.getElementById('complete-btn');
  const btnText = document.getElementById('complete-btn-text');
  if (btn && btnText) {
    btnText.textContent = nowComplete ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
    btn.style.background    = nowComplete ? '#2E6B0E' : 'transparent';
    btn.style.borderColor   = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.3)';
    btn.style.color         = nowComplete ? '#90EE90'  : 'rgba(255,255,255,0.7)';
  }

  // Rebuild sidebar to reflect new state immediately
  if (typeof buildSidebar === 'function') {
    const root = window.location.pathname.includes('/theme') ? '..' : '.';
    buildSidebar(root);
  }

  setStatus(nowComplete ? '✅ Module marked complete!' : '↩️ Marked incomplete.', 'ok');
}

// ── COMPLETION BUTTON INJECTION ───────────────────────────
function injectCompleteButton() {
  const key = getCompleteKey();
  if (!key) return; // Not a completable page

  // Find the bottom nav (prev/next buttons div) to insert before it
  const bottomNav = document.querySelector('#main > div[style*="justify-content:space-between"]');
  const main      = document.getElementById('main');
  if (!main) return;

  const isDone    = localStorage.getItem('cbsg-' + key) === 'true';
  const wrapper   = document.createElement('div');
  wrapper.style.cssText = 'margin:32px 0 8px;text-align:center;';
  wrapper.innerHTML = `
    <div style="border-top:1px solid #ddd;padding-top:28px;margin-bottom:8px;">
      <p style="font-size:13px;color:#888;font-family:Arial,sans-serif;margin-bottom:14px;">
        Finished studying this module? Mark it complete to track your progress in the sidebar.
      </p>
      <button id="complete-btn" onclick="toggleCompletion()" style="
        background:${isDone ? '#2E6B0E' : 'transparent'};
        color:${isDone ? '#90EE90' : 'rgba(255,255,255,0.7)'};
        border:2px solid ${isDone ? '#90EE90' : 'rgba(255,255,255,0.3)'};
        border-radius:6px;
        padding:10px 28px;
        font-size:13px;
        font-family:Arial,sans-serif;
        font-weight:bold;
        cursor:pointer;
        transition:all 0.2s;
        background-color:${isDone ? '#2E6B0E' : '#1F3864'};
      ">
        <span id="complete-btn-text">${isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete'}</span>
      </button>
    </div>
  `;

  if (bottomNav) {
    main.insertBefore(wrapper, bottomNav);
  } else {
    main.appendChild(wrapper);
  }
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
    sessionSeconds      = Math.floor((Date.now() - sessionStart) / 1000);
    const total         = getStoredSeconds() + sessionSeconds;
    const sessionEl     = document.getElementById('bar-session-time');
    const totalEl       = document.getElementById('bar-total-time');
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
    sessionStart  = Date.now() - (sessionSeconds * 1000);
    if (!timerInterval) startTimer();
  }
});

// ── UNIFORM GITHUB BAR INJECTION ─────────────────────────
function injectBarExtras() {
  const bar = document.getElementById('github-bar');
  if (!bar || document.getElementById('bar-session-time')) return;

  const stored  = getStoredSeconds();
  const extras  = document.createElement('div');
  extras.id     = 'bar-extras';
  extras.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:8px;';
  extras.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:80px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">This Session</span>
      <span id="bar-session-time" style="font-size:12px;color:#FFD700;font-family:Arial,sans-serif;font-weight:bold;">0s</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:80px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Page Total</span>
      <span id="bar-total-time" style="font-size:12px;color:rgba(255,255,255,0.8);font-family:Arial,sans-serif;font-weight:bold;">${formatTime(stored)}</span>
    </div>
    <button onclick="logStudyTime()" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.25);border-radius:4px;padding:4px 10px;font-size:11px;font-family:Arial,sans-serif;cursor:pointer;white-space:nowrap;" title="Log this study session to your journal">📋 Log Study</button>
    <button onclick="insertTimestamp()" style="background:rgba(255,215,0,0.15);color:#FFD700;border:1px solid rgba(255,215,0,0.4);border-radius:4px;padding:4px 10px;font-size:11px;font-family:Arial,sans-serif;font-weight:bold;cursor:pointer;white-space:nowrap;" title="Insert a timestamp into your notes">📅 Timestamp</button>
  `;

  const barRight = bar.querySelector('.bar-right');
  if (barRight) bar.insertBefore(extras, barRight);
  else bar.appendChild(extras);
}

// ── LOG STUDY TIME ────────────────────────────────────────
function logStudyTime() {
  const now     = new Date();
  const date    = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
  const date    = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const divider = '─'.repeat(40);
  const stamp   = `\n${divider}\n${date} at ${time}\n${divider}\n`;

  const active = document.activeElement;
  if (active && (active.tagName === 'TEXTAREA') && active.id) {
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
  const putRes  = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
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

  // ── SCRUB ALL SENSITIVE FIELDS BEFORE CAPTURING HTML ──────
  // Clear token, Gemini key, and any password fields so they
  // are never baked into the saved HTML on GitHub.
  // We restore them immediately after capturing the HTML string.
  const sensitiveIds = ['gh-token', 'gemini-key'];
  const savedValues  = {};
  sensitiveIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) { savedValues[id] = el.value; el.value = ''; }
  });
  // Also scrub any other password-type inputs on the page
  document.querySelectorAll('input[type="password"]').forEach(el => {
    if (el.id && !savedValues[el.id]) {
      savedValues[el.id] = el.value;
      el.value = '';
    }
  });

  const html = document.documentElement.outerHTML;

  // Restore all sensitive fields immediately after capture
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

    // Re-render sidebar and complete button after loading completion state
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
  btnText.textContent      = isDone ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
  btn.style.background     = isDone ? '#2E6B0E' : '#1F3864';
  btn.style.borderColor    = isDone ? '#90EE90'  : 'rgba(255,255,255,0.3)';
  btn.style.color          = isDone ? '#90EE90'  : 'rgba(255,255,255,0.7)';
}

// ── SHARED NOTES JSON ─────────────────────────────────────

async function saveNotesJson(token) {
  const notes    = {};
  const excluded = new Set(['cbsg-gh-token', 'cbsg-gemini-key']);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cbsg-')) continue;
    if (excluded.has(key)) continue;
    if (key.startsWith('cbsg-nav-'))   continue;
    if (key.startsWith('cbsg-timer-')) continue;
    const value = localStorage.getItem(key);
    if (value && value.trim()) notes[key.replace('cbsg-', '')] = value;
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    originDate:  'March 30, 2026',
    noteLabels: {
      'n-intro':    'Introduction — What I currently believe & hope to discover',
      'n-m1':       'Module 1 — Daniel\'s 70 Weeks',
      'n-m2':       'Module 2 — Israel in Prophecy',
      'n-m3':       'Module 3 — Day of the Lord',
      'n-m4':       'Module 4 — Watchman Principle',
      'n-m5':       'Module 5 — New Covenant',
      'n-m6':       'Module 6 — Rapture',
      'n-m7':       'Module 7 — Antichrist',
      'n-m8':       'Module 8 — Rebuilt Temple',
      'n-m9':       'Module 9 — Gog-Magog',
      'n-m10':      'Module 10 — Signs of the Times',
      'n-m11':      'Module 11 — False Prophets',
      'n-m12':      'Module 12 — Millennium',
      'n-m13':      'Module 13 — Second Coming',
      'n-m14':      'Module 14 — Matt 24 vs Revelation',
      'n-m15':      'Module 15 — Armageddon',
      'n-t2m1':     'Theme 2 Module 1 — Calendar History',
      'n-t2m2':     'Theme 2 Module 2 — Calendar Timeline',
      'n-t2m3':     'Theme 2 Module 3 — Book of Jubilees',
      'n-journal-new': 'Personal Journal',
      'n-sermons':  'Sermon log notes',
      'c-prophecy': 'Conviction — Prophecy',
      'c-israel':   'Conviction — Israel',
      'c-rapture':  'Conviction — Rapture',
      'c-millennium':'Conviction — Millennium',
      'c-calendar': 'Conviction — Calendar',
      'c-grace':    'Conviction — Grace & holiness',
      'c-live':     'Conviction — How study changes my life',
      'c-snapshots':'Conviction snapshots',
      'c-gog-session-apr9': 'Study Session — Gog-Magog April 9 2026',
      'n-cl-general':'Prophecy Checklist — General notes',
      // Completion states
      'complete-t1m1':  'Completion — Module 1',
      'complete-t1m2':  'Completion — Module 2',
      'complete-t1m3':  'Completion — Module 3',
      'complete-t1m4':  'Completion — Module 4',
      'complete-t1m5':  'Completion — Module 5',
      'complete-t1m6':  'Completion — Module 6',
      'complete-t1m7':  'Completion — Module 7',
      'complete-t1m8':  'Completion — Module 8',
      'complete-t1m9':  'Completion — Module 9',
      'complete-t1m10': 'Completion — Module 10',
      'complete-t1m11': 'Completion — Module 11',
      'complete-t1m12': 'Completion — Module 12',
      'complete-t1m13': 'Completion — Module 13',
      'complete-t1m14': 'Completion — Module 14',
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
  const label = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const vEl   = document.getElementById('gh-bar-version');
  if (vEl) vEl.textContent = 'Version: ' + label;
  const sEl   = document.getElementById('sidebar-version');
  if (sEl) sEl.textContent = 'Version: ' + label;
}

// ── LOCAL STORAGE NOTES ───────────────────────────────────

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

  // Also wire checklist note textareas
  document.querySelectorAll('textarea.notes-textarea').forEach(el => {
    if (el.id && !el.id.startsWith('ai-')) {
      el.addEventListener('input', () => localStorage.setItem('cbsg-' + el.id, el.value));
      const saved = localStorage.getItem('cbsg-' + el.id);
      if (saved) el.value = saved;
    }
  });

  // Restore saved GitHub token
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
  markActivePage();
  injectBarExtras();
  injectCompleteButton();
  startTimer();
});
