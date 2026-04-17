/* =======================================================================
   CAMPBELL FAMILY MASTER BIBLICAL STUDY GUIDE
   Enhanced Navigation Builder — v4.6 ULTIMATE ANTI-JUMP + Completion Fix
   ======================================================================= */

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

// ============================================================================
// ULTIMATE SCROLL PRESERVATION SYSTEM
// ============================================================================

class ScrollPreserver {
  constructor() {
    this.element = null;
    this.position = 0;
    this.isRestoring = false;
    this.timeoutIds = [];
  }

  save(element) {
    if (!element) return;
    this.element = element;
    this.position = element.scrollTop;
    
    // Store in sessionStorage as backup
    if (element.id) {
      sessionStorage.setItem(`scroll-${element.id}`, this.position.toString());
    }
  }

  restore() {
    if (!this.element || this.isRestoring) return;
    
    this.isRestoring = true;
    this.clearTimeouts();
    
    // Multiple restoration attempts with progressive delays
    const delays = [0, 5, 15, 30, 60, 120, 250];
    
    delays.forEach(delay => {
      const timeoutId = setTimeout(() => {
        if (this.element && typeof this.position === 'number') {
          // Force scroll position
          this.element.scrollTop = this.position;
          
          // Verify it stuck and retry if needed
          setTimeout(() => {
            if (this.element && Math.abs(this.element.scrollTop - this.position) > 2) {
              this.element.scrollTop = this.position;
            }
          }, 5);
        }
      }, delay);
      
      this.timeoutIds.push(timeoutId);
    });
    
    // Clear restoration flag after all attempts
    setTimeout(() => {
      this.isRestoring = false;
      this.clearTimeouts();
    }, 300);
  }

  clearTimeouts() {
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
  }

  restoreFromSession(element) {
    if (!element || !element.id) return;
    
    const saved = sessionStorage.getItem(`scroll-${element.id}`);
    if (saved) {
      const position = parseInt(saved, 10);
      if (!isNaN(position)) {
        this.element = element;
        this.position = position;
        this.restore();
      }
    }
  }

  lockElement(element) {
    if (!element) return;
    
    // Disable all scroll-related interactions temporarily
    element.style.overflow = 'hidden';
    setTimeout(() => {
      if (element) element.style.overflow = '';
    }, 100);
  }
}

const scrollPreserver = new ScrollPreserver();

// ============================================================================
// PROTECTED DOM MANIPULATION
// ============================================================================

function withScrollProtection(element, callback) {
  if (!element) {
    callback();
    return;
  }

  // Save current scroll position
  scrollPreserver.save(element);
  
  // Temporarily lock scrolling
  scrollPreserver.lockElement(element);
  
  // Disable any existing scroll listeners temporarily
  const originalOnScroll = element.onscroll;
  element.onscroll = null;
  
  try {
    // Execute the callback
    callback();
  } finally {
    // Restore scroll position after DOM changes
    requestAnimationFrame(() => {
      scrollPreserver.restore();
      
      // Restore scroll listener after a delay
      setTimeout(() => {
        if (element) element.onscroll = originalOnScroll;
      }, 150);
    });
  }
}

// ============================================================================
// NAVIGATION BUILDING
// ============================================================================

