/* ============================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Sidebar Navigation Builder — v5.15 (2026-05-12)

   v5.15: Added Chapters 24 (David & Friendship), 25 (David &
   Israel's Enemies), and 26 (The Strange Death Stories) to
   both NAV_STRUCTURE and READING_CHAIN. All three completable
   with the standard complete-david-NN key pattern. Ch 26
   closes the 26-chapter Life of David encyclopedia.

   Companion change in main.js: COMPLETION_KEYS gains
   complete-david-24, complete-david-25, complete-david-26.

   v5.14: Added Chapter 22 (Kingdom of David as Type) and
   Chapter 23 (David & Prayer) to both NAV_STRUCTURE and
   READING_CHAIN. Both completable with the standard
   complete-david-NN key pattern.

   Companion change in main.js: COMPLETION_KEYS gains
   complete-david-22 and complete-david-23 entries.

   v5.13: Added Chapters 19 (David vs. Saul), 20 (David &
   Repentance), and 21 (David & Worship) to both NAV_STRUCTURE
   and READING_CHAIN. All three are completable with the standard
   complete-david-NN key pattern. Header version comment had
   drifted — Chs 19 and 20 were already present in the file from
   prior sessions without a version bump; this entry consolidates
   the accounting and brings the header in sync with reality.

   Companion change in main.js: COMPLETION_KEYS gains
   complete-david-21 entry.

   v5.12: Added Chapter 18 (The Cave Years) to both NAV_STRUCTURE
   (David sub-tree) and READING_CHAIN (between Ch 17 and Appendix
   A). Added completable: true + completeKey to all 18 David
   chapters (Ch 01-18). Appendices remain non-completable per
   user preference (they're reference, not study).

   Companion change in main.js: COMPLETION_KEYS gained Theme 3
   M4/M5 (previously missing) plus 18 David chapter entries.

   v5.11: Site-wide prev/next navigation. Defines an explicit
   READING_CHAIN of 50 study pages (Themes 1-3 + Characters
   library) in canonical reading order. injectPrevNext() locates
   the current page in the chain and appends a prominent
   prev/next bar inside #main. Each study page calls
   injectPrevNext() once after buildSidebar(). The David chapter
   pages had their own bottom <nav class="chapter-nav"> block
   removed in favor of this unified version. Themes 4-8 overview
   pages and all My Study / Current Events / Deep Dive pages are
   intentionally NOT in the chain.

   v5.10: First-visit nav state is fully collapsed. A persistent
   flag 'cbsg-nav-visited' is written on first sidebar build;
   while absent, all sections render closed and the usual
   "auto-open the section containing the active page" override
   is suppressed for that single load. On every subsequent page
   load, behavior is unchanged from v5.9 (sections remember the
   visitor's last expand/collapse choice; the section containing
   the current page auto-opens if not already remembered open).

   v5.9: Added new top-level "📖 Characters in Scripture" section
   between "Themes 4–8" and "🌍 Current Events". Two-level nested:
   parent "Characters in Scripture" → "The Life of David" (with
   hasSubCollapse) → 17 chapters + 4 appendices as sub-items.
   Noah / Joseph / Ruth are placeholder character cards on the
   characters.html landing page; not in nav until pages exist.
   Removed "✝️ My Growing Convictions" from My Study (page still
   exists at convictions.html, just not linked from sidebar).

   v5.8: Added new top-level "🌍 Current Events" section between
   "Themes 4–8" and "My Study". Red/amber color palette (header
   #E57373 / item #F4A6A6) to signal urgency/watchfulness —
   distinct from existing theme colors. Contains a single
   "Current Events Tracker" item pointing to current-events.html.
   Uses existing collapsible plumbing (no buildSidebar changes).

   v5.7: Personal Journal is now a collapsible subsection.
   Grouped under it are the personal/reflective studies:
     ⭐ Hearing God's Voice (migrated from Deep Dives — this
        is Chris's core-priority living spiritual study, more
        personal-reflective than academic-analytical)
     ⚖️ Gematria Skepticism (new — personal stance page on
        the Troy Brewer framework, built to live alongside
        but separate from the Deep Dive on Gematria itself)

   Deep Dives is now 4 items (Hearing God's Voice removed):
     1. Prophetic Calendars
     2. H7620 — What Does "Weeks" Mean in Daniel 9?
     3. The Willow in Scripture
     4. Gematria (Hebrew/Greek)

   Rationale: Hearing God's Voice is spiritual practice, not
   topical study. Gematria Skepticism is personal conviction,
   not academic analysis. Both fit naturally with Journal
   (personal-reflective content) rather than Deep Dives
   (topical-analytical content).

   v5.6: Added ⭐ Hearing God's Voice as a starred sub-item
   under Deep Dives. (Now migrated in v5.7.)

   v5.5: Deep Dives collapsible lists all live Deep Dive
   pages as sub-items. "Coming Soon" dives on DeepDives.html
   (Hailstones, Gog-Magog, Abomination of Desolation) are
   NOT listed here until they have dedicated pages built.

   All other v5.4/v5.5/v5.6 behavior preserved: colored text
   (no stripes), My Study collapsible, admin gating, etc.
   ============================================================ */

