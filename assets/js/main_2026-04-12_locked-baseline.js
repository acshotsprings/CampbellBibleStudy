/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v3.2 Centralized Quill Toolbar + Locked Buttons
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
    // Fetch my-notes.json fresh (bypass cache)
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

    // Write every note into localStorage
    let loaded = 0;
    for (const [key, value] of Object.entries(notes)) {
      if (value && value.trim()) {
        localStorage.setItem('cbsg-' + key, value);
        loaded++;
      }
    }

    // Populate any fields visible on this page right now
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

// ── LOCAL STORAGE NOTES (Quill + textarea aware) ──────────
//
// For each id in PAGE_NOTE_IDS we look for a registered Quill first
// (created by bootstrapQuillEditors below). If one exists, we read/write
// its HTML. Otherwise we fall back to the plain textarea .value.

function _getQuillFor(id) {
  const list = window.CBSG_QUILLS || [];
  const entry = list.find(e => e.id === id);
  return entry ? entry.quill : null;
}

function saveAllNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const q = _getQuillFor(id);
    if (q) {
      localStorage.setItem('cbsg-' + id, q.root.innerHTML);
      return;
    }
    const el = document.getElementById(id);
    if (el) localStorage.setItem('cbsg-' + id, el.value);
  });
}

function loadNotes() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const val = localStorage.getItem('cbsg-' + id);
    if (val == null) return;
    const q = _getQuillFor(id);
    if (q) {
      q.root.innerHTML = val;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

function wireAutoSave() {
  (window.PAGE_NOTE_IDS || []).forEach(id => {
    const q = _getQuillFor(id);
    if (q) {
      q.on('text-change', () => {
        localStorage.setItem('cbsg-' + id, q.root.innerHTML);
      });
      return;
    }
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

// ── CANONICAL QUILL TOOLBAR (locked, single source of truth) ──
//
// Every Quill editor on every page gets exactly this toolbar. To change
// the buttons available site-wide, edit this one constant — do not let
// individual pages define their own.

const CBSG_TOOLBAR = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  ['blockquote', 'link'],
  ['clean']
  // Note: the 🕐 timestamp button is added manually after init in
  // bootstrapQuillEditors — Quill 2 doesn't reliably accept custom
  // non-format toolbar entries via the array form.
];

// ── QUILL BOOTSTRAP ───────────────────────────────────────
//
// Find every textarea.notes-input on the page, tear down any pre-baked
// Quill DOM next to it (left over from earlier auto-converters), and
// re-init Quill fresh with the canonical toolbar. This is what locks the
// toolbar in place and stops it from drifting between pages or reloads.

function bootstrapQuillEditors() {
  if (!window.Quill) return;

  const textareas = document.querySelectorAll('textarea.notes-input');
  textareas.forEach(ta => {
    const id = ta.id;
    if (!id) return;

    // 1. Capture any existing content. Priority order:
    //    a) saved value in localStorage (most recent)
    //    b) HTML inside a pre-baked .ql-editor sitting next to the textarea
    //    c) the textarea's own .value
    const stored = localStorage.getItem('cbsg-' + id);
    const parent = ta.parentNode;
    let prebakedHtml = null;
    const oldQuillContainer = parent.querySelector('#' + CSS.escape(id) + '__quill');
    if (oldQuillContainer) {
      const ed = oldQuillContainer.querySelector('.ql-editor');
      if (ed) prebakedHtml = ed.innerHTML;
    }
    const initialHtml = stored != null ? stored
                       : prebakedHtml != null ? prebakedHtml
                       : (ta.value || '');

    // 2. Remove any leftover Quill DOM from prior auto-converters.
    //    We strip both the old toolbar and the old container so we can
    //    rebuild cleanly.
    parent.querySelectorAll('.ql-toolbar').forEach(n => n.remove());
    if (oldQuillContainer) oldQuillContainer.remove();

    // 3. Hide the textarea (it stays as a hidden mirror for legacy code).
    ta.style.display = 'none';

    // 4. Build a fresh container right after the textarea.
    const host = document.createElement('div');
    host.id = id + '__quill';
    host.className = 'quill-editor';
    host.style.minHeight = '120px';
    parent.insertBefore(host, ta.nextSibling);

    // 5. Initialize Quill with the canonical toolbar.
    const q = new Quill(host, {
      theme: 'snow',
      placeholder: ta.getAttribute('placeholder') || 'Write your notes…',
      modules: {
        toolbar: CBSG_TOOLBAR
      }
    });

    // 6. Inject the 🕐 timestamp button into Quill's toolbar manually.
    //    We grab the toolbar element directly from Quill's toolbar module
    //    so we always get THIS editor's toolbar, even if the page has
    //    multiple note boxes.
    const toolbarModule = q.getModule('toolbar');
    const toolbarEl = toolbarModule && toolbarModule.container;
    if (toolbarEl) {
      const group = document.createElement('span');
      group.className = 'ql-formats';
      const tsBtn = document.createElement('button');
      tsBtn.type = 'button';
      tsBtn.className = 'ql-cbsg-timestamp';
      tsBtn.innerHTML = '🕐';
      tsBtn.title = 'Insert timestamp';
      tsBtn.setAttribute('aria-label', 'Insert timestamp');
      tsBtn.style.width = 'auto';
      tsBtn.style.padding = '0 6px';
      tsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Focus this editor so insertTimestamp targets it.
        q.focus();
        _insertQuillStamp({ id: id, quill: q });
      });
      group.appendChild(tsBtn);
      toolbarEl.appendChild(group);
    }

    // 7. Restore content into the fresh editor.
    if (initialHtml) {
      q.root.innerHTML = initialHtml;
    }

    // 8. Register so insertTimestamp + save/load can find this editor.
    registerQuill(id, q);
  });
}


//
// Behavior:
//   • Detects which Quill editor currently has focus and inserts there.
//   • Falls back to a focused <textarea>, then to #n-journal-new for
//     backwards compatibility with any pre-Quill page.
//   • First stamp of the day in a given editor → full border with date+time.
//   • Subsequent stamps the same day in the same editor → time-only with
//     a shorter divider for visual separation without repeating the date.
//   • Last-stamp tracking is per-editor and persisted in localStorage so
//     it survives page reloads.

// Track Quill instances so insertTimestamp() can find the active one.
// Pages that initialize Quill should push their instances here, e.g.:
//   const q = new Quill('#editor-journal', {...});
//   (window.CBSG_QUILLS = window.CBSG_QUILLS || []).push({ id: 'editor-journal', quill: q });
window.CBSG_QUILLS = window.CBSG_QUILLS || [];

function registerQuill(id, quillInstance) {
  if (!quillInstance) return;
  // Replace any prior registration for the same id (handles re-inits).
  window.CBSG_QUILLS = (window.CBSG_QUILLS || []).filter(e => e.id !== id);
  window.CBSG_QUILLS.push({ id, quill: quillInstance });
}

function _findActiveQuill() {
  const list = window.CBSG_QUILLS || [];
  if (!list.length) return null;

  // 1. Prefer the Quill that reports it has focus.
  for (const entry of list) {
    try { if (entry.quill && entry.quill.hasFocus && entry.quill.hasFocus()) return entry; }
    catch(e) {}
  }

  // 2. Fall back to whichever editor contains document.activeElement.
  const active = document.activeElement;
  if (active) {
    for (const entry of list) {
      const root = entry.quill && entry.quill.root;
      if (root && (root === active || root.contains(active))) return entry;
    }
  }

  // 3. Last resort: if there's exactly one Quill on the page, use it.
  if (list.length === 1) return list[0];

  return null;
}

function _todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function _wasStampedToday(editorId) {
  try {
    return localStorage.getItem('cbsg-laststamp-' + editorId) === _todayKey();
  } catch(e) { return false; }
}

function _markStampedToday(editorId) {
  try { localStorage.setItem('cbsg-laststamp-' + editorId, _todayKey()); }
  catch(e) {}
}

function _formatDate(now) {
  return now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function _formatTime(now) {
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function _insertQuillStamp(entry) {
  const quill = entry.quill;
  const editorId = entry.id;
  const realNow = new Date();
  const sameDay = _wasStampedToday(editorId);
  const date = _formatDate(realNow);
  const time = _formatTime(realNow);

  // Figure out where to insert. Prefer current selection; fall back to end.
  const sel = quill.getSelection(true);
  let index = sel ? sel.index : quill.getLength();

  // Make sure we start on a new line.
  if (index > 0) {
    const before = quill.getText(index - 1, 1);
    if (before !== '\n') {
      quill.insertText(index, '\n', 'user');
      index += 1;
    }
  }

  // Build the stamp text. Same-day = time only, different day = date + time.
  const stampText = sameDay
    ? '— ' + time + ' —'
    : '— ' + date + '  ·  ' + time + ' —';

  // Insert: blank line, stamp line (bold + centered), blank line.
  // We use Quill's native APIs so there's no HTML conversion to break.
  quill.insertText(index, '\n', 'user');           // leading blank line
  index += 1;
  const stampStart = index;
  quill.insertText(index, stampText, { bold: true }, 'user');
  index += stampText.length;
  quill.insertText(index, '\n', 'user');           // end of stamp line
  index += 1;
  quill.insertText(index, '\n', 'user');           // trailing blank line
  index += 1;

  // Center-align the stamp line itself.
  quill.formatLine(stampStart, 1, 'align', 'center', 'user');

  // Move cursor to after the stamp so the user can keep typing.
  quill.setSelection(index, 0, 'user');
  quill.focus();

  _markStampedToday(editorId);
}

function _insertTextareaStamp(el) {
  const editorId = el.id || 'textarea-default';
  const sameDay = _wasStampedToday(editorId);
  const now = new Date();
  const date = _formatDate(now);
  const time = _formatTime(now);

  let block;
  if (sameDay) {
    const divider = '─'.repeat(20);
    block = `\n${divider}\n${time}\n${divider}\n`;
  } else {
    const divider = '═'.repeat(40);
    block = `\n${divider}\n${date} at ${time}\n${divider}\n`;
  }

  el.value += block;
  // Trigger input listeners so autosave fires.
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
  el.scrollTop = el.scrollHeight;
  _markStampedToday(editorId);
}

function insertTimestamp() {
  // 1. Try to find an active Quill editor.
  const entry = _findActiveQuill();
  if (entry && entry.quill && window.Quill) {
    try {
      _insertQuillStamp(entry);
      return;
    } catch(e) {
      console.warn('Quill timestamp insert failed, falling back:', e);
    }
  }

  // 2. Fall back to a focused textarea.
  const active = document.activeElement;
  if (active && active.tagName === 'TEXTAREA') {
    _insertTextareaStamp(active);
    return;
  }

  // 3. Final fallback: legacy #n-journal-new textarea.
  const legacy = document.getElementById('n-journal-new');
  if (legacy) {
    _insertTextareaStamp(legacy);
    return;
  }

  console.warn('insertTimestamp: no editor found to stamp.');
}

// ── STUDY TIMER ───────────────────────────────────────────
//
// Two timer pills displayed in the top bar: Session (current visit) and
// Total (accumulated for THIS page across all visits). Auto-starts on
// page load, pauses when the tab is hidden, saves on tab close.
// Per-page tracking: each page gets its own total under cbsg-timer-{key}.

let _sessionStart   = null;
let _sessionSeconds = 0;
let _timerInterval  = null;

function _getPageKey() {
  const path = window.location.pathname
    .replace(/^\/CampbellBibleStudy\/?/, '')
    .replace(/\.html$/, '');
  return 'timer-' + (path || 'index');
}

function _getPageLabel() {
  return document.title.replace(' — Campbell Bible Study', '').trim() || 'This page';
}

function _getStoredSeconds() {
  return parseInt(localStorage.getItem('cbsg-' + _getPageKey()) || '0', 10);
}

function _addStoredSeconds(s) {
  const prev = _getStoredSeconds();
  localStorage.setItem('cbsg-' + _getPageKey(), String(prev + s));
}

function _formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return h + 'h ' + m + 'm ' + s + 's';
  if (m > 0) return m + 'm ' + s + 's';
  return s + 's';
}

function startStudyTimer() {
  _sessionStart   = Date.now();
  _sessionSeconds = 0;
  if (_timerInterval) clearInterval(_timerInterval);
  _timerInterval = setInterval(() => {
    _sessionSeconds = Math.floor((Date.now() - _sessionStart) / 1000);
    const total     = _getStoredSeconds() + _sessionSeconds;
    const sessionEl = document.getElementById('bar-session-time');
    const totalEl   = document.getElementById('bar-total-time');
    if (sessionEl) sessionEl.textContent = _formatDuration(_sessionSeconds);
    if (totalEl)   totalEl.textContent   = _formatDuration(total);
  }, 1000);
}

function stopStudyTimer() {
  if (_timerInterval) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
  // Only persist if the session was meaningful (>2s) to avoid logging
  // accidental refreshes or quick tab-flips.
  if (_sessionSeconds > 2) {
    _addStoredSeconds(_sessionSeconds);
    _sessionSeconds = 0;
  }
}

function wireTimerLifecycle() {
  window.addEventListener('beforeunload', stopStudyTimer);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopStudyTimer();
    } else {
      startStudyTimer();
    }
  });
}

