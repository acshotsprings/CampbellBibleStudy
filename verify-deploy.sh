#!/usr/bin/env bash
# ============================================================
# verify-deploy.sh — Campbell Bible Study deployment checker
# ============================================================
# Run this AFTER every GitHub Desktop commit/push to catch
# drag-and-drop disasters (e.g. main.js clobbered with HTML,
# David Library index swapped with chapter content).
#
# Usage:
#   bash verify-deploy.sh
#   bash verify-deploy.sh --quick    # skip optional chapters
#
# Exit code 0 = all OK, 1 = at least one mismatch.
# ============================================================

set -u

RAW="https://raw.githubusercontent.com/acshotsprings/CampbellBibleStudy/main"
QUICK=${1:-}

# Colors (auto-disable if not a TTY)
if [ -t 1 ]; then
  GREEN=$'\033[32m'; RED=$'\033[31m'; YELLOW=$'\033[33m'; DIM=$'\033[2m'; RESET=$'\033[0m'
else
  GREEN=""; RED=""; YELLOW=""; DIM=""; RESET=""
fi

PASS=0
FAIL=0
WARN=0
FAILURES=()

# ------------------------------------------------------------
# check_html PATH "expected substring in <title>" [min_bytes]
# Verifies a file at $PATH on the live raw URL contains the
# expected title substring AND meets the minimum byte size.
# ------------------------------------------------------------
check_html() {
  local path="$1"
  local expect="$2"
  local min_bytes="${3:-1000}"

  local body
  body=$(curl -sL --max-time 15 "$RAW/$path")
  local bytes=${#body}
  local title
  title=$(printf '%s' "$body" | grep -i -o '<title>[^<]*</title>' | head -1 | sed 's/<[^>]*>//g' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')

  if [ "$bytes" -lt "$min_bytes" ]; then
    echo "${RED}✗${RESET} $path"
    echo "  ${DIM}size $bytes bytes (expected ≥ $min_bytes)${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("$path — size $bytes < $min_bytes")
    return 1
  fi

  if printf '%s' "$title" | grep -q -i -- "$expect"; then
    echo "${GREEN}✓${RESET} $path ${DIM}($bytes bytes — \"$title\")${RESET}"
    PASS=$((PASS+1))
    return 0
  else
    echo "${RED}✗${RESET} $path"
    echo "  ${DIM}expected title to contain: $expect${RESET}"
    echo "  ${DIM}got title: $title${RESET}"
    echo "  ${DIM}size: $bytes bytes${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("$path — title mismatch (expected \"$expect\", got \"$title\")")
    return 1
  fi
}

# ------------------------------------------------------------
# check_js PATH "expected substring (function name, etc)" min_bytes
# Verifies a JS/CSS file contains the expected token and
# is NOT actually HTML (catches the main.js clobber pattern).
# ------------------------------------------------------------
check_js() {
  local path="$1"
  local expect="$2"
  local min_bytes="${3:-5000}"

  local body
  body=$(curl -sL --max-time 15 "$RAW/$path")
  local bytes=${#body}
  local first_line
  first_line=$(printf '%s' "$body" | head -1)

  # Catch the clobber pattern: a .js or .css file that starts with HTML
  if printf '%s' "$first_line" | grep -q -i "<!DOCTYPE\|<html\|<head\|<body"; then
    echo "${RED}✗${RESET} $path — ${RED}FILE IS HTML, NOT JS/CSS${RESET}"
    echo "  ${DIM}first line: $first_line${RESET}"
    echo "  ${DIM}size: $bytes bytes${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("$path — clobbered with HTML content")
    return 1
  fi

  if [ "$bytes" -lt "$min_bytes" ]; then
    echo "${RED}✗${RESET} $path"
    echo "  ${DIM}size $bytes bytes (expected ≥ $min_bytes)${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("$path — size $bytes < $min_bytes")
    return 1
  fi

  if printf '%s' "$body" | grep -q -- "$expect"; then
    echo "${GREEN}✓${RESET} $path ${DIM}($bytes bytes — contains \"$expect\")${RESET}"
    PASS=$((PASS+1))
    return 0
  else
    echo "${RED}✗${RESET} $path"
    echo "  ${DIM}expected to contain: $expect${RESET}"
    echo "  ${DIM}size: $bytes bytes${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("$path — missing expected token \"$expect\"")
    return 1
  fi
}

# ------------------------------------------------------------
# Header
# ------------------------------------------------------------
echo ""
echo "============================================================"
echo "  Campbell Bible Study — Deploy Verification"
echo "  $(date)"
echo "============================================================"
echo ""

# ------------------------------------------------------------
# TIER 1 — Critical infrastructure (site-breaking if wrong)
# ------------------------------------------------------------
echo "${YELLOW}── Tier 1: Critical infrastructure ──${RESET}"
check_js  "assets/js/main.js"     "function initQuillEditors"  60000
check_js  "assets/js/nav.js"      "NAV_STRUCTURE"              20000
check_js  "assets/js/analytics.js" "gtag\\|G-P44J6HEJYG"       5000
echo ""

# ------------------------------------------------------------
# TIER 2 — Top-level pages
# ------------------------------------------------------------
echo "${YELLOW}── Tier 2: Top-level pages ──${RESET}"
check_html "index.html"           "Campbell Family Master"     5000
check_html "checklist.html"       "Prophecy Checklist"         20000
check_html "current-events.html"  "Current Events"             10000
check_html "sermons.html"         "Sermon"                     5000
check_html "journal.html"         "Journal"                    1000
check_html "convictions.html"     "Convictions"                1000
echo ""

# ------------------------------------------------------------
# TIER 3 — David Library — index + key chapters
# ------------------------------------------------------------
echo "${YELLOW}── Tier 3: David Library ──${RESET}"
check_html "characters/david/index.html"            "Life of David · Complete Reference"  5000
check_html "characters/david/01-origins.html"       "Chapter 01"                          5000
check_html "characters/david/05b-abigail.html"      "Chapter 05b: Abigail"                5000
check_html "characters/david/05c-cave-years.html"   "Cave Years"                          5000
check_html "characters/david/06-ziklag.html"        "Ziklag"                              5000
check_html "characters/david/07-king-of-judah.html" "Chapter 07"                          5000
check_html "characters/david/19-david-vs-saul.html" "Chapter 19: David vs. Saul"          5000
check_html "characters/david/23-prayer.html"        "Chapter 23: David & Prayer"          5000
echo ""

# ------------------------------------------------------------
# TIER 4 — Theme modules (spot-check)
# ------------------------------------------------------------
echo "${YELLOW}── Tier 4: Theme modules (spot-check) ──${RESET}"
check_html "theme1/module1.html"  "Daniel"                           5000
check_html "theme1/module9.html"  "Gog-Magog"                        5000
check_html "theme1/module15.html" "Armageddon"                       5000
check_html "theme2/index.html"    "Calendar\\|Theme 2"               2000
check_html "theme3/index.html"    "Judgment\\|Mercy\\|Theme 3"       2000
check_html "theme4/index.html"    "Covenant\\|Theme 4"               2000
echo ""

# ------------------------------------------------------------
# TIER 5 — Watchdog: confirm key files are NOT mis-routed
# Catches the symmetric clobber: HTML file that turns out to
# be JS, image, or wrong-named content.
# ------------------------------------------------------------
echo "${YELLOW}── Tier 5: Anti-shuffle watchdog ──${RESET}"
echo "${DIM}  Confirms key files aren't byte-identical to each other${RESET}"
echo "${DIM}  (catches the 'drag-shuffled by alphabetical order' bug)${RESET}"

sha_main=$(curl -sL "$RAW/assets/js/main.js" | sha256sum | awk '{print $1}')
sha_davidx=$(curl -sL "$RAW/characters/david/index.html" | sha256sum | awk '{print $1}')
sha_ch19=$(curl -sL "$RAW/characters/david/19-david-vs-saul.html" | sha256sum | awk '{print $1}')
sha_ch23=$(curl -sL "$RAW/characters/david/23-prayer.html" | sha256sum | awk '{print $1}')
sha_ch5b=$(curl -sL "$RAW/characters/david/05b-abigail.html" | sha256sum | awk '{print $1}')
sha_chk=$(curl -sL "$RAW/checklist.html" | sha256sum | awk '{print $1}')

watchdog_pair() {
  local a_name="$1" a_sha="$2" b_name="$3" b_sha="$4"
  if [ "$a_sha" = "$b_sha" ]; then
    echo "${RED}✗${RESET} $a_name and $b_name are byte-identical — ${RED}SHUFFLE BUG${RESET}"
    FAIL=$((FAIL+1))
    FAILURES+=("Shuffle: $a_name == $b_name")
  else
    echo "${GREEN}✓${RESET} $a_name ≠ $b_name"
    PASS=$((PASS+1))
  fi
}

watchdog_pair "main.js"             "$sha_main"   "david/index.html" "$sha_davidx"
watchdog_pair "david/index.html"    "$sha_davidx" "ch 19"            "$sha_ch19"
watchdog_pair "ch 19"               "$sha_ch19"   "ch 23"            "$sha_ch23"
watchdog_pair "ch 23"               "$sha_ch23"   "ch 05b"           "$sha_ch5b"
watchdog_pair "checklist"           "$sha_chk"    "david/index.html" "$sha_davidx"
echo ""

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------
echo "============================================================"
TOTAL=$((PASS+FAIL))
if [ "$FAIL" -eq 0 ]; then
  echo "  ${GREEN}ALL CLEAR — $PASS / $TOTAL checks passed${RESET}"
  echo "============================================================"
  echo ""
  exit 0
else
  echo "  ${RED}FAILED — $FAIL of $TOTAL checks failed${RESET}"
  echo ""
  echo "  Failures:"
  for f in "${FAILURES[@]}"; do
    echo "  ${RED}•${RESET} $f"
  done
  echo "============================================================"
  echo ""
  echo "${YELLOW}NEXT STEPS:${RESET}"
  echo "  1. DO NOT push more commits until these are fixed"
  echo "  2. Check the affected files in GitHub Desktop's history"
  echo "  3. If it's a shuffle (Tier 5 fail), use git revert or"
  echo "     restore files one at a time, NOT drag-and-drop multiple"
  echo ""
  exit 1
fi
