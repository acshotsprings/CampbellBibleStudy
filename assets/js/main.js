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
  ['cbsg-timestamp'],   // custom 🕐 button — handler wired below
  ['clean']
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
        toolbar: {
          container: CBSG_TOOLBAR,
          handlers: {
            'cbsg-timestamp': function() { insertTimestamp(); }
          }
        }
      }
    });

    // 6. Decorate the custom timestamp button so it actually shows 🕐.
    //    Quill renders unknown toolbar entries as bare buttons; we find
    //    it by class on whichever toolbar Quill just inserted next to
    //    our host element.
    const toolbarEl = parent.querySelector('.ql-toolbar');
    const tsBtn = toolbarEl ? toolbarEl.querySelector('.ql-cbsg-timestamp') : null;
    if (tsBtn) {
      tsBtn.innerHTML = '🕐';
      tsBtn.setAttribute('title', 'Insert timestamp');
      tsBtn.setAttribute('aria-label', 'Insert timestamp');
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

  // Make sure we start on a new line.
  let index = quill.getSelection(true) ? quill.getSelection(true).index : quill.getLength();
  const before = index > 0 ? quill.getText(index - 1, 1) : '\n';
  if (before !== '\n') {
    quill.insertText(index, '\n', 'user');
    index += 1;
  }

  // Build the stamp as raw HTML so the divider + heading land as a real
  // block in Quill's content. Same-day stamps get a thinner border and
  // omit the date line.
  const date = _formatDate(realNow);
  const time = _formatTime(realNow);

  let html;
  if (sameDay) {
    html =
      '<p><br></p>' +
      '<p style="border-top:1px dashed #888;margin:6px 0 4px 0;padding-top:4px;">' +
        '<strong>' + time + '</strong>' +
      '</p>' +
      '<p><br></p>';
  } else {
    html =
      '<p><br></p>' +
      '<p style="border-top:2px solid #444;border-bottom:2px solid #444;margin:10px 0 6px 0;padding:6px 0;text-align:center;">' +
        '<strong>' + date + ' &nbsp;·&nbsp; ' + time + '</strong>' +
      '</p>' +
      '<p><br></p>';
  }

  // Use Quill's clipboard to convert HTML → Delta and insert at cursor.
  const delta = quill.clipboard.convert(html);
  quill.updateContents(
    new (window.Quill.imports.delta)()
      .retain(index)
      .concat(delta),
    'user'
  );

  // Move the cursor to the end of what we just inserted.
  const newIndex = index + delta.length();
  quill.setSelection(newIndex, 0, 'user');
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

// ── INIT ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  bootstrapQuillEditors();   // build canonical toolbars + register Quills
  loadNotes();               // populate from localStorage (Quill-aware)
  wireAutoSave();            // attach text-change listeners
  markActivePage();
});