// ── LOG & STAMP ───────────────────────────────────────────
//
// Writes a session-summary block ("📚 Date · Page · this session: Xm Ys
// · page total: Xh Ym Zs") into the active Quill editor using the same
// Quill API path as the 🕐 timestamp button. Falls back to the journal
// textarea if no Quill is available.

function logAndStamp() {
  const now = new Date();
  const date = _formatDate(now);
  const time = _formatTime(now);
  const label = _getPageLabel();
  const sessionStr = _formatDuration(_sessionSeconds);
  const totalStr = _formatDuration(_getStoredSeconds() + _sessionSeconds);

  const summaryLine = '📚 ' + date + ' at ' + time;
  const pageLine = 'Page: ' + label;
  const timeLine = 'This session: ' + sessionStr + '  ·  Page total: ' + totalStr;

  // Find the Quill to write into. Prefer the focused one, then fall back
  // to the first registered Quill on the page.
  let entry = _findActiveQuill();
  if (!entry && (window.CBSG_QUILLS || []).length > 0) {
    entry = window.CBSG_QUILLS[0];
  }

  if (entry && entry.quill) {
    const quill = entry.quill;
    let index = quill.getSelection(true)
                ? quill.getSelection(true).index
                : quill.getLength();

    // Make sure we start on a new line.
    if (index > 0) {
      const before = quill.getText(index - 1, 1);
      if (before !== '\n') {
        quill.insertText(index, '\n', 'user');
        index += 1;
      }
    }

    // Insert: blank line, summary line (bold center), page line, time
    // line, blank line. All centered for visual emphasis.
    quill.insertText(index, '\n', 'user');
    index += 1;

    const blockStart = index;
    quill.insertText(index, summaryLine, { bold: true }, 'user');
    index += summaryLine.length;
    quill.insertText(index, '\n', 'user');
    index += 1;

    quill.insertText(index, pageLine, 'user');
    index += pageLine.length;
    quill.insertText(index, '\n', 'user');
    index += 1;

    quill.insertText(index, timeLine, { italic: true }, 'user');
    index += timeLine.length;
    quill.insertText(index, '\n', 'user');
    index += 1;

    quill.insertText(index, '\n', 'user');
    index += 1;

    // Center-align all three lines of the block.
    quill.formatLine(blockStart, 3, 'align', 'center', 'user');

    quill.setSelection(index, 0, 'user');
    quill.focus();

    // Mark same-day so the next 🕐 stamp shortens correctly.
    _markStampedToday(entry.id);

    setStatus('📋 Logged session to notes!', 'ok');
    return;
  }

  // Fallback: append to journal textarea if no Quill found.
  const journalEl = document.getElementById('n-journal-new');
  if (journalEl) {
    const divider = '─'.repeat(40);
    const block =
      '\n' + divider + '\n' +
      summaryLine + '\n' +
      pageLine + '\n' +
      timeLine + '\n' +
      divider + '\n';
    journalEl.value += block;
    journalEl.dispatchEvent(new Event('input', { bubbles: true }));
    setStatus('📋 Logged session to journal!', 'ok');
    return;
  }

  setStatus('⚠️ No notes editor found to log to.', 'warn');
}


