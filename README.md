# Gari Mela: website redesign preview

A redesign concept for [garimela.com](https://garimela.com) (Rangs Motors Ltd.): same content and live stock, rebuilt for a premium, Bangla-first, mobile-first experience.

**Live preview:** https://sosakib.github.io/garimela-redesign/

## What's in it
| Page | File | Live-site equivalent |
|---|---|---|
| Home | `index.html` | `/` |
| All vehicles (search + filters) | `vehicles.html` | `/all-vehicles`, `/vehicles/:slug`, `/all-category` |
| Vehicle detail | `vehicle.html?v=<slug>` | `/vehicle-details/:slug` |
| Brands | `brands.html` | `/all-brand` |
| About, Careers, Help/FAQ | `about.html`, `careers.html`, `help.html` | same |
| Terms, Privacy | `terms.html`, `privacy.html` | same |

Login, account, offers and bidding stay on garimela.com (they need the real backend); buttons link there.

## Themes
Three palettes, each in light and dark (picker = the swatch button in the nav, or the menu on phones). Any page takes `?theme=` and `?mode=` for a direct preview:

| Theme | Palette | Light | Dark |
|---|---|---|---|
| **হেমন্ত / Harvest**: paddy green, golden sun, golden chaff drifting on the hero | `#117D65` `#667588` `#D7A753` | [light](https://sosakib.github.io/garimela-redesign/?theme=harvest&mode=light) | [dark](https://sosakib.github.io/garimela-redesign/?theme=harvest&mode=dark) |
| **গোধূলি / Dusk**: twilight sky, headlight orange, first stars | `#112639` `#EA7832` `#FFFFFF` | [light](https://sosakib.github.io/garimela-redesign/?theme=dusk&mode=light) | [dark](https://sosakib.github.io/garimela-redesign/?theme=dusk&mode=dark) |
| **বর্ষা / Monsoon**: river teal, rain across the stage, trucks mirrored on the wet road | `#1E272E` `#F4F8FB` `#0B7E90` | [light](https://sosakib.github.io/garimela-redesign/?theme=monsoon&mode=light) | [dark](https://sosakib.github.io/garimela-redesign/?theme=monsoon&mode=dark) |

Tokens live in `assets/themes.css` (one block per palette, `light-dark()` for the mode); `assets/theme-init.js` applies the choice before first paint. Each theme also sets its own radii, display-type width and glass blur. All text pairs pass WCAG AA in all six modes.

## Highlights
- **Layered hero:** the real 7-vehicle lineup (cut out of the site's own banner) on a theme sky with an alpona rosette rising like a low sun; scrolling moves the planes at different rates, then frames the stage into the page.
- **Human touches:** time-of-day greeting with the live stock count, hand-drawn underlines, handwritten notes (Atma), buyers' words as taped-up notes, alpona watermarks.
- **Glass + light:** glass on floating and touchable layers (nav, search dock, theme picker, filters, depot panel), translucent cards with a rim that catches each theme's accent; theme switches spread as a circle from the control you touched.
- **Depot map:** all stock drawn on a map of Bangladesh from the depot data (≈95 free-text depot names normalised to 30 districts). Tap a district to see what's parked there.
- **Showroom:** segmented control by body type, one price-label schema on every card.
- **বাংলা / English** toggle on every page, Bangla digits and lakh grouping.
- Accessible: keyboard paths, focus rings, 44px+ targets, reduced-motion and reduced-transparency fallbacks.

## Data
`data/site.json` is a snapshot of the public API (`admin.garimela.com/api/v1`). Refresh it with:

```bash
py -3 tools/build_data.py
```

Personal and internal fields (staff emails, engine and chassis numbers) are dropped. Brand and type art is copied from the CMS into `assets/img/`.

## Stack
Static HTML, one CSS file, one vanilla JS file. No build step. Font: Anek Bangla (Google Fonts). Map outline: geoBoundaries (CC BY 4.0).
