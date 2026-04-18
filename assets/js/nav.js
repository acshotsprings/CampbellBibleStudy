/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Sidebar Navigation Builder — v5.2 (2026-04-18)
   Color theming (inline !important) + My Study collapsible +
   Deep Dives sub-collapsible. v5.2 adds !important to beat
   style.css .nav-item.active border-left-color override.
   ============================================================ */

/* ---- COLOR PALETTE ------------------------------------------
   Each theme gets a strong accent color for its header, and a
   lighter-shade accent for its module items. My Study items
   each get their own distinct color for quick scanning.
   ------------------------------------------------------------ */
const NAV_COLORS = {
  theme1:    { header: '#2E75B6', item: 'rgba(46,117,182,0.55)' },   // blue
  theme2:    { header: '#4a7c59', item: 'rgba(74,124,89,0.55)'  },   // green
  theme3:    { header: '#7E57C2', item: 'rgba(126,87,194,0.55)' },   // purple
  themes48:  { header: '#888888', item: 'rgba(136,136,136,0.55)' },  // gray
  mystudy:   { header: '#FFD700', item: null                    },   // gold header; items use per-item colors below
  getstarted:{ header: 'rgba(255,255,255,0.4)', item: null      },
};

const MYSTUDY_ITEM_COLORS = {
  'mystudy-checklist':   '#E57373',  // red
  'mystudy-resources':   '#64B5F6',  // blue
  'mystudy-sermons':     '#FFB74D',  // orange
  'mystudy-journal':     '#81C784',  // green
  'mystudy-convictions': '#BA68C8',  // purple
  'mystudy-history':     '#4DB6AC',  // teal
  'mystudy-deepdives':   '#FFD54F',  // gold
  'mystudy-gematria':    '#F48FB1',  // pink
  'mystudy-listening':   '#A1887F',  // brown
};

