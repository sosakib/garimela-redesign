# Garimela rebuild: progress

## 10 Nov 2026
- [x] Crawled garimela.com (React SPA, no sitemap): 21 routes from the bundle, public API at admin.garimela.com/api/v1 (7 endpoints).
- [x] Snapshot: 557 vehicles (425 available, 132 sold), 6 types, 15 brands, 9 FAQs, 4 testimonials -> `data/site.json` via `tools/build_data.py`.
- [x] Depot names (~95 free-text spellings) normalised to 30 districts; only "Lohagara" unmapped (ambiguous: Narail or Chattogram).
- [x] Hero asset: 7-vehicle lineup cut out of live banner slider-01 (`tools/cutout.py`, red key + glass repaint).
- [x] Brand and type art copied from the CMS cards to local 480px webp.
- [x] Pages: index, vehicles, vehicle, brands, about, help, careers, terms (bn + en), privacy (en only, as live), 404.
- [x] Verified in preview at 1440 and 375: hero scroll planes, depot map tap, showroom tabs, filters + chips + empty state, EN toggle, no horizontal overflow.
- [x] Local git repo, first commit on `main`.
- [x] Public repo github.com/sosakib/garimela-redesign, Pages at https://sosakib.github.io/garimela-redesign/ (approved by user 10 Nov).

## 10 Nov 2026, round 2 (polish)
- [x] Dark mode: `light-dark()` tokens (follows system, toggle in nav, stored in `gm-theme`), dark logo variant, no flash on load, colours ease on switch.
- [x] Ambient background: three drifting brand-light blobs + pointer-lit dot field (echoes the depot map); off on touch, reduced motion and reduced transparency.
- [x] Motion: hero planes ease toward scroll (fps-independent damping), cross-page view transitions, staggered card entrances, depot-panel swap, smooth FAQ open, scroll-linked section reveals.
- [x] Mobile polish: hovers gated to mouse, no tap flash, 0.96 press, theme + language moved into the menu sheet on phones.
- [x] Verified light + dark at 1440 and 375, no horizontal overflow, no console errors.

## Data issues found on the live site (worth telling the client)
- Testimonial photos return 403 from the CDN (broken on garimela.com too). Rebuild uses monograms.
- Homepage stat "23 satisfied customers" contradicts the 132 sold vehicles in the data. Dropped.
- Footer TikTok/YouTube icons link to tiktok.com / youtube.com home, not a Gari Mela channel. Dropped.
- ~430 listings show "offer ends" dates already in the past (Sep 2025 / Sep 2026). Rebuild hides past dates.
- Some descriptions stored HTML-escaped 5+ times (`&amp;amp;amp;`). Rebuild decodes them.
- One FAQ is duplicated in the CMS ("How do I make the payment after winning a bid?").
- Privacy policy says "Gari Mela.com" for the URL; rebuild uses garimela.com.

## Not built (needs the real backend)
Login / OTP, account pages, offers, bidding, saved list. Buttons link to garimela.com.
