# The P Story — Parth & Prerna

Save-the-date site for **11 & 12 December**, with scenic palace / lake / resort backgrounds, scroll-moving peacocks, doors that open onto the venue view, and a Netlify Forms RSVP.

## Pages

| Path | Purpose |
|------|---------|
| `/` (`index.html`) | Invitation, doors, events, countdown |
| `/rsvp.html` | Guest RSVP (plus-one, days, arrival / departure) |
| `/rsvp-success.html` | Thank-you after submit |

## Local preview

```bash
npx --yes serve .
```

## Netlify

1. Connect the GitHub repo (or drag-drop the folder).
2. **Publish directory:** `.`
3. **Build command:** empty (or the echo in `netlify.toml`).
4. After first deploy, open **Forms** in Netlify — submissions from `rsvp` appear there.
5. Optional: Forms → form notifications → email alert on new RSVP.

### Swap backgrounds later

Drop your photos into `images/` and keep these names (or update the `src` paths in HTML):

- `hero-cinematic.jpg` — hero
- `door-reveal-lake.jpg` — view behind the doors
- `peacock-scroll.jpg` — peacocks in the UI
- `palace-fort.jpg`, `resort.jpg`, `lake.jpg`, `lake-resort.jpg` — section backdrops

## RSVP fields

Name, email, phone, attending, plus-one (+ name), which event days, arrival date, departure date, notes.
