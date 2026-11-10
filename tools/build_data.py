"""Snapshot Garimela's public API into one slim data/site.json for the static rebuild.

    py -3 tools/build_data.py            # fetch live from admin.garimela.com
    py -3 tools/build_data.py --offline  # rebuild from _research/*.json dumps

Drops personal/internal fields (emails, creator, engine/chassis numbers).
"""
import json, math, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "_research"
API = "https://admin.garimela.com/api/v1"
OFFLINE = "--offline" in sys.argv


def get(endpoint, cache):
    if not OFFLINE:
        req = urllib.request.Request(f"{API}/{endpoint}", headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.load(r)
        cache.write_text(json.dumps(data, ensure_ascii=False), encoding="utf8")
        return data
    return json.loads(cache.read_text(encoding="utf8"))


# depot names in the CMS are free text (~95 spellings) -> district.
# first matching keyword wins, so specific places sit above "dhaka".
DISTRICTS = [
    ("chattogram", "Chattogram", "চট্টগ্রাম", 22.36, 91.78, ["chatt", "chitt", "ctg", "hathajari", "হাটহাজারী", "potia", "mirsharai", "khan mor", "coenelhat", "pahartoly"]),
    ("gazipur", "Gazipur", "গাজীপুর", 24.00, 90.42, ["gazipur", "nawjhor", "tongi", "mawna"]),
    ("narayanganj", "Narayanganj", "নারায়ণগঞ্জ", 23.62, 90.50, ["narayan", "sonargaon", "mavis", "kanchpur"]),
    ("jashore", "Jashore", "যশোর", 23.17, 89.21, ["jessore", "jashore", "lawjani"]),
    ("cumilla", "Cumilla", "কুমিল্লা", 23.46, 91.18, ["cumilla", "comilla"]),
    ("faridpur", "Faridpur", "ফরিদপুর", 23.61, 89.84, ["faridpur"]),
    ("bogura", "Bogura", "বগুড়া", 24.85, 89.37, ["bogura", "bogra"]),
    ("mymensingh", "Mymensingh", "ময়মনসিংহ", 24.75, 90.41, ["mymens"]),
    ("rajshahi", "Rajshahi", "রাজশাহী", 24.37, 88.60, ["rajshahi"]),
    ("habiganj", "Habiganj", "হবিগঞ্জ", 24.37, 91.41, ["habig", "sayestaganj"]),
    ("rangpur", "Rangpur", "রংপুর", 25.75, 89.25, ["rangpur"]),
    ("barishal", "Barishal", "বরিশাল", 22.70, 90.37, ["barishal", "barisal"]),
    ("sylhet", "Sylhet", "সিলেট", 24.89, 91.87, ["sylhet"]),
    ("rangamati", "Rangamati", "রাঙ্গামাটি", 22.65, 92.17, ["rangamati"]),
    ("tangail", "Tangail", "টাঙ্গাইল", 24.25, 89.92, ["tangail"]),
    ("khulna", "Khulna", "খুলনা", 22.82, 89.55, ["khulna"]),
    ("noakhali", "Noakhali", "নোয়াখালী", 22.87, 91.10, ["noakhali"]),
    ("pabna", "Pabna", "পাবনা", 24.00, 89.24, ["pabna"]),
    ("narsingdi", "Narsingdi", "নরসিংদী", 23.92, 90.72, ["narsingdi"]),
    ("satkhira", "Satkhira", "সাতক্ষীরা", 22.72, 89.07, ["satkhira"]),
    ("sirajganj", "Sirajganj", "সিরাজগঞ্জ", 24.45, 89.70, ["sirajg"]),
    ("rajbari", "Rajbari", "রাজবাড়ী", 23.76, 89.64, ["rajbari"]),
    ("lakshmipur", "Lakshmipur", "লক্ষ্মীপুর", 22.94, 90.83, ["lakshmipur"]),
    ("khagrachari", "Khagrachari", "খাগড়াছড়ি", 23.12, 91.98, ["khagra"]),
    ("bandarban", "Bandarban", "বান্দরবান", 22.20, 92.22, ["bandarban"]),
    ("madaripur", "Madaripur", "মাদারীপুর", 23.17, 90.19, ["madaripur"]),
    ("manikganj", "Manikganj", "মানিকগঞ্জ", 23.86, 90.00, ["manikg"]),
    ("natore", "Natore", "নাটোর", 24.41, 88.98, ["nator"]),
    ("meherpur", "Meherpur", "মেহেরপুর", 23.76, 88.63, ["meherpur"]),
    ("dhaka", "Dhaka", "ঢাকা", 23.81, 90.41, ["dhaka", "savar", "birulia", "ashulia", "bypile", "mirpur", "badda", "jatrabari", "abdullahpur", "mohammadpur", "beri badh", "dohar", "airport"]),
]


def district(raw):
    s = (raw or "").lower()
    for key, *_rest, kws in DISTRICTS:
        if any(k in s for k in kws):
            return key
    return None  # ponytail: unmapped (e.g. "Lohagara" is ambiguous) -> shown as raw text only


def unescape_all(s):
    """CMS stores some descriptions escaped 5+ times (&amp;amp;amp;...)."""
    import html
    while True:
        u = html.unescape(s)
        if u == s:
            return " ".join(u.split())
        s = u


assert unescape_all("oil &amp;amp;amp;  change") == "oil & change"


def bn(obj, field="name"):
    return ((obj or {}).get("bn_translation") or {}).get(field)


# ---------- vehicles ----------
vehicles, page = [], 1
(RES / "pages").mkdir(parents=True, exist_ok=True)
while True:
    d = get(f"get-vehicles?page={page}", RES / "pages" / f"p{page}.json")
    vehicles += d["products"]
    if not d["pagination"]["has_more_pages"]:
        break
    page += 1

out_v = []
for v in vehicles:
    spec = v.get("specifications") or {}
    raw = spec.get("depot_location") or v.get("depot_location") or ""
    out_v.append({
        "id": v["id"],
        "slug": v["product_slug"],
        "t": v["title"].strip(),
        "tb": (bn(v, "title") or v["title"]).strip(),
        "d": unescape_all(v.get("description") or ""),
        "brand": v["brand"]["brand_slug"] if v.get("brand") else None,
        "type": v["type_name"],
        "cash": v["cash_price"] or 0,
        "inst": v["installment_price"] or 0,
        "sold": bool(v["sold_status"]),
        "dep": district(raw),
        "depRaw": raw.strip(),
        "depBn": (v.get("depot_location_bn") or "").strip(),
        "reg": (v.get("registration_no") or spec.get("registration_number") or "").strip(),
        "color": v.get("color_name"),
        "body": v.get("body_type_name"),
        "fuel": v.get("fuel_type_name"),
        "ends": v.get("offer_ends_at"),
        "img": v.get("images") or [],
    })

# ---------- taxonomy ----------
home = get("get-homepage", RES / "get-homepage.json")
types_raw = get("get-categories-types", RES / "get-categories-types.json")["types"]
brands_raw = get("get-brands", RES / "get-brands.json")
brands_raw = brands_raw.get("brands", brands_raw) if isinstance(brands_raw, dict) else brands_raw
faqs_raw = get("get-faqs", RES / "get-faqs.json")["faqs"]

avail = [v for v in out_v if not v["sold"]]
types = [{
    "name": t["name"], "bn": bn(t) or t["name"], "icon": t.get("icon_image"),
    "count": sum(1 for v in avail if v["type"] == t["name"]),
    "total": sum(1 for v in out_v if v["type"] == t["name"]),
} for t in types_raw]
types = [t for t in types if t["total"]]

brands = [{
    "slug": b["brand_slug"], "name": b["name"], "bn": bn(b) or b["name"], "logo": b.get("icon_image"),
    "count": sum(1 for v in avail if v["brand"] == b["brand_slug"]),
    "total": sum(1 for v in out_v if v["brand"] == b["brand_slug"]),
} for b in brands_raw]
brands = sorted([b for b in brands if b["total"]], key=lambda b: -b["total"])

# ---------- Bangladesh outline (equirectangular, lon scaled by cos(lat)) ----------
# geoBoundaries gbOpen BGD ADM0 (simplified), CC-BY 4.0
geo = json.loads((RES / "BGD_gb.geojson").read_text(encoding="utf8"))
g = geo["features"][0]["geometry"]
polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
polys = [[ring for ring in poly if len(ring) > 6] for poly in polys]
polys = [p for p in polys if p]
K, W = math.cos(math.radians(23.7)), 1000
lons = [p[0] for poly in polys for ring in poly for p in ring]
lats = [p[1] for poly in polys for ring in poly for p in ring]
minx, maxx, miny, maxy = min(lons), max(lons), min(lats), max(lats)
S = W / ((maxx - minx) * K)
H = round((maxy - miny) * S)


def proj(lon, lat):
    return round((lon - minx) * K * S, 1), round((maxy - lat) * S, 1)


path = " ".join("M" + "L".join(f"{x},{y}" for x, y in (proj(*p) for p in ring)) + "Z"
                for poly in polys for ring in poly)

depots = {}
for key, en, bnn, lat, lon, _ in DISTRICTS:
    n_all = sum(1 for v in out_v if v["dep"] == key)
    if n_all:
        x, y = proj(lon, lat)
        depots[key] = {"en": en, "bn": bnn, "x": x, "y": y,
                       "count": sum(1 for v in avail if v["dep"] == key), "total": n_all}

# ---------- brand + type art: 1080px CMS cards -> local 480px webp ----------
from io import BytesIO
from PIL import Image


def localize(url, out, crop_top):
    out = ROOT / out
    if not url:
        return None
    if not out.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        im = Image.open(BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGBA")
        if crop_top and im.width == im.height:  # brand cards carry Gari Mela marks in the top band
            im = im.crop((0, int(im.height * crop_top), im.width, im.height))
        im.thumbnail((480, 480))
        out.parent.mkdir(parents=True, exist_ok=True)
        im.save(out, "WEBP", quality=82)
    return str(out.relative_to(ROOT)).replace("\\", "/")


for b in brands:
    b["logo"] = localize(b["logo"], f"assets/img/brands/{b['slug']}.webp", 0.14)
for x in types:
    x["icon"] = localize(x["icon"], f"assets/img/types/{x['name'].lower().replace(' ', '-')}.webp", 0)

site = {
    "updated": __import__("datetime").date.today().isoformat(),
    "vehicles": out_v,
    "types": types,
    "brands": brands,
    "depots": depots,
    "faqs": [{"q": f["question"], "qb": bn(f, "question") or f["question"],
              "a": f["answer"], "ab": bn(f, "answer") or f["answer"]} for f in faqs_raw],
    "testimonials": [{"name": t["name"], "role": t.get("company"), "text": t["content"],
                      "img": t.get("image"), "rating": t.get("rating")} for t in home.get("testimonials", [])],
    "bd": {"path": path, "w": W, "h": H},
}
(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data/site.json").write_text(json.dumps(site, ensure_ascii=False, separators=(",", ":")), encoding="utf8")

unmapped = sorted({v["depRaw"] for v in out_v if not v["dep"]})
assert len(out_v) == len({v["slug"] for v in out_v}), "duplicate slugs"
print(f"{len(out_v)} vehicles ({len(avail)} available), {len(types)} types, {len(brands)} brands, "
      f"{len(depots)} depot districts, unmapped depots: {unmapped}")
