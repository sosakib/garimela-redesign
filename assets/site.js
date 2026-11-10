/* Gari Mela rebuild: shared runtime (i18n, data, header/footer, vehicle cards) + per-page init. */
(() => {
  "use strict";

  const HOTLINE = "16758";
  const LIVE = "https://garimela.com";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#${id}"/></svg>`;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- i18n ---------------- */
  const T = {
    bn: {
      skip: "মূল অংশে যান", home: "হোম", vehicles: "সব যানবাহন", brands: "ব্র্যান্ড", help: "সাহায্য", about: "আমাদের সম্পর্কে",
      callNow: "এখনই কল করুন", login: "লগইন", menu: "মেনু", close: "বন্ধ করুন", theme: "লাইট / ডার্ক মোড",
      cash: "নগদ মূল্য", inst: "কিস্তি মূল্য", sold: "বিক্রি হয়ে গেছে", viewAll: "সব দেখুন", photos: "ছবি",
      searchPh: "মডেল, ব্র্যান্ড বা জেলা লিখুন", searchBtn: "খুঁজুন", anyType: "সব ধরন",
      support: "কাস্টমার সাপোর্ট", hours: "রবি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা",
      address: "র‌্যাংগস ভবন, ১১৭/এ (লেভেল-৪), পুরাতন এয়ারপোর্ট রোড, বিজয় সরণি, তেজগাঁও, ঢাকা, বাংলাদেশ",
      products: "প্রোডাক্ট", company: "কোম্পানি", faq: "প্রশ্ন ও উত্তর", careers: "ক্যারিয়ার", privacy: "গোপনীয়তা নীতি", terms: "শর্তাবলী",
      rights: "গাড়িমেলা • কপিরাইট সংরক্ষিত", dev: "ডিজাইন এবং ডেভেলপমেন্ট", tagline: "রিকন্ডিশন ও পুনরায় বিক্রয়যোগ্য পিকআপ, বাস ও বাণিজ্যিক যানবাহন কেনার নির্ভরযোগ্য প্ল্যাটফর্ম।",
      units: (n) => `${n}টি`, vehiclesN: (n) => `${n}টি গাড়ি`, availableN: (n) => `${n}টি উপলব্ধ`,
      model: "মডেল", desc: "বিবরণ", type: "ধরন", brand: "ব্র্যান্ড", body: "বডির ধরন", fuel: "জ্বালানি", color: "রং", depot: "ডিপো", reg: "রেজিস্ট্রেশন নম্বর", id: "আইডি", offerEnds: "অফার চলবে",
    },
    en: {
      skip: "Skip to content", home: "Home", vehicles: "All vehicles", brands: "Brands", help: "Help", about: "About us",
      callNow: "Call now", login: "Log in", menu: "Menu", close: "Close", theme: "Light / dark mode",
      cash: "Cash price", inst: "Installment", sold: "Sold", viewAll: "View all", photos: "photos",
      searchPh: "Model, brand or district", searchBtn: "Search", anyType: "All types",
      support: "Customer support", hours: "Sun - Thu, 9 am - 6 pm",
      address: "Rangs Bhaban, 117/A (Level-4), Old Airport Road, Bijoy Sarani, Tejgaon, Dhaka, Bangladesh",
      products: "Products", company: "Company", faq: "FAQ", careers: "Careers", privacy: "Privacy policy", terms: "Terms & conditions",
      rights: "Gari Mela • All rights reserved", dev: "Design and development", tagline: "A trusted marketplace for reconditioned and resale pickups, buses and commercial vehicles.",
      units: (n) => `${n}`, vehiclesN: (n) => `${n} vehicle${n == 1 ? "" : "s"}`, availableN: (n) => `${n} available`,
      model: "Model", desc: "Description", type: "Type", brand: "Brand", body: "Body type", fuel: "Fuel", color: "Color", depot: "Depot", reg: "Registration no.", id: "ID", offerEnds: "Offer open until",
    },
  };
  let lang = "bn";
  try { lang = localStorage.getItem("gm-lang") || "bn"; } catch (e) {}
  const t = (k, ...a) => { const v = (T[lang] && T[lang][k]) ?? T.bn[k] ?? k; return typeof v === "function" ? v(...a) : v; };
  const isBn = () => lang === "bn";
  const nf = () => new Intl.NumberFormat(isBn() ? "bn-BD" : "en-IN");
  const num = (n) => nf().format(n);
  const money = (n) => `${num(n)}৳`;
  const digits = (s) => isBn() ? String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : String(s);
  const pick = (en, bn) => (isBn() ? bn || en : en || bn);

  function applyI18n(root = document) {
    document.documentElement.lang = lang;
    $$("[data-i18n]", root).forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]", root).forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-aria]", root).forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)));
  }
  const renderers = [];
  const onRender = (fn) => { renderers.push(fn); fn(); };
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("gm-lang", l); } catch (e) {}
    applyI18n();
    renderers.forEach((fn) => fn());
  }

  /* ---------------- theme ---------------- */
  const darkMQ = matchMedia("(prefers-color-scheme: dark)");
  function setTheme(th) {
    const root = document.documentElement;
    root.classList.add("theming");                       // colours ease, layout doesn't move
    root.dataset.theme = th;
    $$('meta[name="theme-color"]').forEach((m) => (m.content = th === "dark" ? "#12161f" : "#ED1C25"));
    setTimeout(() => root.classList.remove("theming"), 420);
  }
  darkMQ.addEventListener("change", (e) => { let s; try { s = localStorage.getItem("gm-theme"); } catch (er) {} if (!s) setTheme(e.matches ? "dark" : "light"); });

  /* ---------------- ambient background: drifting brand light + pointer-lit dot grid ---------------- */
  function ambient() {
    const el = document.createElement("div");
    el.className = "ambient";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<i class="ambient__blob b1"></i><i class="ambient__blob b2"></i><i class="ambient__blob b3"></i><i class="ambient__grid"></i>';
    document.body.prepend(el);
    if (reduceMotion.matches || !matchMedia("(pointer: fine)").matches) return; // touch + reduced motion: drift only / static
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, raf = 0, last = 0;
    const tick = (now) => {
      const k = 1 - Math.exp(-(now - (last || now)) / 1000 * 7); // frame-rate independent ease toward pointer
      last = now;
      x += (tx - x) * k; y += (ty - y) * k;
      el.style.setProperty("--mx", x.toFixed(1) + "px");
      el.style.setProperty("--my", y.toFixed(1) + "px");
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  }

  /* ---------------- data ---------------- */
  let dataP;
  const data = () => (dataP ||= fetch("data/site.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(index));
  function index(d) {
    d.brandBy = Object.fromEntries(d.brands.map((b) => [b.slug, b]));
    d.typeBy = Object.fromEntries(d.types.map((x) => [x.name, x]));
    d.available = d.vehicles.filter((v) => !v.sold);
    return d;
  }
  const typeName = (d, name) => { const x = d.typeBy[name]; return x ? pick(x.name, x.bn) : name; };
  const brandName = (d, slug) => { const b = d.brandBy[slug]; return b ? pick(b.name, b.bn) : ""; };
  const depotName = (d, v) => v.dep && d.depots[v.dep] ? pick(d.depots[v.dep].en, d.depots[v.dep].bn) : (pick(v.depRaw, v.depBn) || "");
  const isModel = (v) => /^model\s*[-:]?\s*\d{4}$/i.test(v.d);
  const modelLine = (v) => isModel(v) ? (isBn() ? digits(v.d.replace(/^Model/i, "মডেল")) : v.d) : "";
  const NOIMG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#eceff4"/></svg>');
  const thumb = (v) => v.img[0] || NOIMG;

  function card(d, v, { eager = false, i = 0 } = {}) {
    const href = `vehicle.html?v=${encodeURIComponent(v.slug)}`;
    return `<a class="vcard${v.sold ? " vcard--sold" : ""}" href="${href}" style="--i:${Math.min(i, 8)}">
      <div class="vcard__media">
        <img src="${esc(thumb(v))}" alt="${esc(pick(v.t, v.tb))}" loading="${eager ? "eager" : "lazy"}" decoding="async" width="400" height="300">
        ${v.sold ? `<span class="badge badge--sold">${t("sold")}</span>` : ""}
        ${v.img.length > 1 ? `<span class="vcard__photos">${icon("camera")}${num(v.img.length)}</span>` : ""}
      </div>
      <div class="vcard__body">
        <span class="vcard__brand">${esc(brandName(d, v.brand))} · ${esc(typeName(d, v.type))}</span>
        <h3 class="vcard__title">${esc(pick(v.t, v.tb))}</h3>
        <span class="vcard__meta">${icon("pin")}${esc(depotName(d, v))}${modelLine(v) ? ` <span aria-hidden="true">·</span> ${esc(modelLine(v))}` : ""}</span>
        <div class="vcard__price">
          <span class="price"><small>${t("cash")}</small>${money(v.cash)}</span>
          ${v.inst ? `<span class="price price--inst"><small>${t("inst")}</small>${money(v.inst)}</span>` : ""}
        </div>
      </div>
    </a>`;
  }

  /* ---------------- chrome ---------------- */
  const PAGES = [["index.html", "home"], ["vehicles.html", "vehicles"], ["brands.html", "brands"], ["help.html", "help"], ["about.html", "about"]];
  function chrome() {
    const here = location.pathname.split("/").pop() || "index.html";
    const head = $("#site-header");
    if (head) {
      head.className = "site-header";
      head.innerHTML = `
      <a class="skip" href="#main" data-i18n="skip"></a>
      <nav class="nav glass" aria-label="Primary">
        <a class="nav__logo" href="index.html"><img class="logo-l" src="assets/img/logo.png" alt="Gari Mela" width="82" height="34"><img class="logo-d" src="assets/img/logo-dark.png" alt="Gari Mela" width="82" height="34"></a>
        <div class="nav__links">${PAGES.map(([h, k]) => `<a href="${h}" ${h === here ? 'aria-current="page"' : ""} data-i18n="${k}"></a>`).join("")}</div>
        <div class="nav__end">
          <button class="theme-btn" type="button" data-i18n-aria="theme">${icon("sun", "icon i-sun")}${icon("moon", "icon i-moon")}</button>
          <div class="lang" role="group" aria-label="Language"><button type="button" data-set-lang="bn">বাংলা</button><button type="button" data-set-lang="en">EN</button></div>
          <a class="btn btn--ghost btn--sm nav__login" href="${LIVE}/login" data-i18n="login"></a>
          <a class="btn btn--primary btn--sm nav__call" href="tel:${HOTLINE}">${icon("phone")}<span data-i18n="callNow"></span><span class="num">${HOTLINE}</span></a>
          <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu-sheet" data-i18n-aria="menu">${icon("menu")}</button>
        </div>
      </nav>
      <div class="sheet" id="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="sheet__panel">
          <div class="sheet__grab"></div>
          <nav>${PAGES.map(([h, k]) => `<a href="${h}"><span data-i18n="${k}"></span>${icon("arrow-right")}</a>`).join("")}
            <a href="${LIVE}/login"><span data-i18n="login"></span>${icon("arrow-right")}</a></nav>
          <div class="sheet__prefs">
            <div class="lang" role="group" aria-label="Language"><button type="button" data-set-lang="bn">বাংলা</button><button type="button" data-set-lang="en">EN</button></div>
            <button class="theme-btn" type="button" data-i18n-aria="theme">${icon("sun", "icon i-sun")}${icon("moon", "icon i-moon")}</button>
          </div>
          <a class="btn btn--primary" href="tel:${HOTLINE}">${icon("phone")}<span data-i18n="callNow"></span> ${HOTLINE}</a>
        </div>
      </div>`;
      head.addEventListener("click", (e) => { const b = e.target.closest("[data-set-lang]"); if (b) setLang(b.dataset.setLang); });
      head.addEventListener("click", (e) => {
        if (!e.target.closest(".theme-btn")) return;
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem("gm-theme", next); } catch (e) {}
        setTheme(next);
      });
      const sheet = $("#menu-sheet"), btn = $(".nav__menu");
      const openSheet = (open) => {
        sheet.toggleAttribute("data-open", open); btn.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
        if (open) $("a", sheet).focus(); else btn.focus();
      };
      btn.addEventListener("click", () => openSheet(true));
      sheet.addEventListener("click", (e) => { if (e.target === sheet) openSheet(false); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.hasAttribute("data-open")) openSheet(false); });
    }
    const foot = $("#site-footer");
    if (foot) {
      foot.className = "site-footer";
      foot.innerHTML = `<div class="wrap">
        <div class="footer__top">
          <div class="footer__brand">
            <img src="assets/img/logo.png" alt="Gari Mela" width="98" height="40" loading="lazy">
            <p data-i18n="tagline"></p>
            <a class="footer__hot" href="tel:${HOTLINE}"><span data-i18n="support"></span><strong class="num">${HOTLINE}</strong><span data-i18n="hours"></span></a>
            <div class="social">
              <a href="https://www.facebook.com/garimela.bd" aria-label="Facebook">${icon("facebook")}</a>
              <a href="https://www.linkedin.com/company/gari-mela" aria-label="LinkedIn">${icon("linkedin")}</a>
              <a href="mailto:info@garimela.com" aria-label="Email">${icon("mail")}</a>
            </div>
          </div>
          <div><h3 data-i18n="products"></h3><ul id="foot-types"></ul></div>
          <div><h3 data-i18n="company"></h3><ul>
            <li><a href="about.html" data-i18n="about"></a></li><li><a href="help.html" data-i18n="faq"></a></li>
            <li><a href="careers.html" data-i18n="careers"></a></li><li><a href="brands.html" data-i18n="brands"></a></li></ul></div>
          <div><h3 data-i18n="support"></h3><ul>
            <li><a href="mailto:info@garimela.com">info@garimela.com</a></li>
            <li><span data-i18n="address"></span></li></ul></div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} <span data-i18n="rights"></span></span>
          <span><a href="privacy.html" data-i18n="privacy"></a> · <a href="terms.html" data-i18n="terms"></a></span>
          <span><span data-i18n="dev"></span> RML-IT TEAM</span>
        </div></div>`;
      data().then((d) => onRender(() => {
        $("#foot-types").innerHTML = d.types.filter((x) => x.count).map((x) => `<li><a href="vehicles.html?type=${encodeURIComponent(x.name)}">${esc(pick(x.name, x.bn))}</a></li>`).join("");
      })).catch(() => {});
    }
    applyI18n();
  }

  /* ---------------- shared bits ---------------- */
  function searchForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new FormData(form);
      const p = new URLSearchParams();
      for (const [k, v] of q) if (String(v).trim()) p.set(k, String(v).trim());
      location.href = `vehicles.html${p.toString() ? "?" + p : ""}`;
    });
  }
  function railControls(rail, prev, next) {
    const step = () => rail.clientWidth * 0.85;
    const sync = () => {
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: reduceMotion.matches ? "auto" : "smooth" }));
    next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: reduceMotion.matches ? "auto" : "smooth" }));
    rail.addEventListener("scroll", sync, { passive: true });
    new ResizeObserver(sync).observe(rail);
    return sync;
  }
  const failBox = (el) => { el.innerHTML = `<p class="lede">${isBn() ? "তথ্য লোড করা যায়নি। পেজটি রিফ্রেশ করুন বা কল করুন " : "Couldn't load the listings. Refresh, or call "}<a class="link" href="tel:${HOTLINE}">${HOTLINE}</a></p>`; };

  /* ================= HOME ================= */
  function home() {
    // hero: one shared progress value drives independent planes
    const hero = $(".hero");
    if (hero) {
      // wheel steps arrive in jumps; ease a shared progress toward the scroll target (critically damped, fps-independent)
      let raf = 0, cur = -1, last = 0;
      const clamp = (x) => Math.min(1, Math.max(0, x));
      const target = () => { const span = hero.offsetHeight - innerHeight; return span > 0 ? clamp(-hero.getBoundingClientRect().top / span) : 0; };
      const paint = (p) => {
        hero.style.setProperty("--p", p.toFixed(4));
        hero.style.setProperty("--copy", clamp(p / 0.4).toFixed(4));
        hero.style.setProperty("--beat", clamp((p - 0.38) / 0.3).toFixed(4));
        hero.style.setProperty("--exit", clamp((p - 0.78) / 0.22).toFixed(4));
      };
      const update = (now) => {
        const t = target();
        const k = cur < 0 || reduceMotion.matches ? 1 : 1 - Math.exp(-(now - (last || now)) / 1000 * 10);
        last = now;
        cur = cur < 0 ? t : cur + (t - cur) * k;
        if (Math.abs(t - cur) < 0.0005) cur = t;
        paint(cur);
        raf = cur !== t ? requestAnimationFrame(update) : 0;
        if (!raf) last = 0;
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) addEventListener("scroll", onScroll, { passive: true });
        else removeEventListener("scroll", onScroll);
      });
      io.observe(hero);
      addEventListener("resize", onScroll, { passive: true });
      update();
      const img = $(".hero__lineup img");
      const ready = () => hero.classList.add("is-ready");
      img.complete ? ready() : img.addEventListener("load", ready, { once: true });
    }
    $$("form[data-search]").forEach(searchForm);

    data().then((d) => {
      onRender(() => {
        // hero facts (computed from the snapshot)
        $$("[data-count]").forEach((el) => {
          const k = el.dataset.count;
          const n = k === "available" ? d.available.length : k === "brands" ? d.brands.length : Object.keys(d.depots).length;
          el.textContent = isBn() ? digits(n) : n;
        });
        $$("select[name=type]").forEach((s) => {
          const cur = s.value;
          s.innerHTML = `<option value="">${t("anyType")}</option>` + d.types.filter((x) => x.count).map((x) => `<option value="${esc(x.name)}">${esc(pick(x.name, x.bn))}</option>`).join("");
          s.value = cur;
        });
        typesBlock(d);
        brandsBlock(d);
        voices(d);
        faqs(d);
      });
      showroom(d);
      depotMap(d);
    }).catch(() => { const s = $("#showroom-rail"); if (s) failBox(s); });
  }

  function typesBlock(d) {
    const el = $("#types");
    if (!el) return;
    el.innerHTML = d.types.filter((x) => x.total).map((x) => `
      <a class="type-tile${x.count ? "" : " is-empty"}" href="vehicles.html?type=${encodeURIComponent(x.name)}">
        <img src="${esc(x.icon)}" alt="" width="120" height="80" loading="lazy">
        <span class="type-tile__name">${esc(pick(x.name, x.bn))}</span>
        <span class="type-tile__count">${x.count ? t("availableN", num(x.count)) : t("sold")}</span>
      </a>`).join("");
  }

  function showroom(d) {
    const tabs = $("#showroom-tabs"), rail = $("#showroom-rail"), more = $("#showroom-more");
    if (!tabs) return;
    const list = d.types.filter((x) => x.count);
    let cur = list[0].name;
    const sync = railControls(rail, $("#showroom-prev"), $("#showroom-next"));
    const draw = () => {
      tabs.innerHTML = list.map((x) => `<button type="button" role="tab" aria-selected="${x.name === cur}" data-type="${esc(x.name)}">${esc(pick(x.name, x.bn))} <span class="num">${num(x.count)}</span></button>`).join("") + `<span class="seg__thumb" aria-hidden="true"></span>`;
      const items = d.available.filter((v) => v.type === cur && v.img.length).slice(0, 12);
      rail.innerHTML = items.map((v, i) => card(d, v, { i })).join("");
      rail.scrollLeft = 0;
      more.href = `vehicles.html?type=${encodeURIComponent(cur)}`;
      more.querySelector("span").textContent = isBn() ? `সব ${pick(cur, d.typeBy[cur].bn)} দেখুন (${num(d.typeBy[cur].count)})` : `View all ${cur.toLowerCase()}s (${num(d.typeBy[cur].count)})`;
      requestAnimationFrame(() => { moveThumb(); sync(); });
    };
    const moveThumb = () => {
      const b = $('[aria-selected="true"]', tabs), th = $(".seg__thumb", tabs);
      if (!b || !th) return;
      th.style.width = b.offsetWidth + "px";
      th.style.transform = `translateX(${b.offsetLeft}px)`;
    };
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-type]");
      if (!b || b.dataset.type === cur) return;
      cur = b.dataset.type;
      $$("[role=tab]", tabs).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      moveThumb();
      rail.classList.add("is-swapping");
      setTimeout(() => { draw(); rail.classList.remove("is-swapping"); }, reduceMotion.matches ? 0 : 160);
    });
    tabs.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const bs = $$("[role=tab]", tabs), i = bs.indexOf(document.activeElement);
      const n = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length];
      n.focus(); n.click();
    });
    addEventListener("resize", moveThumb, { passive: true });
    onRender(draw);
  }

  // signature: the whole stock as a map of Bangladesh, from real depot data
  function depotMap(d) {
    const svg = $("#bd-map"), listEl = $("#depot-list"), panel = $("#depot-panel");
    if (!svg) return;
    const deps = Object.entries(d.depots).sort((a, b) => b[1].count - a[1].count || b[1].total - a[1].total);
    const max = Math.max(...deps.map(([, x]) => x.count));
    let cur = deps[0][0];
    svg.setAttribute("viewBox", `-20 -20 ${d.bd.w + 40} ${d.bd.h + 40}`);
    svg.innerHTML = `<path class="bd-land" d="${d.bd.path}"/>` + deps.slice().reverse().map(([k, x], i) => {
      const r = 9 + 34 * Math.sqrt(x.count / max);
      return `<g class="dot" data-k="${k}" style="--i:${deps.length - i}" transform="translate(${x.x} ${x.y})">
        <circle class="dot__halo" r="${r + 10}"/><circle class="dot__core" r="${r}"/>
      </g>`;
    }).join("");

    const select = (k, focusList) => {
      cur = k;
      $$(".dot", svg).forEach((g) => g.classList.toggle("is-on", g.dataset.k === k));
      $$("button", listEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
      const x = d.depots[k];
      const here = d.available.filter((v) => v.dep === k);
      const byType = {};
      here.forEach((v) => (byType[v.type] = (byType[v.type] || 0) + 1));
      const top = here.filter((v) => v.img.length).slice(0, 3);
      panel.innerHTML = `
        <p class="depot-panel__eyebrow">${icon("pin")}${isBn() ? "ডিপো" : "Depot"}</p>
        <h3>${esc(pick(x.en, x.bn))}</h3>
        <p class="depot-panel__n"><strong class="num">${num(x.count)}</strong> ${isBn() ? "টি গাড়ি এখন বিক্রির জন্য" : `vehicle${x.count == 1 ? "" : "s"} for sale now`}</p>
        <p class="depot-panel__types">${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([ty, n]) => `${esc(typeName(d, ty))} ${num(n)}`).join(" · ") || (isBn() ? "সব গাড়ি বিক্রি হয়ে গেছে" : "All sold")}</p>
        <div class="depot-panel__cars">${top.map((v) => `<a href="vehicle.html?v=${encodeURIComponent(v.slug)}"><img src="${esc(v.img[0])}" alt="${esc(pick(v.t, v.tb))}" loading="lazy" width="160" height="120"><span>${esc(pick(v.t, v.tb))}<b class="num">${money(v.cash)}</b></span></a>`).join("")}</div>
        <a class="btn btn--dark" href="vehicles.html?depot=${k}">${isBn() ? "এই ডিপোর সব গাড়ি" : "See everything here"} ${icon("arrow-right")}</a>`;
      const btn = $(`button[data-k="${k}"]`, listEl);
      if (focusList && btn) listEl.scrollTo({ left: btn.offsetLeft - 16, behavior: reduceMotion.matches ? "auto" : "smooth" });
    };
    onRender(() => {
      listEl.innerHTML = deps.map(([k, x]) => `<button type="button" data-k="${k}" aria-pressed="false"><span>${esc(pick(x.en, x.bn))}</span><span class="num">${num(x.count)}</span></button>`).join("");
      select(cur);
    });
    listEl.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) select(b.dataset.k); });
    svg.addEventListener("click", (e) => { const g = e.target.closest(".dot"); if (g) select(g.dataset.k, true); });
    svg.addEventListener("pointerover", (e) => { const g = e.target.closest(".dot"); svg.dataset.hover = g ? g.dataset.k : ""; });
    // dots arrive in order of stock the first time the map is seen
    if (!reduceMotion.matches) svg.classList.add("will-animate");
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { svg.classList.add("is-in"); o.disconnect(); } }, { threshold: 0.3 }).observe(svg);
  }

  function brandsBlock(d) {
    const el = $("#brand-wall");
    if (!el) return;
    el.innerHTML = d.brands.map((b) => `<a class="brand-tile" href="vehicles.html?brand=${encodeURIComponent(b.slug)}">
      <span class="brand-tile__art">${b.logo ? `<img src="${esc(b.logo)}" alt="" loading="lazy" width="480" height="413">` : `<b>${esc(b.name)}</b>`}</span>
      <span class="brand-tile__name">${esc(pick(b.name, b.bn))}</span>
      <span class="brand-tile__n">${b.count ? t("availableN", num(b.count)) : t("sold")}</span></a>`).join("");
  }

  function voices(d) {
    const el = $("#voices");
    if (!el || !d.testimonials.length) return;
    // ponytail: CMS testimonial photos 403 on the CDN (broken on the live site too) -> monograms until re-uploaded
    el.innerHTML = d.testimonials.map((v) => {
      const body = v.text.replace(/\s+/g, " ").replace(/\s*—\s*/g, ", ").trim();
      const [lead, ...rest] = body.split(/(?<=[!।])\s/);
      return `<figure class="voice">
        <span class="voice__stars" aria-label="${v.rating} / 5">${Array.from({ length: 5 }, (_, k) => `<svg class="icon${k < v.rating ? " on" : ""}" aria-hidden="true"><use href="assets/icons.svg#star"/></svg>`).join("")}</span>
        <blockquote lang="bn"><strong>${esc(lead)}</strong> ${esc(rest.join(" "))}</blockquote>
        <figcaption><span class="voice__mono" aria-hidden="true">${esc([...v.name.replace(/^মোঃ\s*/, "")][0])}</span>
          <span><strong lang="bn">${esc(v.name)}</strong><span lang="bn">${esc((v.role || "").replace(/^্/, ""))}</span></span></figcaption>
      </figure>`;
    }).join("");
  }

  function faqs(d, all = false) {
    const el = $("#faqs");
    if (!el) return;
    const seen = new Set();
    const list = d.faqs.filter((f) => !seen.has(f.q) && seen.add(f.q)); // CMS has one duplicate
    el.innerHTML = (all ? list : list.slice(0, 5)).map((f) => `<details class="faq">
      <summary><span>${esc(pick(f.q, f.qb))}</span>${icon("chevron-down")}</summary>
      <div class="faq__a">${esc(pick(f.a, f.ab)).replace(/m\.me\/(\d+)/, '<a class="link" href="https://m.me/$1">m.me/$1</a>').replace(/\n/g, "<br>")}</div></details>`).join("");
  }

  /* ================= LISTING ================= */
  function listing() {
    const grid = $("#results"), form = $("#filters"), countEl = $("#result-count"), moreBtn = $("#load-more");
    const PER = 24;
    let shown = PER;
    data().then((d) => {
      const params = () => new URLSearchParams(location.search);
      const fillFilters = () => {
        const p = params();
        const opt = (arr, sel) => arr.map(([v, l]) => `<option value="${esc(v)}" ${v === sel ? "selected" : ""}>${esc(l)}</option>`).join("");
        form.type.innerHTML = `<option value="">${t("anyType")}</option>` + opt(d.types.map((x) => [x.name, `${pick(x.name, x.bn)} (${num(x.count)})`]), p.get("type"));
        form.brand.innerHTML = `<option value="">${isBn() ? "সব ব্র্যান্ড" : "All brands"}</option>` + opt(d.brands.map((b) => [b.slug, `${pick(b.name, b.bn)} (${num(b.count)})`]), p.get("brand"));
        form.depot.innerHTML = `<option value="">${isBn() ? "সারাদেশ" : "All districts"}</option>` + opt(Object.entries(d.depots).sort((a, b) => a[1].en.localeCompare(b[1].en)).map(([k, x]) => [k, `${pick(x.en, x.bn)} (${num(x.count)})`]), p.get("depot"));
        form.max.innerHTML = opt([["", isBn() ? "যেকোনো দাম" : "Any price"], ...[3, 5, 10, 15, 20, 30].map((l) => [String(l * 100000), `≤ ${num(l)} ${isBn() ? "লাখ" : "lakh"}`])], p.get("max") || "");
        form.sort.innerHTML = opt(isBn()
          ? [["new", "নতুন আগে"], ["low", "কম দাম আগে"], ["high", "বেশি দাম আগে"]]
          : [["new", "Newest first"], ["low", "Price: low to high"], ["high", "Price: high to low"]], p.get("sort") || "new");
        form.q.value = p.get("q") || "";
        form.sold.checked = p.get("sold") === "1";
      };
      const run = () => {
        const p = params();
        const q = (p.get("q") || "").toLowerCase().trim();
        const max = +p.get("max") || 0;
        let rows = d.vehicles.filter((v) =>
          (p.get("sold") === "1" || !v.sold) &&
          (!p.get("type") || v.type === p.get("type")) &&
          (!p.get("brand") || v.brand === p.get("brand")) &&
          (!p.get("depot") || v.dep === p.get("depot")) &&
          (!max || v.cash <= max) &&
          (!q || [v.t, v.tb, v.d, v.depRaw, v.depBn, brandName(d, v.brand), d.brandBy[v.brand]?.name, v.type, d.typeBy[v.type]?.bn, v.dep && d.depots[v.dep]?.en, v.dep && d.depots[v.dep]?.bn]
            .filter(Boolean).some((s) => String(s).toLowerCase().includes(q))));
        const s = p.get("sort");
        if (s === "low") rows.sort((a, b) => a.cash - b.cash);
        else if (s === "high") rows.sort((a, b) => b.cash - a.cash);
        else rows.sort((a, b) => a.sold - b.sold || b.id - a.id);
        countEl.textContent = t("vehiclesN", num(rows.length));
        grid.innerHTML = rows.length
          ? rows.slice(0, shown).map((v, i) => card(d, v, { eager: i < 4, i: i % 24 })).join("")
          : `<div class="empty"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#search"/></svg>
              <h2>${isBn() ? "এই ফিল্টারে কোনো গাড়ি পাওয়া যায়নি" : "No vehicles match these filters"}</h2>
              <p>${isBn() ? "ফিল্টার কমিয়ে দেখুন, অথবা আমাদের জানান কী খুঁজছেন।" : "Loosen a filter, or tell us what you're looking for."}</p>
              <div class="empty__actions"><a class="btn btn--ghost" href="vehicles.html">${isBn() ? "সব ফিল্টার মুছুন" : "Clear all filters"}</a><a class="btn btn--primary" href="tel:${HOTLINE}">${icon("phone")} ${HOTLINE}</a></div></div>`;
        moreBtn.hidden = rows.length <= shown;
        // active filter chips
        const chips = [];
        if (p.get("type")) chips.push(["type", typeName(d, p.get("type"))]);
        if (p.get("brand")) chips.push(["brand", brandName(d, p.get("brand"))]);
        if (p.get("depot") && d.depots[p.get("depot")]) chips.push(["depot", pick(d.depots[p.get("depot")].en, d.depots[p.get("depot")].bn)]);
        if (p.get("q")) chips.push(["q", `“${p.get("q")}”`]);
        if (max) chips.push(["max", `≤ ${money(max)}`]);
        $("#chips").innerHTML = chips.map(([k, l]) => `<button type="button" class="chip" data-k="${k}">${esc(l)} ${icon("close")}</button>`).join("");
        const h = $("#list-title");
        h.textContent = p.get("type") ? typeName(d, p.get("type")) : p.get("brand") ? brandName(d, p.get("brand")) : t("vehicles");
        document.title = `${h.textContent} · Gari Mela`;
      };
      const push = () => {
        const p = new URLSearchParams();
        const f = new FormData(form);
        for (const [k, v] of f) if (String(v).trim() && !(k === "sort" && v === "new")) p.set(k, String(v).trim());
        history.replaceState(null, "", `vehicles.html${p.toString() ? "?" + p : ""}`);
        shown = PER;
        run();
      };
      form.addEventListener("change", push);
      form.addEventListener("submit", (e) => { e.preventDefault(); push(); });
      let tm; form.q.addEventListener("input", () => { clearTimeout(tm); tm = setTimeout(push, 250); });
      $("#chips").addEventListener("click", (e) => {
        const b = e.target.closest("[data-k]"); if (!b) return;
        const el = form.elements[b.dataset.k]; el.value = ""; push();
      });
      moreBtn.addEventListener("click", () => { shown += PER; run(); });
      $("#filter-toggle")?.addEventListener("click", (e) => {
        const open = form.toggleAttribute("data-open");
        e.currentTarget.setAttribute("aria-expanded", String(open));
      });
      onRender(() => { fillFilters(); run(); });
    }).catch(() => failBox(grid));
  }

  /* ================= DETAIL ================= */
  function detail() {
    const root = $("#vehicle");
    const slug = new URLSearchParams(location.search).get("v");
    data().then((d) => {
      const v = d.vehicles.find((x) => x.slug === slug);
      if (!v) {
        root.innerHTML = `<div class="empty"><h1>${isBn() ? "গাড়িটি পাওয়া যায়নি" : "Vehicle not found"}</h1><p>${isBn() ? "লিংকটি পুরনো হতে পারে বা গাড়িটি সরিয়ে নেওয়া হয়েছে।" : "The link may be old, or the listing was removed."}</p><div class="empty__actions"><a class="btn btn--primary" href="vehicles.html">${t("vehicles")}</a></div></div>`;
        return;
      }
      let at = 0;
      const today = new Date().toISOString().slice(0, 10);
      onRender(() => {
        const title = pick(v.t, v.tb);
        document.title = `${title} · Gari Mela`;
        const rows = [
          ["model", modelLine(v)], ["desc", isModel(v) ? "" : v.d], ["type", typeName(d, v.type)], ["brand", brandName(d, v.brand)],
          ["body", v.body], ["fuel", v.fuel], ["color", v.color],
          ["depot", pick(v.depRaw, v.depBn) + (v.dep && d.depots[v.dep] ? ` (${pick(d.depots[v.dep].en, d.depots[v.dep].bn)})` : "")],
          ["reg", v.reg], ["offerEnds", v.ends && v.ends >= today && !v.sold ? new Date(v.ends).toLocaleDateString(isBn() ? "bn-BD" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""],
        ].filter(([, x]) => x);
        const similar = d.available.filter((x) => x.slug !== v.slug && x.type === v.type && x.img.length).sort((a, b) => (b.brand === v.brand) - (a.brand === v.brand) || Math.abs(a.cash - v.cash) - Math.abs(b.cash - v.cash)).slice(0, 8);
        root.innerHTML = `
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">${t("home")}</a><span>/</span><a href="vehicles.html">${t("vehicles")}</a><span>/</span><a href="vehicles.html?type=${encodeURIComponent(v.type)}">${esc(typeName(d, v.type))}</a></nav>
        <div class="vd">
          <section class="vd__gallery" aria-label="${t("photos")}">
            <div class="vd__stage">${v.img.length ? v.img.map((src, i) => `<img src="${esc(src)}" alt="${esc(title)} ${i + 1}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} width="1200" height="900">`).join("") : `<div class="vd__noimg">${icon("camera")}</div>`}</div>
            ${v.sold ? `<span class="badge badge--sold">${t("sold")}</span>` : ""}
            ${v.img.length > 1 ? `<div class="vd__thumbs">${v.img.map((src, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}" aria-current="${i === at}"><img src="${esc(src)}" alt="" loading="lazy" width="96" height="72"></button>`).join("")}</div>` : ""}
          </section>
          <aside class="vd__info">
            <p class="vcard__brand">${esc(brandName(d, v.brand))} · ${esc(typeName(d, v.type))}</p>
            <h1>${esc(title)}</h1>
            <p class="vd__where">${icon("pin")}${esc(depotName(d, v))}</p>
            <div class="vd__prices">
              <div><small>${t("cash")}</small><strong class="num">${money(v.cash)}</strong></div>
              ${v.inst ? `<div><small>${t("inst")}</small><strong class="num">${money(v.inst)}</strong></div>` : ""}
            </div>
            ${v.sold ? `<p class="vd__soldnote">${isBn() ? "এই গাড়িটি বিক্রি হয়ে গেছে। একই রকম গাড়ি নিচে দেখুন।" : "This vehicle has been sold. Similar ones are below."}</p>` : `
            <div class="vd__cta">
              <a class="btn btn--primary" href="tel:${HOTLINE}">${icon("phone")}<span>${t("callNow")}</span> <span class="num">${HOTLINE}</span></a>
              <a class="btn btn--ghost" href="${LIVE}/vehicle-details/${encodeURIComponent(v.slug)}">${isBn() ? "অনলাইনে অফার দিন" : "Place an offer online"}</a>
            </div>
            <p class="vd__hint">${icon("eye")}${isBn() ? "কেনার আগে ডিপোতে গিয়ে গাড়িটি দেখে নিতে পারবেন। সময় ঠিক করতে কল করুন।" : "You can inspect the vehicle at the depot before you buy. Call to book a time."}</p>`}
            <dl class="specs">${rows.map(([k, x]) => `<div><dt>${t(k)}</dt><dd>${esc(x)}</dd></div>`).join("")}<div><dt>${t("id")}</dt><dd class="num">${esc(digits(v.id))}</dd></div></dl>
            <button class="btn btn--ghost btn--sm vd__share" type="button">${icon("share")} ${isBn() ? "শেয়ার করুন" : "Share"}</button>
          </aside>
        </div>
        ${similar.length ? `<section class="section"><div class="section__head"><h2 class="h2">${isBn() ? "একই ধরনের আরও গাড়ি" : "More like this"}</h2>
          <div class="rail-ctrl"><button type="button" id="sim-prev" aria-label="Previous">${icon("arrow-left")}</button><button type="button" id="sim-next" aria-label="Next">${icon("arrow-right")}</button></div></div>
          <div class="rail" id="sim-rail">${similar.map((x) => card(d, x)).join("")}</div></section>` : ""}`;
        const stage = $(".vd__stage", root);
        const go = (i) => { at = i; stage.scrollTo({ left: stage.clientWidth * i, behavior: reduceMotion.matches ? "auto" : "smooth" }); };
        $(".vd__thumbs", root)?.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i); });
        stage.addEventListener("scroll", () => {
          const i = Math.round(stage.scrollLeft / stage.clientWidth);
          if (i !== at) at = i;
          $$(".vd__thumbs button", root).forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
        }, { passive: true });
        stage.tabIndex = 0;
        stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(Math.min(v.img.length - 1, at + 1)); if (e.key === "ArrowLeft") go(Math.max(0, at - 1)); });
        $(".vd__share", root).addEventListener("click", async (e) => {
          const url = location.href;
          if (navigator.share) { try { await navigator.share({ title, url }); } catch (er) {} }
          else { await navigator.clipboard?.writeText(url); e.currentTarget.lastChild.textContent = isBn() ? " লিংক কপি হয়েছে" : " Link copied"; }
        });
        if ($("#sim-rail")) railControls($("#sim-rail"), $("#sim-prev"), $("#sim-next"))();
      });
    }).catch(() => failBox(root));
  }

  /* ================= BRANDS ================= */
  function brands() {
    data().then((d) => onRender(() => {
      $("#brand-grid").innerHTML = d.brands.map((b) => {
        const types = [...new Set(d.vehicles.filter((v) => v.brand === b.slug).map((v) => v.type))];
        return `<a class="brand-card" href="vehicles.html?brand=${encodeURIComponent(b.slug)}">
          <span class="brand-tile__art">${b.logo ? `<img src="${esc(b.logo)}" alt="" loading="lazy" width="480" height="413">` : `<b>${esc(b.name)}</b>`}</span>
          <h2>${esc(pick(b.name, b.bn))}</h2>
          <p>${types.map((x) => esc(typeName(d, x))).join(" · ")}</p>
          <span class="brand-card__n"><strong class="num">${num(b.count)}</strong> ${isBn() ? "উপলব্ধ" : "available"} <span>/ ${num(b.total)} ${isBn() ? "মোট" : "listed"}</span></span>
        </a>`;
      }).join("");
    })).catch(() => failBox($("#brand-grid")));
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    chrome();
    ambient();
    const page = document.body.dataset.page;
    ({ home, listing, detail, brands, help: () => data().then((d) => onRender(() => faqs(d, true))) }[page] || (() => {}))();
  });
})();
