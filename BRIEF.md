# Garimela rebuild: brief

*Self-authored under explicit creative delegation* ("remake the UI/UX, improve the visuals, make the user feel more premium and elegant").
Source of truth for content: the live site garimela.com and its public API (admin.garimela.com/api/v1), crawled 10 Nov 2026.

## What it is, who it's for
Gari Mela (Rangs Motors) sells pre-owned commercial vehicles (pickups, trucks, buses, tippers, 3-wheelers) from Mahindra, Tata, Eicher, Ashok Leyland, JAC and 10 more brands, cash or installment, out of depots across Bangladesh.
Buyer: a transport owner, driver-owner or trader (testimonials: আড়ৎ ব্যবসায়ী, ড্রাইভার, ব্যবসায়ী), mostly on a phone, Bangla first.

**Scene sentence:** a pickup owner in Jashore checks prices on his phone at midday between trips, then calls 16758 to see the truck at the nearest depot. -> light theme, high contrast, Bangla-first, big tap targets.

## Must believe by the end
"The vehicle I need is already sitting at a depot near me, at a clear price."

## One action
Call **16758** (label everywhere: "এখনই কল করুন / Call now"). Secondary: open a vehicle.

## The eight topics
1. **Vibe:** showroom floor at Rangs Bhaban; a brand-red stage; honest price tags. References: a car-launch stage, a museum label, a well-printed bus timetable.
2. **Journey:** recognition (the lineup you know) -> range (what body type) -> choice (real vehicles, real prices) -> proximity (where it sits, depot map) -> trust (workshops, real buyers) -> how buying works -> call.
3. **Energy:** loud red hero, calm catalog, one interactive peak (map), quiet trust, firm close.
4. **Feeling curve:** see below. **Peak:** the depot map: "I tapped Jashore and it showed 56 vehicles 20 minutes from me."
5. **No other site does:** show the whole stock as a live map of Bangladesh, built from the real depot data.
6. **Range:** premium-minimal, committed brand red, editorial labels. Not glassy everywhere: glass only on things you touch (nav, search dock, segmented control).
7. **Structure:** distinct scenes, not one continuous world.
8. **Assets:** live-site banners (lineup cut out of slider-01), brand logos, type icons, 557 listing photos, 4 testimonial photos. Nothing generated.

## Grammar
*Showroom catalog* (gallery/catalog with a staged hero): nav is an index (body types + brands), every vehicle wears the same label schema (brand · model · depot · cash · installment), the close is an input (search + call plate).

## Feeling curve
| Act | Feeling | Cause |
|---|---|---|
| Hero | recognition, pride | the real 7-vehicle lineup on the red stage; it rolls toward you as you scroll, the wordmark sinks behind it |
| Body types | orientation | six tiles with live counts |
| Showroom | choice | segmented control swaps real stock; uniform price labels |
| **Depot map (peak)** | **"it's near me"** | Bangladesh drawn from boundary data; 30 districts light up by stock; tap one to see what's there |
| Brands | familiarity | 15 makers with counts |
| Trust | reassurance | workshop + experience figures quoted from the client's own site, on navy |
| How to buy | clarity | the real 3-step process from the FAQ |
| Voices | warmth | real buyers, real photos |
| Close | resolve | 16758 in big type + a search field |

Tell-someone sentence: *"It's the site where you tap your district and see the trucks parked there."*

## Number rules
Only sourced numbers: vehicle/brand/depot counts are computed from the API snapshot; "23 workshops" and "30 years" are quoted from the live homepage. The live site's "23 satisfied customers" is dropped (contradicts 132 sold vehicles in the data).
