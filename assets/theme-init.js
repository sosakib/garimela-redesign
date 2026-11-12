/* Runs in <head> before first paint, so no flash of the wrong theme.
   Palette: harvest | dusk | monsoon (gm-palette). Mode: light | dark, or follow the system when unset (gm-theme).
   ?theme=dusk&mode=dark on any URL applies and remembers them (shareable previews). */
(() => {
  const root = document.documentElement, q = new URLSearchParams(location.search);
  const PALETTES = ["harvest", "dusk", "monsoon"];
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { return null; } };
  let p = q.get("theme"), m = q.get("mode");
  if (PALETTES.includes(p)) ls("gm-palette", p); else p = ls("gm-palette");
  if (m === "light" || m === "dark") ls("gm-theme", m);
  else if (m === "auto") ls("gm-theme", null), (m = null);
  else m = ls("gm-theme");
  root.dataset.palette = PALETTES.includes(p) ? p : "harvest";
  root.dataset.theme = m === "light" || m === "dark" ? m : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
})();
