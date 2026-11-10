"""Cut the real 7-vehicle lineup out of the live site's red banner (slider-01).

Background is a saturated red stage; no vehicle in the lineup is red, so a
hue/saturation key plus hole-filling gives a clean alpha. Run:
    py -3 tools/cutout.py
"""
import cv2
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_research/live/slider-01.jpg"
OUT = ROOT / "assets/img"

img = cv2.imread(str(SRC))
h, w = img.shape[:2]
# vehicle band, measured from the banner
x0, x1, y0, y1 = int(w * 0.18), int(w * 0.822), int(h * 0.44), int(h * 0.96)
crop = img[y0:y1, x0:x1]

hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
hue, sat, val = cv2.split(hsv)
# stage measures hue 175-178 (OpenCV 0-180); orange Eicher shading reaches hue 2-8
red = ((hue >= 168) | (hue <= 1)) & (sat > 110)
fg = (~red).astype(np.uint8) * 255

# drop speckle, then fill interior holes (red reflections on chrome/glass)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(fg)
keep = np.zeros_like(fg)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] > 4000:  # only vehicle-sized blobs
        keep[lab == i] = 255
cnts, _ = cv2.findContours(keep, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
solid = np.zeros_like(keep)
cv2.drawContours(solid, cnts, -1, 255, thickness=cv2.FILLED)

# red still inside a vehicle silhouette = stage seen through glass or floor glow:
# repaint as dark tinted glass / contact shadow, keeping the original shading
inner = red & (solid > 0)
v = val[inner].astype(np.float32) * 0.2
crop = crop.copy()
crop[inner] = np.stack([v + 14, v + 10, v + 8], axis=1).astype(np.uint8)

# soft 1.5px edge to kill the matte halo
alpha = cv2.GaussianBlur(cv2.erode(solid, np.ones((3, 3), np.uint8)), (0, 0), 1.2)

# despill: pull red fringe on edges toward neutral
b, g, r = cv2.split(crop.astype(np.float32))
edge = (alpha > 0) & (alpha < 250)
r[edge] = np.minimum(r[edge], (g[edge] + b[edge]) / 2 + 40)
rgba = cv2.merge([b, g, np.clip(r, 0, 255), alpha.astype(np.float32)]).astype(np.uint8)

ys, xs = np.where(alpha > 8)
rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
for width, name in [(2400, "lineup.webp"), (1200, "lineup-sm.webp")]:
    s = width / rgba.shape[1]
    out = cv2.resize(rgba, (width, int(rgba.shape[0] * s)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(OUT / name), out, [cv2.IMWRITE_WEBP_QUALITY, 88])

# preview on contrasting backgrounds for halo inspection
prev = cv2.resize(rgba, (1400, int(rgba.shape[0] * 1400 / rgba.shape[1])))
a = prev[:, :, 3:4] / 255.0
rows = [(prev[:, :, :3] * a + np.full_like(prev[:, :, :3], c) * (1 - a)).astype(np.uint8)
        for c in ((255, 255, 255), (40, 30, 20), (60, 60, 230))]
cv2.imwrite(str(ROOT / "_research/live/_cutout_check.jpg"), np.vstack(rows))
print("ok", rgba.shape)
