/* =======================================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
<<<<<<< HEAD
   Sidebar Navigation Builder
   Call: buildSidebar(root) where root is the path prefix
   e.g. buildSidebar('..') from inside theme1/
        buildSidebar('.')  from root index.html
   ======================================================================= */

function buildSidebar(root) {
  root = root || '.';

  const nav = [
    { type: 'header' },
    { type: 'section', label: 'Getting Started' },
    { type: 'link', label: 'Introduction',    href: root + '/index.html#intro',   page: root + '/index.html' },
    { type: 'link', label: 'Thematic Index',  href: root + '/index.html#index',   page: root + '/index.html' },

    { type: 'section', label: 'Theme 1 — End Times' },
    { type: 'link',  label: 'Module 1 — Daniel\'s 70 Weeks',              href: root + '/theme1/module1.html',  page: 'module1.html' },
    { type: 'link',  label: 'Module 2 — Israel in Prophecy',              href: root + '/theme1/module2.html',  page: 'module2.html' },
    { type: 'link',  label: 'Module 3 — Day of the Lord',                 href: root + '/theme1/module3.html',  page: 'module3.html' },
    { type: 'link',  label: 'Module 4 — The Watchman',                    href: root + '/theme1/module4.html',  page: 'module4.html' },
    { type: 'link',  label: 'Module 5 — The New Covenant',                href: root + '/theme1/module5.html',  page: 'module5.html' },
    { type: 'link',  label: 'Module 6 — The Rapture',                     href: root + '/theme1/module6.html',  page: 'module6.html' },
    { type: 'link',  label: 'Module 7 — The Antichrist',                  href: root + '/theme1/module7.html',  page: 'module7.html' },
    { type: 'link',  label: 'Module 8 — The Rebuilt Temple',              href: root + '/theme1/module8.html',  page: 'module8.html' },
    { type: 'link',  label: 'Module 9 — Gog-Magog War',                   href: root + '/theme1/module9.html',  page: 'module9.html' },
    { type: 'link',  label: 'Module 10 — Signs of the Times',             href: root + '/theme1/module10.html', page: 'module10.html' },
    { type: 'link',  label: 'Module 11 — False Prophets',                 href: root + '/theme1/module11.html', page: 'module11.html' },
    { type: 'link',  label: 'Module 12 — The Millennium',                 href: root + '/theme1/module12.html', page: 'module12.html' },
    { type: 'link',  label: 'Module 13 — Second Coming',                  href: root + '/theme1/module13.html', page: 'module13.html' },
    { type: 'link',  label: 'Module 14 — Matt 24 ↣ Revelation',           href: root + '/theme1/module14.html', page: 'module14.html' },
    { type: 'link',  label: 'Module 15 — Armageddon',                     href: root + '/theme1/module15.html', page: 'module15.html' },

    { type: 'section', label: 'Theme 2 — Biblical Calendar' },
    { type: 'link',  label: 'Theme 2 Overview',                           href: root + '/theme2/index.html',    page: 'theme2/index.html' },
    { type: 'link',  label: '⇧ Module 1 — Calendar History',              href: root + '/theme2/module1.html',  page: 'module1.html', sub: true },

    { type: 'section', label: 'Theme 3 — Judgment & Mercy' },
    { type: 'link',  label: 'Theme 3 Overview',                           href: root + '/theme3/index.html',    page: 'theme3/index.html' },

    { type: 'section', label: 'Themes 4–8' },
    { type: 'link',  label: 'Themes 4–8 (Coming Soon)',                   href: root + '/index.html#themes48',  page: 'themes48' },

    { type: 'section', label: 'My Study' },
    { type: 'link',  label: 'Sermon & Teaching Log',                      href: root + '/sermons.html',         page: 'sermons.html' },
    { type: 'link',  label: 'Personal Journal',                           href: root + '/journal.html',         page: 'journal.html' },
    { type: 'link',  label: 'My Growing Convictions',                     href: root + '/convictions.html',     page: 'convictions.html' },
    { type: 'link',  label: '🔢 Gematria Study', href: root + '/DeepDive-Gematria.html', page: 'DeepDive-Gematria.html', sub: true },
  ];

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
=======
   Sidebar Navigation Builder — v4.3 No-Jump + Completion + History
   ============================================================ */

const NAV_STRUCTURE = [
  {
    type: 'section',
    label: 'Getting Started',
    collapsible: false,
    items: [
      { label: 'Introduction',   href: 'index.html' },
      { label: 'Thematic Index', href: 'index.html#index' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 1 — End Times',
    collapsible: true,
    key: 'theme1',
    items: [
      { label: 'Module 1 — Daniel\'s 70 Weeks',     href: 'theme1/module1.html',  completable: true, completeKey: 'complete-t1m1'  },
      { label: 'Module 2 — Israel in Prophecy',     href: 'theme1/module2.html',  completable: true, completeKey: 'complete-t1m2'  },
      { label: 'Module 3 — Day of the Lord',        href: 'theme1/module3.html',  completable: true, completeKey: 'complete-t1m3'  },
      { label: 'Module 4 — The Watchman',           href: 'theme1/module4.html',  completable: true, completeKey: 'complete-t1m4'  },
      { label: 'Module 5 — The New Covenant',       href: 'theme1/module5.html',  completable: true, completeKey: 'complete-t1m5'  },
      { label: 'Module 6 — The Rapture',            href: 'theme1/module6.html',  completable: true, completeKey: 'complete-t1m6'  },
      { label: 'Module 7 — The Antichrist',         href: 'theme1/module7.html',  completable: true, completeKey: 'complete-t1m7'  },
      { label: 'Module 8 — The Rebuilt Temple',     href: 'theme1/module8.html',  completable: true, completeKey: 'complete-t1m8'  },
      { label: 'Module 9 — Gog-Magog War',          href: 'theme1/module9.html',  completable: true, completeKey: 'complete-t1m9'  },
      { label: 'Module 10 — Signs of the Times',    href: 'theme1/module10.html', completable: true, completeKey: 'complete-t1m10' },
      { label: 'Module 11 — False Prophets',        href: 'theme1/module11.html', completable: true, completeKey: 'complete-t1m11' },
      { label: 'Module 12 — The Millennium',        href: 'theme1/module12.html', completable: true, completeKey: 'complete-t1m12' },
      { label: 'Module 13 — Second Coming',         href: 'theme1/module13.html', completable: true, completeKey: 'complete-t1m13' },
      { label: 'Module 14 — Matt 24 ↔ Revelation',  href: 'theme1/module14.html', completable: true, completeKey: 'complete-t1m14' },
      { label: 'Module 15 — Armageddon',            href: 'theme1/module15.html', completable: true, completeKey: 'complete-t1m15' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 2 — Biblical Calendar',
    collapsible: true,
    key: 'theme2',
    items: [
      { label: 'Theme 2 Overview',               href: 'theme2/index.html' },
      { label: '↳ Module 1 — Calendar History',  href: 'theme2/module1.html', sub: true, completable: true, completeKey: 'complete-t2m1' },
      { label: '↳ Module 2 — Calendar Timeline', href: 'theme2/module2.html', sub: true, completable: true, completeKey: 'complete-t2m2' },
      { label: '↳ Module 3 — Book of Jubilees',  href: 'theme2/module3.html', sub: true, completable: true, completeKey: 'complete-t2m3' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 3 — Judgment & Mercy',
    collapsible: true,
    key: 'theme3',
    items: [
      { label: 'Theme 3 Overview', href: 'theme3/index.html' },
    ]
  },
  {
    type: 'section',
    label: 'Themes 4–8',
    collapsible: true,
    key: 'themes48',
    items: [
      { label: 'Themes 4–8 (Coming Soon)', href: 'index.html#index' },
    ]
  },
  {
    type: 'section',
    label: 'My Study',
    collapsible: false,
    items: [
      { label: 'Prophecy Checklist',     href: 'checklist.html'           },
      { label: 'Resource Library',        href: 'resources.html'           },
      { label: 'Sermon & Teaching Log',  href: 'sermons.html'             },
      { label: 'Personal Journal',       href: 'journal.html'             },
      { label: 'My Growing Convictions', href: 'convictions.html'         },
      { label: '📋 Save History',        href: 'history.html'             },
      { label: '🔬 Deep Dives',          href: 'DeepDives.html'           },
      { label: '🎧 Listening Notes',     href: 'listening-notes.html',    adminOnly: true },
    ]
  }
];

function isModuleComplete(key) {
  return localStorage.getItem('cbsg-' + key) === 'true';
}

function buildSidebar(root) {
  root = root || './';
  if (!root.endsWith('/')) root += '/';
  const base        = '/CampbellBibleStudy/';
>>>>>>> 67d3f9dfc9b418ded723ccfaff732854ae6baabb
  const currentPath = window.location.pathname;
  const sidebar     = document.getElementById('sidebar');
  if (!sidebar) return;

  // Save scroll position before rebuild to prevent jump
  const savedScrollTop = sidebar.scrollTop;

<<<<<<< HEAD
  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 2, 2026</p>
=======
  function isActiveSection(section) {
    if (!section.items) return false;
    return section.items.some(item => {
      const fullHref = base + item.href;
      return currentPath === fullHref ||
             currentPath.endsWith(item.href.split('/').pop());
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

  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: March 27, 2026</p>
>>>>>>> 67d3f9dfc9b418ded723ccfaff732854ae6baabb
    </div>
    <div id="sidebar-nav">
  `;

<<<<<<< HEAD
  nav.forEach(item => {
    if (item.type === 'header') return;
    if (item.type === 'section') {
      html += `<div class="nav-section">${item.label}</div>`;
      return;
=======
  const adminUnlocked = sessionStorage.getItem('cbsg-admin') === 'true';

  NAV_STRUCTURE.forEach(section => {
    if (!section.collapsible) {
      html += `<div class="nav-section">${section.label}</div>`;
      section.items.forEach(item => {
        if (item.adminOnly && !adminUnlocked) return;
        const fullHref = base + item.href;
        const active   = currentPath === fullHref ||
                         currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub      = item.sub ? ' sub' : '';
        html += `<a class="nav-item${sub}${active}" href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}</a>`;
      });
    } else {
      const key           = section.key;
      const hasActivePage = isActiveSection(section);
      if (hasActivePage) setCollapsed(key, false);
      const collapsed     = isCollapsed(key);

      const completable    = section.items.filter(i => i.completable);
      const completedCount = completable.filter(i => isModuleComplete(i.completeKey)).length;
      const allDone        = completable.length > 0 && completedCount === completable.length;
      const progressLabel  = completable.length > 0
        ? `<span style="font-size:9px;margin-left:6px;color:${allDone ? '#90EE90' : 'rgba(255,255,255,0.3)'};">${completedCount}/${completable.length}</span>`
        : '';

      html += `
        <div class="nav-section-collapsible" onclick="toggleNavSection('${key}')" id="nav-header-${key}">
          <span>${section.label}${progressLabel}</span>
          <span class="nav-arrow ${collapsed && !hasActivePage ? '' : 'open'}" id="nav-arrow-${key}">▶</span>
        </div>
        <div class="nav-section-items ${collapsed && !hasActivePage ? 'collapsed' : ''}" id="nav-items-${key}">
      `;

      section.items.forEach(item => {
        const fullHref  = base + item.href;
        const active    = currentPath === fullHref ||
                          currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub       = item.sub ? ' sub' : '';
        const done      = item.completable && isModuleComplete(item.completeKey);
        const doneStyle = done ? ' style="color:#90EE90;border-left-color:#90EE90;"' : '';
        const doneIcon  = done ? ' <span style="color:#90EE90;font-size:11px;">✓</span>' : '';
        html += `<a class="nav-item${sub}${active}"${doneStyle} href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}${doneIcon}</a>`;
      });

      html += `</div>`;
>>>>>>> 67d3f9dfc9b418ded723ccfaff732854ae6baabb
    }

    // Determine if this link is the active page
    const isCurrent = currentPath.includes(item.page) ||
                      (item.page === currentFile);
    const activeClass = isCurrent ? ' active' : '';
    const subClass    = item.sub  ? ' sub'    : '';

    html += `<a class="nav-item${subClass}${activeClass}" href="${item.href}">${item.label}</a>`;
  });

  html += `</div>`;

  // Restore scroll immediately — prevents any visible jump
  sidebar.innerHTML    = html;
  sidebar.scrollTop    = savedScrollTop;
}
<<<<<<< HEAD
=======

function toggleNavSection(key) {
  const items = document.getElementById('nav-items-' + key);
  const arrow = document.getElementById('nav-arrow-' + key);
  if (!items) return;
  const isNowCollapsed = !items.classList.contains('collapsed');
  items.classList.toggle('collapsed', isNowCollapsed);
  arrow.classList.toggle('open', !isNowCollapsed);
  localStorage.setItem('cbsg-nav-' + key, isNowCollapsed ? 'true' : 'false');
}
>>>>>>> 67d3f9dfc9b418ded723ccfaff732854ae6baabb
