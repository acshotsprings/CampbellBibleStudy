/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Shared JavaScript — v2.0 Multi-Page
   ============================================================ */

// ── GITHUB SAVE ───────────────────────────────────────────

async function saveToGitHub() {
  const token = document.getElementById('gh-token').value.trim();
  if (!token) {
    setStatus('⚠️ Paste your GitHub token first.', 'warn');
    return;
  }

  // Save token locally so user doesn't have to re-enter
  localStorage.setItem('cbsg-gh-token', token);

  // Save all notes on this page before uploading
  saveAllNotes();

  const owner = 'acshotsprings';
  const repo  = 'CampbellBibleStudy';

  // Determine the file path from the current URL
  // e.g. /theme1/module1.html → theme1/module1.html
  const rawPath = window.location.pathname.replace(/^\/CampbellBibleStudy\//, '');
  const filePath = rawPath || 'index.html';

  setStatus('📡 Fetching current file SHA...', 'info');

  try {
    // GET current file to retrieve SHA
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
    );

    if (!getRes.ok) {
      setStatus(`❌ Could not fetch file (${getRes.status}). Check token & path.`, 'error');
      return;
    }

    const fileData = await getRes.json();
    const sha = fileData.sha;

    // Encode page HTML as base64
    const html    = document.documentElement.outerHTML;
    const encoded = btoa(unescape(encodeURIComponent(html)));

    setStatus('💾 Saving to GitHub...', 'info');

    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update ${filePath} — ${new Date().toLocaleDateString()}`,
          content: encoded,
          sha: sha
        })
      }
    );

    if (putRes.ok) {
      setStatus('✅ Saved! Changes live in ~30 seconds.', 'ok');
      updateVersionTimestamp();
    } else {
      const err = await putRes.json();
      setStatus(`❌ Save failed: ${err.message}`, 'error');
    }

  } catch (e) {
    setStatus(`❌ Error: ${e.message}`, 'error');
  }
}

function setStatus(msg, type) {
  const el = document.getElementById('gh-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'ok'   ? '#90EE90'
                 : type === 'error' ? '#FF8888'
                 : type === 'warn'  ? '#FFD700'
                 : 'rgba(255,255,255,0.7)';
}

function updateVersionTimestamp() {
  const now = new Date();
  const label = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const vEl = document.getElementById('gh-bar-version');
  if (vEl) vEl.textContent = 'Version: ' + label;
  const sEl = document.getElementById('sidebar-version');
  if (sEl) sEl.textContent = 'Version: ' + label;
}

// ── LOCAL STORAGE NOTES ───────────────────────────────────

// Each page declares its own noteIds array before including this script.
// Falls back to empty array if not defined.

function saveAllNotes() {
  const ids = window.PAGE_NOTE_IDS || [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('cbsg-' + id, el.value);
  });
}

function loadNotes() {
  const ids = window.PAGE_NOTE_IDS || [];
  ids.forEach(id => {
    const el  = document.getElementById(id);
    const val = localStorage.getItem('cbsg-' + id);
    if (el && val) el.value = val;
  });
}

function autoSaveNote(id) {
  const el = document.getElementById(id);
  if (el) localStorage.setItem('cbsg-' + id, el.value);
}

// Wire up auto-save on all textareas/inputs that have data-noteid
function wireAutoSave() {
  const ids = window.PAGE_NOTE_IDS || [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => autoSaveNote(id));
    }
  });

  // Restore saved GitHub token
  const savedToken = localStorage.getItem('cbsg-gh-token');
  if (savedToken) {
    const tokenEl = document.getElementById('gh-token');
    if (tokenEl) tokenEl.value = savedToken;
  }
}

// ── SIDEBAR ACTIVE STATE ──────────────────────────────────

function markActivePage() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\.\.\//, '/').replace(/^\.\//, '/'))) {
      item.classList.add('active');
    }
  });
}

// ── JOURNAL TIMESTAMP ─────────────────────────────────────

function insertTimestamp() {
  const el = document.getElementById('journal-new');
  if (!el) return;
  const now   = new Date();
  const label = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const stamp = `\n--- ${label} ---\n`;
  el.value += stamp;
  el.focus();
  el.scrollTop = el.scrollHeight;
}

// ── INIT ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  wireAutoSave();
  markActivePage();
});
