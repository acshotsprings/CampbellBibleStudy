/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Sidebar Navigation Builder — v4.2 Collapsible Themes + Timestamp Button
   ============================================================ */

const NAV_STRUCTURE = [
  {
    type: 'section',
    label: 'Getting Started',
    collapsible: false,
    items: [
      { label: 'Introduction',   href: '/index.html' },
      { label: 'Thematic Index', href: '/index.html#index' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 1 — End Times',
    collapsible: true,
    key: 'theme1',
    items: [
      { label: 'Module 1 — Daniel\'s 70 Weeks',     href: '/theme1/module1.html' },
      { label: 'Module 2 — Israel in Prophecy',     href: '/theme1/module2.html' },
      { label: 'Module 3 — Day of the Lord',        href: '/theme1/module3.html' },
      { label: 'Module 4 — The Watchman',           href: '/theme1/module4.html' },
      { label: 'Module 5 — The New Covenant',       href: '/theme1/module5.html' },
      { label: 'Module 6 — The Rapture',            href: '/theme1/module6.html' },
      { label: 'Module 7 — The Antichrist',         href: '/theme1/module7.html' },
      { label: 'Module 8 — The Rebuilt Temple',     href: '/theme1/module8.html' },
      { label: 'Module 9 — Gog-Magog War',          href: '/theme1/module9.html' },
      { label: 'Module 10 — Signs of the Times',    href: '/theme1/module10.html' },
      { label: 'Module 11 — False Prophets',        href: '/theme1/module11.html' },
      { label: 'Module 12 — The Millennium',        href: '/theme1/module12.html' },
      { label: 'Module 13 — Second Coming',         href: '/theme1/module13.html' },
      { label: 'Module 14 — Matt 24 ↔ Revelation',  href: '/theme1/module14.html' },
      { label: 'Module 15 — Armageddon',            href: '/theme1/module15.html' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 2 — Biblical Calendar',
    collapsible: true,
    key: 'theme2',
    items: [
      { label: 'Theme 2 Overview',                  href: '/theme2/index.html' },
      { label: '↳ Module 1 — Calendar History',     href: '/theme2/module1.html', sub: true },
      { label: '↳ Module 2 — Calendar Timeline',    href: '/theme2/module2.html', sub: true },
      { label: '↳ Module 3 — Book of Jubilees',     href: '/theme2/module3.html', sub: true },
    ]
  },
  {
    type: 'section',
    label: 'Theme 3 — Judgment & Mercy',
    collapsible: true,
    key: 'theme3',
    items: [
      { label: 'Theme 3 Overview', href: '/theme3/index.html' },
    ]
  },
  {
    type: 'section',
    label: 'Themes 4–8',
    collapsible: true,
    key: 'themes48',
    items: [
      { label: 'Themes 4–8 (Coming Soon)', href: '/index.html#themes48' },
    ]
  },
  {
    type: 'section',
    label: 'My Study',
    collapsible: false,
    items: [
      { label: 'Sermon & Teaching Log',  href: '/sermons.html' },
      { label: 'Personal Journal',       href: '/journal.html' },
      { label: 'My Growing Convictions', href: '/convictions.html' },
    ]
  }
];

function buildSidebar(root) {
  root = root || '.';
  const base = '/CampbellBibleStudy';
  const currentPath = window.location.pathname;

  function isActiveSection(section) {
    if (!section.items) return false;
    return section.items.some(item => {
      const fullHref = base + item.href;
      return currentPath === fullHref ||
             currentPath === item.href ||
             currentPath.endsWith(item.href.replace(/^\//, ''));
    });
  }

  function isCollapsed(key) {
    const stored = localStorage.getItem('cbsg-nav-' + key);
    if (stored !== null) return stored === 'true';
    return true;
  }

  function setCollapsed(key, val) {
    localStorage.setItem('cbsg-nav-' + key, val ? 'true' : 'false');
  }

  // ── Build the top GitHub bar (includes timestamp button) ──
  const bar = document.getElementById('github-bar');
  if (bar) {
    // Only inject if the timestamp button isn't already present
    if (!document.getElementById('btn-log-time')) {
      const tsBtn = document.createElement('button');
      tsBtn.id        = 'btn-timestamp';
      tsBtn.className = 'btn-timestamp';
      tsBtn.title     = 'Insert timestamp at cursor in your notes';
      tsBtn.textContent = '🕐 Timestamp';
      tsBtn.setAttribute('onclick', 'insertTimestamp()');

      // Log Study Time button
      const logBtn = document.createElement('button');
      logBtn.id        = 'btn-log-time';
      logBtn.className = 'btn-timestamp';
      logBtn.title     = 'Insert study time summary at cursor in your notes';
      logBtn.textContent = '📚 Log Study Time';
      logBtn.setAttribute('onclick', 'insertStudyTime()');

      // Timer display (live clock)
      const timerSpan = document.createElement('span');
      timerSpan.id        = 'study-timer-display';
      timerSpan.className = 'study-timer-display';
      timerSpan.textContent = '⏱ 0m 0s';

      // Insert after the Load from GitHub button
      const loadBtn = bar.querySelector('.btn-load');
      if (loadBtn && loadBtn.nextSibling) {
        bar.insertBefore(tsBtn, loadBtn.nextSibling);
        bar.insertBefore(logBtn, tsBtn.nextSibling);
        bar.insertBefore(timerSpan, logBtn.nextSibling);
      } else {
        bar.appendChild(tsBtn);
        bar.appendChild(logBtn);
        bar.appendChild(timerSpan);
      }
    }
  }

  // ── Build sidebar HTML ──
  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 4, 2026</p>
    </div>
    <div id="sidebar-nav">
  `;

  NAV_STRUCTURE.forEach(section => {
    if (!section.collapsible) {
      html += `<div class="nav-section">${section.label}</div>`;
      section.items.forEach(item => {
        const fullHref = base + item.href;
        const active = currentPath === fullHref ||
                       currentPath === item.href ||
                       currentPath.endsWith(item.href.replace(/^\//, '')) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';
        html += `<a class="nav-item${sub}${active}" href="${root + item.href}">${item.label}</a>`;
      });
    } else {
      const key = section.key;
      const hasActivePage = isActiveSection(section);
      if (hasActivePage) setCollapsed(key, false);
      const collapsed = isCollapsed(key);

      html += `
        <div class="nav-section-collapsible" onclick="toggleNavSection('${key}')" id="nav-header-${key}">
          <span>${section.label}</span>
          <span class="nav-arrow ${collapsed && !hasActivePage ? '' : 'open'}" id="nav-arrow-${key}">▶</span>
        </div>
        <div class="nav-section-items ${collapsed && !hasActivePage ? 'collapsed' : ''}" id="nav-items-${key}">
      `;

      section.items.forEach(item => {
        const fullHref = base + item.href;
        const active = currentPath === fullHref ||
                       currentPath === item.href ||
                       currentPath.endsWith(item.href.replace(/^\//, '')) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';
        html += `<a class="nav-item${sub}${active}" href="${root + item.href}">${item.label}</a>`;
      });

      html += `</div>`;
    }
  });

  html += `</div>`;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;
}

function toggleNavSection(key) {
  const items = document.getElementById('nav-items-' + key);
  const arrow = document.getElementById('nav-arrow-' + key);
  if (!items) return;

  const isNowCollapsed = !items.classList.contains('collapsed');
  items.classList.toggle('collapsed', isNowCollapsed);
  arrow.classList.toggle('open', !isNowCollapsed);

  localStorage.setItem('cbsg-nav-' + key, isNowCollapsed ? 'true' : 'false');
}
