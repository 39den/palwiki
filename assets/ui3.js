(function() {
  const B = window.PW_BASE;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mob = () => innerWidth < 700;
  async function share(url, title, btn) {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      if (btn) {
        const t = btn.textContent;
        btn.textContent = "\u2705 \u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E";
        setTimeout(() => btn.textContent = t, 1500);
      }
    } catch (e) {
    }
  }
  window.PW_share = share;
  document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".pal-hero");
    if (hero) {
      hero.classList.add("compact");
      const im = hero.querySelector(".pal-card");
      if (im) {
        im.setAttribute("role", "button");
        im.setAttribute("tabindex", "0");
        im.setAttribute("aria-label", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443");
        const open = () => {
          const bx = document.createElement("div");
          bx.className = "lbx";
          bx.innerHTML = `<img src="${im.dataset.card || im.currentSrc || im.src}" alt="${esc(im.alt)}"><button type="button" class="x" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C">\xD7</button>`;
          bx.onclick = () => bx.remove();
          document.body.appendChild(bx);
        };
        im.addEventListener("click", open);
        im.addEventListener("keydown", (e) => {
          if (e.key == "Enter") open();
        });
      }
    }
    const chips = [...document.querySelectorAll("article a.psv[data-psv]")].filter((a) => !a.closest(".pgrid,.psv-hero"));
    if (chips.length) window.PW_data().then((D) => {
      const M = Object.fromEntries(D.passives.map((q) => [q.name, q]));
      chips.forEach((a) => {
        const q = M[a.dataset.psv];
        if (!q || a.querySelector(".pe")) return;
        const e = (q.desc || "").split(";")[0].replace(/([+\-−])\s+(\d)/g, "$1$2").replace(/(\d)\s+%/g, "$1%").replace(/(\d+)\.0%/g, "$1%").trim();
        if (e) a.insertAdjacentHTML("beforeend", `<small class="pe">${esc(e.length > 34 ? e.slice(0, 32) + "\u2026" : e)}</small>`);
      });
    });
    document.querySelectorAll("[data-skel]").forEach((x) => new MutationObserver((m, o) => {
      x.removeAttribute("data-skel");
      o.disconnect();
    }).observe(x, { childList: true }));
    const br = document.getElementById("breed");
    if (br) br.addEventListener("click", (e) => {
      const b = e.target.closest(".bshare");
      if (b) share(location.href, "\u0420\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u2014 \u042D\u043D\u0446\u0438\u043A\u043B\u043E\u043F\u0435\u0434\u0438\u044F Palworld", b);
    });
    if (br) new MutationObserver(() => {
      const c = br.querySelector(".bchild .bb");
      if (c && !c.querySelector(".bshare")) c.insertAdjacentHTML("beforeend", '<button type="button" class="md-button bshare">\u{1F517} \u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F</button>');
    }).observe(br, { childList: true, subtree: true });
    const tb = document.querySelector(".tabbar");
    if (tb) {
      const P = location.pathname;
      const sec = /\/(gallery|4_spravochniki\/paly|compare|breed|my)\//.test(P) ? "gallery/" : /\/map\//.test(P) ? "map/" : P.replace(/\/$/, "") == B.replace(/\/$/, "") ? "home" : "";
      tb.querySelectorAll("a").forEach((a) => {
        const h = a.getAttribute("href");
        a.classList.toggle("on", sec == "home" && h == B || sec && sec != "home" && h.endsWith(sec));
        if (a.classList.contains("on")) a.setAttribute("aria-current", "page");
      });
      let ly = scrollY, acc = 0;
      addEventListener("scroll", () => {
        const y = scrollY, d = y - ly;
        ly = y;
        if (document.documentElement.classList.contains("drawer-open")) return;
        acc = (Math.sign(d) == Math.sign(acc) ? acc : 0) + d;
        if (acc > 40 && y > 120) tb.classList.add("hid");
        if (acc < -30 || y < 60) tb.classList.remove("hid");
      }, { passive: true });
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("pwmap");
    if (!el) return;
    document.documentElement.classList.add("mappage");
    const wait = setInterval(() => {
      const M = window.PW_map;
      if (!M) return;
      clearInterval(wait);
      if (mob()) {
        document.documentElement.classList.add("mapfull");
        const sh = document.createElement("div");
        sh.className = "msheet";
        const q = document.querySelector(".msq"), sw = document.querySelector(".mapsw");
        sh.innerHTML = '<div class="pkg"></div><div class="mrow"></div>';
        const row = sh.querySelector(".mrow");
        if (sw) {
          row.appendChild(sw);
          const tb = sw.querySelector("[data-w=t]");
          if (tb) tb.textContent = "\u0414\u0440\u0435\u0432\u043E";
        }
        if (q) {
          row.appendChild(q);
          const qi = q.querySelector("input");
          if (qi) qi.placeholder = "\u041F\u0430\u043B \u0438\u043B\u0438 \u0431\u043E\u0441\u0441";
        }
        const fb = document.createElement("button");
        fb.type = "button";
        fb.className = "mflt";
        fb.setAttribute("aria-label", "\u0424\u0438\u043B\u044C\u0442\u0440\u044B");
        fb.setAttribute("aria-expanded", "false");
        fb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg><span>\u0424\u0438\u043B\u044C\u0442\u0440\u044B</span>';
        row.appendChild(fb);
        fb.onclick = () => {
          const on = sh.classList.toggle("flt");
          fb.setAttribute("aria-expanded", on);
          sh.classList.remove("min");
        };
        document.body.appendChild(sh);
        const lg = document.querySelector(".mleg");
        if (lg) {
          lg.classList.add("in-sheet");
          sh.appendChild(lg);
        }
        let y0 = null;
        const g = sh.querySelector(".pkg");
        g.onclick = () => sh.classList.toggle("min");
        g.addEventListener("touchstart", (e) => y0 = e.touches[0].clientY, { passive: true });
        g.addEventListener("touchend", (e) => {
          if (y0 == null) return;
          const d = e.changedTouches[0].clientY - y0;
          if (d > 30) sh.classList.add("min");
          if (d < -30) sh.classList.remove("min");
          y0 = null;
        });
        setTimeout(() => M.m.invalidateSize(), 50);
      }
      M.m.on("popupopen", (e) => {
        const c = e.popup.getElement();
        if (!c || c.querySelector(".mshare")) return;
        const ll = e.popup.getLatLng();
        const hit = M.all.find(([p2, mk]) => mk.getLatLng().equals(ll));
        if (!hit) return;
        const p = hit[0];
        const u = location.origin + location.pathname + "?pt=" + p.x + "," + p.y;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mshare";
        b.textContent = "\u{1F517} \u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u0442\u043E\u0447\u043A\u043E\u0439";
        b.onclick = () => share(u, p.name + " \u2014 \u043A\u0430\u0440\u0442\u0430 Palworld", b);
        const box = c.querySelector(".leaflet-popup-content");
        box && box.appendChild(b);
      });
      const pt = new URLSearchParams(location.search).get("pt");
      if (pt) {
        const [x, y] = pt.split(",").map(Number);
        const h = M.all.slice().sort((a, b) => (a[0].x - x) ** 2 + (a[0].y - y) ** 2 - ((b[0].x - x) ** 2 + (b[0].y - y) ** 2))[0];
        if (h) {
          const g = Object.values(M.groups).find((g2) => g2.hasLayer && g2.hasLayer(h[1]));
          if (g && g.zoomToShowLayer) g.zoomToShowLayer(h[1], () => h[1].openPopup());
          else {
            M.m.setView(h[1].getLatLng(), 4);
            h[1].openPopup();
          }
        }
      }
    }, 150);
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const f = document.querySelector(".ifl");
  if (!f) return;
  const q = f.querySelector(".pfq"), n = f.querySelector(".pfn");
  const cards = [...document.querySelectorAll(".icard,.itm")];
  const run = () => {
    const v = (q.value || "").toLowerCase().replace(/ё/g, "\u0435");
    let c = 0;
    cards.forEach((x) => {
      const ok = !v || x.dataset.n.replace(/ё/g, "\u0435").includes(v);
      x.style.display = ok ? "" : "none";
      const h = x.previousElementSibling;
      if (h && /^H2$/.test(h.tagName)) h.style.display = ok ? "" : "none";
      c += ok;
    });
    n.textContent = "\u043D\u0430\u0439\u0434\u0435\u043D\u043E " + c;
  };
  q.addEventListener("input", run);
  run();
  const openHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const d = id && document.getElementById(id);
    if (d && d.tagName == "DETAILS") {
      d.open = true;
      setTimeout(() => d.scrollIntoView({ block: "start", behavior: "smooth" }), 60);
    }
  };
  openHash();
  addEventListener("hashchange", openHash);
  document.querySelectorAll("details.itm").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) {
      document.querySelectorAll("details.itm[open]").forEach((o) => {
        if (o !== d) o.open = false;
      });
      history.replaceState(null, "", "#" + d.id);
    }
  }));
});
document.addEventListener("DOMContentLoaded", () => {
  const F = document.querySelector(".food");
  if (!F) return;
  const g = F.querySelector(".fgrid"), q = F.querySelector(".ffq"), so = F.querySelector(".ffs"), n = F.querySelector(".ffn");
  let e = "";
  const cards = [...g.children];
  const run = () => {
    const t = (q.value || "").toLowerCase().replace(/ё/g, "\u0435");
    let c = 0;
    const k = so.value;
    cards.sort((a, b) => k == "n" ? a.dataset.n.localeCompare(b.dataset.n, "ru") : +b.dataset[k] - +a.dataset[k]);
    cards.forEach((x) => {
      const ok = (!e || x.dataset.e.split(" ").includes(e)) && (!t || x.dataset.n.replace(/ё/g, "\u0435").includes(t));
      x.hidden = !ok;
      if (ok) c++;
      g.appendChild(x);
    });
    n.textContent = "\u041D\u0430\u0439\u0434\u0435\u043D\u043E " + c;
  };
  F.querySelectorAll(".fc").forEach((b) => b.onclick = () => {
    e = b.dataset.e;
    F.querySelectorAll(".fc").forEach((z) => z.classList.toggle("on", z === b));
    run();
  });
  q.oninput = run;
  so.onchange = run;
  run();
});
(function() {
  const X0 = -1923.225927, Y0 = 1032.79857101, X1 = 1234.833276624702, Y1 = -2125.2606328, SMAX = 12;
  const ok = (s) => Math.max(1, Math.min(SMAX, s));
  function init(root) {
    root.querySelectorAll(".habmap:not([data-ok])").forEach((el) => {
      el.dataset.ok = 1;
      const img = el.querySelector(".hm-img"), dots = el.querySelector(".hm-dots"), cnt = el.querySelector(".hm-c"), full = el.querySelector(".hm-full"), bx = el.querySelector(".hm-box");
      const base = img.getAttribute("src").replace(/assets\/wtree\/mini_\w+\.webp$/, "");
      let H = null, tod = "d", w = +el.dataset.d || +el.dataset.n ? "p" : "t";
      if (!+el.dataset.d && +el.dataset.n) tod = "n";
      el.querySelectorAll(".hm-tod button").forEach((b) => b.classList.toggle("on", b.dataset.k == tod));
      if (dots) dots.remove();
      const st = document.createElement("div");
      st.className = "hm-stage";
      img.before(st);
      st.appendChild(img);
      const cv = document.createElement("canvas");
      cv.className = "hm-cv";
      cv.setAttribute("aria-hidden", "true");
      bx.appendChild(cv);
      const zc = document.createElement("div");
      zc.className = "hm-zc";
      zc.innerHTML = '<button type="button" data-z="1" aria-label="\u041F\u0440\u0438\u0431\u043B\u0438\u0437\u0438\u0442\u044C">+</button><button type="button" data-z="-1" aria-label="\u041E\u0442\u0434\u0430\u043B\u0438\u0442\u044C">\u2212</button><button type="button" data-z="0" aria-label="\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u044E \u043E\u0431\u043B\u0430\u0441\u0442\u044C">\u2922</button>';
      bx.appendChild(zc);
      let P = [], A = [], s = 1, tx = 0, ty = 0, fit = { s: 1, tx: 0, ty: 0 }, bw = 0, bh = 0, dpr = 1, raf = 0, anim = 0;
      const ctx = cv.getContext("2d");
      const size = () => {
        bw = bx.clientWidth;
        bh = bx.clientHeight;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(bw * dpr);
        cv.height = Math.round(bh * dpr);
      };
      const clamp = () => {
        s = ok(s);
        tx = Math.min(0, Math.max(bw - bw * s, tx));
        ty = Math.min(0, Math.max(bh - bh * s, ty));
      };
      const zoomed = () => s > fit.s * 1.05;
      const req = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      let last = [];
      function frame() {
        const f0 = performance.now();
        raf = 0;
        clamp();
        st.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        bx.classList.toggle("zin", zoomed());
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, bw, bh);
        const C = 26, G = /* @__PURE__ */ new Map();
        last = [];
        for (const p of P) {
          const x = tx + p[0] * bw * s, y = ty + p[1] * bh * s;
          if (x < -12 || y < -12 || x > bw + 12 || y > bh + 12) continue;
          const k = (x / C | 0) + ":" + (y / C | 0);
          const g2 = G.get(k);
          if (g2) {
            g2.n++;
            g2.x += x;
            g2.y += y;
          } else G.set(k, { n: 1, x, y });
        }
        ctx.lineWidth = 1.5;
        G.forEach((g2) => {
          const x = g2.x / g2.n, y = g2.y / g2.n;
          if (g2.n == 1) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 6.283);
            ctx.fillStyle = "#ffd34d";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,.55)";
            ctx.stroke();
            return;
          }
          const r = g2.n < 10 ? 10 : g2.n < 100 ? 12 : 14;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.283);
          ctx.fillStyle = "#ffd34d";
          ctx.fill();
          ctx.strokeStyle = "#1b1300";
          ctx.stroke();
          ctx.fillStyle = "#1b1300";
          ctx.font = "800 11px Manrope,system-ui,sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(g2.n, x, y + 0.5);
          last.push({ x, y, r, n: g2.n });
        });
        for (const p of A) {
          const x = tx + p[0] * bw * s, y = ty + p[1] * bh * s;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, 6.283);
          ctx.fillStyle = "#ff5a6a";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
        if (window.PW_hmFrame) window.PW_hmFrame(f0, performance.now() - f0);
      }
      const zoomAt = (ns, cx, cy) => {
        ns = ok(ns);
        const k = ns / s;
        tx = cx - (cx - tx) * k;
        ty = cy - (cy - ty) * k;
        s = ns;
        req();
      };
      const tween = (to, ms = 280) => {
        cancelAnimationFrame(anim);
        const f = { s, tx, ty }, t0 = performance.now();
        if (matchMedia("(prefers-reduced-motion:reduce)").matches) ms = 1;
        const step = (t) => {
          const q = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - q, 3);
          s = f.s + (to.s - f.s) * e;
          tx = f.tx + (to.tx - f.tx) * e;
          ty = f.ty + (to.ty - f.ty) * e;
          frame();
          if (q < 1) anim = requestAnimationFrame(step);
        };
        anim = requestAnimationFrame(step);
      };
      function draw() {
        if (!H) return;
        const W = H[w] || {};
        const f = w == "p" ? (x, y) => [(x - X0) / (X1 - X0), (Y0 - y) / (Y0 - Y1)] : (x, y) => [x, y];
        P = (W[tod] || []).map((p) => f(p[0], p[1]));
        A = (W.a || []).map((p) => f(p[0], p[1]));
        img.src = base + "assets/wtree/mini_" + (w == "p" ? "palpagos" : "tree") + ".webp";
        size();
        let to = { s: 1, tx: 0, ty: 0 };
        if (P.length) {
          let a = 1, b = 1, c = 0, d = 0;
          P.forEach((p) => {
            a = Math.min(a, p[0]);
            b = Math.min(b, p[1]);
            c = Math.max(c, p[0]);
            d = Math.max(d, p[1]);
          });
          const cx = (a + c) / 2, cy = (b + d) / 2, sp = Math.max(c - a, d - b, 0.12) * 1.6, sc = Math.min(4, Math.max(1, 1 / sp));
          to = { s: sc, tx: bw / 2 - cx * bw * sc, ty: bh / 2 - cy * bh * sc };
        }
        fit = to;
        tween(to);
        cnt.textContent = P.length ? `${P.length} ${tod == "d" ? "\u0442\u043E\u0447\u0435\u043A \u0434\u043D\u0451\u043C" : "\u0442\u043E\u0447\u0435\u043A \u043D\u043E\u0447\u044C\u044E"}` + (A.length ? ` \xB7 \u0430\u043B\u044C\u0444\u0430: ${A.length}` : "") : tod == "n" ? "\u041D\u043E\u0447\u044C\u044E \u043D\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F" : "\u0414\u043D\u0451\u043C \u043D\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F";
        if (full) full.href = base + "map/?pal=" + el.dataset.pal + (w == "t" ? "&w=tree" : "") + (tod == "n" ? "&t=n" : "");
      }
      el.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.z != null) {
          const z = +b.dataset.z;
          if (!z) tween(fit);
          else {
            const ns = ok(s * (z > 0 ? 2 : 0.5));
            const k = ns / s;
            tween({ s: ns, tx: bw / 2 - (bw / 2 - tx) * k, ty: bh / 2 - (bh / 2 - ty) * k });
          }
          return;
        }
        if (b.dataset.k) {
          tod = b.dataset.k;
          el.querySelectorAll(".hm-tod button").forEach((x) => x.classList.toggle("on", x === b));
        }
        if (b.dataset.w) {
          w = b.dataset.w;
          el.querySelectorAll(".hm-w button").forEach((x) => x.classList.toggle("on", x === b));
        }
        draw();
      });
      const pt = (t, r) => ({ x: t.clientX - r.left, y: t.clientY - r.top });
      let g = null, tap = null;
      bx.addEventListener("touchstart", (e) => {
        if (e.target.closest(".hm-zc")) return;
        const r = bx.getBoundingClientRect();
        cancelAnimationFrame(anim);
        if (e.touches.length >= 2) {
          e.cancelable && e.preventDefault();
          const a = pt(e.touches[0], r), b = pt(e.touches[1], r);
          g = { m: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: s, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx0: tx, ty0: ty, r };
        } else {
          const a = pt(e.touches[0], r);
          g = { m: "one", x0: a.x, y0: a.y, tx0: tx, ty0: ty, r, dir: null, t: performance.now() };
        }
      }, { passive: false });
      bx.addEventListener("touchmove", (e) => {
        if (!g) return;
        const r = g.r;
        if (e.touches.length >= 2) {
          e.cancelable && e.preventDefault();
          const a2 = pt(e.touches[0], r), b = pt(e.touches[1], r);
          if (g.m != "pinch") g = { m: "pinch", d0: Math.hypot(a2.x - b.x, a2.y - b.y) || 1, s0: s, cx: (a2.x + b.x) / 2, cy: (a2.y + b.y) / 2, tx0: tx, ty0: ty, r };
          const d = Math.hypot(a2.x - b.x, a2.y - b.y), mx = (a2.x + b.x) / 2, my = (a2.y + b.y) / 2, ns = ok(g.s0 * d / g.d0), k = ns / g.s0;
          s = ns;
          tx = mx - (g.cx - g.tx0) * k;
          ty = my - (g.cy - g.ty0) * k;
          req();
          return;
        }
        if (g.m != "one") return;
        const a = pt(e.touches[0], r), dx = a.x - g.x0, dy = a.y - g.y0;
        if (!g.dir && Math.hypot(dx, dy) > 8) g.dir = Math.abs(dx) > Math.abs(dy) * 1.2 && (s > 1.001 || zoomed()) ? "pan" : "page";
        if (g.dir == "pan") {
          e.cancelable && e.preventDefault();
          tx = g.tx0 + dx;
          ty = g.ty0 + (zoomed() ? dy : 0);
          req();
        }
      }, { passive: false });
      bx.addEventListener("touchend", (e) => {
        if (!g) return;
        const was = g;
        if (e.touches.length) {
          if (g.m == "pinch" && e.touches.length == 1) {
            const a = pt(e.touches[0], g.r);
            g = { m: "one", x0: a.x, y0: a.y, tx0: tx, ty0: ty, r: g.r, dir: "pan" };
          }
          return;
        }
        g = null;
        if (was.m == "one" && !was.dir && e.changedTouches.length) {
          const a = pt(e.changedTouches[0], was.r), now = performance.now();
          const hit = last.find((c) => Math.hypot(c.x - a.x, c.y - a.y) <= c.r + 6);
          if (tap && now - tap.t < 320 && Math.hypot(tap.x - a.x, tap.y - a.y) < 30) {
            e.cancelable && e.preventDefault();
            tap = null;
            const ns = zoomed() && s >= SMAX * 0.98 ? fit.s : ok(s * 2);
            const k = ns / s;
            tween({ s: ns, tx: a.x - (a.x - tx) * k, ty: a.y - (a.y - ty) * k });
            return;
          }
          tap = { t: now, x: a.x, y: a.y };
          if (hit) {
            e.cancelable && e.preventDefault();
            const ns = ok(s * 2.2), k = ns / s;
            tween({ s: ns, tx: a.x - (a.x - tx) * k, ty: a.y - (a.y - ty) * k });
          }
        }
      }, { passive: false });
      bx.addEventListener("touchcancel", () => {
        g = null;
      });
      ["gesturestart", "gesturechange", "gestureend"].forEach((n) => bx.addEventListener(n, (e) => e.cancelable && e.preventDefault(), { passive: false }));
      bx.addEventListener("wheel", (e) => {
        if (!e.ctrlKey && !zoomed() && Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
        e.cancelable && e.preventDefault();
        const r = bx.getBoundingClientRect();
        zoomAt(s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 22e-4)), e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });
      let md = null;
      bx.addEventListener("pointerdown", (e) => {
        if (e.pointerType != "mouse" || e.button || e.target.closest(".hm-zc")) return;
        md = { x: e.clientX, y: e.clientY, tx0: tx, ty0: ty };
        bx.setPointerCapture(e.pointerId);
        bx.classList.add("drag");
      });
      bx.addEventListener("pointermove", (e) => {
        if (!md) return;
        tx = md.tx0 + e.clientX - md.x;
        ty = md.ty0 + e.clientY - md.y;
        req();
      });
      const mu = () => {
        md = null;
        bx.classList.remove("drag");
      };
      bx.addEventListener("pointerup", mu);
      bx.addEventListener("pointercancel", mu);
      bx.addEventListener("dblclick", (e) => {
        e.cancelable && e.preventDefault();
        const r = bx.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, ns = ok(s * 2), k = ns / s;
        tween({ s: ns, tx: x - (x - tx) * k, ty: y - (y - ty) * k });
      });
      if ("ResizeObserver" in window) new ResizeObserver(() => {
        const ow = bw;
        size();
        if (!ow && bw && H) {
          draw();
          return;
        }
        if (ow && bw && ow != bw) {
          const k = bw / ow;
          tx *= k;
          ty *= k;
          fit = { s: fit.s, tx: fit.tx * k, ty: fit.ty * k };
        }
        req();
      }).observe(bx);
      el._hm = { get s() {
        return s;
      }, get fit() {
        return fit.s;
      }, get pts() {
        return P.length;
      }, get badges() {
        return last.length;
      } };
      const go = () => fetch(base + "hab/" + el.dataset.pal + ".json").then((r) => r.json()).then((j) => {
        H = j;
        draw();
      }).catch(() => {
        cnt.textContent = "\u041A\u0430\u0440\u0442\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u043E\u0444\u043B\u0430\u0439\u043D";
      });
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((es) => {
          if (es.some((x) => x.isIntersecting)) {
            io.disconnect();
            go();
          }
        }, { rootMargin: "300px" });
        io.observe(el);
      } else go();
    });
  }
  window.ppHabInit = init;
  const run = () => init(document);
  if (window.document$ && document$.subscribe) document$.subscribe(run);
  else document.addEventListener("DOMContentLoaded", run);
  document.addEventListener("click", () => setTimeout(run, 0), { passive: true });
})();
(function() {
  const B = window.PW_BASE;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const X0 = -1923.225927, Y0 = 1032.79857101, X1 = 1234.833276624702, Y1 = -2125.2606328, S = 8192, Z = 5;
  const TT = { alpha: ["\u{1F451}", "\u0410\u043B\u044C\u0444\u044B \u0438 \u043F\u043E\u043B\u0435\u0432\u044B\u0435 \u0431\u043E\u0441\u0441\u044B"], tower: ["\u{1F3EF}", "\u0411\u0430\u0448\u043D\u0438"], travel: ["\u{1F5FF}", "\u0422\u0435\u043B\u0435\u043F\u043E\u0440\u0442\u044B"], watch: ["\u{1F5FC}", "\u0421\u043C\u043E\u0442\u0440\u043E\u0432\u044B\u0435 \u0432\u044B\u0448\u043A\u0438"], npc: ["\u{1F9D1}", "\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438"], chest: ["\u{1F381}", "\u0421\u0443\u043D\u0434\u0443\u043A\u0438"], fruit: ["\u{1F333}", "\u041F\u043B\u043E\u0434\u043E\u0432\u044B\u0435 \u0434\u0435\u0440\u0435\u0432\u044C\u044F"], spring: ["\u{1F4A7}", "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438"], fish: ["\u{1F3A3}", "\u0420\u044B\u0431\u0430\u043B\u043A\u0430"] };
  const RU = (n) => {
    const D = window.PW_D;
    if (!D) return n;
    const p = D.pals.find((p2) => p2.en == n);
    return p ? p.ru : n;
  };
  let TM = null, TM_dc = null;
  window.PW_tree = function() {
    const wt = document.getElementById("wtree");
    if (!wt || TM) return TM;
    wt.innerHTML = '<div id="wtmap"></div>';
    const el = wt.firstChild;
    const m = L.map(el, { crs: L.CRS.Simple, minZoom: 0, maxZoom: 5, zoomSnap: 0.5, attributionControl: true });
    const ll = (x, y) => m.unproject([x * 4096, y * 4096], 3);
    const bounds = L.latLngBounds(ll(0, 1), ll(1, 0));
    L.tileLayer(B + "assets/wtree/tiles/z{z}x{x}y{y}.webp", { minZoom: 0, maxZoom: 5, maxNativeZoom: 3, tileSize: 512, noWrap: true, bounds, errorTileUrl: B + "assets/wtree/tiles/blank.webp", attribution: '\u041A\u0430\u0440\u0442\u0430 \u0438 \u0442\u043E\u0447\u043A\u0438: <a href="https://paldb.cc/ru/Map_Tree">paldb.cc</a> \xB7 \xA9 Pocketpair' }).addTo(m);
    m.setMaxBounds(bounds.pad(0.05));
    m.options.maxBoundsViscosity = 1;
    m.fitBounds(bounds);
    el.style.background = "#0d151c";
    const groups = {};
    const lay = L.control({ position: "topright" });
    fetch(B + "assets/wtree/markers.json").then((r) => r.json()).then((J) => {
      const cnt = {};
      const MI = window.PW_MI, dc = MI.DC(m);
      MI.fit(m);
      TM_dc = dc;
      const on0 = ["alpha", "tower", "travel", "watch", "npc"];
      Object.keys(TT).forEach((k) => {
        if (!on0.includes(k)) dc.on(k, false);
      });
      J.pts.forEach((p) => {
        const t = TT[p.t];
        if (!t) return;
        cnt[p.t] = (cnt[p.t] || 0) + 1;
        groups[p.t] = groups[p.t] || dc.group(p.t);
        const nm = p.n;
        dc.add(L.marker(ll(p.x, p.y), { icon: MI.icon(p.t, 0, nm), title: nm, riseOnHover: true }).bindPopup(() => window.PW_pop({ t: p.t, name: nm, lvl: p.lv, kind: t[0] + " " + t[1] }), MI.POP), p.t);
      });
      lay.onAdd = () => {
        const d = L.DomUtil.create("div", "mleg");
        const small = innerWidth < 700;
        d.innerHTML = `<button class="mleg-t">\u{1F5FA} \u0421\u043B\u043E\u0438</button><div class="mleg-b" ${small ? "hidden" : ""}>` + Object.keys(TT).filter((k) => cnt[k]).map((k) => `<label><input type="checkbox" ${dc.isOn(k) ? "checked" : ""} data-k="${k}"> ${MI.leg(k)} ${TT[k][1]} <small>${cnt[k]}</small></label>`).join("") + "</div>";
        L.DomEvent.disableClickPropagation(d);
        d.querySelector(".mleg-t").onclick = () => {
          const b = d.querySelector(".mleg-b");
          b.hidden = !b.hidden;
        };
        d.querySelectorAll("input").forEach((i) => i.onchange = () => dc.on(i.dataset.k, i.checked));
        return d;
      };
      lay.addTo(m);
      dc.run();
      habitat();
    });
    TM = { m, ll };
    window.PW_tmap = { m, get dc() {
      return TM_dc;
    } };
    setTimeout(() => m.invalidateSize(), 60);
    return TM;
  };
  let HL = null;
  let HT = 0, HC = 0;
  function habitat() {
    const q = new URLSearchParams(location.search), id = q.get("pal");
    if (!id) return;
    let tod = q.get("t") == "n" ? "n" : "d";
    fetch(B + "hab/" + id + ".json").then((r) => r.ok ? r.json() : {}).catch(() => ({})).then((H) => {
      const D = window.PW_D || {};
      const pal = (D.pals || []).find((p) => p.id == id);
      const nm = pal ? pal.ru : id;
      H = H || {};
      const fx = (D.map || []).filter((p) => pal && p.url && p.url == pal.url && (p.t == "alpha" || p.t == "tower" || p.t == "sealed"));
      const L0 = (w2, t) => ((H[w2] || {})[t] || []).length, A = (w2) => ((H[w2] || {}).a || []).length + (w2 == "p" ? fx.length : 0), N = (w2, t) => L0(w2, t) + A(w2);
      const ot = tod == "n" ? "d" : "n";
      let sw0 = "";
      if (!L0("p", tod) && !L0("t", tod) && (L0("p", ot) || L0("t", ot))) {
        tod = ot;
        sw0 = tod == "n" ? "\u0434\u043D\u0451\u043C \u043D\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F, \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u043D\u043E\u0447\u044C" : "\u043D\u043E\u0447\u044C\u044E \u043D\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F, \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u0434\u0435\u043D\u044C";
      }
      let w = q.get("w") == "tree" ? "t" : q.get("w") == "pal" ? "p" : N("p", tod) >= N("t", tod) ? "p" : "t";
      if (!N(w, tod) && N(w == "p" ? "t" : "p", tod)) w = w == "p" ? "t" : "p";
      const MI = window.PW_MI;
      const add = (M, ll, pts, al, dc) => {
        const g = [];
        pts.forEach((p) => g.push(dc.add(L.marker(ll(p[0], p[1]), { icon: MI.icon("hab", 22), title: nm, riseOnHover: true }).bindPopup(() => window.PW_pop({ t: "hab", name: nm, sub: (tod == "n" ? "\u041D\u043E\u0447\u044C\u044E" : "\u0414\u043D\u0451\u043C") + (p[2] ? " \xB7 \u0443\u0440. " + p[2] : "") }), MI.POP), "hab", 22, 4)));
        (al || []).forEach((p) => g.push(dc.add(L.marker(ll(p[0], p[1]), { icon: MI.icon("alpha", 34, nm), title: nm, riseOnHover: true }).bindPopup(() => window.PW_pop({ t: "alpha", name: nm, kind: "\u{1F451} \u0410\u043B\u044C\u0444\u0430" }), MI.POP), "alpha", 32, 6)));
        const b = pts.concat(al || []);
        if (b.length) M.m.fitBounds(L.latLngBounds(b.map((p) => ll(p[0], p[1]))).pad(0.3), { maxZoom: 4, animate: false });
        M.m.closePopup();
        dc.run();
        return g;
      };
      const P = window.PW_map, pm = P && { m: P.m, ll: (x, y) => P.m.unproject([(x - X0) / (X1 - X0) * S, (Y0 - y) / (Y0 - Y1) * S], Z) };
      if (w == "t") {
        if (!TM || !TM_dc) {
          const sb = document.querySelector(".mapsw [data-w=t]");
          if (HT) return;
          if (sb && sb.onclick) {
            HT = 1;
            sb.click();
          } else if (++HC < 80) setTimeout(habitat, 150);
          return;
        }
        if (!HL) HL = add(TM, TM.ll, (H.t || {})[tod] || [], (H.t || {}).a, TM_dc);
      } else if (pm && P.dc && !HL) {
        if (P.m.closePopup) P.m.closePopup();
        HL = add(pm, pm.ll, (H.p || {})[tod] || [], ((H.p || {}).a || []).concat(fx.map((p) => [p.x, p.y])), P.dc);
      }
      const n = N(w, tod), wo = w == "p" ? "t" : "p", no = N(wo, tod) + N(wo, ot);
      const txt = n ? `${n} ${n % 10 == 1 && n % 100 != 11 ? "\u0442\u043E\u0447\u043A\u0430" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "\u0442\u043E\u0447\u043A\u0438" : "\u0442\u043E\u0447\u0435\u043A"}${w == "t" ? " \u043D\u0430 \u041C\u0438\u0440\u043E\u0432\u043E\u043C \u0434\u0440\u0435\u0432\u0435" : ""}` : (() => {
        const en = pal && pal.en || "";
        if (/Slime|Bat$|Demon Eye|Enchanted Sword/.test(en)) return "\u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0442\u043E\u0447\u0435\u043A \u043D\u0435\u0442: \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u044C\u044F\u0445";
        if (/Bellanoir|Xenolord|Blazamut Ryu/.test(en)) return "\u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0442\u043E\u0447\u0435\u043A \u043D\u0435\u0442: \u044D\u0442\u043E \u0431\u043E\u0441\u0441 \u0440\u0435\u0439\u0434\u0430, \u0435\u0433\u043E \u043F\u0440\u0438\u0437\u044B\u0432\u0430\u044E\u0442 \u043D\u0430 \u0431\u0430\u0437\u0435";
        return "\u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0442\u043E\u0447\u0435\u043A \u043D\u0435\u0442: \u0432 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043D\u0435 \u0436\u0438\u0432\u0451\u0442, \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432 \u0440\u0435\u0439\u0434\u0430\u0445 \u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u044F\u0445 \u0438\u043B\u0438 \u0432\u044B\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0441\u043A\u0440\u0435\u0449\u0438\u0432\u0430\u043D\u0438\u0435\u043C" + (pal && pal.egg ? " (\u044F\u0439\u0446\u043E \xAB" + esc(pal.egg) + "\xBB)" : "");
      })();
      const other = no ? `<a href="?pal=${encodeURIComponent(id)}${tod == "n" ? "&t=n" : ""}${wo == "t" ? "&w=tree" : "&w=pal"}">${wo == "t" ? "\u{1F333} \u0415\u0449\u0451 \u043D\u0430 \u0414\u0440\u0435\u0432\u0435" : "\u{1F5FA} \u0415\u0449\u0451 \u043D\u0430 \u041F\u0430\u043B\u043F\u0430\u0433\u043E\u0441\u0435"}</a>` : "";
      if (!document.querySelector(".habchip")) {
        const c = document.createElement("div");
        c.className = "habchip";
        c.innerHTML = `<span>\u{1F4CD} \u041E\u0431\u0438\u0442\u0430\u043D\u0438\u0435: <b>${esc(nm)}</b> \xB7 ${tod == "n" ? "\u043D\u043E\u0447\u044C" : "\u0434\u0435\u043D\u044C"} \xB7 ${txt}${sw0 ? " <small>(" + sw0 + ")</small>" : ""}</span>` + (L0(w, ot) || L0(wo, ot) ? `<a href="?pal=${encodeURIComponent(id)}&t=${ot}${w == "t" ? "&w=tree" : ""}">${ot == "n" ? "\u{1F319} \u041D\u043E\u0447\u044C" : "\u2600\uFE0F \u0414\u0435\u043D\u044C"}</a>` : "") + other + `<a href="${location.pathname}" aria-label="\u0423\u0431\u0440\u0430\u0442\u044C">\u2715</a>`;
        const anchor = document.querySelector(".msheet .mrow") || document.querySelector(".msq");
        anchor ? anchor.after(c) : document.getElementById("pwmap").before(c);
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("pwmap")) return;
    const w = setInterval(() => {
      if (!window.PW_map) return;
      clearInterval(w);
      if (!window.PW_D && window.PW_data) window.PW_data().then((D) => {
        window.PW_D = D;
        habitat();
      });
      else habitat();
      if (new URLSearchParams(location.search).get("w") == "tree" || location.hash == "#tree") {
        let n = 0;
        const t = setInterval(() => {
          const b = document.querySelector(".mapsw [data-w=t]");
          if (b && b.onclick) b.click();
          if (document.getElementById("wtmap") || ++n > 40) clearInterval(t);
        }, 150);
      }
    }, 150);
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const F = document.querySelector(".skf");
  if (!F) return;
  const g = document.querySelector(".skg"), q = F.querySelector(".sk-q"), so = F.querySelector(".sk-s"), n = F.querySelector(".skn");
  const cards = [...g.children];
  const st = { el: "", pw: "", ct: "", ef: "", u: "", f: "" };
  const rng = (v, r) => {
    if (!r) return true;
    const [a, b] = r.split("-").map(Number);
    return v >= a && v <= b;
  };
  const u = new URLSearchParams(location.search);
  Object.keys(st).forEach((k) => {
    if (u.get(k)) st[k] = u.get(k);
  });
  if (u.get("q")) q.value = u.get("q");
  if (u.get("s")) so.value = u.get("s");
  const paint = () => F.querySelectorAll(".fc").forEach((b) => b.classList.toggle("on", st[b.dataset.g] == b.dataset.v));
  const run = () => {
    const t = (q.value || "").toLowerCase().replace(/ё/g, "\u0435").trim();
    const k = so.value;
    cards.sort((a, b) => k == "n" ? a.dataset.n.localeCompare(b.dataset.n, "ru") : k == "ct" ? +a.dataset.ct - +b.dataset.ct : +b.dataset.pw - +a.dataset.pw);
    let c = 0;
    const fr = document.createDocumentFragment();
    cards.forEach((x) => {
      const d = x.dataset;
      const ok = (!st.el || d.el == st.el) && rng(+d.pw, st.pw) && rng(+d.ct, st.ct) && (!st.ef || d.ef.split(" ").includes(st.ef)) && (!st.u || d.u == "1") && (!st.f || d.f == "1") && (!t || d.n.replace(/ё/g, "\u0435").includes(t) || d.ef.toLowerCase().includes(t));
      x.hidden = !ok;
      c += ok;
      fr.appendChild(x);
    });
    g.appendChild(fr);
    n.textContent = c ? "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: " + c : "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C \u2014 \u0441\u0431\u0440\u043E\u0441\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B";
    paint();
    const p = new URLSearchParams();
    Object.entries(st).forEach(([a, b]) => b && p.set(a, b));
    if (t) p.set("q", t);
    if (k != "pw") p.set("s", k);
    history.replaceState(null, "", (p + "" ? "?" + p : location.pathname) + location.hash);
  };
  F.addEventListener("click", (e) => {
    const b = e.target.closest(".fc");
    if (!b) return;
    const gk = b.dataset.g;
    st[gk] = st[gk] == b.dataset.v && b.dataset.v ? "" : b.dataset.v;
    run();
  });
  q.addEventListener("input", run);
  so.addEventListener("change", run);
  run();
  if (location.hash) {
    const x = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (x && x.tagName == "DETAILS") {
      x.open = true;
      x.hidden = false;
      setTimeout(() => x.scrollIntoView({ block: "center" }), 100);
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const art = document.querySelector("article.md-content__inner");
  if (!art) return;
  const G = [
    [/\bIV\b/, "\u0422\u0430\u043B\u0430\u043D\u0442\u044B (IV) \u2014 \u0441\u043A\u0440\u044B\u0442\u044B\u0435 \u0431\u043E\u043D\u0443\u0441\u044B \u043F\u0430\u043B\u0430 \u043A \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044E, \u0430\u0442\u0430\u043A\u0435 \u0438 \u0437\u0430\u0449\u0438\u0442\u0435, \u043E\u0442 0 \u0434\u043E 100. \u0427\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0435, \u0442\u0435\u043C \u0441\u0438\u043B\u044C\u043D\u0435\u0435."],
    [/[Кк]онденсаци[яиюей]/, "\u041A\u043E\u043D\u0434\u0435\u043D\u0441\u0430\u0446\u0438\u044F \u2014 \u0441\u043B\u0438\u044F\u043D\u0438\u0435 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u0445 \u043F\u0430\u043B\u043E\u0432 \u0432 \u041A\u043E\u043D\u0434\u0435\u043D\u0441\u0430\u0442\u043E\u0440\u0435. \u0414\u0430\u0451\u0442 \u0437\u0432\u0451\u0437\u0434\u044B: \u043F\u0430\u043B \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0438 \u043B\u0443\u0447\u0448\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442."],
    [/[Сс]ила разведения/, "\u0421\u0438\u043B\u0430 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u2014 \u0441\u043A\u0440\u044B\u0442\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0432\u0438\u0434\u0430. \u0420\u0435\u0431\u0451\u043D\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F \u0441 \u0441\u0438\u043B\u043E\u0439, \u0431\u043B\u0438\u0437\u043A\u043E\u0439 \u043A \u0441\u0440\u0435\u0434\u043D\u0435\u043C\u0443 \u0434\u0432\u0443\u0445 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439."],
    [/[Мм]ножитель поимки/, "\u041C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0438\u043C\u043A\u0438 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0433\u043A\u043E \u043F\u043E\u0439\u043C\u0430\u0442\u044C \u043F\u0430\u043B\u0430. \u0411\u043E\u043B\u044C\u0448\u0435 \u2014 \u043F\u0440\u043E\u0449\u0435."],
    [/\bCT\b/, "CT \u2014 \u043F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430 \u043D\u0430\u0432\u044B\u043A\u0430 \u0432 \u0441\u0435\u043A\u0443\u043D\u0434\u0430\u0445."],
    [/\bмет[аеуы]\b/, "\u041C\u0435\u0442\u0430 \u2014 \u0442\u043E, \u0447\u0435\u043C \u0447\u0430\u0449\u0435 \u0432\u0441\u0435\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F \u0441\u0438\u043B\u044C\u043D\u044B\u0435 \u0438\u0433\u0440\u043E\u043A\u0438."],
    [/[Пп]ригодност[ьи]/, "\u041F\u0440\u0438\u0433\u043E\u0434\u043D\u043E\u0441\u0442\u044C \u043A \u0440\u0430\u0431\u043E\u0442\u0435 \u2014 \u043A\u0430\u043A\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u044B \u043F\u0430\u043B \u0443\u043C\u0435\u0435\u0442 \u0438 \u043D\u0430 \u043A\u0430\u043A\u043E\u043C \u0443\u0440\u043E\u0432\u043D\u0435 (1\u201310)."],
    [/[Кк]улдаун/, "\u041A\u0443\u043B\u0434\u0430\u0443\u043D \u2014 \u0432\u0440\u0435\u043C\u044F \u0434\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0433\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F."],
    [/[Рр]еспаун/, "\u0420\u0435\u0441\u043F\u0430\u0443\u043D \u2014 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u043B\u0435 \u0433\u0438\u0431\u0435\u043B\u0438 \u0438\u043B\u0438 \u0441\u0431\u043E\u0440\u0430."],
    [/[Сс]павн/, "\u0421\u043F\u0430\u0432\u043D \u2014 \u043C\u0435\u0441\u0442\u043E, \u0433\u0434\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u043F\u0430\u043B\u044B \u0438\u043B\u0438 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B."],
    [/\bDPS\b/, "DPS \u2014 \u0443\u0440\u043E\u043D \u0432 \u0441\u0435\u043A\u0443\u043D\u0434\u0443."],
    [/\bкап\b/, "\u041A\u0430\u043F \u2014 \u043F\u043E\u0442\u043E\u043B\u043E\u043A, \u0432\u044B\u0448\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043D\u0435 \u0440\u0430\u0441\u0442\u0451\u0442."]
  ];
  const done = /* @__PURE__ */ new Set();
  const w = document.createTreeWalker(art, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest("a,button,code,pre,kbd,h1,h2,h3,input,label,select,textarea,.gl,.hlp-pop,script,style,.leaflet-container,summary.tabbed-labels") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) {
    for (let i = 0; i < G.length; i++) {
      if (done.has(i)) continue;
      const m = n.nodeValue.match(G[i][0]);
      if (!m) continue;
      done.add(i);
      const r = n.splitText(m.index);
      r.splitText(m[0].length);
      const s = document.createElement("span");
      s.className = "gl";
      s.tabIndex = 0;
      s.setAttribute("role", "button");
      s.dataset.tip = G[i][1];
      s.textContent = r.nodeValue;
      r.replaceWith(s);
      break;
    }
    if (done.size == G.length) break;
  }
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("#bfl .fcs .fc");
  if (!b) return;
  const row = b.closest(".fcs"), sel = document.getElementById(row.dataset.s);
  if (!sel) return;
  sel.value = b.dataset.v;
  row.querySelectorAll(".fc").forEach((x) => x.classList.toggle("on", x === b));
  sel.dispatchEvent(new Event("change", { bubbles: true }));
});
document.addEventListener("DOMContentLoaded", () => {
  const q = document.getElementById("mapq");
  if (!q) return;
  const vv = window.visualViewport;
  const sh = () => document.querySelector(".msheet");
  const place = () => {
    const s = sh();
    if (!s || !s.classList.contains("kb")) return;
    const kb = vv ? Math.max(0, innerHeight - vv.height - vv.offsetTop) : 0;
    s.style.setProperty("--kb", kb + "px");
    const free = (vv ? vv.height : innerHeight) - 130;
    s.style.setProperty("--kbh", Math.max(120, Math.min(free * 0.55, 300)) + "px");
  };
  q.addEventListener("focus", () => {
    const s = sh();
    if (!s) return;
    s.classList.add("kb");
    document.documentElement.classList.add("mapkb");
    place();
    setTimeout(place, 300);
  });
  q.addEventListener("blur", () => setTimeout(() => {
    if (document.activeElement === q) return;
    const s = sh();
    if (s) {
      s.classList.remove("kb");
      s.style.removeProperty("--kb");
    }
    document.documentElement.classList.remove("mapkb");
  }, 200));
  if (vv) {
    vv.addEventListener("resize", place);
    vv.addEventListener("scroll", place);
  }
});
const _noAF = (i) => {
  if (!i || i.tagName != "INPUT" || i.type == "range" || i.type == "number" || i.type == "checkbox" || i.type == "radio" || i.dataset.naf) return;
  i.dataset.naf = 1;
  i.setAttribute("autocomplete", "off");
  i.setAttribute("autocorrect", "off");
  i.setAttribute("autocapitalize", "off");
  i.setAttribute("spellcheck", "false");
  if (!i.getAttribute("enterkeyhint")) i.setAttribute("enterkeyhint", "search");
  if (i.type == "text" && i.id != "nl") i.type = "search";
  if (!i.name) i.name = "pp-q-" + (i.id || i.className.split(" ")[0] || "f");
};
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(_noAF);
  if (window.MutationObserver) new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n.nodeType != 1) continue;
      if (n.tagName == "INPUT") _noAF(n);
      else if (n.querySelectorAll) n.querySelectorAll("input").forEach(_noAF);
    }
  }).observe(document.body, { childList: true, subtree: true });
});
document.addEventListener("focusin", (e) => _noAF(e.target), true);
document.addEventListener("click", (e) => {
  const b = e.target.closest && e.target.closest(".pflip");
  if (!b) return;
  const w = b.closest(".pcardwrap");
  const c = w.querySelector(".tcard26"), r = w.querySelector(".pal-art2");
  if (!c || !r) return;
  const on = b.getAttribute("aria-pressed") != "true";
  c.hidden = on;
  r.hidden = !on;
  b.setAttribute("aria-pressed", on);
  b.textContent = on ? "\u{1F0CF} \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430" : "\u{1F504} 3D-\u043C\u043E\u0434\u0435\u043B\u044C";
});
(() => {
  const H = document.documentElement;
  const isT = (e) => e && e.matches && e.matches("input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=button]),textarea,select");
  document.addEventListener("focusin", (e) => {
    if (isT(e.target)) {
      H.classList.add("kbopen");
      H.classList.toggle("hsqf", e.target.id == "hsq");
    }
  });
  document.addEventListener("focusout", () => setTimeout(() => {
    const a = document.activeElement;
    if (!isT(a)) {
      H.classList.remove("kbopen", "hsqf");
    } else H.classList.toggle("hsqf", a.id == "hsq");
  }, 60));
})();
(function() {
  const keep = () => {
    const a = document.activeElement;
    if (!a || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    for (let e = a; e && e !== document.body; e = e.parentElement) {
      const ps = getComputedStyle(e).position;
      if (ps == "fixed" || ps == "sticky") return;
    }
    const r = a.getBoundingClientRect(), vv = window.visualViewport, h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0;
    if (r.bottom > top + h - 8 || r.top < top + 56) try {
      a.scrollIntoView({ block: "center", behavior: "auto" });
    } catch (e) {
      a.scrollIntoView();
    }
  };
  let t = null;
  const deb = () => {
    clearTimeout(t);
    t = setTimeout(keep, 120);
  };
  addEventListener("resize", deb);
  window.visualViewport && visualViewport.addEventListener("resize", deb);
})();
