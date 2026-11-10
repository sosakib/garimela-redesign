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

## Highlights
- **Layered hero:** the real 7-vehicle lineup (cut out of the site's own banner) on the brand-red stage; scrolling moves four planes at different rates, then frames the stage into the page.
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
