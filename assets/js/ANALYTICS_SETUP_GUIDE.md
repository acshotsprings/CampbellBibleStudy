# 📊 Analytics.js Setup Guide
**Campbell Bible Study Website**
**Created: April 22, 2026**

---

## What This Does

The `analytics.js` file handles TWO systems at once:

1. **Google Analytics 4** — tracks every page view, time on site, which modules get read
2. **EmailJS Notifications** — sends you an email when:
   - Someone visits the site (first page view per session)
   - Someone saves their notes

All emails go to: **acshotsprings@gmail.com**

---

## Step 1: Upload `analytics.js` to GitHub

Upload the `analytics.js` file to this exact location in your repo:

```
CampbellBibleStudy/assets/js/analytics.js
```

Use GitHub Desktop drag-and-drop into the `assets/js/` folder.

---

## Step 2: Add the Script Tag to Every Page

Copy the appropriate script tag below and paste it into the `<head>` section of each page, **right before the closing `</head>` tag**.

### 🟦 For `index.html` (root level):

```html
<script src="assets/js/analytics.js"></script>
```

### 🟦 For `journal.html`, `sermons.html`, `convictions.html`, `resources.html`, etc. (root level):

```html
<script src="assets/js/analytics.js"></script>
```

### 🟩 For module pages inside `theme1/`, `theme2/`, `theme3/`:

```html
<script src="../assets/js/analytics.js"></script>
```

(The `../` means "go up one folder level to find assets")

### 🟥 For any page deeper than one folder (rare):

```html
<script src="../../assets/js/analytics.js"></script>
```

---

## Step 3: Where Exactly to Paste

Look for this pattern at the top of each page:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Some Title — Campbell Bible Study</title>
  <link rel="stylesheet" href="...">
  <!-- PASTE THE SCRIPT TAG HERE, right before </head> -->
</head>
```

---

## Step 4: Pages to Update

Here is the full list of pages that need the script tag added:

### Root-level pages (use `assets/js/analytics.js`):
- [ ] `index.html`
- [ ] `journal.html`
- [ ] `sermons.html`
- [ ] `convictions.html`
- [ ] `resources.html`
- [ ] `DeepDives.html`
- [ ] `DeepDive-Gematria.html`
- [ ] `numbers-skepticism.html`
- [ ] Any other root-level HTML files

### Theme 1 module pages (use `../assets/js/analytics.js`):
- [ ] `theme1/index.html`
- [ ] `theme1/module1.html`
- [ ] `theme1/module2.html`
- [ ] `theme1/module3.html`
- [ ] `theme1/module4.html`
- [ ] `theme1/module5.html`
- [ ] `theme1/module6.html`
- [ ] `theme1/module7.html`
- [ ] `theme1/module8.html`
- [ ] `theme1/module9.html`
- [ ] `theme1/module10.html`
- [ ] `theme1/module11.html`
- [ ] `theme1/module12.html`
- [ ] `theme1/module13.html`
- [ ] `theme1/module14.html`
- [ ] `theme1/module15.html`

### Theme 2 module pages (use `../assets/js/analytics.js`):
- [ ] `theme2/index.html`
- [ ] `theme2/module1.html`
- [ ] `theme2/module2.html`
- [ ] `theme2/module3.html`
- [ ] `theme2/module4.html`

### Theme 3 module pages (use `../assets/js/analytics.js`):
- [ ] `theme3/index.html`
- [ ] Any other theme3 files as they get built

---

## Step 5: Test It

After uploading everything:

1. **Open an incognito/private browser window** (so session storage is fresh)
2. Visit `https://acshotsprings.github.io/CampbellBibleStudy/`
3. Wait ~5 seconds
4. Check your Gmail — you should see a notification email titled something like **"Visitor hit site"**
5. Open the browser's developer console (F12) — you should see either:
   - `[CBSG Analytics] Email sent: Visitor hit site` (success)
   - `[CBSG Analytics] Email notification failed: ...` (troubleshooting info)

If the email shows up in your Gmail, **you're live.**

---

## How to Verify Google Analytics Is Working

1. Go to `analytics.google.com`
2. Navigate to your **Campbell Bible Study** property
3. Click **Reports** → **Realtime**
4. Open your site in another browser tab
5. You should see yourself appear as "1 user in last 30 minutes"

---

## Troubleshooting

**"I'm not getting emails":**
- Check spam folder first
- Verify EmailJS template `template_275v5hl` has the right variables configured (to_email, visitor_name, event_type, page_url, page_title, timestamp, extra_info, user_agent)
- Check browser console for error messages

**"GA isn't tracking":**
- Make sure `analytics.js` file is actually uploaded to `assets/js/analytics.js`
- Make sure the `<script>` tag path matches the folder depth of the page
- Try an incognito window — browser extensions can block GA

**"Getting too many emails":**
- The script fires ONE email per session per browser
- If you're getting multiples, check for duplicate `<script>` tags on the same page
- Incognito windows each count as new sessions

---

## Adding New Module Pages in the Future

Every new module page you create must include this line in the `<head>`:

```html
<script src="../assets/js/analytics.js"></script>
```

(or the correct relative path based on folder depth)

If you forget, that page won't track visits or fire emails — everything else will still work.

---

## What Chris Will See in the Email

Each notification email will include:
- **Who** — visitor name (if they entered one) or "Unknown Visitor"
- **What** — event type (visitor hit site / notes saved)
- **Where** — page URL and title
- **When** — full timestamp
- **Extra info** — landing page or note context
- **Device info** — browser/device user agent string

---

*Generated by Claude, April 22, 2026, for the Campbell Family Master Biblical Study Guide.*
