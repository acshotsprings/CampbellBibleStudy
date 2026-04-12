/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Sidebar Navigation Builder — v7.0 Full Site Audit
   - ALL pages from Drive + live site accounted for
   - completable + completeKey on every module
   - Deep Dive sub-pages linked
   - Checklist, Resources, Listening Notes added
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
      { label: 'Module 1 — Daniel\'s 70 Weeks',     href: '/theme1/module1.html',  completable: true, completeKey: 'complete-t1m1'  },
      { label: 'Module 2 — Israel in Prophecy',     href: '/theme1/module2.html',  completable: true, completeKey: 'complete-t1m2'  },
      { label: 'Module 3 — Day of the Lord',        href: '/theme1/module3.html',  completable: true, completeKey: 'complete-t1m3'  },
      { label: 'Module 4 — The Watchman',           href: '/theme1/module4.html',  completable: true, completeKey: 'complete-t1m4'  },
      { label: 'Module 5 — The New Covenant',       href: '/theme1/module5.html',  completable: true, completeKey: 'complete-t1m5'  },
      { label: 'Module 6 — The Rapture',            href: '/theme1/module6.html',  completable: true, completeKey: 'complete-t1m6'  },
      { label: 'Module 7 — The Antichrist',         href: '/theme1/module7.html',  completable: true, completeKey: 'complete-t1m7'  },
      { label: 'Module 8 — The Rebuilt Temple',     href: '/theme1/module8.html',  completable: true, completeKey: 'complete-t1m8'  },
      { label: 'Module 9 — Gog-Magog War',          href: '/theme1/module9.html',  completable: true, completeKey: 'complete-t1m9'  },
      { label: 'Module 10 — Signs of the Times',    href: '/theme1/module10.html', completable: true, completeKey: 'complete-t1m10' },
      { label: 'Module 11 — False Prophets',        href: '/theme1/module11.html', completable: true, completeKey: 'complete-t1m11' },
      { label: 'Module 12 — The Millennium',        href: '/theme1/module12.html', completable: true, completeKey: 'complete-t1m12' },
      { label: 'Module 13 — Second Coming',         href: '/theme1/module13.html', completable: true, completeKey: 'complete-t1m13' },
      { label: 'Module 14 — Matt 24 ↔ Revelation',  href: '/theme1/module14.html', completable: true, completeKey: 'complete-t1m14' },
      { label: 'Module 15 — Armageddon',            href: '/theme1/module15.html', completable: true, completeKey: 'complete-t1m15' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 2 — Biblical Calendar',
    collapsible: true,
    key: 'theme2',
    items: [
      { label: 'Theme 2 Overview',                                       href: '/theme2/index.html' },
      { label: '↳ Module 1 — Calendar History',                          href: '/theme2/module1.html', sub: true, completable: true, completeKey: 'complete-t2m1' },
      { label: '↳ Module 2 — Israel in Prophecy',                        href: '/theme2/module2.html', sub: true, completable: true, completeKey: 'complete-t2m2' },
      { label: '↳ Module 3 — The Book of Jubilees',                      href: '/theme2/module3.html', sub: true, completable: true, completeKey: 'complete-t2m3' },
      { label: '↳ Module 4 — Feast of Tabernacles & Dead Sea Scrolls',   href: '/theme2/module4.html', sub: true, completable: true, completeKey: 'complete-t2m4' },
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
    label: 'Deep Dive Studies',
    collapsible: true,
    key: 'deepdives',
    items: [
      { label: 'Deep Dives Index',                      href: '/DeepDives.html' },
      { label: '↳ The Willow in Scripture',              href: '/DeepDive-Willow.html',    sub: true },
      { label: '↳ Daniel\'s Weeks (H7620)',              href: '/DeepDive-Shabua.html',     sub: true },
      { label: '↳ Prophetic Calendars',                  href: '/DeepDive-Calendars.html',  sub: true },
    ]
  },
  {
    type: 'section',
    label: 'My Study',
    collapsible: false,
    items: [
      { label: 'Sermon & Teaching Log',     href: '/sermons.html' },
      { label: 'Listening Notes',           href: '/listening-notes.html' },
      { label: 'Personal Journal',          href: '/journal.html' },
      { label: 'My Growing Convictions',    href: '/convictions.html' },
      { label: 'Current Events & Prophecy', href: '/current-events.html' },
      { label: 'Study Checklist',           href: '/checklist.html' },
      { label: 'Reference Library',         href: '/resources.html' },
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
      <p id="sidebar-version">Version: April 12, 2026</p>
    </div>
    <div id="sidebar-nav">
  `;

  NAV_STRUCTURE.forEach(section => {
    if (!section.collapsible) {
      html += `<div class="nav-section">${section.label}</div>`;
      section.items.forEach(item => {
        const fullHref = base + item.href;
        const active = currentPath === fullHref ||
                       currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';

        // Completion checkmark for sidebar
        let check = '';
        if (item.completable && item.completeKey) {
          const done = localStorage.getItem('cbsg-' + item.completeKey) === 'true';
          check = done ? ' ✅' : '';
        }

        html += `<a class="nav-item${sub}${active}" href="${root + item.href}">${item.label}${check}</a>`;
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
                       currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';

        // Completion checkmark for sidebar
        let check = '';
        if (item.completable && item.completeKey) {
          const done = localStorage.getItem('cbsg-' + item.completeKey) === 'true';
          check = done ? ' ✅' : '';
        }

        html += `<a class="nav-item${sub}${active}" href="${root + item.href}">${item.label}${check}</a>`;
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

/* ── MOBILE HAMBURGER ──────────────────────────────────── */

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('nav-item') && window.innerWidth <= 768) {
    closeSidebar();
  }
});
