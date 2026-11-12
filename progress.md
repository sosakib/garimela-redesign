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

## 12 Nov 2026, round 3 (three palette themes)
- [x] Brief: three palettes from the user's swatch sheet, each light + dark, more gradient / glass / modern, with a human touch. PRODUCT.md written (register: brand; personality: warm, local, crafted; avoid beige luxury).
- [x] Themes: হেমন্ত Harvest (emerald / slate / gold), গোধূলি Dusk (navy / orange / white), বর্ষা Monsoon (charcoal / mist / teal). `themes.css` tokens, `theme-init.js` (no flash, `?theme=&mode=` share links).
- [x] Each theme has its own hero sky and weather (golden chaff, twilight stars, rain + wet-road reflection), radii, display width and glass blur.
- [x] Picker: native popover in the nav, inline in the phone menu; palette x Day / Auto / Night; circular view-transition reveal from the tapped control.
- [x] Human touches: greeting chip (time of day + live count), hand-drawn underlines, Atma handwritten notes, taped testimonial notes, alpona rosette (`assets/rosette.svg`) as hero sun and section watermarks, paper grain.
- [x] Nav collapses to the menu below 1100px (links wrapped at 1024).
- [x] Verified: 18 text/background pairs pass AA in all 6 modes (measured in the browser), hero copy >= 4.8:1 on every sky at 1024 and 375, no horizontal overflow at 375, listing + detail pages themed, choice persists across pages.

## 12 Nov 2026, round 4 (more colour in the body)
- [x] Prices hang on showroom tags in each theme's own tag colour, never the action colour: Harvest gold, Dusk navy "night ticket" with amber figures (amber in dark), Monsoon kadam-flower yellow. Detail page price = two-part ticket (cash stub + perforated installment stub).
- [x] Category colours, three per theme taken in turn: Harvest emerald / harvest gold / river slate, Dusk orange / twilight blue / dusk rose, Monsoon river teal / kadam yellow / water-hyacinth lilac. Used on body-type bays and counts, brand counts, step stamps and rules, note tapes and initials, spec stripes. Tint and text derived per element by fixing OKLCH lightness.
- [x] Trust section is now a committed colour band, a different region per theme: ripe paddy gold, sunset peach (plum-indigo in dark), water-hyacinth lilac.
- [x] Accent colour on hero figures, depot counts and prices, footer headings and hotline; brand colour on card brand lines, listing count, FAQ.
- [x] Verified in the browser: every new text pair passes AA in all 6 modes.

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
