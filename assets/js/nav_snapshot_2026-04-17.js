/* =======================================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
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
  ];

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentPath = window.location.pathname;

  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 2, 2026</p>
    </div>
    <div id="sidebar-nav">
  `;

  nav.forEach(item => {
    if (item.type === 'header') return;
    if (item.type === 'section') {
      html += `<div class="nav-section">${item.label}</div>`;
      return;
    }

    // Determine if this link is the active page
    const isCurrent = currentPath.includes(item.page) ||
                      (item.page === currentFile);
    const activeClass = isCurrent ? ' active' : '';
    const subClass    = item.sub  ? ' sub'    : '';

    html += `<a class="nav-item${subClass}${activeClass}" href="${item.href}">${item.label}</a>`;
  });

  html += `</div>`;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;
}
