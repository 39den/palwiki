(function() {
  const B = window.PW_BASE;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const LS = { get: (k, d) => {
    var _a;
    try {
      return (_a = JSON.parse(localStorage.getItem(k))) != null ? _a : d;
    } catch (e) {
      return d;
    }
  }, set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  } };
  const chip = (e) => window.PW_chip ? window.PW_chip(e) : `<span class="el">${esc(e)}</span>`;
  window.PW_breed2 = true;
  let lock = 0;
  const bodyLock = (v) => {
    lock = Math.max(0, lock + (v ? 1 : -1));
    document.documentElement.classList.toggle("sheet-open", lock > 0);
  };
  let IDX = null;
  function index(D) {
    if (IDX) return IDX;
    const N = window.PW_core.norm;
    IDX = [];
    const add = (o) => {
      o.k = N(o.label + " " + (o.alt || ""));
      IDX.push(o);
    };
    const pop = Object.fromEntries((D.popular || []).map(([i, c]) => [i, c]));
    D.pals.forEach((p) => p.url && add({ t: "pal", label: p.ru, alt: p.en, sub: "\u2116" + p.no + " \xB7 " + p.el.join(", "), img: p.thumb, url: p.url, w: (pop[p.id] || 0) + 1, ref: p }));
    (D.bcards || []).forEach((b) => add({ t: "boss", label: b.n, alt: b.pal, sub: b.k + " \xB7 \u0443\u0440. " + b.lv.filter(Boolean).join(" / "), img: b.t, url: b.u, w: 2 }));
    D.passives.forEach((q) => add({ t: "passive", label: q.name, alt: q.en, sub: "\u0440\u0430\u043D\u0433 " + q.rank + " \xB7 " + (q.desc || "").slice(0, 60), url: q.url, w: 1, rank: q.rank }));
    D.items.forEach((i) => i.url && add({ t: "item", label: i.ru, alt: i.en, sub: i.type || "\u043F\u0440\u0435\u0434\u043C\u0435\u0442", url: i.url, w: 0.5 }));
    [
      /*WORKCALC off 21.10*/
      ["\u0420\u0430\u0431\u043E\u0442\u0430 \u043F\u0430\u043B\u043E\u0432", "2_mehaniki/rabota/", "\u{1F6E0}\uFE0F", "\u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u0440\u0443\u0447\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u043A\u0430\u043A \u0430\u043F\u043D\u0443\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443 \u043F\u043E\u0434\u043D\u044F\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443 \u043F\u0440\u0438\u0433\u043E\u0434\u043D\u043E\u0441\u0442\u044C \u043A \u0440\u0430\u0431\u043E\u0442\u0435 \u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u0440\u0430\u0431\u043E\u0442\u044B"],
      ["\u041A\u0430\u0440\u0442\u0430", "map/", "\u{1F5FA}\uFE0F", "\u043A\u0430\u0440\u0442\u0430 map \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442 \u0431\u0430\u0448\u043D\u044F"],
      ["\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F", "breed/", "\u{1F9EC}", "\u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0435\u0441\u0442\u0438\u0442\u044C \u0432\u044B\u0432\u0435\u0441\u0442\u0438"],
      ["\u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u043F\u0430\u043B\u043E\u0432", "compare/", "\u2696\uFE0F", "\u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435"],
      ["\u0413\u0430\u043B\u0435\u0440\u0435\u044F \u043F\u0430\u043B\u043E\u0432", "gallery/", "\u{1F43E}", "\u0433\u0430\u043B\u0435\u0440\u0435\u044F \u043F\u0430\u043B\u044B \u0444\u0438\u043B\u044C\u0442\u0440"],
      ["\u041C\u043E\u0438 \u0441\u043F\u0438\u0441\u043A\u0438", "my/", "\u2B50", "\u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u0441\u043F\u0438\u0441\u043A\u0438 \u0441\u0431\u043E\u0440\u043A\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0430"],
      ["\u0412\u0441\u0435 \u0431\u043E\u0441\u0441\u044B", "boss/", "\u{1F451}", "\u0431\u043E\u0441\u0441\u044B \u0431\u0430\u0448\u043D\u0438 \u0440\u0435\u0439\u0434\u044B"],
      ["\u0412\u0441\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", "passivki/", "\u2728", "\u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438"],
      ["\u0415\u0434\u0430 \u0438 \u0431\u0430\u0444\u0444\u044B", "guide/eda/", "\u{1F372}", "\u0435\u0434\u0430 \u0431\u0430\u0444 \u0431\u0430\u0444\u0444 \u0431\u0430\u0444\u044B \u043F\u0438\u0446\u0446\u0430 \u0431\u043B\u044E\u0434\u043E \u0431\u043B\u044E\u0434\u0430 \u043A\u0443\u0445\u043D\u044F \u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u0441\u044B\u0442\u043E\u0441\u0442\u044C"]
    ].filter((x) => x[1] != "2_mehaniki/rabota/").forEach(([l, u, i, a]) => add({ t: "page", label: l, alt: a, sub: "\u0440\u0430\u0437\u0434\u0435\u043B", ic: i, url: u, w: 1 }));
    return IDX;
  }
  const dl = (a, b) => {
    if (Math.abs(a.length - b.length) > 3) return 9;
    const m = [...Array(b.length + 1).keys()];
    for (let i = 1; i <= a.length; i++) {
      let p = m[0];
      m[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const t = m[j];
        m[j] = Math.min(m[j] + 1, m[j - 1] + 1, p + (a[i - 1] == b[j - 1] ? 0 : 1));
        p = t;
      }
    }
    return m[b.length];
  };
  function match(D, q, types) {
    const C = window.PW_core, N = C.norm;
    let n = N(q);
    const fx = C.fixLayout(q.toLowerCase());
    let fixed = null;
    if (fx && fx[1]) {
      fixed = fx[0];
      n = N(fx[0]);
    }
    if (!n) return { res: [], fixed };
    const ws = n.split(" ");
    const R = [];
    for (const o of index(D)) {
      if (types && !types.includes(o.t)) continue;
      const k = o.k;
      let s = 0;
      if (k.startsWith(n)) s = 100;
      else if (k.includes(" " + n) || N(o.label).split(" ").some((w) => w.startsWith(n))) s = 80;
      else if (k.includes(n)) s = 60;
      else if (ws.every((w) => k.includes(w))) s = 50;
      else if (n.length >= 3) {
        const best = Math.min(...N(o.label + " " + (o.alt || "")).split(" ").map((w) => dl(w.slice(0, n.length + 1), n)));
        if (best <= Math.max(1, Math.floor(n.length / 4))) s = 35 - best * 5;
      }
      if (s) R.push([s + Math.log(1 + o.w) * 3, o]);
    }
    R.sort((a, b) => b[0] - a[0]);
    return { res: R.map((x) => x[1]), fixed };
  }
  const TT = { pal: "\u041F\u0430\u043B", boss: "\u0411\u043E\u0441\u0441", passive: "\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0430", item: "\u041F\u0440\u0435\u0434\u043C\u0435\u0442", page: "\u0420\u0430\u0437\u0434\u0435\u043B" };
  const rc = (r) => r < 0 ? "r-neg" : "r-" + Math.min(5, r || 1);
  const row = (o) => `<a class="sx-r" href="${B + o.url}" data-u="${esc(o.url)}">${o.img ? `<img src="${B + o.img}" width="40" height="40" alt="" loading="lazy">` : `<span class="sx-ic ${o.t == "passive" ? "psv " + rc(o.rank) : ""}">${o.ic || (o.t == "passive" ? "\u2728" : o.t == "item" ? "\u{1F4E6}" : "\u{1F4C4}")}</span>`}<span class="sx-t"><b>${esc(o.label)}</b><small>${esc(o.sub || "")}</small></span><span class="sx-b sx-${o.t}">${TT[o.t]}</span></a>`;
  window.PW_pickPal = function(D, title, cb) {
    const sh = document.createElement("div");
    sh.className = "pk";
    const bg = document.createElement("div");
    bg.className = "sheet-bg";
    const close = () => {
      sh.remove();
      bg.remove();
      bodyLock(false);
    };
    bg.onclick = close;
    bodyLock(true);
    const rec = LS.get("pw_recent", []).map((id) => D.pals.find((p) => p.id == id)).filter((p) => p && p.url).slice(0, 8);
    const pop = (D.popular || []).map(([i]) => D.pals.find((p) => p.id == i)).filter((p) => p && p.url).slice(0, 8);
    const it = (p) => `<button type="button" class="pki pp" data-id="${esc(p.id)}"><img src="${B + p.thumb}" width="40" height="40" alt=""><span><b>${esc(p.ru)}</b><small>\u2116${esc(p.no)} \xB7 ${p.el.map(esc).join(", ")}</small></span></button>`;
    const body = (v) => {
      if (v.trim()) {
        const r = match(D, v, ["pal"]).res.slice(0, 40);
        return r.length ? r.map((o) => it(o.ref)).join("") : '<p class="sx-none">\u041D\u0435 \u043D\u0430\u0448\u0451\u043B. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043F\u043E-\u0434\u0440\u0443\u0433\u043E\u043C\u0443 \u0438\u043B\u0438 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0435 \u0438\u043C\u044F.</p>';
      }
      return (rec.length ? '<div class="pkt">\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435</div>' + rec.map(it).join("") : "") + (pop.length ? '<div class="pkt">\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435</div>' + pop.map(it).join("") : "") + '<div class="pkt">\u0412\u0441\u0435 \u043F\u0430\u043B\u044B</div>' + D.pals.filter((p) => p.url).map(it).join("");
    };
    sh.innerHTML = `<div class="pkg"></div><div class="pkhd"><input type="search" placeholder="${esc(title || "\u041D\u0430\u0439\u0442\u0438 \u043F\u0430\u043B\u0430\u2026")}" autocomplete="off" enterkeyhint="search"><button type="button" class="x" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C">\xD7</button></div><div class="pkl">${body("")}</div>`;
    document.body.append(bg, sh);
    sh.querySelector(".x").onclick = close;
    const L = sh.querySelector(".pkl"), inp = sh.querySelector("input");
    let t;
    inp.oninput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        L.innerHTML = body(inp.value);
        L.scrollTop = 0;
      }, 120);
    };
    L.addEventListener("click", (e) => {
      const b = e.target.closest(".pp");
      if (!b) return;
      const p = D.pals.find((x) => x.id == b.dataset.id);
      close();
      cb(p);
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        const b = L.querySelector(".pp");
        if (b) b.click();
      }
    });
  };
  let SX = null, SXo = null;
  function hsInput() {
    let w = document.getElementById("hsx");
    if (w) return w.querySelector("input");
    const hd = document.querySelector(".md-header__inner");
    if (!hd) return null;
    w = document.createElement("div");
    w.id = "hsx";
    w.className = "hsx";
    w.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" id="hsq" name="pp-site-q" type="search" placeholder="' + (innerWidth < 480 ? "\u041F\u0430\u043B, \u0431\u043E\u0441\u0441\u2026" : "\u041F\u0430\u043B, \u0431\u043E\u0441\u0441 \u0438\u043B\u0438 \u0432\u043E\u043F\u0440\u043E\u0441") + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="\u041F\u043E\u0438\u0441\u043A" aria-controls="sxp" aria-expanded="false"><button type="button" class="sx-clr" aria-label="\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C" hidden>\xD7</button>';
    const t = hd.querySelector(".md-header__title");
    (t || hd.lastChild).after(w);
    return w.querySelector("input");
  }
  function openSearch(pre) {
    const hi = hsInput();
    if (hi && pre == null) hi.focus({ preventScroll: true });
    (window.PW_load || window.PW_data)().then((D) => {
      if (SX) {
        if (pre != null) {
          hi.value = pre;
        }
        SXo();
        if (pre != null) hi.dispatchEvent(new Event("input"));
        hi.focus({ preventScroll: true });
        return;
      }
      const s = document.getElementById("__search");
      if (s) s.checked = false;
      SX = document.createElement("div");
      SX.className = "sx sx-inline";
      SX.id = "sxp";
      SX.setAttribute("role", "listbox");
      SX.setAttribute("aria-label", "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430");
      SX.hidden = true;
      const recQ = () => LS.get("pw_recentq", []);
      const pushQ = (q) => {
        q = q.trim();
        if (q.length < 2) return;
        LS.set("pw_recentq", [q, ...recQ().filter((x) => x != q)].slice(0, 8));
      };
      const pop = (D.popular || []).map(([i]) => D.pals.find((p) => p.id == i)).filter((p) => p && p.url).slice(0, 8);
      const tiles = [["\u{1F43E}", "\u041F\u0430\u043B\u044B", "gallery/"], ["\u{1F451}", "\u0411\u043E\u0441\u0441\u044B", "boss/"], ["\u2728", "\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", "passivki/"], ["\u{1F4E6}", "\u041F\u0440\u0435\u0434\u043C\u0435\u0442\u044B", "4_spravochniki/predmety/"], ["\u{1F5FA}\uFE0F", "\u041A\u0430\u0440\u0442\u0430", "map/"], ["\u{1F9EC}", "\u0420\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435", "breed/"], ["\u{1F6E0}", "\u0421\u0431\u043E\u0440\u043A\u0430", "my/"], ["\u2696\uFE0F", "\u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C", "compare/"]];
      const ex = ["\u043A\u0442\u043E \u043B\u0443\u0447\u0448\u0435 \u043A\u043E\u043F\u0430\u0435\u0442", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C \u0437\u043E\u0438", "\u0433\u0434\u0435 \u0432\u0437\u044F\u0442\u044C \u0441\u0435\u0440\u0443", "\u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u0444\u0440\u043E\u0441\u0442\u0430\u043B\u0438\u043E\u043D \u0431\u043E\u0435\u0446", "\u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0430\u043D\u0443\u0431\u0438\u0441\u0430", "\u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u0430\u043D\u0443\u0431\u0438\u0441 \u0438 \u0434\u0436\u0435\u0442\u0440\u0430\u0433\u043E\u043D"];
      const empty = () => `${recQ().length ? `<div class="sx-h">\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435</div><div class="sx-chips">${recQ().map((q) => `<span class="sx-c"><button type="button" data-q="${esc(q)}">\u{1F558} ${esc(q)}</button><button type="button" class="sx-del" data-del="${esc(q)}" aria-label="\u0423\u0434\u0430\u043B\u0438\u0442\u044C">\xD7</button></span>`).join("")}</div>` : ""}
  ${pop.length ? `<div class="sx-h">\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435</div><div class="sx-chips">${pop.map((p) => `<a class="sx-c sx-p" href="${B + p.url}"><img src="${B + p.thumb}" width="22" height="22" alt="">${esc(p.ru)}</a>`).join("")}</div>` : ""}
  ${document.getElementById("pwmap") ? "" : `<div class="sx-h">\u0420\u0430\u0437\u0434\u0435\u043B\u044B</div><div class="sx-tiles">${tiles.map(([i, l, u]) => `<a href="${B + u}"><span>${i}</span>${l}</a>`).join("")}</div>`}
  <div class="sx-h">\u041C\u043E\u0436\u043D\u043E \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C</div><div class="sx-chips">${ex.map((q) => `<button type="button" class="sx-c" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>`;
      SX.innerHTML = `<button type="button" class="sx-x" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C">\xD7</button><div class="sx-body">${empty()}</div>`;
      document.body.appendChild(SX);
      const inp = hi, body = SX.querySelector(".sx-body"), clr = inp.parentNode.querySelector(".sx-clr");
      const place = () => {
        const r = inp.parentNode.getBoundingClientRect(), mob = innerWidth < 700;
        SX.style.top = r.bottom + 6 + "px";
        if (mob) {
          SX.style.left = "8px";
          SX.style.right = "8px";
          SX.style.width = "";
        } else {
          const w = Math.max(r.width, 520);
          SX.style.left = Math.min(r.left, innerWidth - w - 12) + "px";
          SX.style.width = w + "px";
          SX.style.right = "";
        }
      };
      SXo = () => {
        place();
        SX.hidden = false;
        clr.hidden = false;
        clr.setAttribute("aria-label", inp.value ? "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C" : "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A");
        inp.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("sx-open");
      };
      const close = () => {
        SX.hidden = true;
        inp.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("sx-open");
        if (!inp.value) clr.hidden = true;
      };
      SX.querySelector(".sx-x").onclick = () => {
        close();
        inp.blur();
      };
      addEventListener("resize", () => {
        if (!SX.hidden) place();
      }, { passive: true });
      addEventListener("scroll", () => {
        if (!SX.hidden) place();
      }, { passive: true });
      document.addEventListener("pointerdown", (e) => {
        if (SX.hidden) return;
        if (SX.contains(e.target) || inp.parentNode.contains(e.target)) return;
        close();
      }, true);
      inp.addEventListener("focus", () => {
        draw();
        SXo();
      });
      const cmp = (v) => {
        const m = window.PW_core.norm(v).match(/^сравн\S*\s+(.+?)\s+(?:и|с|vs|против|или)\s+(.+)$/);
        if (!m) return null;
        const a = window.PW_core.find(m[1], ["pal"]), b = window.PW_core.find(m[2], ["pal"]);
        if (!a || !b) return null;
        const A = D.pals[a.ref], Bp = D.pals[b.ref];
        return `<a class="sx-ans sx-cmp" href="${B}compare/?a=${encodeURIComponent(A.ru)}&b=${encodeURIComponent(Bp.ru)}"><img src="${B + A.thumb}" width="48" height="48" alt=""><b>\u2696\uFE0F \u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C ${esc(A.ru)} \u0438 ${esc(Bp.ru)}</b><img src="${B + Bp.thumb}" width="48" height="48" alt=""></a>`;
      };
      const draw = () => {
        const v = inp.value;
        clr.hidden = !v && SX.hidden;
        clr.setAttribute("aria-label", v ? "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C" : "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A");
        if (v.trim().length < 1) {
          body.innerHTML = empty();
          return;
        }
        const { res, fixed } = match(D, v);
        let h = fixed ? `<div class="dym">\u041F\u043E\u043D\u044F\u043B \u043A\u0430\u043A: \xAB${esc(fixed)}\xBB</div>` : "";
        const c = cmp(v);
        if (c) h += c;
        let ans = "";
        try {
          const a = window.PW_core.answer(v);
          if (a && a.type != "none" && window.PW_render) ans = window.PW_render(a);
        } catch (e) {
        }
        let fu = "";
        try {
          const a2 = window.PW_core.answer(v);
          const pn = a2 && (a2.pal || a2.e && a2.e.ru && a2.e) && (a2.pal || a2.e).ru;
          if (pn) {
            const opts = [["\u2728 \u041B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", "\u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 " + pn], ["\u{1F9EC} \u041A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438", "\u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 " + pn], ["\u{1F3AF} \u0427\u0435\u043C \u0431\u0438\u0442\u044C", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C " + pn], ["\u2696\uFE0F \u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C", "\u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C " + pn + " \u0438 "]].filter((o) => window.PW_core.norm(o[1]) != window.PW_core.norm(v));
            fu = `<div class="sx-fu">${opts.map(([l, q]) => `<button type="button" class="sx-c" data-q="${esc(q)}">${l}</button>`).join("")}</div>`;
          }
        } catch (e) {
        }
        if (ans && !c) h += `<div class="sx-card ai"><span class="ai-tag">\u{1F916} \u041E\u0442\u0432\u0435\u0442 \u0438\u0437 \u0431\u0430\u0437\u044B</span>${ans}${fu}</div>`;
        if (res.length) {
          const g = {};
          res.slice(0, 30).forEach((o) => (g[o.t] = g[o.t] || []).push(o));
          h += ["pal", "boss", "passive", "item", "page"].filter((t2) => g[t2]).map((t2) => `<div class="sx-h">${TT[t2]}\u044B</div>`.replace("\u041F\u0430\u043B\u044B", "\u041F\u0430\u043B\u044B").replace("\u0411\u043E\u0441\u0441\u044B", "\u0411\u043E\u0441\u0441\u044B").replace("\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0430\u044B", "\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438").replace("\u041F\u0440\u0435\u0434\u043C\u0435\u0442\u044B", "\u041F\u0440\u0435\u0434\u043C\u0435\u0442\u044B").replace("\u0420\u0430\u0437\u0434\u0435\u043B\u044B", "\u0420\u0430\u0437\u0434\u0435\u043B\u044B") + g[t2].slice(0, t2 == "pal" ? 8 : 5).map(row).join("")).join("");
        } else if (!ans && !c) {
          const s2 = window.PW_core.suggest ? window.PW_core.suggest(v, 4) : [];
          h += `<div class="sx-none"><b>\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C</b><p>\u041F\u0440\u043E\u0432\u0435\u0440\u044C \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438\u043B\u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439:</p><div class="sx-chips">${s2.map((x) => `<button type="button" class="sx-c" data-q="${esc(x.name)}">${esc(x.name)}</button>`).join("")}${["\u0430\u043D\u0443\u0431\u0438\u0441", "\u0431\u0430\u0448\u043D\u044F", "\u043B\u0435\u0433\u0435\u043D\u0434\u0430"].map((q) => `<button type="button" class="sx-c" data-q="${q}">${q}</button>`).join("")}</div></div>`;
        }
        body.innerHTML = h;
      };
      let t;
      inp.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(draw, 90);
      });
      clr.onclick = () => {
        if (!inp.value && !SX.hidden) {
          close();
          inp.blur();
          clr.hidden = true;
          return;
        }
        inp.value = "";
        draw();
        inp.focus({ preventScroll: true });
        SXo();
      };
      inp.addEventListener("input", () => {
        if (SX.hidden) SXo();
      });
      body.addEventListener("click", (e) => {
        const d = e.target.closest("[data-del]");
        if (d) {
          LS.set("pw_recentq", recQ().filter((x) => x != d.dataset.del));
          draw();
          return;
        }
        const q = e.target.closest("[data-q]");
        if (q) {
          e.preventDefault();
          inp.value = q.dataset.q;
          draw();
          inp.focus({ preventScroll: true });
          return;
        }
        const a = e.target.closest("a");
        if (a) pushQ(inp.value);
      });
      let sel = -1;
      const items = () => [...body.querySelectorAll(".sx-ans,.sx-r")];
      const mark = () => items().forEach((x, i) => x.classList.toggle("sel", i == sel));
      inp.addEventListener("input", () => {
        sel = -1;
      });
      inp.addEventListener("keydown", (e) => {
        const it = items();
        if (e.key == "ArrowDown") {
          e.preventDefault();
          sel = Math.min(it.length - 1, sel + 1);
          mark();
          it[sel] && it[sel].scrollIntoView({ block: "nearest" });
        } else if (e.key == "ArrowUp") {
          e.preventDefault();
          sel = Math.max(-1, sel - 1);
          mark();
        } else if (e.key == "Enter") {
          pushQ(inp.value);
          const a = it[sel >= 0 ? sel : 0];
          if (a) location.href = a.href;
        }
        if (e.key == "Escape") {
          e.preventDefault();
          close();
        }
      });
      SX.addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
          close();
          inp.focus({ preventScroll: true });
        }
      });
      if (pre != null) inp.value = pre;
      draw();
      SXo();
      inp.focus({ preventScroll: true });
    });
  }
  window.PW_search = openSearch;
  document.addEventListener("click", (e) => {
    const l = e.target.closest('label[for=__search],.md-search__icon,[href="#search"],.md-search__input');
    if (!l) return;
    e.preventDefault();
    e.stopPropagation();
    const s = document.getElementById("__search");
    if (s) s.checked = false;
    openSearch();
  }, true);
  document.addEventListener("keydown", (e) => {
    const tg = e.target;
    const typing = tg.closest && tg.closest("input,textarea,select,[contenteditable]");
    if ((e.key == "k" || e.key == "K" || e.key == "\u043B") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    } else if (e.key == "/" && !typing) {
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    }
  }, true);
  document.addEventListener("DOMContentLoaded", () => {
    const hi0 = hsInput();
    if (hi0) hi0.addEventListener("focus", () => {
      if (!SX) openSearch();
    }, { once: true });
    const s = document.getElementById("__search");
    if (s) s.addEventListener("change", () => {
      if (s.checked) {
        s.checked = false;
        openSearch();
      }
    });
    window.PW_data();
    const hq = document.getElementById("home-q");
    if (hq) {
      hq.addEventListener("focus", (e) => {
        hq.blur();
        openSearch(hq.value);
      });
    }
    document.querySelectorAll("[data-open-search]").forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch(b.dataset.q || null);
    }));
    const q = new URLSearchParams(location.search).get("q");
    if (q && !document.getElementById("pwmap")) openSearch(q);
  });
  document.addEventListener("DOMContentLoaded", () => window.PW_data().then((D) => {
    const info = document.querySelector(".pal-info[data-pal]");
    if (info) {
      const p = D.pals.find((x) => x.id == info.dataset.pal);
      if (p) {
        const a = document.createElement("a");
        a.className = "fav cmpb";
        a.href = B + "compare/?a=" + encodeURIComponent(p.ru);
        a.textContent = "\u2696\uFE0F \u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C";
        info.appendChild(a);
      }
    }
    const c1 = document.getElementById("c1"), c2 = document.getElementById("c2");
    if (c1 && c2 && c1.type !== "hidden" && !c1.dataset.pk) {
      [c1, c2].forEach((inp, i) => {
        inp.dataset.pk = 1;
        inp.readOnly = true;
        inp.removeAttribute("list");
        const slot = document.createElement("button");
        slot.type = "button";
        slot.className = "pslot";
        inp.style.display = "none";
        inp.after(slot);
        const paint = () => {
          const a = window.PW_core.find(inp.value, ["pal"]);
          const p = a ? D.pals[a.ref] : null;
          slot.innerHTML = p ? `<img src="${B + p.thumb}" width="64" height="64" alt=""><b>${esc(p.ru)}</b><small>\u0441\u043C\u0435\u043D\u0438\u0442\u044C</small>` : '<span class="plus">\uFF0B</span><b>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u0430\u043B\u0430</b>';
        };
        paint();
        slot.onclick = () => window.PW_pickPal(D, i ? "\u0412\u0442\u043E\u0440\u043E\u0439 \u043F\u0430\u043B\u2026" : "\u041F\u0435\u0440\u0432\u044B\u0439 \u043F\u0430\u043B\u2026", (p) => {
          inp.value = p.ru;
          paint();
          inp.dispatchEvent(new Event("input", { bubbles: true }));
          inp.dispatchEvent(new Event("change", { bubbles: true }));
          const u = new URLSearchParams(location.search);
          u.set(i ? "b" : "a", p.ru);
          history.replaceState(null, "", "?" + u);
        });
      });
      if (!new URLSearchParams(location.search).get("b") && new URLSearchParams(location.search).get("a")) {
        c2.value = "";
        c2.dispatchEvent(new Event("input", { bubbles: true }));
        c2.nextElementSibling.innerHTML = '<span class="plus">\uFF0B</span><b>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0432\u0442\u043E\u0440\u043E\u0433\u043E</b>';
      }
    }
    breed2(D);
  }));
  function breed2(D) {
    const el = document.getElementById("breed");
    if (!el) return;
    fetch(B + "assets/breeding.json").then((r) => r.json()).then((J) => {
      const ix = {};
      J.pals.forEach((x, i) => ix[x.ru] = i);
      const by = (n) => D.pals.find((p) => p.ru == n) || { ru: n, el: [], thumb: "", url: "" };
      const sp = {};
      J.special.forEach((x) => sp[[x.a, x.b].sort().join("|")] = x.child);
      const child = (a, b) => {
        const k = sp[[a.ru, b.ru].sort().join("|")];
        if (k) return [by(k), true];
        const i = ix[a.ru], j = ix[b.ru];
        if (i == null || j == null) return [null, false];
        return [by(J.pals[J.pairs[Math.min(i, j) + "," + Math.max(i, j)]].ru), false];
      };
      const easy = (p) => (p.rarity || 5) + (p.rank ? 0 : 5);
      const pairs = (t) => {
        const o = [];
        J.special.forEach((x) => {
          if (x.child == t.ru) o.push([x.a, x.b, true]);
        });
        const ti = ix[t.ru];
        if (!o.length && ti != null) {
          for (const k in J.pairs) if (J.pairs[k] == ti) {
            const [i, j] = k.split(",").map(Number);
            if (i != ti && j != ti) o.push([J.pals[i].ru, J.pals[j].ru, false]);
          }
        }
        return o.map(([a, b, s]) => [by(a), by(b), s]).filter(([a, b]) => a.url && b.url).sort((x, y) => easy(x[0]) + easy(x[1]) - easy(y[0]) - easy(y[1]));
      };
      const u = new URLSearchParams(location.search);
      let A = by(u.get("a") || "\u041B\u0430\u043C\u0431\u043E\u043B\u043B"), Bp = by(u.get("b") || "\u041A\u0430\u0442\u0442\u0438\u0432\u0430"), T = by(u.get("t") || "\u0410\u043D\u0443\u0431\u0438\u0441"), mode = u.get("t") ? "r" : "f", onlyMine = false, page = 1;
      const av = (p, lbl) => p && p.url ? `<img src="${B + p.thumb}" width="72" height="72" alt=""><b>${esc(p.ru)}</b><span class="els">${p.el.map(chip).join("")}</span>` : `<span class="plus">\uFF0B</span><b>${lbl}</b>`;
      const mine = () => new Set(Object.values(LS.get("pw_lists", {})).flat());
      const draw = () => {
        const [c, spc] = A.url && Bp.url ? child(A, Bp) : [null, false];
        el.innerHTML = `<div class="seg bseg"><button type="button" data-m="f" class="${mode == "f" ? "on" : ""}">\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u0438 \u2192 \u0434\u0435\u0442\u0451\u043D\u044B\u0448</button><button type="button" data-m="r" class="${mode == "r" ? "on" : ""}">\u041A\u0430\u043A \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C</button><button type="button" class="hlp" data-tip="\u0412\u044B\u0431\u0435\u0440\u0438 \u0434\u0432\u0443\u0445 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u2014 \u0443\u0432\u0438\u0434\u0438\u0448\u044C, \u043A\u0442\u043E \u0432\u044B\u043B\u0443\u043F\u0438\u0442\u0441\u044F. \u0418\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438 \u043D\u0443\u0436\u043D\u043E\u0433\u043E \u043F\u0430\u043B\u0430 \u0432\u043E \u0432\u043A\u043B\u0430\u0434\u043A\u0435 \xAB\u041A\u0430\u043A \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C\xBB \u2014 \u043F\u043E\u043A\u0430\u0436\u0435\u043C \u043F\u0430\u0440\u044B \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439, \u043D\u0430\u0447\u0438\u043D\u0430\u044F \u0441 \u0441\u0430\u043C\u044B\u0445 \u043F\u0440\u043E\u0441\u0442\u044B\u0445.">?</button></div>
  ${mode == "f" ? `<div class="bpar"><button type="button" class="pslot" data-s="a">${av(A, "\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C 1")}</button><button type="button" class="bswap" aria-label="\u041F\u043E\u043C\u0435\u043D\u044F\u0442\u044C \u043C\u0435\u0441\u0442\u0430\u043C\u0438">\u21C4</button><button type="button" class="pslot" data-s="b">${av(Bp, "\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C 2")}</button></div>
   <div class="beq">=</div>${c ? `<div class="bchild">${spc ? '<span class="spc">\u{1F49E} \u041E\u0441\u043E\u0431\u0430\u044F \u043F\u0430\u0440\u0430</span>' : ""}<img src="${B + c.thumb}" width="120" height="120" alt=""><h3>${esc(c.ru)}</h3><div>${c.el.map(chip).join("")}</div><div class="bb"><a class="md-button" href="${B + c.url}">\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0430\u043B\u0430</a><a class="md-button md-button--primary" href="${B + c.url}#bld">\u{1F6E0} \u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0441\u0431\u043E\u0440\u043A\u0443</a></div></div>` : '<div class="bchild empty">\u0412\u044B\u0431\u0435\u0440\u0438 \u0434\u0432\u0443\u0445 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439</div>'}` : `<button type="button" class="pslot wide" data-s="t">${av(T, "\u041A\u043E\u0433\u043E \u0445\u043E\u0447\u0435\u0448\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C?")}</button><label class="bmine"><input type="checkbox" ${onlyMine ? "checked" : ""}> \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0430\u043B\u044B \u0438\u0437 \u043C\u043E\u0438\u0445 \u0441\u043F\u0438\u0441\u043A\u043E\u0432</label><div class="bpairs"></div>`}`;
        if (mode == "r" && T.url) {
          let ps = pairs(T);
          if (onlyMine) {
            const M = mine();
            ps = ps.filter(([a, b]) => M.has(a.id) && M.has(b.id));
          }
          const per = 12;
          const sh = ps.slice(0, page * per);
          el.querySelector(".bpairs").innerHTML = (ps.length ? `<div class="gcount">\u041F\u0430\u0440: ${ps.length}${ps[0] && ps[0][2] ? " \xB7 \u{1F49E} \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0441\u043E\u0431\u0430\u044F \u043F\u0430\u0440\u0430" : ""}</div>` : "<p>" + (onlyMine ? "\u0412 \u0442\u0432\u043E\u0438\u0445 \u0441\u043F\u0438\u0441\u043A\u0430\u0445 \u043D\u0435\u0442 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u043F\u0430\u0440." : "\u042D\u0442\u043E\u0433\u043E \u043F\u0430\u043B\u0430 \u043D\u0435\u043B\u044C\u0437\u044F \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0439\u043C\u0430\u0442\u044C.") + "</p>") + sh.map(([a, b, s]) => `<a class="bpair" href="?a=${encodeURIComponent(a.ru)}&b=${encodeURIComponent(b.ru)}"><span><img src="${B + a.thumb}" width="48" height="48" alt="">${esc(a.ru)}</span><i>+</i><span><img src="${B + b.thumb}" width="48" height="48" alt="">${esc(b.ru)}</span>${s ? "<em>\u{1F49E}</em>" : ""}</a>`).join("") + (ps.length > sh.length ? '<button type="button" class="md-button bmore">\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451</button>' : "");
        }
        el.querySelectorAll(".bseg [data-m]").forEach((b) => b.onclick = () => {
          mode = b.dataset.m;
          page = 1;
          draw();
        });
        el.querySelectorAll(".pslot").forEach((b) => b.onclick = () => window.PW_pickPal(D, b.dataset.s == "t" ? "\u041A\u043E\u0433\u043E \u0432\u044B\u0432\u0435\u0441\u0442\u0438?" : "\u0412\u044B\u0431\u0435\u0440\u0438 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F\u2026", (p) => {
          if (b.dataset.s == "a") A = p;
          else if (b.dataset.s == "b") Bp = p;
          else {
            T = p;
            page = 1;
          }
          history.replaceState(null, "", mode == "f" ? `?a=${encodeURIComponent(A.ru)}&b=${encodeURIComponent(Bp.ru)}` : `?t=${encodeURIComponent(T.ru)}`);
          draw();
          if (mode == "f") {
            const c2 = el.querySelector(".bchild");
            c2 && c2.classList.add("pop");
          }
        }));
        const sw = el.querySelector(".bswap");
        if (sw) sw.onclick = () => {
          [A, Bp] = [Bp, A];
          draw();
        };
        const mm = el.querySelector(".bmine input");
        if (mm) mm.onchange = () => {
          onlyMine = mm.checked;
          page = 1;
          draw();
        };
        const mo = el.querySelector(".bmore");
        if (mo) mo.onclick = () => {
          page++;
          draw();
        };
      };
      draw();
    });
  }
})();
(function() {
  const B = window.PW_BASE;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".pfl").forEach((f) => {
      const g = f.nextElementSibling && f.nextElementSibling.classList.contains("pgrid") ? f.nextElementSibling : document.querySelector(".pgrid");
      if (!g) return;
      let rk = null, cat = null;
      const q = f.querySelector(".pfq"), n = f.querySelector(".pfn");
      const run = () => {
        const v = (q.value || "").toLowerCase().replace(/ё/g, "\u0435");
        let c = 0;
        g.querySelectorAll(".pcard").forEach((x) => {
          const r = +x.dataset.rk;
          let ok = !v || x.dataset.n.replace(/ё/g, "\u0435").includes(v);
          if (ok && rk) ok = rk == "neg" ? r < 0 : rk.includes("-") ? r >= +rk.split("-")[0] && r <= +rk.split("-")[1] : r == +rk;
          if (ok && cat) ok = x.dataset.cat.split(" ").includes(cat);
          x.style.display = ok ? "" : "none";
          c += ok;
        });
        n.textContent = "\u043D\u0430\u0439\u0434\u0435\u043D\u043E " + c;
      };
      f.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.rk != null) {
          rk = rk == b.dataset.rk ? null : b.dataset.rk;
          f.querySelectorAll("[data-rk]").forEach((x) => x.classList.toggle("on", x.dataset.rk == rk));
        }
        if (b.dataset.cat != null) {
          cat = cat == b.dataset.cat ? null : b.dataset.cat;
          f.querySelectorAll("[data-cat]").forEach((x) => x.classList.toggle("on", x.dataset.cat == cat));
        }
        run();
      });
      q.addEventListener("input", run);
      run();
    });
    const fa = document.getElementById("fqall");
    if (fa) {
      let lv = "", cat = null;
      const run = () => fa.querySelectorAll(".fq").forEach((d) => {
        d.style.display = (!lv || d.dataset.lv == lv) && (!cat || d.dataset.cat == cat) ? "" : "none";
      });
      document.querySelectorAll(".fqlv button").forEach((b) => b.onclick = () => {
        lv = b.dataset.lv;
        document.querySelectorAll(".fqlv button").forEach((x) => x.classList.toggle("on", x === b));
        run();
      });
      document.querySelectorAll(".fqc button").forEach((b) => b.onclick = () => {
        cat = cat == b.dataset.cat ? null : b.dataset.cat;
        document.querySelectorAll(".fqc button").forEach((x) => x.classList.toggle("on", x.dataset.cat == cat));
        run();
      });
    }
    const ask = document.getElementById("ask");
    if (ask) window.PW_data().then((D) => {
      const C = window.PW_core, N = C.norm;
      const st = (w) => w.length > 5 ? w.slice(0, 5) : w;
      const SW = new Set("\u043A\u0430\u043A \u0433\u0434\u0435 \u0447\u0442\u043E \u043A\u0442\u043E \u0447\u0435\u043C \u0434\u043B\u044F \u044D\u0442\u043E \u0438\u043B\u0438 the \u0430 \u0432 \u043D\u0430 \u0438 \u0441 \u043F\u043E \u0443 \u043E \u0438\u0437".split(" "));
      const FQ = D.faq.map((f) => ({ f, w: new Set(N(f.q).split(" ").filter((w) => !SW.has(w)).map(st)) }));
      const inp = document.getElementById("askq"), out = document.getElementById("asko");
      const ph = ["\u0421\u043F\u0440\u043E\u0441\u0438 \u043F\u0440\u043E Palworld\u2026", "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u0433\u0434\u0435 \u0432\u0437\u044F\u0442\u044C \u0441\u0435\u0440\u0443?", "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u0447\u0435\u043C \u0431\u0438\u0442\u044C \u0417\u043E\u0438?", "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0410\u043D\u0443\u0431\u0438\u0441\u0430?"];
      let pi = 0;
      setInterval(() => {
        if (!inp.value && document.activeElement !== inp) {
          pi = (pi + 1) % ph.length;
          inp.placeholder = ph[pi];
        }
      }, 2600);
      const kb = (t) => esc(t).replace(/(Клавиш[аиу]|Нажми|клавиш[аиу])\s+([A-Za-z0-9]+)/g, (m, a, k) => a + " <kbd>" + k + "</kbd>");
      const go = () => {
        const raw = inp.value.trim();
        if (raw.length < 2) return;
        const fx = C.fixLayout(raw.toLowerCase());
        const q = fx && fx[1] ? fx[0] : raw;
        const ws = N(q).split(" ").filter((w) => !SW.has(w)).map(st);
        const sc = FQ.map((x) => [ws.reduce((a, w) => a + (x.w.has(w) ? 1 : 0), 0) / Math.max(2, x.w.size) ** 0.5, x.f]).filter((x) => x[0] > 0).sort((a, b) => b[0] - a[0]);
        let ent = "";
        try {
          const a = C.answer(q);
          if (a && a.type != "none" && a.type != "faq") ent = window.PW_render(a);
        } catch (e) {
        }
        const best = sc[0] && sc[0][0] >= 0.5 ? sc[0][1] : null;
        const rel = sc.slice(best ? 1 : 0, 5).map((x) => x[1].q);
        out.innerHTML = `<div class="bub me">${esc(raw)}</div>` + (best || ent ? `<div class="bub ai"><span class="ai-av">\u{1F411}</span><div>${best ? `<b>${esc(best.q)}</b><p>${kb(best.a)}</p>` : ""}${ent ? `<div class="sx-card">${ent}</div>` : ""}</div></div>` : `<div class="bub ai"><span class="ai-av">\u{1F411}</span><div><p>\u041F\u043E\u043A\u0430 \u043D\u0435 \u0437\u043D\u0430\u044E \u0442\u043E\u0447\u043D\u043E\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430.</p><a class="md-button md-button--primary" href="https://t.me/PalGuideBot?start=ask" target="_blank" rel="noopener">\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0432 \u0431\u043E\u0442\u0435</a></div></div>`) + (rel.length ? `<div class="ask-chips rel">${rel.map((r) => `<button type="button" data-q="${esc(r)}">${esc(r)}</button>`).join("")}</div>` : "");
      };
      ask.addEventListener("click", (e) => {
        const b = e.target.closest("[data-q]");
        if (b) {
          inp.value = b.dataset.q;
          go();
        }
      });
      document.getElementById("asks").onclick = go;
      inp.addEventListener("keydown", (e) => {
        if (e.key == "Enter") go();
      });
      let _at;
      inp.addEventListener("input", () => {
        clearTimeout(_at);
        if (inp.value.trim().length < 2) {
          out.innerHTML = "";
          return;
        }
        _at = setTimeout(go, 250);
      });
      const u = new URLSearchParams(location.search).get("ask");
      if (u) {
        inp.value = u;
        go();
      }
    });
    const info = document.querySelector(".pal-info[data-pal]"), bh = document.querySelector(".boss-hero");
    if (info || bh) {
      const name = ((document.querySelector("article h1") || {}).textContent || "").replace(/[¶§\u200b-\u200d\u2060\u2063\ufeff]/g, "").trim();
      const nm = name.trim();
      const qs = info ? [["\u{1F4CD} \u0433\u0434\u0435 \u043D\u0430\u0439\u0442\u0438", "\u0433\u0434\u0435 \u043D\u0430\u0439\u0442\u0438 " + nm], ["\u2728 \u043B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", "\u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 " + nm], ["\u{1F9EC} \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435", "\u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 " + nm], ["\u{1F3AF} \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C " + nm]] : [["\u{1F3AF} \u0447\u0435\u043C \u0431\u0438\u0442\u044C", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C " + nm], ["\u{1F4CD} \u0433\u0434\u0435", "\u0433\u0434\u0435 " + nm]];
      const box = document.createElement("div");
      box.className = "askmini";
      box.innerHTML = `<div class="am-h">\u{1F916} \u0421\u043F\u0440\u043E\u0441\u0438 \u043F\u0440\u043E ${info ? "\u044D\u0442\u043E\u0433\u043E \u043F\u0430\u043B\u0430" : "\u044D\u0442\u043E\u0433\u043E \u0431\u043E\u0441\u0441\u0430"}</div><div class="ask-chips">${qs.map(([l, q]) => `<button type="button" data-q="${esc(q)}">${l}</button>`).join("")}<button type="button" data-ig>\u{1F3AE} \u0412 \u0438\u0433\u0440\u0435</button></div>`;
      box.querySelector("[data-ig]").onclick = () => window.PW_ingame && window.PW_ingame(true);
      (info ? info.closest(".pal-hero") : bh).after(box);
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-q]");
        if (b && window.PW_search) window.PW_search(b.dataset.q);
      });
    }
    const my = document.getElementById("mylists");
    if (my) window.PW_data().then((D) => {
      const by = Object.fromEntries(D.pals.map((p) => [p.id, p]));
      const mk = () => {
        const L = JSON.parse(localStorage.getItem("pw_lists") || "null") || {};
        const seg = (c, ids) => c + ids.map((i) => i.toString(36).padStart(2, "0")).join("");
        const segs = [];
        [["f", "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"], ["t", "\u041A\u043E\u043C\u0430\u043D\u0434\u0430"], ["m", "\u0424\u0430\u0440\u043C"]].forEach(([c, n]) => {
          const ids = (L[n] || []).map((id) => by[id]).filter(Boolean).map((p) => p.j);
          for (let k = 0; k < ids.length; k += 28) segs.push(seg(c, ids.slice(k, k + 28)));
        });
        const links = [];
        let cur = "";
        segs.forEach((s) => {
          if (cur && (cur + "-" + s).length > 59) {
            links.push(cur);
            cur = s;
          } else cur = cur ? cur + "-" + s : s;
        });
        if (cur) links.push(cur);
        return links;
      };
      const w = document.createElement("div");
      w.className = "syncb";
      my.before(w);
      const draw = () => {
        const l = mk();
        w.innerHTML = `<div class="am-h">\u{1F4F2} \u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438 \u0441\u043F\u0438\u0441\u043A\u0438 \u0432 \u0431\u043E\u0442\u0430 <button type="button" class="hlp" data-tip="\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435, \u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u0438 \u0424\u0430\u0440\u043C \u043E\u0442\u043A\u0440\u043E\u044E\u0442\u0441\u044F \u0432 \u0431\u043E\u0442\u0435 @PalGuideBot. \u041D\u0430\u0436\u043C\u0438 \u0441\u0441\u044B\u043B\u043A\u0443 \u2014 \u0431\u043E\u0442 \u0434\u043E\u0431\u0430\u0432\u0438\u0442 \u043F\u0430\u043B\u043E\u0432 \u0432 \u0441\u0432\u043E\u0438 \u0441\u043F\u0438\u0441\u043A\u0438.">?</button></div>` + (l.length ? l.map((c, i) => `<a class="md-button md-button--primary" target="_blank" rel="noopener" href="https://t.me/PalGuideBot?start=sync_${c}">\u0412 \u0431\u043E\u0442\u0430${l.length > 1 ? " \xB7 \u0447\u0430\u0441\u0442\u044C " + (i + 1) : ""}</a>`).join(" ") : "<small>\u0421\u043F\u0438\u0441\u043A\u0438 \u043F\u0443\u0441\u0442\u044B \u2014 \u0434\u043E\u0431\u0430\u0432\u044C \u043F\u0430\u043B\u043E\u0432, \u0438 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043A\u043D\u043E\u043F\u043A\u0430.</small>");
      };
      draw();
      my.addEventListener("click", () => setTimeout(draw, 50));
    });
  });
})();
(function() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("article.md-content__inner > ul, article .tabbed-block > ul").forEach((ul) => {
      const n = ul.children.length;
      if (n <= 8 || ul.closest(".md-nav")) return;
      ul.classList.add("lgrid");
      if (n > 30) {
        const f = document.createElement("input");
        f.type = "search";
        f.className = "pfq lgq";
        f.placeholder = "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0441\u043F\u0438\u0441\u043A\u0443 (" + n + ")\u2026";
        ul.before(f);
        const items = [...ul.children];
        let lim = 60;
        const show = () => {
          const v = f.value.toLowerCase().replace(/ё/g, "\u0435");
          let c = 0;
          items.forEach((li) => {
            const ok = !v || li.textContent.toLowerCase().replace(/ё/g, "\u0435").includes(v);
            li.style.display = ok && (v || c < lim) ? "" : "none";
            if (ok) c++;
          });
          mb.hidden = !!v || c <= lim;
        };
        const mb = document.createElement("button");
        mb.type = "button";
        mb.className = "md-button lgmore";
        mb.textContent = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451";
        mb.onclick = () => {
          lim += 60;
          show();
        };
        ul.after(mb);
        f.oninput = show;
        show();
      }
    });
  });
})();
(function() {
  const B = window.PW_BASE;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const LS = { get: (k, d) => {
    var _a;
    try {
      return (_a = JSON.parse(localStorage.getItem(k))) != null ? _a : d;
    } catch (e) {
      return d;
    }
  }, set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  } };
  const S = Object.assign({ fs: "m", mode: "full" }, LS.get("pw_set", {}));
  const apply = () => {
    const h = document.documentElement;
    h.classList.toggle("fs-l", S.fs == "l");
    h.classList.toggle("fs-xl", S.fs == "xl");
    h.classList.toggle("simple", S.mode == "simple");
  };
  apply();
  function scheme(v) {
    const b = document.body;
    if (!b) return;
    b.setAttribute("data-md-color-scheme", v == "light" ? "default" : "slate");
    document.documentElement.setAttribute("data-md-color-scheme", v == "light" ? "default" : "slate");
    document.documentElement.style.colorScheme = v == "light" ? "light" : "dark";
    try {
      const k = (typeof __md_scope != "undefined" ? __md_scope.pathname : new URL((window.PW_BASE || "/") + "/", location).pathname).replace(/\/+$/, "/") + ".__palette";
      const sc = v == "light" ? "default" : "slate";
      localStorage.setItem(k, JSON.stringify({ index: v == "light" ? 1 : 0, color: { media: "", scheme: sc, primary: "custom", accent: "custom" } }));
      const i = document.getElementById("__palette_" + (v == "light" ? 1 : 0));
      if (i) i.checked = true;
    } catch (e) {
    }
  }
  function panel() {
    const bg = document.createElement("div");
    bg.className = "sheet-bg";
    const p = document.createElement("div");
    p.className = "setp";
    p.setAttribute("role", "dialog");
    const cur = document.body.getAttribute("data-md-color-scheme") == "default" ? "light" : "dark";
    const seg = (k, opts, v) => `<div class="seg" data-k="${k}">${opts.map(([a, t]) => `<button type="button" data-v="${a}" class="${a == v ? "on" : ""}">${t}</button>`).join("")}</div>`;
    p.innerHTML = `<h3>\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h3><div class="row"><span>\u0422\u0435\u043C\u0430</span>${seg("th", [["dark", "\u{1F319} \u0422\u0451\u043C\u043D\u0430\u044F"], ["light", "\u2600\uFE0F \u0421\u0432\u0435\u0442\u043B\u0430\u044F"]], cur)}</div><div class="row"><span>\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442</span>${seg("fs", [["m", "\u0410"], ["l", "\u0410+"], ["xl", "\u0410++"]], S.fs)}</div><div class="row"><span>\u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0440\u0435\u0436\u0438\u043C</span>${seg("mode", [["full", "\u0412\u044B\u043A\u043B"], ["simple", "\u0412\u043A\u043B"]], S.mode)}</div><div class="row"><span>\u0420\u0435\u0436\u0438\u043C \xAB\u0412 \u0438\u0433\u0440\u0435\xBB</span><button type="button" class="md-button" data-ig>${document.documentElement.classList.contains("ingame") ? "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u{1F3AE} \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u2014 \u044D\u043A\u0440\u0430\u043D \u043D\u0435 \u0433\u0430\u0441\u043D\u0435\u0442"}</button></div><button type="button" class="md-button" data-tour>\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435</button><button type="button" class="md-button md-button--primary" data-x>\u0413\u043E\u0442\u043E\u0432\u043E</button>`;
    const close = () => {
      p.remove();
      bg.remove();
    };
    bg.onclick = close;
    document.body.append(bg, p);
    p.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const sg = b.closest(".seg");
      if (sg) {
        sg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        const k = sg.dataset.k;
        if (k == "th") scheme(b.dataset.v);
        else {
          S[k] = b.dataset.v;
          LS.set("pw_set", S);
          apply();
        }
      }
      if (b.hasAttribute("data-x")) close();
      if (b.hasAttribute("data-tour")) {
        close();
        tour(true);
      }
      if (b.hasAttribute("data-ig")) {
        ingame(!document.documentElement.classList.contains("ingame"));
        close();
      }
    });
  }
  let wl = null;
  async function ingame(on) {
    document.documentElement.classList.toggle("ingame", on);
    LS.set("pw_ingame", on);
    let ib = document.querySelector(".igb");
    if (on) {
      try {
        if ("wakeLock" in navigator) {
          wl = await navigator.wakeLock.request("screen");
        }
      } catch (e) {
      }
      if (!ib) {
        ib = document.createElement("button");
        ib.className = "igb";
        ib.type = "button";
        ib.onclick = () => ingame(false);
        document.body.appendChild(ib);
      }
      ib.textContent = "\u{1F3AE} \u0412 \u0438\u0433\u0440\u0435" + (wl ? " \xB7 \u044D\u043A\u0440\u0430\u043D \u043D\u0435 \u0433\u0430\u0441\u043D\u0435\u0442" : "") + " \u2715";
    } else {
      try {
        wl && wl.release();
      } catch (e) {
      }
      wl = null;
      ib && ib.remove();
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "visible" && document.documentElement.classList.contains("ingame") && "wakeLock" in navigator) navigator.wakeLock.request("screen").then((w) => wl = w).catch(() => {
    });
  });
  function tour(force) {
    if (!force && LS.get("pw_onb", false)) return;
    const steps = [["\u{1F50D}", "\u0418\u0449\u0438 \u0447\u0442\u043E \u0443\u0433\u043E\u0434\u043D\u043E", "\u041D\u0430\u0436\u043C\u0438 \xAB\u041F\u043E\u0438\u0441\u043A\xBB \u0432\u043D\u0438\u0437\u0443 \u0438\u043B\u0438 \u043A\u043B\u0430\u0432\u0438\u0448\u0443 /. \u041F\u043E\u043D\u0438\u043C\u0430\u044E \u043E\u043F\u0435\u0447\u0430\u0442\u043A\u0438 \u0438 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0443\u044E \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0443: \xABfye,bc\xBB \u2014 \u044D\u0442\u043E \xAB\u0410\u043D\u0443\u0431\u0438\u0441\xBB."], ["\u{1F6E0}", "\u0421\u043E\u0431\u0438\u0440\u0430\u0439 \u043F\u0430\u043B\u043E\u0432", "\u041D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043F\u0430\u043B\u0430 \u0435\u0441\u0442\u044C \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440: \u0437\u0432\u0451\u0437\u0434\u044B, \u0443\u0440\u043E\u0432\u0435\u043D\u044C, \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438. \u0421\u0431\u043E\u0440\u043A\u0443 \u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0432 \u0431\u043E\u0442\u0430."], ["\u2B50", "\u0421\u043F\u0438\u0441\u043A\u0438 \u0438 \u0431\u043E\u0442", "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0439 \u043F\u0430\u043B\u043E\u0432 \u0432 \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435, \u041A\u043E\u043C\u0430\u043D\u0434\u0443 \u0438 \u0424\u0430\u0440\u043C. \u0412 \xAB\u041C\u043E\u0438 \u0441\u043F\u0438\u0441\u043A\u0438\xBB \u0435\u0441\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0430 \xAB\u0412 \u0431\u043E\u0442\u0430\xBB \u2014 \u0441\u043F\u0438\u0441\u043A\u0438 \u043E\u043A\u0430\u0436\u0443\u0442\u0441\u044F \u0432 @PalGuideBot."]];
    let i = 0;
    const bg = document.createElement("div");
    bg.className = "sheet-bg";
    const p = document.createElement("div");
    p.className = "setp onb";
    p.setAttribute("role", "dialog");
    document.body.append(bg, p);
    const close = () => {
      p.remove();
      bg.remove();
      LS.set("pw_onb", true);
    };
    bg.onclick = close;
    const draw = () => {
      const [e, t, d] = steps[i];
      p.innerHTML = `<div class="big">${e}</div><h3>${t}</h3><p>${d}</p><div class="dots">${steps.map((_, k) => `<i class="${k == i ? "on" : ""}"></i>`).join("")}</div><div class="seg" style="justify-content:space-between"><button type="button" data-s>\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C</button><button type="button" class="on" data-n>${i < 2 ? "\u0414\u0430\u043B\u044C\u0448\u0435" : "\u041D\u0430\u0447\u0430\u0442\u044C"}</button></div>`;
      p.querySelector("[data-s]").onclick = close;
      p.querySelector("[data-n]").onclick = () => {
        if (i < 2) {
          i++;
          draw();
        } else close();
      };
    };
    draw();
  }
  let pv = null, tmr = null;
  const hide = () => {
    clearTimeout(tmr);
    if (pv) {
      pv.remove();
      pv = null;
    }
  };
  function preview(a, x, y) {
    (window.PW_load || window.PW_data)().then((D) => {
      hide();
      const h = a.getAttribute("href") || "";
      let html = "";
      const pn = a.dataset.psv;
      if (pn) {
        const q = D.passives.find((z) => z.name == pn);
        if (q) html = `<b>${esc(q.name)}</b><small>\u0440\u0430\u043D\u0433 ${q.rank}</small><div>${esc(q.desc)}</div>`;
      } else {
        const p = D.pals.find((z) => z.url && h.split("#")[0].endsWith(z.url));
        if (p) html = `<img src="${B + p.thumb}" width="56" height="56" alt=""><b>${esc(p.ru)}</b><div>${p.el.map((e) => window.PW_chip ? window.PW_chip(e) : e).join("")}</div><small>\u2764\uFE0F ${p.hp} \xB7 \u2694\uFE0F ${p.atk} \xB7 \u{1F6E1} ${p.def}</small>`;
        else {
          const b = (D.bcards || []).find((z) => h.split("#")[0].endsWith(z.u));
          if (b) html = `<img src="${B + b.t}" width="56" height="56" alt=""><b>${esc(b.n)}</b><small>${esc(b.k)} \xB7 \u0443\u0440. ${b.lv.filter(Boolean).join(" / ")}</small><div>\u0421\u043B\u0430\u0431\u043E\u0441\u0442\u044C: ${b.w.map((e) => window.PW_chip ? window.PW_chip(e) : e).join("")}</div>`;
        }
      }
      if (!html) return;
      pv = document.createElement("div");
      pv.className = "pvw";
      pv.innerHTML = html;
      document.body.appendChild(pv);
      pv.style.left = Math.max(8, Math.min(x + 12, innerWidth - 275)) + "px";
      pv.style.top = (y + 20 + pv.offsetHeight > innerHeight ? y - pv.offsetHeight - 12 : y + 16) + "px";
    });
  }
  const tgt = (e) => e.target.closest && e.target.closest('article a[href*="/paly/"],article a[href*="/boss/"],article a.psv[data-psv],.sx a[href*="/paly/"]');
  document.addEventListener("mouseover", (e) => {
    if (!matchMedia("(hover:hover)").matches) return;
    const a = tgt(e);
    if (!a) return;
    clearTimeout(tmr);
    tmr = setTimeout(() => preview(a, e.clientX, e.clientY), 350);
  });
  document.addEventListener("mouseout", (e) => {
    if (tgt(e)) hide();
  });
  let lp = null;
  document.addEventListener("touchstart", (e) => {
    const a = tgt(e);
    if (!a) return;
    const t = e.touches[0];
    lp = setTimeout(() => {
      lp = "fired";
      preview(a, t.clientX, t.clientY);
      if (navigator.vibrate) navigator.vibrate(10);
    }, 450);
  }, { passive: true });
  document.addEventListener("touchmove", () => {
    if (lp && lp !== "fired") clearTimeout(lp);
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (lp === "fired") {
      e.preventDefault();
      setTimeout(hide, 1800);
    } else clearTimeout(lp);
    lp = null;
  });
  document.addEventListener("contextmenu", (e) => {
    if (tgt(e) && matchMedia("(pointer:coarse)").matches) e.preventDefault();
  });
  addEventListener("scroll", hide, { passive: true });
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "setb";
    b.setAttribute("aria-label", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438");
    b.textContent = "\u2699\uFE0F";
    b.onclick = panel;
    document.body.appendChild(b);
    window.PW_settings = panel;
    const nt = document.querySelector(".md-nav--primary");
    if (nt && !nt.querySelector(".drw-set")) {
      const x = document.createElement("button");
      x.type = "button";
      x.className = "drw-set";
      x.textContent = "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438";
      x.onclick = () => {
        const d = document.getElementById("__drawer");
        if (d) d.checked = false;
        document.documentElement.classList.remove("drawer-open");
        panel();
      };
      nt.appendChild(x);
    }
    if (LS.get("pw_ingame", false)) ingame(true);
    if (!/[?&](nobanner|test)/.test(location.search) && !navigator.webdriver) setTimeout(() => tour(false), 1200);
    const hm = document.querySelector(".hero, .home-hero");
    window.PW_settings = panel;
    window.PW_tour = tour;
    window.PW_ingame = ingame;
  });
})();