//
// One source of truth for the GitHub bar. On page load we rebuild the
// bar based on whether the user is in admin mode or visitor mode:
//
//   ADMIN MODE  → Save to GitHub, Load from GitHub, 🔓 Admin (logout)
//   VISITOR MODE → 👤 [name], 📧 Send my notes to Chris, 🔒 Admin (login)
//
// Admin login: click 🔒 Admin → password prompt → "Campbell 2026" unlocks.
// Session-scoped: closing the browser logs you out.
//
// Visitor name: prompted on first visit, stored on the visitor's device.
// Their notes get tagged with their name when emailed to Chris.

const ADMIN_PASSWORD = 'Campbell 2026';
const EMAILJS_PUBLIC_KEY  = '2duGE838Bx6BcJXTF';
const EMAILJS_SERVICE_ID  = 'service_ef1507g';
const EMAILJS_TEMPLATE_ID = 'template_275v5hl';

function isAdmin() {
  return sessionStorage.getItem('cbsg-admin') === 'true';
}

function getVisitorName() {
  return localStorage.getItem('cbsg-visitor-name') || '';
}

function setVisitorName(name) {
  if (name && name.trim()) {
    localStorage.setItem('cbsg-visitor-name', name.trim());
  }
}

function promptForVisitorName() {
  const existing = getVisitorName();
  if (existing) return existing;
  if (isAdmin()) return ''; // admin doesn't need to be prompted
  const name = window.prompt(
    "Welcome to the Campbell Family Bible Study!\n\n" +
    "What's your name? (so Chris knows who's sending notes)"
  );
  if (name && name.trim()) {
    setVisitorName(name);
    return name.trim();
  }
  return '';
}