function buildSidebar(root) {
  root = root || './';
  if (!root.endsWith('/')) root += '/';
  const base        = '/CampbellBibleStudy/';
  const currentPath = window.location.pathname;
  const sidebar     = document.getElementById('sidebar');
  if (!sidebar) return;

  withScrollProtection(sidebar, () => {
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
        <p id="sidebar-version">Version: April 17, 2026</p>
      </div>
      <div id="sidebar-nav">
    `;

    const adminUnlocked = sessionStorage.getItem('cbsg-admin') === 'true';

    // Mark all Theme 2 modules as completed
    ['complete-t2m1', 'complete-t2m2', 'complete-t2m3', 'complete-t2m4'].forEach(key => {
      localStorage.setItem('cbsg-' + key, 'true');
    });

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
        const key            = section.key;
        const hasActivePage = isActiveSection(section);
        if (hasActivePage) setCollapsed(key, false);
        const collapsed      = isCollapsed(key);

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
      }
    });

    html += `</div>`;

    // Set the HTML content
    sidebar.innerHTML = html;
  });
}

function toggleNavSection(key) {
  const sidebar = document.getElementById('sidebar');
  const items = document.getElementById('nav-items-' + key);
  const arrow = document.getElementById('nav-arrow-' + key);
  if (!items || !sidebar) return;
  
  withScrollProtection(sidebar, () => {
    const isNowCollapsed = !items.classList.contains('collapsed');
    items.classList.toggle('collapsed', isNowCollapsed);
    arrow.classList.toggle('open', !isNowCollapsed);
    localStorage.setItem('cbsg-nav-' + key, isNowCollapsed ? 'true' : 'false');
  });
}

// ============================================================================
// COMPLETION SYSTEM WITH SCROLL PROTECTION
// ============================================================================

window.markModuleComplete = function(moduleKey) {
  const sidebar = document.getElementById('sidebar');
  localStorage.setItem('cbsg-' + moduleKey, 'true');
  
  if (sidebar) {
    withScrollProtection(sidebar, () => {
      buildSidebar();
    });
  }
};

window.markModuleIncomplete = function(moduleKey) {
  const sidebar = document.getElementById('sidebar');
  localStorage.setItem('cbsg-' + moduleKey, 'false');
  
  if (sidebar) {
    withScrollProtection(sidebar, () => {
      buildSidebar();
    });
  }
};

// Enhanced completion button handling for individual pages
document.addEventListener('DOMContentLoaded', function() {
  // Restore scroll position if coming from session storage
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    setTimeout(() => {
      scrollPreserver.restoreFromSession(sidebar);
    }, 100);
  }

  // Enhanced completion button detection and protection
  const completeButtons = document.querySelectorAll('button[onclick*="toggleCompletion"], .btn-complete, .complete-module, [onclick*="complete"]');
  completeButtons.forEach(button => {
    // Ensure button has proper click handler
    if (!button.hasAttribute('data-enhanced')) {
      button.addEventListener('click', function(e) {
        // Don't interfere with existing handlers, just ensure they work
        e.stopPropagation();
      });
      button.setAttribute('data-enhanced', 'true');
    }
  });

  // Check for broken completion buttons (text without functionality)
  const brokenButtons = document.querySelectorAll('p, div, span');
  brokenButtons.forEach(el => {
    if (el.textContent && el.textContent.includes('☐ Mark as Complete') && !el.querySelector('button')) {
      console.warn('Found broken completion button text without functional button:', el);
      
      // Auto-fix broken buttons by wrapping in proper HTML
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div style="border-top:1px solid #ddd;padding-top:28px;margin:32px 0 8px;text-align:center;">
          <p style="font-size:13px;color:#888;font-family:Arial,sans-serif;margin-bottom:14px;">
            Finished studying this module? Mark it complete to track your progress in the sidebar.
          </p>
          <button id="complete-btn" onclick="toggleCompletion()" style="
            background:#1F3864;color:rgba(255,255,255,0.7);border:2px solid rgba(255,255,255,0.3);
            border-radius:6px;padding:10px 28px;font-size:13px;font-family:Arial,sans-serif;
            font-weight:bold;cursor:pointer;transition:all 0.2s;">
            <span id="complete-btn-text">☐ Mark as Complete</span>
          </button>
        </div>
      `;
      
      if (el.parentNode) {
        el.parentNode.replaceChild(wrapper, el);
      }
    }
  });
});

// ============================================================================
// ADDITIONAL PROTECTION AGAINST SCROLL JUMPING
// ============================================================================

// Prevent scroll events during navigation operations
let isNavigationActive = false;

function protectNavigation(callback) {
  isNavigationActive = true;
  try {
    callback();
  } finally {
    setTimeout(() => {
      isNavigationActive = false;
    }, 200);
  }
}

// Override any problematic scroll behaviors
document.addEventListener('scroll', function(e) {
  if (isNavigationActive && e.target.id === 'sidebar') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, true);
