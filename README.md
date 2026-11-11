# Mayura — Parth & Prerna

Royal peacock save-the-date site for the wedding celebrations on **11 & 12 December**.

**Theme:** Mayura (peacock) — teal, emerald, antique gold, Krishnaji blessings, ornate palace doors that open as you scroll.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

## Deploy to Netlify

1. Push this repo to GitHub (or drag the folder into [Netlify Drop](https://app.netlify.com/drop)).
2. In Netlify: **Add new site → Import from Git** → pick the repo.
3. Build settings:
   - **Build command:** leave empty (or use the one in `netlify.toml`)
   - **Publish directory:** `.` (site root)
4. Deploy. Custom domain optional under **Domain settings**.

### Quick update later

Edit copy in `index.html` (venues, times, event names), tweak colours in `css/styles.css`, push — Netlify redeploys automatically.

## Customise

| What | Where |
|------|--------|
| Couple names / dates | `index.html` hero + footer |
| Event details & venues | `#events` section in `index.html` |
| Countdown target | `WEDDING_DATE` in `js/main.js` |
| Colours | CSS variables in `css/styles.css` `:root` |

## Stack

Static HTML, CSS, and vanilla JS — no framework, no build step.