function adminLogin() {
  const pw = window.prompt('Admin password:');
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem('cbsg-admin', 'true');
    document.body.classList.add('admin-mode');
    document.body.classList.remove('visitor-mode');
    rebuildTopBar();
    setStatus('🔓 Admin mode unlocked.', 'ok');
  } else if (pw !== null) {
    setStatus('❌ Wrong password.', 'error');
  }
}

function adminLogout() {
  sessionStorage.removeItem('cbsg-admin');
  document.body.classList.remove('admin-mode');
  document.body.classList.add('visitor-mode');
  rebuildTopBar();
  setStatus('🔒 Logged out of admin mode.', 'info');
}

function _loadEmailJsThen(callback) {
  if (typeof emailjs !== 'undefined') {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}
    callback();
    return;
  }
  // Wait up to 5 seconds for the EmailJS script to finish loading.
  let attempts = 0;
  const t = setInterval(() => {
    attempts++;
    if (typeof emailjs !== 'undefined') {
      clearInterval(t);
      try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}
      callback();
    } else if (attempts > 10) {
      clearInterval(t);
      setStatus('❌ Email service not loaded — try again in a moment.', 'error');
    }
  }, 500);
}

function sendVisitorNotesToChris() {
  let name = getVisitorName();
  if (!name) {
    name = promptForVisitorName();
    if (!name) { setStatus('⚠️ Please enter your name first.', 'warn'); return; }
  }

  // Gather all the visitor's notes for this page from localStorage,
  // and any others they've written across the site.
  const allNotes = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cbsg-')) continue;
    if (key === 'cbsg-gh-token') continue;
    if (key === 'cbsg-visitor-name') continue;
    if (key === 'cbsg-admin') continue;
    if (key.startsWith('cbsg-laststamp-')) continue;
    if (key.startsWith('cbsg-nav-')) continue;
    const val = localStorage.getItem(key);
    if (val && val.trim()) allNotes[key.replace('cbsg-', '')] = val;
  }

  if (Object.keys(allNotes).length === 0) {
    setStatus('⚠️ No notes to send yet — write something first.', 'warn');
    return;
  }

  // Build a plain-text bundle of every note, labeled.
  let body = '';
  for (const [k, v] of Object.entries(allNotes)) {
    body += '─────────────────────────────────\n';
    body += k + '\n';
    body += '─────────────────────────────────\n';
    // Strip HTML tags so the email is readable plain text.
    const plain = v.replace(/<\/p>/gi, '\n')
                   .replace(/<br\s*\/?>/gi, '\n')
                   .replace(/<[^>]+>/g, '')
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .trim();
    body += plain + '\n\n';
  }

  const pageName = document.title.replace(' — Campbell Bible Study', '').trim()
                 || window.location.pathname;

  setStatus('📡 Sending your notes to Chris...', 'info');

  _loadEmailJsThen(() => {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: name,
      from_name: name,
      from_email: '(visitor — no email)',
      page_name: pageName,
      page_url: window.location.href,
      message: body
    }).then(() => {
      setStatus('✅ Thank you, ' + name + '! Your notes were sent to Chris.', 'ok');
    }).catch((err) => {
      console.error('EmailJS error:', err);
      setStatus('❌ Could not send: ' + (err && err.text ? err.text : 'unknown error'), 'error');
    });
  });
}