/* ---- COLOR PALETTE ------------------------------------------
   Each theme has a text color for its module items. My Study
   items each get their own distinct color for quick scanning.
   ------------------------------------------------------------ */
const NAV_COLORS = {
  theme1:    { header: '#2E75B6', item: '#6BA5D9' },   // blue
  theme2:    { header: '#4a7c59', item: '#7BB593' },   // green
  theme3:    { header: '#7E57C2', item: '#A389D4' },   // purple
  themes48:  { header: '#888888', item: '#AAAAAA' },   // gray
  characters: { header: '#C8A800', item: '#D9B838' },  // warm gold — figures of scripture (v5.9)
  mystudy:   { header: '#FFD700', item: null        }, // gold header; items use per-item colors below
  getstarted:{ header: 'rgba(255,255,255,0.4)', item: null },
  currentevents: { header: '#E57373', item: '#F4A6A6' }, // red/amber — urgency/watchfulness (v5.8)
};

const MYSTUDY_ITEM_COLORS = {
  'mystudy-checklist':   '#E57373',  // red
  'mystudy-resources':   '#64B5F6',  // blue
  'mystudy-sermons':     '#FFB74D',  // orange
  'mystudy-journal':     '#81C784',  // green
  'mystudy-convictions': '#BA68C8',  // purple
  'mystudy-history':     '#4DB6AC',  // teal
  'mystudy-deepdives':   '#FFD54F',  // gold
  'mystudy-hearing':     '#FFB300',  // deep amber (starred — stands out)
  'mystudy-gematria':    '#F48FB1',  // pink (Deep Dive — affirmative exploration)
  'mystudy-skepticism':  '#C9A227',  // warm gold (stance page — discerning counterweight)
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
      { label: '↳ Module 2 — Israel in Prophecy', href: 'theme2/module2.html', sub: true, completable: true, completeKey: 'complete-t2m2' },
      { label: '↳ Module 3 — Book of Jubilees',  href: 'theme2/module3.html', sub: true, completable: true, completeKey: 'complete-t2m3' },
      { label: '↳ Module 4 — Feast of Tabernacles',  href: 'theme2/module4.html', sub: true, completable: true, completeKey: 'complete-t2m4' },
      { label: '↳ Module 5 — The Hebrew Calendar',  href: 'theme2/module5.html', sub: true, completable: true, completeKey: 'complete-t2m5' },
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
      { label: '↳ Module 1 — The World That Was', href: 'theme3/module1.html', sub: true, completable: true, completeKey: 'complete-t3m1' },
      { label: '↳ Module 2 — The Ark and the Flood', href: 'theme3/module2.html', sub: true, completable: true, completeKey: 'complete-t3m2' },
      { label: '↳ Module 3 — The Rainbow Covenant', href: 'theme3/module3.html', sub: true, completable: true, completeKey: 'complete-t3m3' },
      { label: '↳ Module 4 — The Days of Noah', href: 'theme3/module4.html', sub: true, completable: true, completeKey: 'complete-t3m4' },
      { label: '↳ Module 5 — Salvation Through the Water', href: 'theme3/module5.html', sub: true, completable: true, completeKey: 'complete-t3m5' },
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
    label: '📖 Characters in Scripture',
    collapsible: true,
    key: 'characters',
    colorKey: 'characters',
    items: [
      { label: 'Characters Overview',                  href: 'characters.html' },
      { label: '↳ The Life of David',                  href: 'characters/david/index.html', sub: true, hasSubCollapse: true, subKey: 'david' },
      { label: '↳↳ Ch 01 — Origins',                   href: 'characters/david/01-origins.html',          sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-01' },
      { label: '↳↳ Ch 02 — The Anointing',             href: 'characters/david/02-anointing.html',        sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-02' },
      { label: '↳↳ Ch 03 — Saul\'s Court',             href: 'characters/david/03-saul-court.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-03' },
      { label: '↳↳ Ch 04 — Jonathan',                  href: 'characters/david/04-jonathan.html',         sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-04' },
      { label: '↳↳ Ch 05 — The Fugitive',              href: 'characters/david/05-fugitive.html',         sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-05' },
      { label: '↳↳ Ch 06 — Ziklag',                    href: 'characters/david/06-ziklag.html',           sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-06' },
      { label: '↳↳ Ch 07 — King of Judah',             href: 'characters/david/07-king-of-judah.html',    sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-07' },
      { label: '↳↳ Ch 08 — King of Israel',            href: 'characters/david/08-king-of-israel.html',   sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-08' },
      { label: '↳↳ Ch 09 — The Davidic Covenant',      href: 'characters/david/09-covenant.html',         sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-09' },
      { label: '↳↳ Ch 10 — Wars & Victories',          href: 'characters/david/10-wars-victories.html',   sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-10' },
      { label: '↳↳ Ch 11 — The Mighty Men',            href: 'characters/david/11-mighty-men.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-11' },
      { label: '↳↳ Ch 12 — Bathsheba',                 href: 'characters/david/12-bathsheba.html',        sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-12' },
      { label: '↳↳ Ch 13 — Family Collapse',           href: 'characters/david/13-family-collapse.html',  sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-13' },
      { label: '↳↳ Ch 14 — Final Years',               href: 'characters/david/14-final-years.html',      sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-14' },
      { label: '↳↳ Ch 15 — Last Words',                href: 'characters/david/15-last-words.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-15' },
      { label: '↳↳ Ch 16 — Psalms Journey',            href: 'characters/david/16-psalms-journey.html',   sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-16' },
      { label: '↳↳ Ch 17 — David & Christ',            href: 'characters/david/17-theology.html',         sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-17' },
      { label: '↳↳ Ch 18 — The Cave Years',            href: 'characters/david/18-cave-years.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-18' },
      { label: '↳↳ Ch 19 — David vs. Saul',            href: 'characters/david/19-david-vs-saul.html',    sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-19' },
      { label: '↳↳ Ch 20 — David & Repentance',        href: 'characters/david/20-repentance.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-20' },
      { label: '↳↳ Ch 21 — David & Worship',           href: 'characters/david/21-worship.html',          sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-21' },
      { label: '↳↳ Ch 22 — Kingdom of David as Type',  href: 'characters/david/22-kingdom-type.html',     sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-22' },
      { label: '↳↳ Ch 23 — David & Prayer',            href: 'characters/david/23-prayer.html',           sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-23' },
      { label: '↳↳ Ch 24 — David & Friendship',        href: 'characters/david/24-friendship.html',       sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-24' },
      { label: '↳↳ Ch 25 — David & Israel\'s Enemies', href: 'characters/david/25-enemies.html',          sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-25' },
      { label: '↳↳ Ch 26 — The Strange Death Stories', href: 'characters/david/26-strange-deaths.html',   sub: true, underSubKey: 'david', completable: true, completeKey: 'complete-david-26' },
      { label: '↳↳ Appendix A — Timeline',             href: 'characters/david/appendix-a-timeline.html', sub: true, underSubKey: 'david' },
      { label: '↳↳ Appendix B — Numbers',              href: 'characters/david/appendix-b-numbers.html',  sub: true, underSubKey: 'david' },
      { label: '↳↳ Appendix C — Lost Books',           href: 'characters/david/appendix-c-lost-books.html', sub: true, underSubKey: 'david' },
      { label: '↳↳ Appendix D — Family',               href: 'characters/david/appendix-d-family.html',   sub: true, underSubKey: 'david' },
    ]
  },
  {
    type: 'section',
    label: '🌍 Current Events',
    collapsible: true,
    key: 'currentevents',
    colorKey: 'currentevents',
    items: [
      { label: 'Current Events Tracker', href: 'current-events.html' },
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
      { label: '📔 Personal Journal',       href: 'journal.html',       itemColor: 'mystudy-journal', hasSubCollapse: true, subKey: 'journal' },
      { label: '↳ ⭐ Hearing God\'s Voice',  href: 'hearing-gods-voice.html',  sub: true, underSubKey: 'journal', itemColor: 'mystudy-hearing' },
      { label: '↳ ⚖️ Gematria Skepticism',  href: 'numbers-skepticism.html',  sub: true, underSubKey: 'journal', itemColor: 'mystudy-skepticism' },
      { label: '💾 Save History',           href: 'history.html',       itemColor: 'mystudy-history'     },
      { label: '🔬 Deep Dives',             href: 'DeepDives.html',     itemColor: 'mystudy-deepdives', hasSubCollapse: true, subKey: 'deepdives' },
      { label: '↳ 📅 Prophetic Calendars',  href: 'DeepDive-Calendars.html', sub: true, underSubKey: 'deepdives', itemColor: 'mystudy-deepdives' },
      { label: '↳ 📖 H7620 — "Weeks" in Daniel 9', href: 'DeepDive-Shabua.html', sub: true, underSubKey: 'deepdives', itemColor: 'mystudy-deepdives' },
      { label: '↳ 🌿 Willow in Scripture',  href: 'DeepDive-Willow.html',    sub: true, underSubKey: 'deepdives', itemColor: 'mystudy-deepdives' },
      { label: '↳ 🔢 Gematria (Hebrew/Greek)', href: 'DeepDive-Gematria.html', sub: true, underSubKey: 'deepdives', itemColor: 'mystudy-gematria' },
      { label: '🎧 Listening Notes',        href: 'listening-notes.html', adminOnly: true, itemColor: 'mystudy-listening' },
    ]
  }
];

function isModuleComplete(key) {
  return localStorage.getItem('cbsg-' + key) === 'true';
}

/* Resolve the TEXT color for a nav item. Priority:
   1. Completed items → green (overrides everything)
   2. Active page → skip inline color, let CSS .active rule (gold) win
   3. My Study per-item color (if itemColor specified)
   4. Section's item color from NAV_COLORS palette
   5. Empty (falls back to CSS default white) */
function navItemTextColor(item, sectionColorKey, done, active) {
  if (done)   return '#90EE90';
  if (active) return '';
  if (item.itemColor && MYSTUDY_ITEM_COLORS[item.itemColor]) {
    return MYSTUDY_ITEM_COLORS[item.itemColor];
  }
  const pal = NAV_COLORS[sectionColorKey];
  if (pal && pal.item) return pal.item;
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

  /* Render a single nav item <a>. Text is colored per theme/item,
     semi-bold (font-weight: 500). `extraStyle` is any additional
     inline CSS (e.g. flex:1 for sub-collapse rows). */
  function renderItem(item, sectionColorKey, extraStyle) {
    const fullHref  = base + item.href;
    const active    = currentPath === fullHref || currentPath.endsWith('/' + item.href);
    const activeCls = active ? ' active' : '';
    const subCls    = item.sub ? ' sub' : '';
    const done      = item.completable && isModuleComplete(item.completeKey);
    const textColor = navItemTextColor(item, sectionColorKey, done, active);
    const doneIcon  = done ? ' <span style="color:#90EE90;font-size:11px;">✓</span>' : '';
    const styleBits = [];
    if (textColor) {
      styleBits.push('color:' + textColor + ' !important');
      styleBits.push('font-weight:500');  // semi-bold
    }
    if (extraStyle) styleBits.push(extraStyle);
    const styleAttr = styleBits.length ? ` style="${styleBits.join(';')}"` : '';
    return `<a class="nav-item${subCls}${activeCls}"${styleAttr} href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}${doneIcon}</a>`;
  }

  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 18, 2026 (v5.5)</p>
    </div>
    <div id="sidebar-nav">
  `;

  const adminUnlocked = sessionStorage.getItem('cbsg-admin') === 'true';

  /* v5.10 — First-visit collapse:
     On the very first time a visitor's browser builds the sidebar,
     'cbsg-nav-visited' is absent. While it's absent, render every
     section closed AND skip the usual "active section auto-opens"
     override, so the visitor sees a clean, fully-collapsed nav.
     Then set the flag so subsequent visits behave normally. */
  const isFirstVisit = localStorage.getItem('cbsg-nav-visited') !== 'true';
  if (isFirstVisit) {
    localStorage.setItem('cbsg-nav-visited', 'true');
  }

  NAV_STRUCTURE.forEach(section => {
    const palette  = NAV_COLORS[section.colorKey] || {};
    // Section headers get their theme color via inline text color.
    // No more left-border stripes anywhere — cleaner.
    const headerColor = palette.header ? `color:${palette.header} !important;` : '';

    if (!section.collapsible) {
      const nonStyle = headerColor ? ` style="${headerColor}"` : '';
      html += `<div class="nav-section"${nonStyle}>${section.label}</div>`;
      section.items.forEach(item => {
        if (item.adminOnly && !adminUnlocked) return;
        html += renderItem(item, section.colorKey, '');
      });
    } else {
      const key           = section.key;
      const hasActivePage = !isFirstVisit && isActiveSection(section);
      if (hasActivePage) setCollapsed(key, false);
      const collapsed     = isFirstVisit ? true : isCollapsed(key);

      const completable    = section.items.filter(i => i.completable);
      const completedCount = completable.filter(i => isModuleComplete(i.completeKey)).length;
      const allDone        = completable.length > 0 && completedCount === completable.length;
      const progressLabel  = completable.length > 0
        ? `<span style="font-size:9px;margin-left:6px;color:${allDone ? '#90EE90' : 'rgba(255,255,255,0.3)'};">${completedCount}/${completable.length}</span>`
        : '';

      const headerStyle = headerColor ? ` style="${headerColor}"` : '';

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


/* ============================================================
   READING CHAIN — v5.11
   Canonical linear order of study pages site-wide.
   Each entry: [href (relative to site root), label, section name]
   ============================================================ */
const READING_CHAIN = [
  // Theme 1 — End Times (15 modules, no overview)
  ['theme1/module1.html',   'Module 1 — Daniel\'s 70 Weeks',     'Theme 1 — End Times'],
  ['theme1/module2.html',   'Module 2 — Israel in Prophecy',     'Theme 1 — End Times'],
  ['theme1/module3.html',   'Module 3 — Day of the Lord',        'Theme 1 — End Times'],
  ['theme1/module4.html',   'Module 4 — The Watchman',           'Theme 1 — End Times'],
  ['theme1/module5.html',   'Module 5 — The New Covenant',       'Theme 1 — End Times'],
  ['theme1/module6.html',   'Module 6 — The Rapture',            'Theme 1 — End Times'],
  ['theme1/module7.html',   'Module 7 — The Antichrist',         'Theme 1 — End Times'],
  ['theme1/module8.html',   'Module 8 — The Rebuilt Temple',     'Theme 1 — End Times'],
  ['theme1/module9.html',   'Module 9 — Gog-Magog War',          'Theme 1 — End Times'],
  ['theme1/module10.html',  'Module 10 — Signs of the Times',    'Theme 1 — End Times'],
  ['theme1/module11.html',  'Module 11 — False Prophets',        'Theme 1 — End Times'],
  ['theme1/module12.html',  'Module 12 — The Millennium',        'Theme 1 — End Times'],
  ['theme1/module13.html',  'Module 13 — Second Coming',         'Theme 1 — End Times'],
  ['theme1/module14.html',  'Module 14 — Matt 24 ↔ Revelation',  'Theme 1 — End Times'],
  ['theme1/module15.html',  'Module 15 — Armageddon',            'Theme 1 — End Times'],

  // Theme 2 — Biblical Calendar (overview + 5 modules)
  ['theme2/index.html',     'Theme 2 Overview',                  'Theme 2 — Biblical Calendar'],
  ['theme2/module1.html',   'Module 1 — Calendar History',       'Theme 2 — Biblical Calendar'],
  ['theme2/module2.html',   'Module 2 — Israel in Prophecy',     'Theme 2 — Biblical Calendar'],
  ['theme2/module3.html',   'Module 3 — Book of Jubilees',       'Theme 2 — Biblical Calendar'],
  ['theme2/module4.html',   'Module 4 — Feast of Tabernacles',   'Theme 2 — Biblical Calendar'],
  ['theme2/module5.html',   'Module 5 — The Hebrew Calendar',    'Theme 2 — Biblical Calendar'],

  // Theme 3 — Judgment & Mercy (overview + 5 modules)
  ['theme3/index.html',     'Theme 3 Overview',                  'Theme 3 — Judgment & Mercy'],
  ['theme3/module1.html',   'Module 1 — The World That Was',     'Theme 3 — Judgment & Mercy'],
  ['theme3/module2.html',   'Module 2 — The Ark and the Flood',  'Theme 3 — Judgment & Mercy'],
  ['theme3/module3.html',   'Module 3 — The Rainbow Covenant',   'Theme 3 — Judgment & Mercy'],
  ['theme3/module4.html',   'Module 4 — The Days of Noah',       'Theme 3 — Judgment & Mercy'],
  ['theme3/module5.html',   'Module 5 — Salvation Through the Water', 'Theme 3 — Judgment & Mercy'],

  // Characters in Scripture (overview + David library)
  ['characters.html',                                'Characters Overview',          'Characters in Scripture'],
  ['characters/david/index.html',                    'The Life of David',            'David'],
  ['characters/david/01-origins.html',               'Ch 01 — Origins',              'David'],
  ['characters/david/02-anointing.html',             'Ch 02 — The Anointing',        'David'],
  ['characters/david/03-saul-court.html',            'Ch 03 — Saul\'s Court',        'David'],
  ['characters/david/04-jonathan.html',              'Ch 04 — Jonathan',             'David'],
  ['characters/david/05-fugitive.html',              'Ch 05 — The Fugitive',         'David'],
  ['characters/david/06-ziklag.html',                'Ch 06 — Ziklag',               'David'],
  ['characters/david/07-king-of-judah.html',         'Ch 07 — King of Judah',        'David'],
  ['characters/david/08-king-of-israel.html',        'Ch 08 — King of Israel',       'David'],
  ['characters/david/09-covenant.html',              'Ch 09 — The Davidic Covenant', 'David'],
  ['characters/david/10-wars-victories.html',        'Ch 10 — Wars & Victories',     'David'],
  ['characters/david/11-mighty-men.html',            'Ch 11 — The Mighty Men',       'David'],
  ['characters/david/12-bathsheba.html',             'Ch 12 — Bathsheba',            'David'],
  ['characters/david/13-family-collapse.html',       'Ch 13 — Family Collapse',      'David'],
  ['characters/david/14-final-years.html',           'Ch 14 — Final Years',          'David'],
  ['characters/david/15-last-words.html',            'Ch 15 — Last Words',           'David'],
  ['characters/david/16-psalms-journey.html',        'Ch 16 — Psalms Journey',       'David'],
  ['characters/david/17-theology.html',              'Ch 17 — David & Christ',       'David'],
  ['characters/david/18-cave-years.html',            'Ch 18 — The Cave Years',       'David'],
  ['characters/david/19-david-vs-saul.html',         'Ch 19 — David vs. Saul',       'David'],
  ['characters/david/20-repentance.html',            'Ch 20 — David & Repentance',   'David'],
  ['characters/david/21-worship.html',               'Ch 21 — David & Worship',      'David'],
  ['characters/david/22-kingdom-type.html',          'Ch 22 — Kingdom of David as Type', 'David'],
  ['characters/david/23-prayer.html',                'Ch 23 — David & Prayer',       'David'],
  ['characters/david/24-friendship.html',            'Ch 24 — David & Friendship',   'David'],
  ['characters/david/25-enemies.html',               'Ch 25 — David & Israel\'s Enemies', 'David'],
  ['characters/david/26-strange-deaths.html',        'Ch 26 — The Strange Death Stories', 'David'],
  ['characters/david/appendix-a-timeline.html',      'Appendix A — Timeline',        'David'],
  ['characters/david/appendix-b-numbers.html',       'Appendix B — Numbers',         'David'],
  ['characters/david/appendix-c-lost-books.html',    'Appendix C — Lost Books',      'David'],
  ['characters/david/appendix-d-family.html',        'Appendix D — Family',          'David'],
];

/* ============================================================
   injectPrevNext() — call after buildSidebar() on study pages.
   Locates the current page in READING_CHAIN, then appends a
   prev/next bar to #main (or <body> as fallback).
   ============================================================ */
function injectPrevNext() {
  // Idempotency: never inject twice on the same page.
  if (document.querySelector('.cbsg-page-nav')) return;

  // Find current page index in the chain.
  // We compare by suffix match so this works on both
  // cbs2026.com and acshotsprings.github.io/CampbellBibleStudy/.
  const path = window.location.pathname.replace(/\/$/, '');
  let idx = -1;
  for (let i = 0; i < READING_CHAIN.length; i++) {
    const href = READING_CHAIN[i][0];
    // Match either "/theme1/module1.html" or any path ending in that.
    if (path.endsWith('/' + href) || path === '/' + href || path.endsWith(href)) {
      idx = i;
      break;
    }
  }
  if (idx === -1) return;  // Not a chain page — silently skip.

  // Determine the relative path prefix needed to reach site root
  // from this page. Count slashes after the trailing filename strip.
  // Examples:
  //   /theme1/module1.html              -> ../
  //   /characters/david/01-origins.html -> ../../
  //   /characters.html                  -> ''
  const segs = path.split('/').filter(Boolean);
  // Drop the filename
  const depth = Math.max(0, segs.length - 1);
  const rootPrefix = '../'.repeat(depth);

  const prev = idx > 0 ? READING_CHAIN[idx - 1] : null;
  const next = idx < READING_CHAIN.length - 1 ? READING_CHAIN[idx + 1] : null;
  const curr = READING_CHAIN[idx];

  // Inject styles once
  if (!document.getElementById('cbsg-prevnext-styles')) {
    const styles = document.createElement('style');
    styles.id = 'cbsg-prevnext-styles';
    styles.textContent = `
      .cbsg-page-nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin: 48px 0 24px;
        padding: 0;
      }
      .cbsg-page-nav a, .cbsg-page-nav .cbsg-pn-disabled {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 18px 22px;
        border-radius: 8px;
        text-decoration: none;
        font-family: Arial, sans-serif;
        transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        border: 2px solid transparent;
      }
      .cbsg-page-nav a {
        background: #1F3864;
        color: #fff;
        box-shadow: 0 2px 6px rgba(31,56,100,0.18);
      }
      .cbsg-page-nav a:hover {
        background: #2E4F8A;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(31,56,100,0.28);
        border-color: #FFD700;
      }
      .cbsg-page-nav .cbsg-pn-disabled {
        background: #f0ede4;
        color: #aaa;
        cursor: default;
        box-shadow: none;
      }
      .cbsg-pn-label {
        font-size: 11px;
        font-weight: bold;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #FFD700;
      }
      .cbsg-page-nav .cbsg-pn-disabled .cbsg-pn-label {
        color: #c8c0a8;
      }
      .cbsg-pn-title {
        font-size: 14px;
        font-weight: bold;
        line-height: 1.35;
      }
      .cbsg-pn-section {
        font-size: 10px;
        color: rgba(255,255,255,0.6);
        font-style: italic;
        margin-top: 2px;
      }
      .cbsg-pn-next {
        text-align: right;
      }
      .cbsg-pn-next .cbsg-pn-title,
      .cbsg-pn-next .cbsg-pn-label,
      .cbsg-pn-next .cbsg-pn-section {
        text-align: right;
      }
      @media (max-width: 600px) {
        .cbsg-page-nav { grid-template-columns: 1fr; }
        .cbsg-pn-next, .cbsg-pn-next .cbsg-pn-title,
        .cbsg-pn-next .cbsg-pn-label, .cbsg-pn-next .cbsg-pn-section {
          text-align: left;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  // Build the markup
  function block(entry, isNext, isDisabled) {
    const labelText = isNext ? 'Next →' : '← Previous';
    const sideClass = isNext ? ' cbsg-pn-next' : '';
    if (isDisabled || !entry) {
      const endText = isNext ? 'End of study chain' : 'Start of study chain';
      return `
        <div class="cbsg-pn-disabled${sideClass}">
          <span class="cbsg-pn-label">${labelText}</span>
          <span class="cbsg-pn-title">${endText}</span>
        </div>`;
    }
    const [href, title, section] = entry;
    return `
      <a href="${rootPrefix}${href}" class="${sideClass.trim()}">
        <span class="cbsg-pn-label">${labelText}</span>
        <span class="cbsg-pn-title">${title}</span>
        <span class="cbsg-pn-section">${section}</span>
      </a>`;
  }

  const nav = document.createElement('nav');
  nav.className = 'cbsg-page-nav';
  nav.setAttribute('aria-label', 'Study navigation');
  nav.innerHTML = block(prev, false, !prev) + block(next, true, !next);

  // Append inside #main if present, else at end of <body>
  const main = document.getElementById('main') || document.body;
  main.appendChild(nav);
}

/* ============================================================
   Auto-fire injectPrevNext() on every page that loads nav.js.
   Pages not in READING_CHAIN are silently ignored by the function
   (it returns early if no match is found). This means new study
   pages added to READING_CHAIN later will automatically gain
   prev/next without any HTML edits.
   ============================================================ */
(function autoFirePrevNext() {
  function run() {
    // Microtask delay so any inline page scripts (e.g.
    // <script>buildSidebar('.')</script>) finish first.
    setTimeout(injectPrevNext, 0);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
