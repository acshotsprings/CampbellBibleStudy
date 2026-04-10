/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v4.0 Uniform Bar + Study Timers
   ============================================================ */

const OWNER = 'acshotsprings';
const REPO  = 'CampbellBibleStudy';

// ── PAGE IDENTITY ─────────────────────────────────────────
// Derives a stable key from the URL for per-page timer storage
function getPageKey() {
  const path = window.location.pathname;
  const parts = path.replace(/^\/CampbellBibleStudy\/?/, '').replace(/\.html$/, '');
  return 'timer-' + (parts || 'index');
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
    sessionSeconds = Math.floor((Date.now() - sessionStart) / 1000);
    const total    = getStoredSeconds() + sessionSeconds;
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

// Save time when leaving the page
window.addEventListener('beforeunload', stopTimer);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopTimer();
  } else {
    // Resume when tab becomes visible again
    sessionStart = Date.now() - (sessionSeconds * 1000);
    if (!timerInterval) startTimer();
  }
});

// ── UNIFORM GITHUB BAR INJECTION ─────────────────────────
// Adds timer display + Log Study Time button to the bar on every page
function injectBarExtras() {
  const bar = document.getElementById('github-bar');
  if (!bar) return;

  // Don't double-inject
  if (document.getElementById('bar-session-time')) return;

  const stored = getStoredSeconds();

  // Build the extras HTML
  const extras = document.createElement('div');
  extras.id = 'bar-extras';
  extras.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:8px;';
  extras.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:90px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">This Session</span>
      <span id="bar-session-time" style="font-size:12px;color:#FFD700;font-family:Arial,sans-serif;font-weight:bold;">0s</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 10px;min-width:90px;">
      <span style="font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Page Total</span>
      <span id="bar-total-time" style="font-size:12px;color:rgba(255,255,255,0.8);font-family:Arial,sans-serif;font-weight:bold;">${formatTime(stored)}</span>
    </div>
    <button onclick="logStudyTime()" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.25);border-radius:4px;padding:4px 10px;font-size:11px;font-family:Arial,sans-serif;cursor:pointer;white-space:nowrap;" title="Log this study session to your journal">📋 Log Study</button>
    <button onclick="insertTimestamp()" style="background:rgba(255,215,0,0.15);color:#FFD700;border:1px solid rgba(255,215,0,0.4);border-radius:4px;padding:4px 10px;font-size:11px;font-family:Arial,sans-serif;font-weight:bold;cursor:pointer;white-space:nowrap;" title="Insert a timestamp into your notes">📅 Timestamp</button>
  `;

  // Insert before bar-right if it exists, otherwise append
  const barRight = bar.querySelector('.bar-right');
  if (barRight) {
    bar.insertBefore(extras, barRight);
  } else {
    bar.appendChild(extras);
  }
}

// ── LOG STUDY TIME ────────────────────────────────────────
function logStudyTime() {
  const now       = new Date();
  const date      = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time      = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const label     = getPageLabel();
  const pageKey   = getPageKey();
  const total     = getStoredSeconds() + sessionSeconds;
  const divider   = '─'.repeat(40);
  const entry     = `\n${divider}\n📚 ${date} at ${time}\nPage: ${label}\nThis session: ${formatTime(sessionSeconds)} | Page total: ${formatTime(total)}\n${divider}\n`;

  // Try to write to journal textarea first, then any visible notes textarea
  const journalEl = document.getElementById('n-journal-new');
  if (journalEl) {
    journalEl.value += entry;
    localStorage.setItem('cbsg-n-journal-new', journalEl.value);
    setStatus('📋 Logged to journal!', 'ok');
    return;
  }

  // Fall back to first available notes textarea on this page
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

  setStatus('📋 Session: ' + formatTime(sessionSeconds) + ' | Total: ' + formatTime(total), 'ok');
}

// ── TIMESTAMP INSERT ──────────────────────────────────────
// Works on any page — finds the best textarea to stamp
function insertTimestamp() {
  const now     = new Date();
  const date    = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time    = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const divider = '─'.repeat(40);
  const stamp   = `\n${divider}\n${date} at ${time}\n${divider}\n`;

  // Priority: focused element, then journal, then first page note
  const active = document.activeElement;
  if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT') && active.id) {
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
  const putRes = await fetch(
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
  const body = { message: `Update ${filePath} — ${new Date().toLocaleDateString()}`, content: encoded };
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

  try {
    await putFile(token, filePath, document.documentElement.outerHTML);
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
      if (res.status === 404) {
        setStatus('⚠️ No saved notes found yet. Save first from any device.', 'warn');
      } else {
        setStatus(`❌ Could not load notes (${res.status})`, 'error');
      }
      return;
    }

    const data  = await res.json();
    const notes = data.notes || {};

    if (Object.keys(notes).length === 0) {
      setStatus('⚠️ Notes file is empty — nothing to load yet.', 'warn');
      return;
    }

    let loaded = 0;
    for (const [key, value] of Object.entries(notes)) {
      if (value && value.trim()) {
        localStorage.setItem('cbsg-' + key, value);
        loaded++;
      }
    }

    loadNotes();
    setStatus(`✅ Loaded ${loaded} notes from GitHub.`, 'ok');

  } catch(e) {
    setStatus('❌ ' + e.message, 'error');
  }
}

// ── SHARED NOTES JSON ─────────────────────────────────────

async function saveNotesJson(token) {
  const notes = {};

  // Collect everything from localStorage EXCEPT sensitive keys and nav state
  const excluded = new Set(['cbsg-gh-token', 'cbsg-gemini-key']);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cbsg-')) continue;
    if (excluded.has(key)) continue;
    if (key.startsWith('cbsg-nav-')) continue;   // nav collapse state — not notes
    if (key.startsWith('cbsg-timer-')) continue;  // per-page timers — keep local only
    const value = localStorage.getItem(key);
    if (value && value.trim()) notes[key.replace('cbsg-', '')] = value;
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    originDate:  'March 30, 2026',
    noteLabels: {
      'n-intro':   'Introduction — What I currently believe & hope to discover',
      'n-m1':      'Module 1 — Daniel\'s 70 Weeks: my convictions',
      'n-m2':      'Module 2 — Israel in Prophecy: my convictions',
      'n-m3':      'Module 3 — Day of the Lord: my notes',
      'n-m4':      'Module 4 — Watchman Principle: what it means for my life',
      'n-m5':      'Module 5 — New Covenant: what it means for my life',
      'n-m6':      'Module 6 — Rapture: my position, reasons, questions',
      'n-m7':      'Module 7 — Antichrist: my notes',
      'n-m8':      'Module 8 — Rebuilt Temple: my notes',
      'n-m9':      'Module 9 — Gog-Magog: my convictions',
      'n-m10':     'Module 10 — Signs of the Times: my notes',
      'n-m11':     'Module 11 — False Prophets: my notes',
      'n-m12':     'Module 12 — Millennium: my view and why',
      'n-m13':     'Module 13 — Second Coming: how this is changing how I live',
      'n-m14':     'Module 14 — Matt 24 vs Revelation: my notes',
      'n-m15':     'Module 15 — Armageddon: my notes',
      'n-t2m1':    'Theme 2 Module 1 — Calendar History: my notes',
      'n-t2m2':    'Theme 2 Module 2 — Calendar Timeline: my notes',
      'n-t2m3':    'Theme 2 Module 3 — Book of Jubilees: my notes',
      'n-journal-new': 'Personal Journal entries',
      'n-sermons': 'Sermon log overflow notes',
      'c-prophecy':  'Conviction — On prophecy and how to interpret it',
      'c-israel':    'Conviction — On Israel\'s role in prophecy',
      'c-rapture':   'Conviction — On the Rapture',
      'c-millennium':'Conviction — On the Millennium',
      'c-calendar':  'Conviction — On God\'s original calendar',
      'c-grace':     'Conviction — On grace, holiness and readiness',
      'c-live':      'Conviction — How this study is changing how I live',
      'c-snapshots': 'Conviction snapshots over time',
      'c-gog-session-apr9': 'Study Session — Gog-Magog April 9 2026',
      'n-cl-general': 'Prophecy Checklist — General notes',
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
  const vEl = document.getElementById('gh-bar-version');
  if (vEl) vEl.textContent = 'Version: ' + label;
  const sEl = document.getElementById('sidebar-version');
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

  // Also wire up any checklist note textareas not in PAGE_NOTE_IDS
  document.querySelectorAll('textarea.notes-textarea').forEach(el => {
    if (el.id && !el.id.startsWith('ai-')) {
      el.addEventListener('input', () => localStorage.setItem('cbsg-' + el.id, el.value));
      const saved = localStorage.getItem('cbsg-' + el.id);
      if (saved) el.value = saved;
    }
  });

  // Restore saved GitHub token
  const savedToken = localStorage.getItem('cbsg-gh-token');
  if (savedToken) {
    const t = document.getElementById('gh-token');
    if (t) t.value = savedToken;
  }
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
  startTimer();
});
