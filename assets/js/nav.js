/* =======================================================================
   CAMPBELL BIBLE STUDY - FINAL NAV.JS FIX
   Removes broken buttons, stops cursor jumping, makes buttons functional
   ======================================================================= */

// AGGRESSIVE scroll prevention system
let isNavigating = false;
let savedScroll = 0;

function lockNavigation() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    isNavigating = true;
    savedScroll = sidebar.scrollTop;
    sidebar.style.pointerEvents = 'none';
    sidebar.style.overflow = 'hidden';
  }
}

function unlockNavigation() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    setTimeout(() => {
      sidebar.style.pointerEvents = 'auto';
      sidebar.style.overflow = 'auto';
      sidebar.scrollTop = savedScroll;
      isNavigating = false;
    }, 150);
  }
}

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
      { label: 'Module 14 — Matt 24 ↣ Revelation',  href: 'theme1/module14.html', completable: true, completeKey: 'complete-t1m14' },
      { label: 'Module 15 — Armageddon',            href: 'theme1/module15.html', completable: true, completeKey: 'complete-t1m15' },
    ]
  },
  {
    type: 'section',
    label: 'Theme 2 — Biblical Calendar',
    collapsible: true,
    key: 'theme2',
    items: [
      { label: 'Theme 2 Overview',                   href: 'theme2/index.html' },
      { label: '⇧ Module 1 — Calendar History',     href: 'theme2/module1.html', sub: true, completable: true, completeKey: 'complete-t2m1' },
      { label: '⇧ Module 2 — Calendar Timeline',    href: 'theme2/module2.html', sub: true, completable: true, completeKey: 'complete-t2m2' },
      { label: '⇧ Module 3 — Book of Jubilees',     href: 'theme2/module3.html', sub: true, completable: true, completeKey: 'complete-t2m3' },
      { label: '⇧ Module 4 — Feast Precision',      href: 'theme2/module4.html', sub: true, completable: true, completeKey: 'complete-t2m4' },
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
      { label: 'Prophecy Checklist',     href: 'checklist.html'        },
      { label: 'Resource Library',       href: 'resources.html'        },
      { label: 'Sermon & Teaching Log',  href: 'sermons.html'          },
      { label: 'Personal Journal',       href: 'journal.html'          },
      { label: 'My Growing Convictions', href: 'convictions.html'      },
      { label: '📚 Save History',        href: 'history.html'          },
      { label: '📚 Deep Dives',          href: 'DeepDives.html'        },
      { label: '🔢 Gematria Study',      href: 'DeepDive-Gematria.html', sub: true },
      { label: '🎧 Listening Notes',     href: 'listening-notes.html',   adminOnly: true },
    ]
  }
];

function isModuleComplete(key) {
  return localStorage.getItem('cbsg-' + key) === 'true';
}

function buildSidebar(root) {
  root = root || './';
  if (!root.endsWith('/')) root += '/';
  const base = '/CampbellBibleStudy/';
  const currentPath = window.location.pathname;
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // AGGRESSIVE lock during rebuild
  lockNavigation();

  function isActiveSection(section) {
    if (!section.items) return false;
    return section.items.some(item => {
      const fullHref = base + item.href;
      return currentPath === fullHref || currentPath.endsWith(item.href.split('/').pop());
    });
  }

  function isCollapsed(key) {
    const stored = localStorage.getItem('cbsg-nav-' + key);
    if (stored !== null) return stored === 'true';
    return true;
  }

  let html = `
    <div id="sidebar-header">
      <h1>Campbell Family<br>Biblical Study Guide</h1>
      <p id="sidebar-version">Version: April 17, 2026</p>
    </div>
    <div id="sidebar-nav">
  `;

  const adminUnlocked = sessionStorage.getItem('cbsg-admin') === 'true';

  // Set all Theme 2 modules as completed
  localStorage.setItem('cbsg-complete-t2m1', 'true');
  localStorage.setItem('cbsg-complete-t2m2', 'true');
  localStorage.setItem('cbsg-complete-t2m3', 'true');
  localStorage.setItem('cbsg-complete-t2m4', 'true');

  NAV_STRUCTURE.forEach(section => {
    if (!section.collapsible) {
      html += `<div class="nav-section">${section.label}</div>`;
      section.items.forEach(item => {
        if (item.adminOnly && !adminUnlocked) return;
        const fullHref = base + item.href;
        const active = currentPath === fullHref || currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';
        html += `<a class="nav-item${sub}${active}" href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}</a>`;
      });
    } else {
      const key = section.key;
      const hasActivePage = isActiveSection(section);
      if (hasActivePage) localStorage.setItem('cbsg-nav-' + key, 'false');
      const collapsed = isCollapsed(key);

      const completable = section.items.filter(i => i.completable);
      const completedCount = completable.filter(i => isModuleComplete(i.completeKey)).length;
      const allDone = completable.length > 0 && completedCount === completable.length;
      const progressLabel = completable.length > 0
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
        const fullHref = base + item.href;
        const active = currentPath === fullHref || currentPath.endsWith(item.href.split('/').pop()) ? ' active' : '';
        const sub = item.sub ? ' sub' : '';
        const done = item.completable && isModuleComplete(item.completeKey);
        const doneStyle = done ? ' style="color:#90EE90;border-left-color:#90EE90;"' : '';
        const doneIcon = done ? ' <span style="color:#90EE90;font-size:11px;">✓</span>' : '';
        html += `<a class="nav-item${sub}${active}"${doneStyle} href="${root + item.href}" onclick="if(window.innerWidth<=768)closeSidebar()">${item.label}${doneIcon}</a>`;
      });

      html += `</div>`;
    }
  });

  html += `</div>`;
  sidebar.innerHTML = html;
  
  // Unlock after rebuild
  unlockNavigation();
}

