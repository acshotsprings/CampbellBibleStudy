/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v3.0 Multi-Page + Shared Notes
   ============================================================
   SNAPSHOT — April 22, 2026
   Reason: Pre-modification backup before adding CBSG_notifyNoteSave hook
   Source: https://raw.githubusercontent.com/acshotsprings/CampbellBibleStudy/main/assets/js/main.js
   ============================================================ */

const OWNER = 'acshotsprings';
const REPO  = 'CampbellBibleStudy';

// ── GITHUB SAVE ───────────────────────────────────────────

async function saveToGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) { setStatus('⚠️ Paste your GitHub token first.', 'warn'); return; }
  localStorage.setItem('cbsg-gh-token', token);
  saveAllNotes();

  const rawPath = window.location.pathname.replace(/^\/CampbellBibleStudy\//, '');
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

    const data = await res.json();
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

// ── SHARED NOTES JSON ─────────────────────────────────────

async function saveNotesJson(token) {
  const notes = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cbsg-') && key !== 'cbsg-gh-token') {
      const value = localStorage.getItem(key);
      if (value && value.trim()) notes[key.replace('cbsg-', '')] = value;
    }
  }
  const payload = {
    lastUpdated: new Date().toISOString(),
    originDate: 'March 30, 2026',
    noteLabels: {
      'n-intro': 'Introduction — What I currently believe & hope to discover',
      'n-m1': 'Module 1 — Daniel\'s 70 Weeks: my convictions',
      'n-m2': 'Module 2 — Israel in Prophecy: my convictions',
      'n-m3': 'Module 3 — Day of the Lord: my notes',
      'n-m4': 'Module 4 — Watchman Principle: what it means for my life',
      'n-m5': 'Module 5 — New Covenant: what it means for my life',
      'n-m6': 'Module 6 — Rapture: my position, reasons, questions',
      'n-m7': 'Module 7 — Antichrist: my notes',
      'n-m8': 'Module 8 — Rebuilt Temple: my notes',
      'n-m9': 'Module 9 — Gog-Magog: my convictions',
      'n-m10': 'Module 10 — Signs of the Times: my notes',
      'n-m11': 'Module 11 — False Prophets: my notes',
      'n-m12': 'Module 12 — Millennium: my view and why',
      'n-m13': 'Module 13 — Second Coming: how this is changing how I live',
      'n-m14': 'Module 14 — Matt 24 vs Revelation: my notes',
      'n-m15': 'Module 15 — Armageddon: my notes',
      'n-t2m1': 'Theme 2 Module 1 — Calendar History: my notes',
      'n-journal-new': 'Personal Journal entries',
      'n-sermons': 'Sermon log overflow notes',
      'c-prophecy': 'Conviction — On prophecy and how to interpret it',
      'c-israel': 'Conviction — On Israel\'s role in prophecy',
      'c-rapture': 'Conviction — On the Rapture',
      'c-millennium': 'Conviction — On the Millennium',
      'c-grace': 'Conviction — On grace, holiness and readiness',
      'c-live': 'Conviction — How this study is changing how I live',
      'c-snapshots': 'Conviction snapshots over time',
      'q-m1-1': 'Q: Daniel 9:26 — two events predicted',
      'q-m1-2': 'Q: What Messiah\'s predicted death says about God\'s sovereignty',
      'q-m1-3': 'Q: What the gap between 69th and 70th week represents',
      'q-m1-4': 'Q: How 70 Weeks changes how I read Revelation',
      'q-m3-1': 'Q: Day of the Lord — thief in the night meaning',
      'q-m3-2': 'Q: How knowing Christians escape affects my urgency to witness',
      'q-m6-1': 'Q: Rapture and the Restrainer connection',
      'q-m6-2': 'Q: Response to Church-goes-through-Tribulation argument',
      'q-m6-3': 'Q: Weighing church history vs Scripture on pre-trib',
      'q-m6-4': 'Q: What it means that I am part of restraining lawlessness now',
      'q-m11-1': 'Q: Sheep\'s clothing — how deceptive false prophets will be',
      'q-m11-2': 'Q: Which biblical tests the Church fails to apply',
      'q-m11-3': 'Q: How I personally test teaching against Scripture',
      'q-m11-4': 'Q: Why miracles alone cannot verify true prophecy'
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
  el.style.color = type === 'ok' ? '#90EE90' : type === 'error' ? '#FF8888' : type === 'warn' ? '#FFD700' : 'rgba(255,255,255,0.7)';
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

// ── JOURNAL TIMESTAMP ─────────────────────────────────────

function insertTimestamp() {
  const el = document.getElementById('n-journal-new');
  if (!el) return;
  const now   = new Date();
  const date  = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time  = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const divider = '─'.repeat(40);
  el.value += `\n${divider}\n${date} at ${time}\n${divider}\n`;
  el.focus();
  el.scrollTop = el.scrollHeight;
}

// ── INIT ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  wireAutoSave();
  markActivePage();
});
