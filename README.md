# The P Story — Royal Garden of Love

Luxury wedding invitation for **Parth & Prerna** · **11 & 12 December 2026** · **Jabalpur, Madhya Pradesh**

Live: [thepstory.netlify.app](https://thepstory.netlify.app)

## Pages

| URL | Purpose |
|-----|---------|
| `/` | Invitation, doors, celebrations, blessing, countdown |
| `/rsvp.html` | Netlify Forms RSVP |
| `/rsvp-success.html` | Thank-you after RSVP |
| `/greeting.html` | Childhood audio greeting + print QR |

## Update wedding details

Edit [`js/wedding-config.js`](js/wedding-config.js):

- Couple names, brand, location
- Countdown ISO datetime
- Venue (`name`, `address`, `mapUrl`, or keep `label: "Venue details to follow"`)
- Event list (Lagoon, Phoolon Ki Haldi, Sangeet, Haldi, Baraat & Vivah)
- Venue defaults to Surya Resort, Siluwa, Jabalpur for all celebrations

## Add childhood greeting audio

1. Place an MP3 at **`assets/audio/childhood-greeting.mp3`**
2. Deploy
3. Test `/greeting.html` → “Tap to Hear My Message”
4. Print QR from **`assets/qr/greeting-qr.png`** (points to `https://thepstory.netlify.app/greeting.html`)

Browsers block unmuted autoplay — guests tap to play.

## Local preview & tests

```bash
npx --yes serve .
npm run test:visual
```

## Netlify

- Publish directory: `.`
- No build command required (or leave empty)
- Forms: confirm `rsvp` appears under Site → Forms after deploy

## Design references

Visual direction lives in `design_references/` (royal garden / jharokha / event cards).
