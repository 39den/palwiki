(function() {
  "use strict";
  const B = window.PW_BASE || (document.querySelector('script[src*="assets/ux50"]') || { src: "" }).src.replace(/assets\/ux50\.js.*$/, "");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const LS = { get: (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v == null ? d : v;
    } catch (e) {
      return d;
    }
  }, set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  } };
  const SS = { get: (k, d) => {
    try {
      const v = JSON.parse(sessionStorage.getItem(k));
      return v == null ? d : v;
    } catch (e) {
      return d;
    }
  }, set: (k, v) => {
    try {
      sessionStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  } };
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const mk = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const hlp = (t) => `<button type="button" class="hlp" data-tip="${esc(t)}" aria-label="\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430">?</button>`;
  const TEST = /[?&]test=1/.test(location.search) || navigator.webdriver;
  const path = location.pathname.replace(/^.*?\/(palwiki(-preview)?\/)?/, "/").replace(/index\.html$/, "");
  const rel = location.pathname.slice(new URL(B, location.href).pathname.length).replace(/index\.html$/, "");
  const ELC = { "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439": "neutral", "\u041E\u0433\u043E\u043D\u044C": "fire", "\u0412\u043E\u0434\u0430": "water", "\u0422\u0440\u0430\u0432\u0430": "grass", "\u041C\u043E\u043B\u043D\u0438\u044F": "electric", "\u041B\u0451\u0434": "ice", "\u0417\u0435\u043C\u043B\u044F": "ground", "\u0422\u044C\u043C\u0430": "dark", "\u0414\u0440\u0430\u043A\u043E\u043D": "dragon" };
  const ELI = { "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439": "\u26AA", "\u041E\u0433\u043E\u043D\u044C": "\u{1F525}", "\u0412\u043E\u0434\u0430": "\u{1F4A7}", "\u0422\u0440\u0430\u0432\u0430": "\u{1F33F}", "\u041C\u043E\u043B\u043D\u0438\u044F": "\u26A1", "\u041B\u0451\u0434": "\u2744\uFE0F", "\u0417\u0435\u043C\u043B\u044F": "\u{1FAA8}", "\u0422\u044C\u043C\u0430": "\u{1F311}", "\u0414\u0440\u0430\u043A\u043E\u043D": "\u{1F409}" };
  const chip = (e) => window.PW_chip ? window.PW_chip(e) : `<span class="el el-${ELC[e] || ""}">${esc(e)}</span>`;
  let _D = null, _X = null, _R = null;
  const data = () => _D || (_D = ((document.getElementById('potd')&&window.PW_data)||window.PW_load || window.PW_data)());
  const ux = () => _X || (_X = fetch(B + "assets/ux50_data.json").then((r) => r.json()));
  const ref = () => _R || (_R = fetch(B + "assets/ux50_ref.json").then((r) => r.json()));
  try {
    if (!localStorage.getItem("pw_onb")) localStorage.setItem("pw_onb", "true");
  } catch (e) {
  }
  const UX = window.UX = { B, esc, LS, SS, $, $$, mk, hlp, data, ux, ref, chip, ELC, ELI, TEST, rel };
  const ready = (f) => document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
  const toast = (t) => {
    const e = mk("div", "ux-toast", esc(t));
    document.body.appendChild(e);
    setTimeout(() => e.classList.add("on"), 10);
    setTimeout(() => {
      e.classList.remove("on");
      setTimeout(() => e.remove(), 300);
    }, 2200);
  };
  UX.toast = toast;
  const palByUrl = (D, u) => D.pals.find((p) => p.url && u.endsWith(p.url));
  function tabbar() {
    const old = $(".tabbar");
    const t = old || mk("nav", "tabbar");
    t.classList.add("ux-tabbar");
    t.setAttribute("aria-label", "\u0413\u043B\u0430\u0432\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B");
    const it = [["\u{1F43E}", "\u041F\u0430\u043B\u044B", "gallery/"], ["\u{1F4CD}", "\u041A\u0430\u0440\u0442\u0430", "map/"], ["\u{1F9EC}", "\u0420\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435", "breed/"], ["\u{1F451}", "\u0411\u043E\u0441\u0441\u044B", "boss/"], ["\u{1F50D}", "\u041F\u043E\u0438\u0441\u043A", "#search"]];
    t.innerHTML = it.map(([i, l, u]) => `<a href="${u[0] == "#" ? u : B + u}" class="${u[0] != "#" && rel.startsWith(u) ? "on" : ""}"${u[0] != "#" && rel.startsWith(u) ? ' aria-current="page"' : ""}><span aria-hidden="true">${i}</span>${l}</a>`).join("");
    if (!old) document.body.appendChild(t);
    t.querySelector('[href="#search"]').addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
  }
  const openSearch = (pre) => {
    if (window.PW_search) window.PW_search(pre);
    else {
      const i = $("#hsq");
      i && i.focus();
    }
  };
  UX.openSearch = openSearch;
  const QCH = [["\u{1F4CD}", "\u0413\u0434\u0435 \u043D\u0430\u0439\u0442\u0438\u2026", "\u0433\u0434\u0435 \u043D\u0430\u0439\u0442\u0438 "], ["\u{1F3AF}", "\u0427\u0435\u043C \u0431\u0438\u0442\u044C\u2026", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C "], ["\u{1F9EC}", "\u041A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438\u2026", "\u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 "], ["\u26CF\uFE0F", "\u041A\u0442\u043E \u043B\u0443\u0447\u0448\u0435 \u043A\u043E\u043F\u0430\u0435\u0442", "\u043A\u0442\u043E \u043B\u0443\u0447\u0448\u0435 \u043A\u043E\u043F\u0430\u0435\u0442"], ["\u{1F372}", "\u0427\u0442\u043E \u043F\u043E\u0435\u0441\u0442\u044C \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "\u0435\u0434\u0430 \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B"], ["\u2728", "\u041B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438\u2026", "\u043B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 "]];
  function searchEnh() {
    const sx = $("#sxp");
    if (!sx || sx.dataset.ux) return;
    sx.dataset.ux = 1;
    const body = $(".sx-body", sx), inp = $("#hsq");
    const inject = () => {
      if (!inp || inp.value.trim() || $(".ux-qchips", body)) return;
      const rq = LS.get("pw_recentq", []);
      const box = mk("div", "ux-qchips", `<div class="sx-h">\u0421\u043F\u0440\u043E\u0441\u0438 \u043E\u0434\u043D\u0438\u043C \u043A\u0430\u0441\u0430\u043D\u0438\u0435\u043C ${hlp("\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441, \u0434\u043E\u043F\u0438\u0448\u0438 \u0438\u043C\u044F \u043F\u0430\u043B\u0430 \u0438\u043B\u0438 \u0431\u043E\u0441\u0441\u0430 \u0438 \u043D\u0430\u0436\u043C\u0438 Enter. \u041C\u043E\u0436\u043D\u043E \u043F\u0438\u0441\u0430\u0442\u044C \u0441 \u043E\u0448\u0438\u0431\u043A\u0430\u043C\u0438 \u0438 \u043D\u0430 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u043C.")}</div><div class="sx-chips">${QCH.map(([i, l, q]) => `<button type="button" class="sx-c ux-tq" data-tq="${esc(q)}">${i} ${esc(l)}</button>`).join("")}</div>`);
      body.prepend(box);
      if (rq.length) {
        const h = $$(".sx-h", body).find((x) => x.textContent.trim().startsWith("\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435"));
        if (h && !$(".ux-clr", h)) {
          const b = mk("button", "ux-clr", "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0451");
          b.type = "button";
          h.appendChild(b);
          b.onclick = (e) => {
            e.stopPropagation();
            LS.set("pw_recentq", []);
            const n = h.nextElementSibling;
            h.remove();
            n && n.remove();
            toast("\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043F\u0440\u043E\u0441\u044B \u0443\u0434\u0430\u043B\u0435\u043D\u044B");
            inp.focus();
          };
        }
      }
    };
    new MutationObserver(inject).observe(body, { childList: true });
    inject();
    sx.addEventListener("click", (e) => {
      const b = (e.target.closest?e.target:document.body).closest("[data-tq]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      inp.value = b.dataset.tq;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      inp.focus();
      try {
        inp.setSelectionRange(inp.value.length, inp.value.length);
      } catch (_) {
      }
    }, true);
  }
  function searchHooks() {
    const w = new MutationObserver(() => {
      if ($("#sxp")) {
        searchEnh();
      }
    });
    w.observe(document.body, { childList: true });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key == "k" || e.key == "K" || e.key == "\u043B" || e.key == "\u041B")) {
        e.preventDefault();
        openSearch();
      }
    });
    const hx = $("#hsx");
    if (hx && !$(".ux-kbd", hx) && matchMedia("(hover:hover) and (pointer:fine)").matches) {
      const k = mk("kbd", "ux-kbd", /Mac|iPhone|iPad/.test(navigator.platform) ? "\u2318K" : "Ctrl K");
      k.setAttribute("aria-hidden", "true");
      hx.appendChild(k);
    }
    const fit = () => {
      const i = $("#hsq");
      if (!i) return;
      i.placeholder = "\u041F\u043E\u0438\u0441\u043A";
    };
    fit();
    new MutationObserver(fit).observe(document.body, { childList: true });
    const ic = $(".md-header label[for=__search]");
    if (ic && $("#hsx")) ic.classList.add("ux-hide-ic");
  }
  const SEC = [["4_spravochniki/paly/", "\u{1F43E} \u041F\u0430\u043B\u044B", "gallery/"], ["gallery/", "\u{1F43E} \u041F\u0430\u043B\u044B", "gallery/"], ["boss/", "\u{1F451} \u0411\u043E\u0441\u0441\u044B", "boss/"], ["passivki/", "\u2728 \u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", "passivki/"], ["4_spravochniki/predmety/", "\u{1F4E6} \u041F\u0440\u0435\u0434\u043C\u0435\u0442\u044B", "4_spravochniki/predmety/"], ["guide/", "\u{1F9ED} \u0413\u0430\u0439\u0434", "guide/01_chto_eto/"], ["map/", "\u{1F4CD} \u041A\u0430\u0440\u0442\u0430", "map/"], ["breed/", "\u{1F9EC} \u0420\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435", "breed/"], ["compare/", "\u2696\uFE0F \u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435", "compare/"], ["my/", "\u2B50 \u041C\u043E\u0451", "my/"], ["ux/", "\u{1F9F0} \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u0438", "ux/"], ["food/", "\u{1F372} \u0415\u0434\u0430", "guide/eda/"], ["2_mehaniki/", "\u{1F4DA} \u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A", "2_mehaniki/aktivki/"], ["5_lut_i_farm/", "\u{1F4DA} \u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A", "5_lut_i_farm/gde_vzyat/"], ["9_faq/", "\u2753 \u0412\u043E\u043F\u0440\u043E\u0441\u044B", "9_faq/faq/"], ["8_slovar/", "\u{1F4D6} \u0421\u043B\u043E\u0432\u0430\u0440\u044C", "8_slovar/slovar/"]];
  const short = (t, n) => {
    t = t.replace(/\s*\(.*?\)/g, "").split(/ [—–] /).pop().trim();
    return t.length > n ? t.slice(0, n - 1).trim() + "\u2026" : t;
  };
  function crumbs() {
    const art = $("article.md-content__inner");
    if (!art || !rel || $(".ux-crumbs")) return;
    const h1 = $("h1", art);
    const s = SEC.find((x) => rel.startsWith(x[0]));
    const title = (h1 ? h1.textContent : document.title.split(" - ")[0]).trim();
    const items = [[`\u{1F3E0} \u0413\u043B\u0430\u0432\u043D\u0430\u044F`, B]];
    if (s && B + s[2] != location.pathname && rel != s[2]) items.push([s[1], B + s[2]]);
    const nav = mk("nav", "ux-crumbs");
    nav.setAttribute("aria-label", "\u0413\u0434\u0435 \u044F");
    const hist = SS.get("ux_hist", []);
    const prev = hist.find((x) => x.u != location.pathname);
    nav.innerHTML = items.map(([l, u]) => `<a class="ux-cr" href="${u}">${esc(l)}</a><span class="ux-sep" aria-hidden="true">\u203A</span>`).join("") + `<span class="ux-cr ux-cr-on" aria-current="page">${esc(short(title, 22))}</span>` + (prev ? `<a class="ux-cr ux-back" href="${esc(prev.u)}" data-back="1" title="\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0442\u0443\u0434\u0430 \u0436\u0435, \u0433\u0434\u0435 \u0431\u044B\u043B">\u21A9 ${esc(short(prev.t, 12))}</a>` : "");
    document.documentElement.classList.add("ux-has-crumbs");
    art.prepend(nav);
    const fade = () => nav.classList.toggle("ux-fade", nav.scrollWidth > nav.clientWidth + 2 && nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2);
    nav.addEventListener("scroll", fade, { passive: true });
    addEventListener("resize", fade);
    setTimeout(fade, 50);
    const bk = $(".ux-back", nav);
    if (bk) bk.addEventListener("click", () => SS.set("ux_restore", prev.u));
  }
  function tabsState() {
    return { y: Math.round(scrollY), tabs: $$(".tabbed-set input:checked").map((i) => i.id), det: $$("details[open]").map((d, i) => d.id || "d" + $$("details").indexOf(d)) };
  }
  function backTrack() {
    const u = location.pathname;
    const title = (($("article h1") || {}).textContent || document.title.split(" - ")[0]).trim();
    const save = () => {
      const st = LS.get("ux_pos", {});
      st[u] = Object.assign(tabsState(), { at: Date.now() });
      const ks = Object.keys(st);
      if (ks.length > 60) ks.sort((a, b) => st[a].at - st[b].at).slice(0, ks.length - 60).forEach((k) => delete st[k]);
      LS.set("ux_pos", st);
    };
    addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", () => document.visibilityState == "hidden" && save());
    document.addEventListener("click", (e) => {
      const a = (e.target.closest?e.target:document.body).closest("a[href]");
      if (a) save();
    }, true);
    let h = SS.get("ux_hist", []).filter((x) => x.u != u);
    h.unshift({ u, t: rel == "" ? "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" : title });
    SS.set("ux_hist", h.slice(0, 10));
    const nav = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || {}).type;
    if (SS.get("ux_restore", "") == u || nav == "back_forward") {
      SS.set("ux_restore", "");
      const st = LS.get("ux_pos", {})[u];
      if (st) {
        (st.tabs || []).forEach((id) => {
          const i = document.getElementById(id);
          if (i) {
            i.checked = true;
            i.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
        const ds = $$("details");
        (st.det || []).forEach((k) => {
          const d = document.getElementById(k) || ds[+String(k).slice(1)];
          if (d) d.open = true;
        });
        setTimeout(() => scrollTo(0, st.y || 0), 60);
        setTimeout(() => scrollTo(0, st.y || 0), 500);
      }
    }
  }
  const HELP = { "\u0440\u0430\u0431\u043E\u0442\u0430 \u043D\u0430 \u0431\u0430\u0437\u0435": "\u0427\u0435\u043C \u0432\u044B\u0448\u0435 \u0447\u0438\u0441\u043B\u043E, \u0442\u0435\u043C \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043F\u0430\u043B \u0434\u0435\u043B\u0430\u0435\u0442 \u044D\u0442\u0443 \u0440\u0430\u0431\u043E\u0442\u0443 \u043D\u0430 \u0431\u0430\u0437\u0435. \u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 10.", "\u043F\u0430\u0440\u0442\u043D\u0451\u0440\u0441\u043A\u0438\u0439 \u043D\u0430\u0432\u044B\u043A": "\u041E\u0441\u043E\u0431\u043E\u0435 \u0443\u043C\u0435\u043D\u0438\u0435 \u043F\u0430\u043B\u0430. \u0420\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u043A\u043E\u0433\u0434\u0430 \u043F\u0430\u043B \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0435, \u043D\u0430 \u0431\u0430\u0437\u0435 \u0438\u043B\u0438 \u043F\u043E \u043A\u043D\u043E\u043F\u043A\u0435.", "\u0433\u0434\u0435 \u0432\u043E\u0434\u0438\u0442\u0441\u044F": "\u0422\u043E\u0447\u043A\u0438 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u2014 \u0433\u0434\u0435 \u043F\u0430\u043B \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0434\u043D\u0451\u043C \u0438 \u043D\u043E\u0447\u044C\u044E.", "\u0434\u0440\u043E\u043F": "\u0427\u0442\u043E \u0432\u044B\u043F\u0430\u0434\u0430\u0435\u0442, \u0435\u0441\u043B\u0438 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0438\u043B\u0438 \u043F\u043E\u0439\u043C\u0430\u0442\u044C \u043F\u0430\u043B\u0430.", "\u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435": "\u041A\u0430\u043A \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0430\u043B\u0430, \u0441\u043A\u0440\u0435\u0441\u0442\u0438\u0432 \u0434\u0432\u0443\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043D\u0430 \u0440\u0430\u043D\u0447\u043E.", "\u043B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u043F\u043E \u0440\u043E\u043B\u0438": "\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u2014 \u0432\u0440\u043E\u0436\u0434\u0451\u043D\u043D\u044B\u0435 \u0431\u043E\u043D\u0443\u0441\u044B. \u0417\u0434\u0435\u0441\u044C \u043B\u0443\u0447\u0448\u0438\u0435 \u0434\u043B\u044F \u0431\u043E\u044F, \u0440\u0430\u0431\u043E\u0442\u044B \u0438 \u0435\u0437\u0434\u044B.", "\u0430\u0442\u0430\u043A\u0438 \u043F\u043E \u0443\u0440\u043E\u0432\u043D\u044F\u043C": "\u041A\u0430\u043A\u0438\u0435 \u0430\u0442\u0430\u043A\u0438 \u043F\u0430\u043B \u0432\u044B\u0443\u0447\u0438\u0442 \u0441\u0430\u043C, \u043A\u043E\u0433\u0434\u0430 \u0432\u044B\u0440\u0430\u0441\u0442\u0435\u0442 \u0434\u043E \u043D\u0443\u0436\u043D\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F.", "\u0447\u0435\u043C \u0445\u043E\u0440\u043E\u0448 / \u0447\u0435\u043C \u043F\u043B\u043E\u0445": "\u041A\u043E\u0440\u043E\u0442\u043A\u043E: \u0441\u0438\u043B\u044C\u043D\u044B\u0435 \u0438 \u0441\u043B\u0430\u0431\u044B\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043F\u0430\u043B\u0430." };
  function helps() {
    $$("article h2, article h3, article h4").forEach((h) => {
      if ($(".hlp", h)) return;
      const k = h.textContent.toLowerCase().replace(/[:¶]/g, "").trim();
      const m = Object.keys(HELP).find((x) => k.startsWith(x));
      if (m) h.insertAdjacentHTML("beforeend", " " + hlp(HELP[m]));
    });
  }
  window.addEventListener("click", (e) => {
    const b = e.target.closest && (e.target.closest?e.target:document.body).closest(".hlp");
    if (b && matchMedia("(hover:hover)").matches && document.querySelector(".hlp-pop")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  function swipeNav() {
    const pn = $$(".pn a.card-link, .pn a");
    if (pn.length < 1) return;
    const art = $("article.md-content__inner");
    if (!art) return;
    const prev = pn.find((a) => /prev|‹|←/.test(a.className + a.textContent)) || pn[0], next = pn.find((a) => /next|›|→/.test(a.className + a.textContent)) || pn[pn.length - 1];
    let x0 = null, y0 = null, t0 = 0;
    art.addEventListener("touchstart", (e) => {
      const t = e.target;
      if (t.closest("input,textarea,select,.ux-hscroll,.leaflet-container,.tabbed-labels,.md-typeset__table,.ux-tree,.ux-layers,.habmap,.swipe,[data-noswipe],.ux-crumbs")) return x0 = null;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = Date.now();
    }, { passive: true });
    art.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Date.now() - t0 > 700 || Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 2.2) return;
      const a = dx < 0 ? next : prev;
      if (!a || !a.href) return;
      document.documentElement.classList.add(dx < 0 ? "ux-swl" : "ux-swr");
      setTimeout(() => location.href = a.href, 120);
    }, { passive: true });
  }
  function glossary(X) {
    const art = $("article.md-content__inner");
    if (!art || rel.startsWith("8_slovar")) return;
    const G = X.gl.filter((g) => g.t.length >= 3 && !/^(Пал|Палы|Топ|Ап|Вес|Чек|Альт|Моб)$/.test(g.t));
    const keys = [];
    G.forEach((g) => [g.t, ...g.a].forEach((a) => {
      if (a.length >= 4 && !/[a-z]/i.test(a)) keys.push([a.toLowerCase(), g]);
    }));
    keys.sort((a, b) => b[0].length - a[0].length);
    const used = /* @__PURE__ */ new Set();
    let n = 0;
    const rx = new RegExp("(^|[^\u0430-\u044F\u0451a-z])(" + keys.map((k) => k[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?=[^\u0430-\u044F\u0451a-z]|$)", "i");
    const map = Object.fromEntries(keys);
    const walk = document.createTreeWalker(art, NodeFilter.SHOW_TEXT, { acceptNode: (t) => {
      const p = t.parentElement;
      if (!p || p.closest("a,button,h1,h2,h3,h4,code,pre,input,textarea,select,.ux-term,.ux-crumbs,.ux-next,.ux-qa,.hlp,.tabbed-labels,label,summary,.sx,.pal-hero,svg,script,style,.leaflet-container")) return 2;
      return t.nodeValue.length > 3 ? 1 : 2;
    } });
    const nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    for (const t of nodes) {
      if (n >= 14) break;
      const m = t.nodeValue.match(rx);
      if (!m) continue;
      const g = map[m[2].toLowerCase()];
      if (!g || used.has(g.t)) continue;
      used.add(g.t);
      n++;
      const i = m.index + m[1].length;
      const r = t.splitText(i);
      r.splitText(m[2].length);
      const ab = mk("button", "ux-term hlp-term", esc(r.nodeValue));
      ab.type = "button";
      ab.dataset.tip = g.d + (g.e ? " \u041F\u0440\u0438\u043C\u0435\u0440: " + g.e : "");
      ab.setAttribute("aria-label", r.nodeValue + ": \u0447\u0442\u043E \u044D\u0442\u043E?");
      r.replaceWith(ab);
    }
  }
  function termTips() {
    let pop = null;
    const close = () => {
      pop && pop.remove();
      pop = null;
    };
    document.addEventListener("click", (e) => {
      const b = (e.target.closest?e.target:document.body).closest(".ux-term");
      if (!b) {
        close();
        return;
      }
      e.preventDefault();
      if (pop && pop._b === b) return close();
      close();
      pop = mk("div", "hlp-pop ux-pop");
      pop.setAttribute("role", "tooltip");
      pop.innerHTML = `<b>${esc(b.textContent)}</b> \u2014 ${esc(b.dataset.tip)}`;
      pop._b = b;
      document.body.appendChild(pop);
      const r = b.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(r.left - 20, innerWidth - pop.offsetWidth - 8)) + "px";
      pop.style.top = (r.bottom + 8 + pop.offsetHeight > innerHeight ? r.top - pop.offsetHeight - 8 : r.bottom + 8) + "px";
    });
    addEventListener("scroll", close, { passive: true });
    document.addEventListener("keydown", (e) => e.key == "Escape" && close());
  }
  const S = () => Object.assign({ fs: "m", mode: "full" }, LS.get("pw_set", {}));
  function applyS(s) {
    const h = document.documentElement;
    h.classList.toggle("fs-l", s.fs == "l");
    h.classList.toggle("fs-xl", s.fs == "xl");
    h.classList.toggle("simple", s.mode == "simple");
  }
  function quick() {
    const hd = $(".md-header__inner");
    if (!hd || $(".ux-quick")) return;
    const q = mk("div", "ux-quick");
    const draw = () => {
      const s = S();
      q.innerHTML = `<button type="button" class="ux-qb ${s.mode == "simple" ? "on" : ""}" data-a="simple" aria-pressed="${s.mode == "simple"}" title="\u041E\u0431\u044A\u044F\u0441\u043D\u0438\u0442\u044C \u043F\u043E\u043F\u0440\u043E\u0449\u0435" aria-label="\u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0440\u0435\u0436\u0438\u043C">\u{1F476}<span> \u041F\u0440\u043E\u0441\u0442\u043E</span></button><button type="button" class="ux-qb" data-a="set" title="\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" aria-label="\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438">\u2699\uFE0F</button><button type="button" class="ux-qb ${s.fs != "m" ? "on" : ""}" data-a="fs" aria-pressed="${s.fs != "m"}" title="\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442" aria-label="\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442">\u0410+</button>`;
    };
    draw();
    q.addEventListener("click", (e) => {
      const b = (e.target.closest?e.target:document.body).closest("button");
      if (!b) return;
      if (b.dataset.a == "set") {
        window.PW_settings && window.PW_settings();
        return;
      }
      const s = S();
      if (b.dataset.a == "simple") {
        s.mode = s.mode == "simple" ? "full" : "simple";
        toast(s.mode == "simple" ? "\u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0440\u0435\u0436\u0438\u043C: \u0442\u043E\u043B\u044C\u043A\u043E \u0433\u043B\u0430\u0432\u043D\u043E\u0435, \u043F\u0440\u043E\u0441\u0442\u044B\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438" : "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C");
      } else {
        s.fs = s.fs == "m" ? "l" : s.fs == "l" ? "xl" : "m";
        toast(s.fs == "m" ? "\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442" : s.fs == "l" ? "\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442" : "\u041E\u0447\u0435\u043D\u044C \u043A\u0440\u0443\u043F\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442");
      }
      LS.set("pw_set", s);
      applyS(s);
      draw();
      simpleMode();
    });
    const hx = $("#hsx");
    (hx || hd.lastChild).after(q);
    document.documentElement.classList.add("ux-hdset");
    if (!LS.get("ux_qhint", false)) {
      const show = () => {
        if ($(".ux-intro")) return setTimeout(show, 800);
        const r = q.getBoundingClientRect();
        if (!r.width) return;
        const t = mk("div", "hlp-pop ux-qhint", '<b>\u{1F476} \u041F\u0440\u043E\u0441\u0442\u043E</b> \u2014 \u043E\u0431\u044A\u044F\u0441\u043D\u044E \u043F\u0440\u043E\u0441\u0442\u044B\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438.<br><b>\u0410+</b> \u2014 \u043A\u0440\u0443\u043F\u043D\u0435\u0435 \u0442\u0435\u043A\u0441\u0442.<button type="button" class="ux-btn" style="min-height:34px;margin-top:8px;width:100%">\u041F\u043E\u043D\u044F\u0442\u043D\u043E</button>');
        t.setAttribute("role", "tooltip");
        document.body.appendChild(t);
        t.style.top = r.bottom + 10 + "px";
        t.style.left = Math.max(8, Math.min(r.left - 40, innerWidth - t.offsetWidth - 8)) + "px";
        const done = () => {
          t.remove();
          LS.set("ux_qhint", true);
        };
        $("button", t).onclick = done;
        q.addEventListener("click", done, { once: true });
      };
      if (!TEST || /[?&]hint=1/.test(location.search)) setTimeout(show, 1200);
    }
    $$(".ux-qb", q).forEach((b) => b.setAttribute("aria-label", b.title));
  }
  function simpleMode() {
    const on = document.documentElement.classList.contains("simple");
    $$(".ux-kid").forEach((e) => e.hidden = !on);
    if (on && !$(".ux-kidbar")) {
      const art = $("article.md-content__inner");
      const h1 = art && $("h1", art);
      if (h1) {
        const b = mk("div", "ux-kidbar", "\u{1F476} \u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0440\u0435\u0436\u0438\u043C: \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u0433\u043B\u0430\u0432\u043D\u043E\u0435. \u041F\u043E\u0434\u0447\u0451\u0440\u043A\u043D\u0443\u0442\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u043C\u043E\u0436\u043D\u043E \u043D\u0430\u0436\u0430\u0442\u044C \u2014 \u043E\u0431\u044A\u044F\u0441\u043D\u044E.");
        h1.after(b);
      }
    }
    if (!on) $$(".ux-kidbar").forEach((e) => e.remove());
  }
  function intro() {
    if (LS.get("ux_intro", false) && !/[?&]intro=1/.test(location.search)) return;
    if (TEST && !/[?&]intro=1/.test(location.search)) return;
    LS.set("pw_onb", true);
    const cards = [["\u{1F50D}", "\u0421\u043F\u0440\u043E\u0441\u0438 \u0447\u0442\u043E \u0443\u0433\u043E\u0434\u043D\u043E", "\u041F\u0438\u0448\u0438 \u0432 \u0441\u0442\u0440\u043E\u043A\u0443 \u0441\u0432\u0435\u0440\u0445\u0443: \xAB\u0433\u0434\u0435 \u043D\u0430\u0439\u0442\u0438 \u0410\u043D\u0443\u0431\u0438\u0441\u0430\xBB, \xAB\u0447\u0435\u043C \u0431\u0438\u0442\u044C \u0417\u043E\u0438\xBB. \u041E\u0448\u0438\u0431\u043A\u0438 \u0438 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0430\u044F \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0430 \u2014 \u043D\u0435 \u0441\u0442\u0440\u0430\u0448\u043D\u043E."], ["\u{1F43E}", "\u041F\u0430\u043B\u044B, \u043A\u0430\u0440\u0442\u0430, \u0431\u043E\u0441\u0441\u044B", "\u0412\u043D\u0438\u0437\u0443 \u044D\u043A\u0440\u0430\u043D\u0430 \u2014 \u0433\u043B\u0430\u0432\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B. \u041D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u043F\u0430\u043B\u0430 \u0435\u0441\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0438: \u043D\u0430 \u043A\u0430\u0440\u0442\u0443, \u0432\u044B\u0432\u0435\u0441\u0442\u0438, \u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C."], ["\u2B50", "\u0422\u0432\u043E\u0451 \u2014 \u043D\u0430 \u0442\u0432\u043E\u0451\u043C \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435", "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C, \u0431\u0435\u0437 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438. \u041D\u0430\u0436\u043C\u0438 \u2B50 \u043D\u0430 \u043B\u044E\u0431\u043E\u043C \u043F\u0430\u043B\u0435."]];
    const bg = mk("div", "sheet-bg ux-introbg"), p = mk("div", "ux-intro");
    p.setAttribute("role", "dialog");
    p.setAttribute("aria-label", "\u0417\u043D\u0430\u043A\u043E\u043C\u0441\u0442\u0432\u043E \u0441 \u0441\u0430\u0439\u0442\u043E\u043C");
    let i = 0;
    const close = () => {
      p.remove();
      bg.remove();
      LS.set("ux_intro", true);
    };
    bg.onclick = close;
    const draw = () => {
      p.innerHTML = `<div class="ux-ic">${cards.map(([e, t, d], k) => `<div class="ux-icard ${k == i ? "on" : ""}" aria-hidden="${k != i}"><div class="ux-big">${e}</div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div><div class="ux-dots">${cards.map((_, k) => `<button type="button" class="${k == i ? "on" : ""}" data-k="${k}" aria-label="\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 ${k + 1}"></button>`).join("")}</div><div class="ux-row"><button type="button" class="ux-btn ghost" data-s>\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C</button><button type="button" class="ux-btn" data-n>${i < 2 ? "\u0414\u0430\u043B\u044C\u0448\u0435 \u2192" : "\u041D\u0430\u0447\u0430\u0442\u044C!"}</button></div>`;
    };
    p.addEventListener("click", (e) => {
      const b = (e.target.closest?e.target:document.body).closest("button");
      if (!b) return;
      if (b.hasAttribute("data-s")) return close();
      if (b.hasAttribute("data-n")) {
        if (i < 2) {
          i++;
          draw();
        } else close();
      }
      if (b.dataset.k) {
        i = +b.dataset.k;
        draw();
      }
    });
    let x0 = null;
    p.addEventListener("touchstart", (e) => x0 = e.touches[0].clientX, { passive: true });
    p.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) {
        i = Math.max(0, Math.min(2, i + (dx < 0 ? 1 : -1)));
        draw();
      }
      x0 = null;
    });
    document.addEventListener("keydown", function k(e) {
      if (e.key == "Escape") {
        close();
        document.removeEventListener("keydown", k);
      }
    });
    draw();
    document.body.append(bg, p);
  }
  UX.intro = () => {
    LS.set("ux_intro", false);
    intro();
  };
  const lists = () => window.PW_lists ? window.PW_lists.lists() : LS.get("pw_lists", { "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435": LS.get("pw_fav", []), "\u041A\u043E\u043C\u0430\u043D\u0434\u0430": [], "\u0424\u0430\u0440\u043C": [] });
  const saveL = (L) => window.PW_lists ? window.PW_lists.saveL(L) : (LS.set("pw_lists", L), LS.set("pw_fav", L["\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"] || []));
  function inList(n, id) {
    return (lists()[n] || []).includes(id);
  }
  function toggleList(n, id) {
    const L = lists();
    const a = L[n] || [];
    L[n] = a.includes(id) ? a.filter((x) => x != id) : [id, ...a];
    saveL(L);
    return L[n].includes(id);
  }
  UX.lists = { lists, saveL, inList, toggleList };
  function palActions(D) {
    const info = $(".pal-info[data-pal]");
    if (!info || $(".ux-qa")) return;
    const id = info.dataset.pal;
    const p = D.pals.find((x) => x.id == id);
    if (!p) return;
    const old = $(".fav", info);
    if (old) old.remove();
    $$(".pal-info .md-button, .pal-info a.btn").forEach((a) => {
      if (/Сравнить/.test(a.textContent)) a.remove();
    });
    const row = mk("div", "ux-qa");
    row.setAttribute("role", "toolbar");
    row.setAttribute("aria-label", "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F");
    const draw = () => {
      const fav = inList("\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435", id), team = inList("\u041A\u043E\u043C\u0430\u043D\u0434\u0430", id);
      row.innerHTML = `<a class="ux-act" href="${B}map/?pal=${encodeURIComponent(id)}"><span>\u{1F4CD}</span>\u041D\u0430 \u043A\u0430\u0440\u0442\u0435</a><a class="ux-act" href="${B}breed/?t=${encodeURIComponent(p.ru)}"><span>\u{1F9EC}</span>\u0412\u044B\u0432\u0435\u0441\u0442\u0438</a><a class="ux-act" href="${B}compare/?a=${encodeURIComponent(p.ru)}&b="><span>\u2696\uFE0F</span>\u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C</a><button type="button" class="ux-act ${team ? "on" : ""}" data-l="\u041A\u043E\u043C\u0430\u043D\u0434\u0430" aria-pressed="${team}"><span>${team ? "\u2705" : "\u{1F392}"}</span>${team ? "\u0412 \u043A\u043E\u043C\u0430\u043D\u0434\u0435" : "\u0412 \u043A\u043E\u043C\u0430\u043D\u0434\u0443"}</button><button type="button" class="ux-act ${fav ? "on" : ""}" data-l="\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435" aria-pressed="${fav}"><span>${fav ? "\u2B50" : "\u2606"}</span>${fav ? "\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u043C" : "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"}</button><button type="button" class="ux-act" data-share><span>\u{1F4E4}</span>\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F</button>`;
    };
    draw();
    row.addEventListener("click", (e) => {
      const b = (e.target.closest?e.target:document.body).closest("button");
      if (!b) return;
      if (b.dataset.l) {
        const on = toggleList(b.dataset.l, id);
        const t = (lists()["\u041A\u043E\u043C\u0430\u043D\u0434\u0430"] || []).length;
        toast(b.dataset.l == "\u041A\u043E\u043C\u0430\u043D\u0434\u0430" ? on ? `${p.ru} \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0435 (${t} \u0438\u0437 5)` : "\u0423\u0431\u0440\u0430\u043B \u0438\u0437 \u043A\u043E\u043C\u0430\u043D\u0434\u044B" : on ? "\u0414\u043E\u0431\u0430\u0432\u0438\u043B \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435" : "\u0423\u0431\u0440\u0430\u043B \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E");
        if (b.dataset.l == "\u041A\u043E\u043C\u0430\u043D\u0434\u0430" && on && t > 5) toast("\u0412 \u043E\u0442\u0440\u044F\u0434\u0435 \u0432 \u0438\u0433\u0440\u0435 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 5 \u043F\u0430\u043B\u043E\u0432");
        draw();
      }
      if (b.hasAttribute("data-share")) shareCard(p);
    });
    const hero = $(".pal-hero");
    (hero || info).after(row);
  }
  function loadImg(src) {
    return new Promise((r) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => r(i);
      i.onerror = () => r(null);
      i.src = src;
    });
  }
  async function shareCard(p) {
    const W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    const col = { "fire": "#ff6a2b", "water": "#2f8fff", "grass": "#3fb950", "electric": "#f2c200", "ice": "#5cc8ef", "ground": "#b0763a", "dark": "#8b5cf6", "dragon": "#d94fc0", "neutral": "#a8957a" }[ELC[p.el[0]]] || "#d42b22";
    g.fillStyle = "#f6f2e9";
    g.fillRect(0, 0, W, H);
    const gr = g.createRadialGradient(W / 2, 520, 40, W / 2, 520, 520);
    gr.addColorStop(0, col + "aa");
    gr.addColorStop(1, "#f6f2e900");
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    const im = await loadImg(B + (p.art || p.img || p.thumb));
    if (im) {
      const s = Math.min(760 / im.width, 760 / im.height);
      g.drawImage(im, (W - im.width * s) / 2, 140 + (760 - im.height * s) / 2, im.width * s, im.height * s);
    }
    const font = (w, s) => `${w} ${s}px Unbounded, Manrope, system-ui, sans-serif`;
    g.fillStyle = "#13202a";
    g.font = font(800, 84);
    g.textAlign = "center";
    g.fillText(p.ru, W / 2, 1e3);
    g.font = font(600, 38);
    g.fillStyle = "#4a5560";
    g.fillText("\u2116" + p.no + " \xB7 " + p.el.join(" \xB7 "), W / 2, 1060);
    const ws = (p.work || []).slice().sort((a, b) => b[1] - a[1]).slice(0, 3).map((w) => w[0] + " " + w[1]).join("   ");
    g.font = font(600, 34);
    g.fillText(ws, W / 2, 1125);
    g.font = font(600, 34);
    g.fillText("\u2764 " + p.hp + "   \u2694 " + p.atk + "   \u{1F6E1} " + p.def, W / 2, 1185);
    g.fillStyle = "#d42b22";
    g.font = font(800, 32);
    g.fillText("\u041F\u0430\u043B\u043F\u0435\u0434\u0438\u044F \xB7 39den.github.io/palwiki", W / 2, 1290);
    const url = location.origin + B + p.url;
    c.toBlob(async (bl) => {
      const f = new File([bl], p.en + ".png", { type: "image/png" });
      try {
        if (navigator.canShare && navigator.canShare({ files: [f] })) {
          await navigator.share({ files: [f], title: p.ru, text: p.ru + " \u2014 " + url });
          return;
        }
      } catch (e) {
        if (e && e.name == "AbortError") return;
      }
      const a = mk("a");
      a.href = URL.createObjectURL(bl);
      a.download = p.en + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("\u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430");
    }, "image/png");
  }
  UX.shareCard = shareCard;
  function whatNext(D) {
    const art = $("article.md-content__inner");
    if (!art || $(".ux-next")) return;
    let b = [];
    const info = $(".pal-info[data-pal]");
    if (info) {
      const p = D.pals.find((x) => x.id == info.dataset.pal);
      if (p) b = [["\u{1F4CD}", "\u0413\u0434\u0435 \u043B\u043E\u0432\u0438\u0442\u044C", B + "map/?pal=" + encodeURIComponent(p.id)], ["\u{1F9EC}", "\u041A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438", B + "breed/?t=" + encodeURIComponent(p.ru)], ["\u2696\uFE0F", "\u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C", B + "compare/?a=" + encodeURIComponent(p.ru) + "&b="], ["\u{1F43E}", "\u0412\u0441\u0435 \u043F\u0430\u043B\u044B", B + "gallery/"]];
    } else if (rel.startsWith("boss/") && rel != "boss/") b = [["\u{1F9E9}", "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u043E\u0442\u0440\u044F\u0434", B + "my/"], ["\u{1F451}", "\u0412\u0441\u0435 \u0431\u043E\u0441\u0441\u044B", B + "boss/"], ["\u{1F9ED}", "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u043D\u0430 \u043C\u043E\u0451\u043C \u0443\u0440\u043E\u0432\u043D\u0435", B + "ux/uroven/"], ["\u{1F525}", "\u0421\u0442\u0438\u0445\u0438\u0438", B + "ux/stihii/"]];
    else if (rel.startsWith("breed")) b = [["\u{1F333}", "\u0414\u0435\u0440\u0435\u0432\u043E \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F", B + "ux/derevo/"], ["\u2728", "\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", B + "passivki/"], ["\u{1F43E}", "\u0413\u0430\u043B\u0435\u0440\u0435\u044F", B + "gallery/"]];
    else if (rel.startsWith("map")) b = [["\u{1F9ED}", "\u041C\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C", B + "ux/uroven/"], ["\u{1F451}", "\u0411\u043E\u0441\u0441\u044B", B + "boss/"], ["\u{1F43E}", "\u041F\u0430\u043B\u044B", B + "gallery/"]];
    else if (rel.startsWith("passivki")) b = [["\u{1F9EC}", "\u0420\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435", B + "breed/"], ["\u{1F43E}", "\u041F\u0430\u043B\u044B", B + "gallery/"], ["\u{1F9ED}", "\u041C\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C", B + "ux/uroven/"]];
    else if (rel == "") return;
    else b = [["\u{1F9ED}", "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u043D\u0430 \u043C\u043E\u0451\u043C \u0443\u0440\u043E\u0432\u043D\u0435", B + "ux/uroven/"], ["\u{1F43E}", "\u041F\u0430\u043B\u044B", B + "gallery/"], ["\u{1F4CD}", "\u041A\u0430\u0440\u0442\u0430", B + "map/"], ["\u{1F50D}", "\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C", "#search"]];
    const n = mk("nav", "ux-next");
    n.setAttribute("aria-label", "\u0427\u0442\u043E \u0434\u0430\u043B\u044C\u0448\u0435");
    n.innerHTML = `<div class="ux-h">\u0427\u0442\u043E \u0434\u0430\u043B\u044C\u0448\u0435?</div><div class="ux-tiles">${b.map(([i, l, u]) => `<a class="ux-tile" href="${u}"><span>${i}</span>${esc(l)}</a>`).join("")}</div>`;
    const s = $('a[href="#search"]', n);
    if (s) s.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
    const pn = $(".pn", art);
    (pn || art.lastElementChild).before(n);
  }
  function tableCards() {
    if (/^(compare|breed|my|map)\//.test(rel)) return;
    $$("article .md-typeset__table table, article > table").forEach((t, ti) => {
      if (t.closest(".ux-keep") || t.dataset.ux) return;
      const hs = $$("thead th", t).map((x) => x.textContent.trim());
      const rows = $$("tbody tr", t);
      if (!hs.length || rows.length < 4) return;
      t.dataset.ux = 1;
      const wrap = t.closest(".md-typeset__table") || t;
      const box = mk("div", "ux-tc");
      const cards = rows.map((r) => {
        const td = $$("td", r);
        const title = td[0] ? td[0].innerHTML : "";
        const rest = td.slice(1).map((d, i) => d.textContent.trim() && d.textContent.trim() != "\u2014" ? `<div class="ux-kv"><span>${esc(hs[i + 1] || "")}</span><b>${d.innerHTML}</b></div>` : "").join("");
        return `<div class="ux-card" data-q="${esc(r.textContent.toLowerCase())}"><div class="ux-ct">${title}</div>${rest}</div>`;
      });
      const opts = hs.slice(1).map((h, i) => [h, i + 1]).filter(([h, i]) => {
        const v = new Set(rows.map((r) => (($$("td", r)[i] || {}).textContent || "").trim()));
        return v.size > 1 && v.size <= 12;
      });
      box.innerHTML = `<div class="ux-tcf"><input type="search" class="ux-in" placeholder="\u041D\u0430\u0439\u0442\u0438 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435" aria-label="\u0424\u0438\u043B\u044C\u0442\u0440">${opts.slice(0, 2).map(([h, i]) => `<select class="ux-in" data-c="${i}" aria-label="${esc(h)}"><option value="">${esc(h)}: \u0432\u0441\u0435</option>${[...new Set(rows.map((r) => (($$("td", r)[i] || {}).textContent || "").trim()))].filter(Boolean).sort().map((v) => `<option>${esc(v)}</option>`).join("")}</select>`).join("")}<span class="ux-cnt"></span></div><div class="ux-cards">${cards.join("")}</div>`;
      wrap.after(box);
      wrap.hidden = true;
      const cs = $$(".ux-card", box), cnt = $(".ux-cnt", box);
      const run = () => {
        const q = $("input", box).value.toLowerCase().trim();
        const fs = $$("select", box).map((s) => [+s.dataset.c, s.value]);
        let n = 0;
        cs.forEach((c, k) => {
          const td = $$("td", rows[k]);
          const ok = (!q || c.dataset.q.includes(q)) && fs.every(([i, v]) => !v || ((td[i] || {}).textContent || "").trim() == v);
          c.hidden = !ok;
          n += ok;
        });
        cnt.textContent = "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: " + n;
      };
      box.addEventListener("input", run);
      box.addEventListener("change", run);
      run();
    });
  }
  function badge(D) {
    const art = $("article.md-content__inner");
    if (!art || $(".ux-ver")) return;
    const h1 = $("h1", art);
    if (!h1) return;
    const v = "1.0.5";
    const b = mk("a", "ux-ver", `\u2705 \u0414\u043B\u044F \u0432\u0435\u0440\u0441\u0438\u0438 ${v}`);
    b.href = B + "ux/patch/";
    b.title = "\u0427\u0442\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C \u0432 \u043F\u0430\u0442\u0447\u0435";
    h1.after(b);
  }
  ready(() => {
    try {
      applyS(S());
      tabbar();
      if (/^(4_spravochniki\/paly|boss)\/./.test(rel)) swipeNav();
      searchHooks();
      crumbs();
      backTrack();
      helps();
      quick();
      simpleMode();
      termTips();
      tableCards();
    } catch (e) {
      console.error("ux50", e);
    }
    data().then((D) => {
      try {
        palActions(D);
        whatNext(D);
        badge(D);
      } catch (e) {
        console.error("ux50", e);
      }
    });
    ux().then((X) => {
      try {
        glossary(X);
      } catch (e) {
        console.error("ux50 gl", e);
      }
    });
    setTimeout(intro, 600);
    document.dispatchEvent(new CustomEvent("ux:ready"));
  });
})();