const NAV_STRUCTURE = [
  {
    type: 'section',
    label: 'Getting Started',
    collapsible: false,
    colorKey: 'getstarted',
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
    colorKey: 'theme1',
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
    colorKey: 'theme2',
    items: [
      { label: 'Theme 2 Overview',               href: 'theme2/index.html' },
      { label: '↳ Module 1 — Calendar History',  href: 'theme2/module1.html', sub: true, completable: true, completeKey: 'complete-t2m1' },
      { label: '↳ Module 2 — Calendar Timeline', href: 'theme2/module2.html', sub: true, completable: true, completeKey: 'complete-t2m2' },
      { label: '↳ Module 3 — Book of Jubilees',  href: 'theme2/module3.html', sub: true, completable: true, completeKey: 'complete-t2m3' },
      { label: '↳ Module 4 — Feast of Tabernacles',  href: 'theme2/module4.html', sub: true, completable: true, completeKey: 'complete-t2m4' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 3 — Judgment & Mercy',
    collapsible: true,
    key: 'theme3',
    colorKey: 'theme3',
    items: [
      { label: 'Theme 3 Overview', href: 'theme3/index.html' },
    ]
  },
  {
    type: 'section',
    label: 'Themes 4–8',
    collapsible: true,
    key: 'themes48',
    colorKey: 'themes48',
    items: [
      { label: 'Themes 4–8 (Coming Soon)', href: 'index.html#index' },
    ]
  },
  {
    type: 'section',
    label: 'My Study',
    collapsible: true,
    key: 'mystudy',
    colorKey: 'mystudy',
    items: [
      { label: '📋 Prophecy Checklist',     href: 'checklist.html',     itemColor: 'mystudy-checklist'   },
      { label: '📚 Resource Library',       href: 'resources.html',     itemColor: 'mystudy-resources'   },
      { label: '🎤 Sermon & Teaching Log',  href: 'sermons.html',       itemColor: 'mystudy-sermons'     },
      { label: '📔 Personal Journal',       href: 'journal.html',       itemColor: 'mystudy-journal'     },
      { label: '✝️ My Growing Convictions', href: 'convictions.html',   itemColor: 'mystudy-convictions' },
      { label: '💾 Save History',           href: 'history.html',       itemColor: 'mystudy-history'     },
      { label: '🔬 Deep Dives',             href: 'DeepDives.html',     itemColor: 'mystudy-deepdives', hasSubCollapse: true, subKey: 'deepdives' },
      { label: '↳ Gematria (Hebrew/Greek)', href: 'DeepDive-Gematria.html', sub: true, underSubKey: 'deepdives', itemColor: 'mystudy-gematria' },
      { label: '🎧 Listening Notes',        href: 'listening-notes.html', adminOnly: true, itemColor: 'mystudy-listening' },
    ]
  }
];

function isModuleComplete(key) {
  return localStorage.getItem('cbsg-' + key) === 'true';
}

/* Resolve the inline border-left color for an item. Completed items
   override with green. Returns a CSS value (e.g. "3px solid #E57373 !important")
   or empty string if no color is set. !important is required because
   style.css .nav-item.active sets border-left-color and would otherwise
   win against a shorthand. */
function navItemBorder(item, sectionColorKey, done) {
  if (done) return '3px solid #90EE90 !important';
  if (item.itemColor && MYSTUDY_ITEM_COLORS[item.itemColor]) {
    return '3px solid ' + MYSTUDY_ITEM_COLORS[item.itemColor] + ' !important';
  }
  const pal = NAV_COLORS[sectionColorKey];
  if (pal && pal.item) return '3px solid ' + pal.item + ' !important';
  return '';
}

function buildSidebar(root) {
  root = root || './';
  if (!root.endsWith('/')) root += '/';
  const base        = '/CampbellBibleStudy/';
  const currentPath = window.location.pathname;
  const sidebar     = document.getElementById('sidebar');
  if (!sidebar) return;

  // Save scroll position before rebuild to prevent jump
  const savedScrollTop = sidebar.scrollTop;

  function isActiveSection(section) {
    if (!section.items) return false;
    return section.items.some(item => {
      const fullHref = base + item.href;
      return currentPath === fullHref || currentPath.endsWith('/' + item.href);
    });
  }

  function isCollapsed(key) {
    const stored = localStorage.getItem('cbsg-nav-' + key);
    if (stored !== null) return stored === 'true';
    return true;
  }

  function isSubCollapsed(key) {
    // Sub-collapsibles default to COLLAPSED on first load
    const stored = localStorage.getItem('cbsg-nav-sub-' + key);
    if (stored !== null) return stored === 'true';
    return true;
  }

  function setCollapsed(key, val) {
    localStorage.setItem('cbsg-nav-' + key, val ? 'true' : 'false');
  }

  /* Render a single nav item <a>. `extraStyle` is any additional inline
     CSS (e.g. flex:1 for sub-collapse rows). */
  function renderItem(item, sectionColorKey, extraStyle) {
    const fullHref  = base + item.href;
    const active    = currentPath === fullHref || currentPath.endsWith('/' + item.href) ? ' active' : '';
    const subCls    = item.sub ? ' sub' : '';
    const done      = item.completable && isModuleComplete(item.completeKey);
    const border    = navItemBorder(item, sectionColorKey, done);
    const doneColor = done ? 'color:#90EE90;' : '';
    const doneIcon  = done ? ' <span style="color:#90EE90;font-size:11px;">✓</span>' : '';
    const styleBits = [];
    if (border)    styleBits.push('border-left:' + border);
    if (doneColor) styleBits.push(doneColor);
    if (extraStyle) styleBits.push(extraStyle);
    const styleAttr = styleBits.length ? ` style="${styleBits.join(';')}"` : '';
    return `<a class="nav-item${subCls}${active}"${styleAttr} href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}${doneIcon}</a>`;
  }

  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 18, 2026</p>
    </div>
    <div id="sidebar-nav">
  `;

  const adminUnlocked = sessionStorage.getItem('cbsg-admin') === 'true';

  NAV_STRUCTURE.forEach(section => {
    const palette   = NAV_COLORS[section.colorKey] || {};
    const headerBd  = palette.header ? `border-left:4px solid ${palette.header} !important;padding-left:10px !important;` : '';

    if (!section.collapsible) {
      const nonStyle = headerBd ? ` style="${headerBd}"` : '';
      html += `<div class="nav-section"${nonStyle}>${section.label}</div>`;
      section.items.forEach(item => {
        if (item.adminOnly && !adminUnlocked) return;
        html += renderItem(item, section.colorKey, '');
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

      const headerStyle = headerBd ? ` style="${headerBd}"` : '';

      html += `
        <div class="nav-section-collapsible"${headerStyle} onclick="toggleNavSection('${key}')" id="nav-header-${key}">
          <span>${section.label}${progressLabel}</span>
          <span class="nav-arrow ${collapsed && !hasActivePage ? '' : 'open'}" id="nav-arrow-${key}">▶</span>
        </div>
        <div class="nav-section-items ${collapsed && !hasActivePage ? 'collapsed' : ''}" id="nav-items-${key}">
      `;

      // Render items, honoring nested sub-collapsibles (e.g. Deep Dives → Gematria)
      let i = 0;
      while (i < section.items.length) {
        const item = section.items[i];
        if (item.adminOnly && !adminUnlocked) { i++; continue; }

        if (item.hasSubCollapse) {
          const subKey       = item.subKey;
          const subCollapsed = isSubCollapsed(subKey);
          html += `
            <div style="display:flex;align-items:center;gap:4px;">
              ${renderItem(item, section.colorKey, 'flex:1')}
              <span onclick="event.stopPropagation();toggleNavSubSection('${subKey}')"
                    id="nav-sub-arrow-${subKey}"
                    style="cursor:pointer;padding:4px 8px;font-size:10px;color:${subCollapsed ? 'rgba(255,255,255,0.5)' : '#FFD700'};background:rgba(255,255,255,0.05);border-radius:3px;user-select:none;transition:transform 0.2s;display:inline-block;transform:rotate(${subCollapsed ? '0' : '90'}deg);">▶</span>
            </div>
            <div id="nav-sub-items-${subKey}" style="display:${subCollapsed ? 'none' : 'block'};">
          `;
          i++;
          while (i < section.items.length && section.items[i].underSubKey === subKey) {
            const sItem = section.items[i];
            if (sItem.adminOnly && !adminUnlocked) { i++; continue; }
            html += renderItem(sItem, section.colorKey, '');
            i++;
          }
          html += `</div>`;
        } else {
          html += renderItem(item, section.colorKey, '');
          i++;
        }
      }

      html += `</div>`;
    }
  });

  html += `</div>`;

  // Restore scroll immediately — prevents any visible jump
  sidebar.innerHTML = html;
  sidebar.scrollTop = savedScrollTop;
}

function toggleNavSection(key) {
  const items = document.getElementById('nav-items-' + key);
  const arrow = document.getElementById('nav-arrow-' + key);
  if (!items) return;
  const isNowCollapsed = !items.classList.contains('collapsed');
  items.classList.toggle('collapsed', isNowCollapsed);
  if (arrow) arrow.classList.toggle('open', !isNowCollapsed);
  localStorage.setItem('cbsg-nav-' + key, isNowCollapsed ? 'true' : 'false');
}

function toggleNavSubSection(subKey) {
  const items = document.getElementById('nav-sub-items-' + subKey);
  const arrow = document.getElementById('nav-sub-arrow-' + subKey);
  if (!items) return;
  const isNowHidden = items.style.display !== 'none';
  items.style.display = isNowHidden ? 'none' : 'block';
  if (arrow) {
    arrow.style.transform = isNowHidden ? 'rotate(0deg)' : 'rotate(90deg)';
    arrow.style.color     = isNowHidden ? 'rgba(255,255,255,0.5)' : '#FFD700';
  }
  localStorage.setItem('cbsg-nav-sub-' + subKey, isNowHidden ? 'true' : 'false');
}
