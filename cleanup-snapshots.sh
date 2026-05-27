#!/usr/bin/env bash
# ============================================================
# cleanup-snapshots.sh
# Campbell Bible Study — one-time repo cleanup
# Created: 2026-05-26
# ============================================================
#
# WHAT THIS DOES:
#   Removes 110 files (~160 MB) from the git repo that should
#   never have been pushed:
#     - 51 zip backups in backups/
#     - 45 snapshot JS files in assets/js/
#     - 14 HTML snapshot files scattered across the tree
#
#   These are all LOCAL ROLLBACK COPIES per the SNAPSHOT RULE.
#   They should stay on Chris's machine, not on GitHub.
#
# HOW IT WORKS:
#   `git rm --cached` removes the file from git tracking
#   WITHOUT deleting it from your local disk. So your local
#   backups stay safe; they just stop getting pushed.
#
# AFTER YOU RUN THIS:
#   1. Open GitHub Desktop — you'll see ~110 "deleted" files
#      in the changes panel
#   2. Commit them with message like "chore: remove tracked
#      snapshots and backups from repo"
#   3. Push
#   4. Verify the site still works (run verify-deploy.sh)
#   5. The new .gitignore prevents this happening again
#
# SAFETY:
#   - Verified none of these files are referenced by HTML/JS
#   - Files stay on your local disk after this runs
#   - You can `git reset` to undo before committing
#
# ============================================================

set -e  # Stop on any error

cd "$(dirname "$0")"  # Run from repo root

echo "========================================"
echo "Campbell Bible Study — Repo Cleanup"
echo "========================================"
echo ""

# Sanity check — are we in the right repo?
if [ ! -f "verify-deploy.sh" ] || [ ! -d ".git" ]; then
  echo "❌ ERROR: This doesn't look like the CBS repo root."
  echo "   Expected to find verify-deploy.sh and .git/ here."
  echo "   Aborting — no changes made."
  exit 1
fi

echo "✅ Running from CBS repo root: $(pwd)"
echo ""

# ============================================================
# STEP 1: Remove backups/ folder from git tracking
# ============================================================
echo "→ Step 1: Removing backups/ zip files from git..."
if [ -d "backups" ]; then
  zip_count=$(ls backups/*.zip 2>/dev/null | wc -l)
  echo "   Found $zip_count zip files in backups/"
  git rm --cached -r backups/ 2>/dev/null || true
  echo "   ✅ Removed from git tracking (files stay on disk)"
else
  echo "   (no backups/ folder found — skipping)"
fi
echo ""

# ============================================================
# STEP 2: Remove JS snapshot files from assets/js/
# ============================================================
echo "→ Step 2: Removing snapshot JS files from assets/js/..."
js_snapshots=$(find assets/js -name '*snapshot*.js' 2>/dev/null | wc -l)
echo "   Found $js_snapshots snapshot JS files"
if [ "$js_snapshots" -gt 0 ]; then
  find assets/js -name '*snapshot*.js' -print0 | xargs -0 git rm --cached 2>/dev/null || true
  echo "   ✅ Removed from git tracking"
else
  echo "   (none found — skipping)"
fi
echo ""

# ============================================================
# STEP 3: Remove scattered HTML snapshots
# ============================================================
echo "→ Step 3: Removing scattered HTML snapshots..."
html_snapshots=$(find . -name '*_snapshot_*.html' -not -path './.git/*' 2>/dev/null | wc -l)
html_snapshots2=$(find . -name '*_snapshot.html' -not -path './.git/*' 2>/dev/null | wc -l)
total_html=$((html_snapshots + html_snapshots2))
echo "   Found $total_html HTML snapshot files"
if [ "$total_html" -gt 0 ]; then
  find . -name '*_snapshot_*.html' -not -path './.git/*' -print0 | xargs -0 git rm --cached 2>/dev/null || true
  find . -name '*_snapshot.html' -not -path './.git/*' -print0 | xargs -0 git rm --cached 2>/dev/null || true
  echo "   ✅ Removed from git tracking"
else
  echo "   (none found — skipping)"
fi
echo ""

# ============================================================
# STEP 4: Replace .gitignore with the comprehensive version
# ============================================================
echo "→ Step 4: Updating .gitignore with broader patterns..."
cat > .gitignore << 'GITIGNORE_EOF'
# Campbell Bible Study — .gitignore
# Keeps local backup snapshots out of the published site.

# === SNAPSHOT FILES ===
# Snapshots are local rollback copies kept on Chris's machine only.
# Per the SNAPSHOT RULE: deliver to /outputs/, never push to repo.

# HTML snapshots anywhere in the tree
*_snapshot_*.html
*_snapshot.html
*_snapshot_*.htm

# JS snapshots in assets/js/
assets/js/*snapshot*.js
assets/js/*_snapshot*.js

# Local snapshot folder pattern
_snapshots/

# === ZIP BACKUPS ===
# Site backup archives — kept locally, never deployed.
backups/
*.zip

# === OS / EDITOR CRUFT ===
.DS_Store
Thumbs.db
*.swp
*~

# === LOCAL DEVELOPMENT ===
node_modules/
.env
.env.local
GITIGNORE_EOF
echo "   ✅ .gitignore updated"
echo ""

# ============================================================
# SUMMARY
# ============================================================
echo "========================================"
echo "CLEANUP STAGED — Review in GitHub Desktop"
echo "========================================"
echo ""
echo "Changes ready to commit:"
git status --short | head -20
echo "..."
echo ""
echo "Total files staged: $(git status --short | wc -l)"
echo ""
echo "NEXT STEPS:"
echo "  1. Open GitHub Desktop"
echo "  2. Review the changes (should see ~110 deleted files + .gitignore modified)"
echo "  3. Commit with message: 'chore: remove tracked snapshots and backups'"
echo "  4. Push"
echo "  5. Run: bash verify-deploy.sh"
echo ""
echo "YOUR LOCAL FILES ARE SAFE:"
echo "  - Nothing has been deleted from your hard drive"
echo "  - Only removed from git tracking"
echo "  - Future snapshots won't be pushed (per new .gitignore)"
echo ""