function rebuildTopBar() {
  const bar = document.getElementById('github-bar');
  if (!bar) return;

  // Preserve the right-side version block if it exists.
  const rightBlock = bar.querySelector('.bar-right');

  // Clear and rebuild the left side.
  bar.innerHTML = '';

  const title = document.createElement('span');
  title.className = 'bar-title';
  title.textContent = 'Campbell Bible Study';
  bar.appendChild(title);

  const sep1 = document.createElement('span');
  sep1.className = 'bar-sep';
  sep1.textContent = '|';
  bar.appendChild(sep1);

  if (isAdmin()) {
    // ── ADMIN MODE ──
    const tokenInput = document.createElement('input');
    tokenInput.id = 'gh-token';
    tokenInput.type = 'password';
    tokenInput.placeholder = 'Paste GitHub token here (saved locally, never shared)';
    tokenInput.style.display = 'inline-block';
    const savedToken = localStorage.getItem('cbsg-gh-token');
    if (savedToken) tokenInput.value = savedToken;
    bar.appendChild(tokenInput);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save';
    saveBtn.textContent = 'Save to GitHub';
    saveBtn.onclick = saveToGitHub;
    bar.appendChild(saveBtn);

    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn-load';
    loadBtn.textContent = 'Load from GitHub';
    loadBtn.onclick = loadFromGitHub;
    bar.appendChild(loadBtn);

    const adminBtn = document.createElement('button');
    adminBtn.className = 'btn-admin';
    adminBtn.textContent = '🔓 Admin';
    adminBtn.title = 'Click to log out of admin mode';
    adminBtn.style.background = '#2a7a2a';
    adminBtn.style.color = '#fff';
    adminBtn.onclick = adminLogout;
    bar.appendChild(adminBtn);
  } else {
    // ── VISITOR MODE ──
    const visitorLabel = document.createElement('span');
    visitorLabel.className = 'bar-visitor';
    visitorLabel.style.color = 'rgba(255,255,255,0.85)';
    visitorLabel.style.padding = '0 8px';
    const name = getVisitorName();
    visitorLabel.textContent = name ? '👤 ' + name : '👤 (no name set)';
    visitorLabel.title = 'Click to change your name';
    visitorLabel.style.cursor = 'pointer';
    visitorLabel.onclick = () => {
      const newName = window.prompt('Your name:', getVisitorName());
      if (newName && newName.trim()) {
        setVisitorName(newName);
        rebuildTopBar();
      }
    };
    bar.appendChild(visitorLabel);

    const sendBtn = document.createElement('button');
    sendBtn.className = 'btn-send-notes';
    sendBtn.textContent = '📧 Send my notes to Chris';
    sendBtn.onclick = sendVisitorNotesToChris;
    bar.appendChild(sendBtn);

    const adminBtn = document.createElement('button');
    adminBtn.className = 'btn-admin';
    adminBtn.textContent = '🔒 Admin';
    adminBtn.title = 'Admin login (Chris only)';
    adminBtn.onclick = adminLogin;
    bar.appendChild(adminBtn);
  }

  // Status span (used by setStatus).
  const status = document.createElement('span');
  status.id = 'gh-status';
  bar.appendChild(status);

  // ── TIMER PILLS + LOG & STAMP (both modes) ──
  // Session timer pill (yellow), Total time pill (white), Log & Stamp btn.
  const timerWrap = document.createElement('div');
  timerWrap.id = 'bar-extras';
  timerWrap.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:8px;';

  const stored = _getStoredSeconds();

  const sessionPill = document.createElement('div');
  sessionPill.style.cssText =
    'display:flex;flex-direction:column;align-items:center;' +
    'background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);' +
    'border-radius:4px;padding:3px 10px;min-width:72px;';
  sessionPill.innerHTML =
    '<span style="font-size:9px;color:rgba(255,255,255,0.4);' +
      'text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Session</span>' +
    '<span id="bar-session-time" style="font-size:12px;color:#FFD700;' +
      'font-family:Arial,sans-serif;font-weight:bold;">0s</span>';
  timerWrap.appendChild(sessionPill);

  const totalPill = document.createElement('div');
  totalPill.style.cssText =
    'display:flex;flex-direction:column;align-items:center;' +
    'background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);' +
    'border-radius:4px;padding:3px 10px;min-width:72px;';
  totalPill.innerHTML =
    '<span style="font-size:9px;color:rgba(255,255,255,0.4);' +
      'text-transform:uppercase;letter-spacing:0.07em;font-family:Arial,sans-serif;">Total</span>' +
    '<span id="bar-total-time" style="font-size:12px;color:rgba(255,255,255,0.8);' +
      'font-family:Arial,sans-serif;font-weight:bold;">' + _formatDuration(stored) + '</span>';
  timerWrap.appendChild(totalPill);

  const logBtn = document.createElement('button');
  logBtn.type = 'button';
  logBtn.textContent = '📅 Log & Stamp';
  logBtn.title = 'Stamp current notes with session time';
  logBtn.style.cssText =
    'background:rgba(255,215,0,0.15);color:#FFD700;' +
    'border:1px solid rgba(255,215,0,0.4);border-radius:4px;' +
    'padding:4px 12px;font-size:11px;font-family:Arial,sans-serif;' +
    'font-weight:bold;cursor:pointer;white-space:nowrap;';
  logBtn.onclick = logAndStamp;
  timerWrap.appendChild(logBtn);

  bar.appendChild(timerWrap);

  // Re-append the right-side version block if it existed.
  if (rightBlock) bar.appendChild(rightBlock);
}

function initVisitorAdminBar() {
  // Set the right body class so any CSS targeting admin/visitor mode works.
  if (isAdmin()) {
    document.body.classList.add('admin-mode');
    document.body.classList.remove('visitor-mode');
  } else {
    document.body.classList.add('visitor-mode');
    document.body.classList.remove('admin-mode');
    // Prompt new visitors for their name on first load.
    if (!getVisitorName()) {
      // Defer slightly so the page has a chance to render first.
      setTimeout(promptForVisitorName, 400);
    }
  }
  rebuildTopBar();
}

// ── INIT ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initVisitorAdminBar();     // rebuild top bar based on admin/visitor state
  bootstrapQuillEditors();   // build canonical toolbars + register Quills
  loadNotes();               // populate from localStorage (Quill-aware)
  wireAutoSave();            // attach text-change listeners
  markActivePage();
  startStudyTimer();         // begin session timer (per-page tracking)
  wireTimerLifecycle();      // pause on tab hide, save on tab close
});