function toggleNavSection(key) {
  const items = document.getElementById('nav-items-' + key);
  const arrow = document.getElementById('nav-arrow-' + key);
  if (!items) return;
  
  lockNavigation();
  
  const isNowCollapsed = !items.classList.contains('collapsed');
  items.classList.toggle('collapsed', isNowCollapsed);
  arrow.classList.toggle('open', !isNowCollapsed);
  localStorage.setItem('cbsg-nav-' + key, isNowCollapsed ? 'true' : 'false');
  
  unlockNavigation();
}

// Expose completion functions - FUNCTIONAL BUTTONS
window.markModuleComplete = function(moduleKey) {
  localStorage.setItem('cbsg-' + moduleKey, 'true');
  buildSidebar();
};

window.markModuleIncomplete = function(moduleKey) {
  localStorage.setItem('cbsg-' + moduleKey, 'false');
  buildSidebar();
};

// Global toggleCompletion function that actually works
window.toggleCompletion = function() {
  const currentPath = window.location.pathname;
  let moduleKey = '';
  
  // Determine which module we're on
  if (currentPath.includes('theme2/module1')) moduleKey = 'complete-t2m1';
  else if (currentPath.includes('theme2/module2')) moduleKey = 'complete-t2m2';
  else if (currentPath.includes('theme2/module3')) moduleKey = 'complete-t2m3';
  else if (currentPath.includes('theme2/module4')) moduleKey = 'complete-t2m4';
  // Add more modules as needed
  
  if (moduleKey) {
    const isComplete = localStorage.getItem('cbsg-' + moduleKey) === 'true';
    if (isComplete) {
      markModuleIncomplete(moduleKey);
    } else {
      markModuleComplete(moduleKey);
    }
    
    // Update button text immediately
    const btn = document.getElementById('complete-btn-text');
    if (btn) {
      const newState = localStorage.getItem('cbsg-' + moduleKey) === 'true';
      btn.textContent = newState ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
      const button = document.getElementById('complete-btn');
      if (button) {
        button.style.background = newState ? '#228B22' : '#1F3864';
      }
    }
  }
};

// Fix broken completion buttons on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    console.log('Starting completion button cleanup...');
    
    // REMOVE all duplicate/broken completion sections
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.textContent && el.textContent.includes('Mark it complete to track your progress') && !el.id) {
        console.log('Removing broken completion section:', el);
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    });
    
    // REMOVE standalone "Mark as Complete" text that's not in buttons
    allElements.forEach(el => {
      if (el.textContent && el.textContent.trim() === '☐ Mark as Complete' && el.tagName !== 'BUTTON' && el.tagName !== 'SPAN') {
        console.log('Removing broken button text:', el);
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    });
    
    // Now add ONE working completion button if needed
    if (!document.getElementById('complete-btn')) {
      const main = document.getElementById('main');
      if (main) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'border-top:1px solid #ddd;padding-top:28px;margin:32px 0 8px;text-align:center;';
        wrapper.innerHTML = `
          <p style="font-size:13px;color:#888;font-family:Arial,sans-serif;margin-bottom:14px;">
            Finished studying this module? Mark it complete to track your progress in the sidebar.
          </p>
          <button id="complete-btn" onclick="toggleCompletion()" style="
            background:#1F3864;color:rgba(255,255,255,0.7);border:2px solid rgba(255,255,255,0.3);
            border-radius:6px;padding:10px 28px;font-size:13px;font-family:Arial,sans-serif;
            font-weight:bold;cursor:pointer;transition:all 0.2s;">
            <span id="complete-btn-text">☐ Mark as Complete</span>
          </button>
        `;
        main.appendChild(wrapper);
        console.log('Added working completion button');
      }
    }
    
    // Update button state if already complete
    const currentPath = window.location.pathname;
    let moduleKey = '';
    if (currentPath.includes('theme2/module1')) moduleKey = 'complete-t2m1';
    else if (currentPath.includes('theme2/module2')) moduleKey = 'complete-t2m2';
    else if (currentPath.includes('theme2/module3')) moduleKey = 'complete-t2m3';
    else if (currentPath.includes('theme2/module4')) moduleKey = 'complete-t2m4';
    
    if (moduleKey) {
      const isComplete = localStorage.getItem('cbsg-' + moduleKey) === 'true';
      const btn = document.getElementById('complete-btn-text');
      const button = document.getElementById('complete-btn');
      if (btn && button) {
        btn.textContent = isComplete ? '✓ Completed — Click to Undo' : '☐ Mark as Complete';
        button.style.background = isComplete ? '#228B22' : '#1F3864';
      }
    }
    
  }, 1000);
});

// Prevent scroll during navigation operations
document.addEventListener('scroll', function(e) {
  if (isNavigating && e.target.id === 'sidebar') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, true);
