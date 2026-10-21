(function() {
  "use strict";
  const go = () => {
    const U = window.UX;
    if (!U) return;
    const { B, esc, LS, $, $$, mk, hlp, data, ux, ref, chip, ELC, ELI, toast, rel } = U;
    const fmt = (x) => {
      x = x < 10 ? Math.round(x * 10) / 10 : Math.round(x);
      return String(x).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
    };
    const dur = (s) => s < 1 ? "\u043C\u0435\u043D\u044C\u0448\u0435 1 \u0441" : s < 90 ? fmt(s) + " \u0441" : s < 5400 ? fmt(s / 60) + " \u043C\u0438\u043D" : fmt(s / 3600) + " \u0447";
    const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    U.botLink = (q, fallback) => {
      const p = "q_" + b64(q);
      return "https://t.me/PalGuideBot?start=" + (p.length <= 64 ? p : fallback || "q");
    };
    function botAsk(D) {
      const art = $("article.md-content__inner");
      if (!art) return;
      const info = $(".pal-info[data-pal]");
      $$(".askmini, .ask-bot").forEach((x) => x.classList.add("ux-had"));
      let qs = [];
      if (info) {
        const p = D.pals.find((x) => x.id == info.dataset.pal);
        if (p) qs = [["\u{1F4CD}", "\u0433\u0434\u0435 \u043D\u0430\u0439\u0442\u0438 " + p.ru, "p_" + p.id + "_where"], ["\u{1F9EC}", "\u043A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 " + p.ru, "p_" + p.id + "_breed"], ["\u2728", "\u043B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 " + p.ru, "p_" + p.id + "_passives"]];
      } else {
        const h1 = $("h1", art);
        if (rel.startsWith("boss/") && h1) qs = [["\u{1F3AF}", "\u0447\u0435\u043C \u0431\u0438\u0442\u044C " + h1.textContent.trim().split(/[(\-—]/)[0].trim(), "q"]];
      }
      if (!qs.length) return;
      const n = mk("div", "ux-panel ux-bot");
      n.innerHTML = `<div class="ux-h">\u{1F916} \u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0432 \u0431\u043E\u0442\u0435 ${hlp("\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F Telegram-\u0431\u043E\u0442 @PalGuideBot, \u0438 \u0432\u043E\u043F\u0440\u043E\u0441 \u0443\u0436\u0435 \u0431\u0443\u0434\u0435\u0442 \u0437\u0430\u0434\u0430\u043D.")}</div><div class="ux-chips">${qs.map(([i, q, f]) => `<a class="ux-chip" target="_blank" rel="noopener" href="${U.botLink(q, f)}">${i} ${esc(q)}</a>`).join("")}</div>`;
      const nx = $(".ux-next");
      nx ? nx.before(n) : art.appendChild(n);
    }
    function bugSheet() {
      document.addEventListener("click", (e) => {
        const a = e.target.closest("a.bug-link, .ux-bug");
        if (!a) return;
        e.preventDefault();
        const slug = (rel.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home").slice(0, 40);
        const R = [["data", "\u{1F522} \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435"], ["text", "\u270F\uFE0F \u041E\u043F\u0435\u0447\u0430\u0442\u043A\u0430 \u0438\u043B\u0438 \u043D\u0435\u043F\u043E\u043D\u044F\u0442\u043D\u043E"], ["img", "\u{1F5BC} \u041F\u043B\u043E\u0445\u0430\u044F \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0430"], ["ui", "\u{1F4F1} \u041D\u0435\u0443\u0434\u043E\u0431\u043D\u043E, \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442"], ["other", "\u{1F4AC} \u0414\u0440\u0443\u0433\u043E\u0435"]];
        const bg = mk("div", "sheet-bg"), s = mk("div", "ux-intro ux-bugs");
        s.setAttribute("role", "dialog");
        s.innerHTML = `<h3>\u0427\u0442\u043E \u043D\u0435 \u0442\u0430\u043A \u043D\u0430 \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435?</h3><div class="ux-chips" style="justify-content:center">${R.map(([k, l]) => `<a class="ux-chip" data-r="${k}" target="_blank" rel="noopener" href="https://t.me/PalGuideBot?start=err_${k}_${slug}">${l}</a>`).join("")}</div><p class="ux-sub">\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0431\u043E\u0442 \u2014 \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438.</p><button type="button" class="ux-btn ghost" data-x>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</button>`;
        const close = () => {
          s.remove();
          bg.remove();
        };
        bg.onclick = close;
        s.addEventListener("click", (ev) => {
          if (ev.target.closest("[data-x]")) close();
          const r = ev.target.closest("[data-r]");
          if (r) {
            const L2 = LS.get("ux_bugs", []);
            L2.unshift({ p: rel, r: r.dataset.r, t: Date.now() });
            LS.set("ux_bugs", L2.slice(0, 50));
            s.innerHTML = '<div class="ux-big">\u{1F64F}</div><h3>\u0421\u043F\u0430\u0441\u0438\u0431\u043E!</h3><p class="ux-sub">\u041C\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C \u0438 \u0438\u0441\u043F\u0440\u0430\u0432\u0438\u043C.</p>';
            setTimeout(close, 1800);
          }
        });
        document.body.append(bg, s);
      });
    }
    const pm = $("#pwmap");
    if (pm) {
      const wait = setInterval(() => {
        const M = window.PW_map;
        if (!M) return;
        clearInterval(wait);
        const { m, groups, T, all } = M;
        const been = () => LS.get("ux_been", []);
        const key = (p) => Math.round(p.x) + "," + Math.round(p.y);
        const mark = () => {
          const b = new Set(been());
          all.forEach(([p, mk2]) => {
            const el = mk2.getElement && mk2.getElement();
            if (el) el.classList.toggle("ux-been", b.has(key(p)));
          });
        };
        const bar = mk("div", "ux-layers");
        bar.setAttribute("role", "toolbar");
        bar.setAttribute("aria-label", "\u0421\u043B\u043E\u0438 \u043A\u0430\u0440\u0442\u044B");
        const NA = [["\u{1F573}\uFE0F", "\u041F\u0435\u0449\u0435\u0440\u044B"], ["\u{1F9F0}", "\u0421\u0443\u043D\u0434\u0443\u043A\u0438"], ["\u26CF\uFE0F", "\u0420\u0443\u0434\u044B"]];
        let hideBeen = false;
        bar.innerHTML = Object.entries(T).map(([k, v]) => `<button type="button" class="ux-chip on" data-k="${k}" aria-pressed="true">${v[0]} ${esc(v[1])}</button>`).join("") + `<button type="button" class="ux-chip" data-tree>\u{1F333} \u041C\u0438\u0440\u043E\u0432\u043E\u0435 \u0434\u0440\u0435\u0432\u043E</button><button type="button" class="ux-chip" data-been aria-pressed="false">\u2705 \u0421\u043A\u0440\u044B\u0442\u044C, \u0433\u0434\u0435 \u0431\u044B\u043B</button>` + NA.map(([i, l]) => `<button type="button" class="ux-chip ux-na" data-na="${l}" aria-disabled="true">${i} ${l}</button>`).join("") + hlp("\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0447\u0438\u043F, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0438\u043B\u0438 \u0441\u043A\u0440\u044B\u0442\u044C \u0442\u043E\u0447\u043A\u0438. \u041F\u0435\u0449\u0435\u0440\u044B, \u0441\u0443\u043D\u0434\u0443\u043A\u0438 \u0438 \u0440\u0443\u0434\u044B \u043F\u043E\u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0432 \u0440\u0430\u0437\u043D\u044B\u0445 \u043C\u0435\u0441\u0442\u0430\u0445, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0438\u0445 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435.");
        const mq = $("#mapq");
        if (mq) mq.placeholder = "\u041F\u0430\u043B, \u0431\u043E\u0441\u0441, \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442";
        document.documentElement.classList.add("ux-mapchips");
        const msq = $(".msq"), mrow = msq && msq.closest(".mrow");
        const anchor = mrow || msq || pm;
        (anchor.parentElement == document.body ? pm : anchor).before(bar);
        if (mq) {
          const fit = () => {
            mq.placeholder = "\u041F\u0430\u043B, \u0431\u043E\u0441\u0441, \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442";
            const cs = getComputedStyle(mq), cv = fit.c || (fit.c = document.createElement("canvas").getContext("2d"));
            cv.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
            const room = mq.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
            for (const t of ["\u041F\u0430\u043B, \u0431\u043E\u0441\u0441, \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442", "\u041F\u0430\u043B \u0438\u043B\u0438 \u0431\u043E\u0441\u0441", "\u041F\u043E\u0438\u0441\u043A"]) {
              mq.placeholder = t;
              if (cv.measureText(t).width <= room) break;
            }
          };
          fit();
          addEventListener("resize", fit);
        }
        bar.addEventListener("click", (e) => {
          const b = e.target.closest("button");
          if (!b) return;
          if (b.dataset.k) {
            const on = b.getAttribute("aria-pressed") != "true";
            b.setAttribute("aria-pressed", on);
            b.classList.toggle("on", on);
            on ? m.addLayer(groups[b.dataset.k]) : m.removeLayer(groups[b.dataset.k]);
            const cb = $(`.mleg input[data-k="${b.dataset.k}"]`);
            if (cb) cb.checked = on;
          }
          if (b.hasAttribute("data-tree")) {
            const t = $(".mapsw [data-w=t]");
            t && t.click();
          }
          if (b.dataset.na) toast(b.dataset.na + ": \u0442\u043E\u0447\u0435\u043A \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u2014 \u043E\u043D\u0438 \u043C\u0435\u043D\u044F\u044E\u0442 \u043C\u0435\u0441\u0442\u043E");
          if (b.hasAttribute("data-been")) {
            hideBeen = !hideBeen;
            b.classList.toggle("on", hideBeen);
            b.setAttribute("aria-pressed", hideBeen);
            document.documentElement.classList.toggle("ux-hidebeen", hideBeen);
          }
        });
        m.on("zoomend moveend layeradd", () => setTimeout(mark, 50));
        setTimeout(mark, 300);
        let line = null;
        m.on("popupopen", (e) => {
          const c = e.popup.getElement();
          if (!c || $(".ux-mp", c)) return;
          const ll = e.popup.getLatLng();
          const hit = all.find(([p2, mk2]) => mk2.getLatLng().equals(ll));
          if (!hit) return;
          const p = hit[0];
          const box = $(".leaflet-popup-content", c);
          if (!box) return;
          const d = mk("div", "ux-mp");
          const isB = been().includes(key(p));
          d.innerHTML = `${p.t != "travel" ? '<button type="button" class="ux-chip" data-route>\u{1F9ED} \u041E\u0442 \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442\u0430</button>' : ""}<button type="button" class="ux-chip ${isB ? "on" : ""}" data-been>${isB ? "\u2705 \u042F \u0431\u044B\u043B \u0442\u0443\u0442" : "\u2610 \u042F \u0431\u044B\u043B \u0442\u0443\u0442"}</button>`;
          box.appendChild(d);
          d.addEventListener("click", (ev) => {
            const b = ev.target.closest("button");
            if (!b) return;
            if (b.hasAttribute("data-been")) {
              let L2 = been();
              const k = key(p);
              L2 = L2.includes(k) ? L2.filter((x) => x != k) : [k, ...L2];
              LS.set("ux_been", L2);
              const on = L2.includes(k);
              b.textContent = on ? "\u2705 \u042F \u0431\u044B\u043B \u0442\u0443\u0442" : "\u2610 \u042F \u0431\u044B\u043B \u0442\u0443\u0442";
              b.classList.toggle("on", on);
              mark();
            }
            if (b.hasAttribute("data-route")) {
              const tp = all.filter(([q2]) => q2.t == "travel").sort((a, b2) => (a[0].x - p.x) ** 2 + (a[0].y - p.y) ** 2 - ((b2[0].x - p.x) ** 2 + (b2[0].y - p.y) ** 2))[0];
              if (!tp) return;
              if (line) m.removeLayer(line);
              line = L.polyline([tp[1].getLatLng(), hit[1].getLatLng()], { color: "#ffd400", weight: 5, dashArray: "10 8", opacity: 0.95 }).addTo(m);
              m.fitBounds(line.getBounds().pad(0.6));
              const dx = p.x - tp[0].x, dy = p.y - tp[0].y;
              const dir = Math.abs(dx) > Math.abs(dy) * 2 ? dx > 0 ? "\u043D\u0430 \u0432\u043E\u0441\u0442\u043E\u043A" : "\u043D\u0430 \u0437\u0430\u043F\u0430\u0434" : Math.abs(dy) > Math.abs(dx) * 2 ? dy > 0 ? "\u043D\u0430 \u0441\u0435\u0432\u0435\u0440" : "\u043D\u0430 \u044E\u0433" : (dy > 0 ? "\u043D\u0430 \u0441\u0435\u0432\u0435\u0440" : "\u043D\u0430 \u044E\u0433") + "-" + (dx > 0 ? "\u0432\u043E\u0441\u0442\u043E\u043A" : "\u0437\u0430\u043F\u0430\u0434");
              b.outerHTML = `<div class="ux-route">\u{1F5FF} \u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0442\u0435\u043B\u0435\u043F\u043E\u0440\u0442: <b>${esc(tp[0].name)}</b><br>\u041E\u0442\u0442\u0443\u0434\u0430 \u0438\u0434\u0438 ${dir} \u043F\u043E \u0436\u0451\u043B\u0442\u043E\u0439 \u043B\u0438\u043D\u0438\u0438.</div>`;
            }
          });
        });
        const q = $("#mapq");
        if (q) q.addEventListener("input", () => setTimeout(() => {
          $$(".ux-hit").forEach((x) => x.classList.remove("ux-hit"));
        }, 10));
        m.on("popupopen", (e) => {
          const ll = e.popup.getLatLng();
          const hit = all.find(([p, mk2]) => mk2.getLatLng().equals(ll));
          const el = hit && hit[1].getElement && hit[1].getElement();
          if (el) el.classList.add("ux-hit");
        });
      }, 300);
      setTimeout(() => clearInterval(wait), 2e4);
    }
    if (rel.startsWith("boss/") && rel != "boss/") Promise.all([data(), ux()]).then(([D, X]) => {
      const bc = (D.bcards || []).find((c) => rel == c.u || rel.startsWith(c.u));
      if (!bc) return;
      const art = $("article.md-content__inner");
      const bs = X.boss.filter((b) => b.pal == bc.pal);
      const lv = Math.min(...bs.map((b) => +b.lv).filter(Boolean));
      const team = [...new Set(bs.flatMap((b) => b.team))].map((n) => D.pals.find((p) => p.ru == n)).filter(Boolean).slice(0, 5);
      const k = "ux_prep_" + bc.u;
      const st = LS.get(k, {});
      const w = (bc.w || []).map((e) => ELI[e] + " " + e).join(", ");
      const items = [["lvl", `\u041C\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C ${isFinite(lv) ? lv : ""} \u0438\u043B\u0438 \u0432\u044B\u0448\u0435`], ["team", `\u0412 \u043A\u043E\u043C\u0430\u043D\u0434\u0435 \u0435\u0441\u0442\u044C \u043F\u0430\u043B\u044B \u0441\u0442\u0438\u0445\u0438\u0438 ${w || "\u2014"}`], ["heal", "\u0412\u0437\u044F\u043B \u043B\u0435\u0447\u0438\u043B\u043A\u0438 \u0438 \u0435\u0434\u0443"], ["armor", "\u041D\u0430\u0434\u0435\u043B \u043B\u0443\u0447\u0448\u0443\u044E \u0431\u0440\u043E\u043D\u044E \u0438 \u0449\u0438\u0442"], ["ammo", "\u0415\u0441\u0442\u044C \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0438 \u0441\u0444\u0435\u0440\u044B \u043F\u0440\u043E \u0437\u0430\u043F\u0430\u0441"], ["pals", "\u041F\u0430\u043B\u044B \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0435 \u043F\u0440\u043E\u043A\u0430\u0447\u0430\u043D\u044B"]];
      const box = mk("section", "ux-panel ux-prep");
      const draw = () => {
        const n = items.filter(([i]) => st[i]).length;
        box.innerHTML = `<div class="ux-h">\u2705 \u0413\u043E\u0442\u043E\u0432 \u043A \u0431\u043E\u044E? <small>${n} \u0438\u0437 ${items.length}</small> ${hlp("\u041E\u0442\u043C\u0435\u0447\u0430\u0439 \u043F\u0443\u043D\u043A\u0442\u044B \u043F\u0435\u0440\u0435\u0434 \u0431\u043E\u0435\u043C. \u0413\u0430\u043B\u043E\u0447\u043A\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435.")}</div><div class="ux-progress"><i style="width:${n / items.length * 100}%"></i></div><div class="ux-checks">${items.map(([i, t]) => `<label class="ux-check ${st[i] ? "on" : ""}"><input type="checkbox" data-i="${i}" ${st[i] ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>
  ${team.length ? `<div class="ux-h" style="margin-top:14px">\u{1F392} \u041E\u0442\u0440\u044F\u0434 \u043F\u0440\u043E\u0442\u0438\u0432 \u0431\u043E\u0441\u0441\u0430</div><div class="ux-hscroll">${team.map((p) => U.palCard ? U.palCard(X, p, p.el.map((e) => ELI[e]).join(" ")) : "").join("")}</div><button type="button" class="ux-btn" data-team style="margin-top:10px">\u{1F392} \u0412\u0437\u044F\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0442\u0440\u044F\u0434 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0443</button>` : ""}`;
      };
      draw();
      box.addEventListener("change", (e) => {
        const i = e.target.dataset.i;
        if (!i) return;
        st[i] = e.target.checked;
        LS.set(k, st);
        draw();
        if (items.every(([j]) => st[j])) toast("\u0412\u0441\u0451 \u0433\u043E\u0442\u043E\u0432\u043E \u2014 \u0443\u0434\u0430\u0447\u0438 \u0432 \u0431\u043E\u044E! \u{1F4AA}");
      });
      box.addEventListener("click", (e) => {
        if (!e.target.closest("[data-team]")) return;
        const L2 = U.lists.lists();
        L2["\u041A\u043E\u043C\u0430\u043D\u0434\u0430"] = team.map((p) => p.id);
        U.lists.saveL(L2);
        toast("\u041E\u0442\u0440\u044F\u0434 \u0432 \xAB\u041A\u043E\u043C\u0430\u043D\u0434\u0435\xBB \u2014 \u0441\u043C\u043E\u0442\u0440\u0438 \u0432 \xAB\u041C\u043E\u0451\xBB");
      });
      const ctr = $(".ctrs") || $(".bmodes") || $("h1", art);
      (ctr.closest(".ctrs") ? ctr : ctr).after(box);
      const pal = D.pals.find((p) => p.ru == bc.pal);
      const xp = pal && X.pals[pal.id];
      const drops = xp && (bc.k == "\u0430\u043B\u044C\u0444\u0430" || /alpha_/.test(bc.u)) ? xp.ad : null;
      if (drops && drops.length) {
        const g = mk("section", "ux-panel");
        g.innerHTML = `<div class="ux-h">\u{1F381} \u041D\u0430\u0433\u0440\u0430\u0434\u044B ${hlp("\u0427\u0442\u043E \u0432\u044B\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u0430\u043B\u044C\u0444\u044B. \u041F\u0440\u043E\u0446\u0435\u043D\u0442 \u2014 \u0448\u0430\u043D\u0441 \u0432\u044B\u043F\u0430\u0434\u0435\u043D\u0438\u044F.")}</div><div class="ux-grid">${drops.map(([n, q, c]) => `<div class="ux-pal ux-drop"><span class="ux-pct">${esc(c)}</span><b>${esc(n)}</b><small>\xD7${esc(q)}</small></div>`).join("")}</div>`;
        box.after(g);
      }
    });
    const rb = $("#ux-work");
    if (rb) Promise.all([data(), ux()]).then(([D, X]) => {
      const T = X.ws.types.filter((t) => t.kind == "speed");
      const u = new URLSearchParams(location.search);
      const pal = D.pals.find((p) => p.id == u.get("pal"));
      let W = T[0], hero = LS.get("ux_hero", 1e3), lvl = 3, pp = 0, food = 0, souls = 0, bld = false, load = 3e3;
      if (pal) {
        const best = (pal.work || []).filter((w) => T.some((t) => t.ru == w[0])).sort((a, b) => b[1] - a[1])[0];
        if (best) {
          W = T.find((t) => t.ru == best[0]);
          lvl = best[1];
        }
      }
      const equiv = (S, L2) => {
        if (S < L2[0]) return 0;
        for (let i = 9; i >= 0; i--) if (S >= L2[i]) return i + 1;
        return 0;
      };
      const draw = () => {
        LS.set("ux_hero", hero);
        const L2 = W.levels;
        const m = (1 + pp / 100) * (1 + food / 100) * (1 + souls * 3 / 100) * (bld ? 1.2 : 1);
        const P = L2[lvl - 1] * m;
        const e = equiv(hero, L2);
        const k = P / hero;
        rb.innerHTML = `${pal ? `<div class="ux-panel ux-row2" style="align-items:center">${U.artHTML ? U.artHTML(X, pal, 64) : ""}<b>${esc(pal.ru)}</b><a class="ux-chip" href="${B + pal.url}">\u043A \u043F\u0430\u043B\u0443</a></div>` : ""}
  <div class="ux-panel"><div class="ux-h">\u041A\u0430\u043A\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430?</div><div class="ux-chips">${T.map((t) => `<button type="button" class="ux-chip ${t === W ? "on" : ""}" data-w="${t.id}">${t.emoji} ${esc(t.short)}</button>`).join("")}</div></div>
  <div class="ux-two"><div class="ux-panel"><div class="ux-h">\u{1F9D1} \u041C\u043E\u0439 \u0433\u0435\u0440\u043E\u0439 ${hlp("\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u0433\u0435\u0440\u043E\u044F \u0432\u0438\u0434\u043D\u0430 \u0432 \u043C\u0435\u043D\u044E \u0441\u0442\u0430\u0442\u0443\u0441\u0430. \u041D\u0430 \u0441\u0442\u0430\u0440\u0442\u0435 100, \u043A\u0430\u0436\u0434\u043E\u0435 \u043E\u0447\u043A\u043E +50.")}</div><input class="ux-in ux-num" type="number" inputmode="numeric" min="100" max="9999" step="50" value="${hero}" data-k="hero" aria-label="\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u0433\u0435\u0440\u043E\u044F"><div class="ux-sub">\u041A\u0430\u043A \u043F\u0430\u043B ${e ? e + "-\u0433\u043E" : "\u043D\u0438\u0436\u0435 1-\u0433\u043E"} \u0443\u0440\u043E\u0432\u043D\u044F \u044D\u0442\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B</div></div>
  <div class="ux-panel"><div class="ux-h">\u{1F43E} \u041F\u0430\u043B: \u0443\u0440\u043E\u0432\u0435\u043D\u044C ${lvl} ${hlp("\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u043F\u0430\u043B\u0430 \u043E\u0442 1 \u0434\u043E 10 \u2014 \u0447\u0438\u0441\u043B\u043E \u0440\u044F\u0434\u043E\u043C \u0441\u043E \u0437\u043D\u0430\u0447\u043A\u043E\u043C \u0440\u0430\u0431\u043E\u0442\u044B.")}</div><input type="range" class="ux-range" min="1" max="10" value="${lvl}" data-k="lvl" aria-label="\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u043F\u0430\u043B\u0430"><div class="ux-chips">${[["pp", "\u{1F9EC} \u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0438", [0, 30, 50, 90, 245]], ["food", "\u{1F354} \u0415\u0434\u0430", [0, 30, 50]]].map(([kk, l, vs]) => `<span class="ux-sub">${l}:</span>${vs.map((v) => `<button type="button" class="ux-chip ${{ pp, food }[kk] == v ? "on" : ""}" data-${kk}="${v}">+${v}%</button>`).join("")}`).join("<br>")}<br><span class="ux-sub">\u{1F47B} \u0414\u0443\u0448\u0438:</span><input type="range" class="ux-range" min="0" max="20" value="${souls}" data-k="souls" aria-label="\u0428\u0430\u0433\u0438 \u0434\u0443\u0448" style="max-width:180px"><b>+${souls * 3}%</b> <button type="button" class="ux-chip ${bld ? "on" : ""}" data-bld>\u{1F3DB} \u041F\u043E\u0441\u0442\u0440\u043E\u0439\u043A\u0438 +20%</button></div></div></div>
  <div class="ux-panel ux-res"><div class="ux-big-n">${k >= 1 ? "\xD7" + fmt(k) : "\xD7" + fmt(1 / k)}</div><div><b>${k >= 1 ? "\u041F\u0430\u043B \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0442\u0435\u0431\u044F" : "\u0422\u044B \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043F\u0430\u043B\u0430"}</b><div class="ux-sub">\u0417\u0430\u0434\u0430\u0447\u0430 \u043D\u0430 ${fmt(load)} \u0435\u0434\u0438\u043D\u0438\u0446: \u0442\u044B \u2014 ${dur(load / (hero / 100))}, \u043F\u0430\u043B \u2014 ${dur(load / (P / 100))}</div><div class="ux-sub">\u0421\u0438\u043B\u0430 \u043F\u0430\u043B\u0430: ${fmt(L2[lvl - 1])} \xD7 \u0431\u043E\u043D\u0443\u0441\u044B ${fmt(m)} = ${fmt(P)}</div></div></div>
  <div class="ux-kid">\u{1F476} \u041F\u0440\u043E\u0449\u0435: \u0447\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u0447\u0438\u0441\u043B\u043E \u0443 \u043F\u0430\u043B\u0430, \u0442\u0435\u043C \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043E\u043D \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442. \u041F\u0430\u043B ${lvl}-\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F \u0434\u0435\u043B\u0430\u0435\u0442 \u0440\u0430\u0431\u043E\u0442\u0443 ${k >= 1 ? "\u0432 " + fmt(k) + " \u0440\u0430\u0437\u0430 \u0431\u044B\u0441\u0442\u0440\u0435\u0435" : "\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u0435\u0435"} \u0442\u0435\u0431\u044F.</div>`;
      };
      rb.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.w) W = T.find((t) => t.id == b.dataset.w);
        if (b.dataset.pp != null) pp = +b.dataset.pp;
        if (b.dataset.food != null) food = +b.dataset.food;
        if (b.hasAttribute("data-bld")) bld = !bld;
        draw();
      });
      rb.addEventListener("change", (e) => {
        const k = e.target.dataset.k;
        if (k == "hero") {
          hero = Math.max(100, +e.target.value || 100);
          draw();
        }
      });
      rb.addEventListener("input", (e) => {
        const k = e.target.dataset.k;
        if (k == "lvl") {
          lvl = +e.target.value;
          draw();
        }
        if (k == "souls") {
          souls = +e.target.value;
          draw();
        }
      });
      draw();
    });
    const lc = $("#ux-catch");
    if (lc) Promise.all([data(), ux()]).then(([D, X]) => {
      let p = D.pals.find((q) => q.id == new URLSearchParams(location.search).get("pal")) || D.pals.find((q) => q.id == "SheepBall");
      let plv = 10, hp = "low", back = true, sleep = false;
      const draw = () => {
        const x = X.pals[p.id] || {};
        const cap = +x.cap || 1;
        const sph = X.sph.slice().sort((a, b) => a[1] - b[1]);
        const rec = sph.filter((s) => s[1] <= Math.max(2, plv)).slice(-1)[0] || sph[0];
        const nxt = sph.find((s) => s[1] > plv);
        let score = (cap > 1 ? 1 : cap < 1 ? -1 : 0) + (hp == "low" ? 2 : hp == "mid" ? 1 : 0) + (back ? 1 : 0) + (sleep ? 1 : 0);
        const lab = score >= 4 ? ["\u{1F7E2}", "\u041B\u0435\u0433\u043A\u043E"] : score >= 2 ? ["\u{1F7E1}", "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E"] : ["\u{1F534}", "\u0422\u0440\u0443\u0434\u043D\u043E"];
        lc.innerHTML = `<div class="ux-panel"><div class="ux-h">\u041A\u043E\u0433\u043E \u043B\u043E\u0432\u0438\u043C</div><button type="button" class="ux-pick">${U.artHTML ? U.artHTML(X, p, 64) : ""} <b>${esc(p.ru)}</b> <small>\u0441\u043C\u0435\u043D\u0438\u0442\u044C</small></button><div class="ux-sub">\u041C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u044C \u0432\u0438\u0434\u0430 \xD7${String(x.cap || 1).replace(".", ",")} ${cap > 1 ? "\u2014 \u043B\u043E\u0432\u0438\u0442\u0441\u044F \u043B\u0435\u0433\u0447\u0435" : cap < 1 ? "\u2014 \u043B\u043E\u0432\u0438\u0442\u0441\u044F \u0442\u0440\u0443\u0434\u043D\u0435\u0435" : ""}</div></div>
  <div class="ux-two"><div class="ux-panel"><div class="ux-h">\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u043F\u0430\u043B\u0430: ${plv}</div><input type="range" class="ux-range" min="1" max="80" value="${plv}" data-k="plv" aria-label="\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u043F\u0430\u043B\u0430"></div>
  <div class="ux-panel"><div class="ux-h">\u041A\u0430\u043A \u043B\u043E\u0432\u0438\u0448\u044C</div><div class="ux-chips">${[["low", "\u2764\uFE0F \u041C\u0430\u043B\u043E HP"], ["mid", "\u{1F49B} \u041F\u043E\u043B\u043E\u0432\u0438\u043D\u0430"], ["full", "\u{1F49A} \u041F\u043E\u043B\u043D\u043E\u0435 HP"]].map(([k, l]) => `<button type="button" class="ux-chip ${hp == k ? "on" : ""}" data-hp="${k}">${l}</button>`).join("")}<button type="button" class="ux-chip ${back ? "on" : ""}" data-back>\u{1F519} \u0412 \u0441\u043F\u0438\u043D\u0443</button><button type="button" class="ux-chip ${sleep ? "on" : ""}" data-sleep>\u{1F4A4} \u0421\u043F\u0438\u0442</button></div></div></div>
  <div class="ux-panel ux-res"><div class="ux-big-n">${lab[0]}</div><div><b>${lab[1]}</b><div class="ux-sub">\u0411\u0435\u0440\u0438 \u0441\u0444\u0435\u0440\u0443 \u043D\u0435 \u043D\u0438\u0436\u0435: <b>${esc(rec[0])}</b>${nxt ? ` \xB7 \u043D\u0430\u0434\u0451\u0436\u043D\u0435\u0435: ${esc(nxt[0])}` : ""}</div><div class="ux-sub">\u0422\u043E\u0447\u043D\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u043D\u0442 \u0432\u0438\u0434\u043D\u043E \u0432 \u0438\u0433\u0440\u0435 \u043D\u0430\u0434 \u043F\u0430\u043B\u043E\u043C, \u043A\u043E\u0433\u0434\u0430 \u0446\u0435\u043B\u0438\u0448\u044C\u0441\u044F. ${hlp("\u041C\u044B \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u0432\u044B\u0434\u0443\u043C\u0430\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u043D\u0442: \u0444\u043E\u0440\u043C\u0443\u043B\u0443 \u0438\u0433\u0440\u0430 \u043D\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442. \u041E\u0446\u0435\u043D\u043A\u0430 \u2014 \u043F\u043E \u043C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u044E \u0432\u0438\u0434\u0430, \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044E, \u0443\u0434\u0430\u0440\u0443 \u0432 \u0441\u043F\u0438\u043D\u0443 \u0438 \u0441\u043D\u0443.")}</div></div></div>
  <div class="ux-panel"><div class="ux-h">\u{1F3AF} \u0421\u0444\u0435\u0440\u044B \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443</div><div class="ux-chips">${sph.map((s) => `<span class="ux-chip ${s === rec ? "on" : ""}">${esc(s[0])} \xB7 \u0442\u0435\u0445\u043D. ${s[1]}</span>`).join("")}</div></div>`;
      };
      lc.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.classList.contains("ux-pick")) return window.PW_pickPal && window.PW_pickPal(D, "\u041A\u043E\u0433\u043E \u043B\u043E\u0432\u0438\u043C?", (q) => {
          p = q;
          draw();
        });
        if (b.dataset.hp) hp = b.dataset.hp;
        if (b.hasAttribute("data-back")) back = !back;
        if (b.hasAttribute("data-sleep")) sleep = !sleep;
        draw();
      });
      lc.addEventListener("input", (e) => {
        if (e.target.dataset.k == "plv") {
          plv = +e.target.value;
          draw();
        }
      });
      draw();
    });
    const kr = $("#ux-craft");
    if (kr) ref().then((R) => {
      const rec = R.rec;
      const names = Object.keys(rec).sort((a, b) => a.localeCompare(b, "ru"));
      const used = {};
      for (const [n, v] of Object.entries(rec)) v.r.forEach(([m]) => (used[m] = used[m] || []).push(n));
      const u = new URLSearchParams(location.search);
      let it = rec[u.get("i")] ? u.get("i") : "\u0413\u0438\u0433\u0430\u0441\u0444\u0435\u0440\u0430";
      if (!rec[it]) it = names[0];
      let qty = +u.get("n") || 1;
      const tree = (n, q, d, seen) => {
        const r = rec[n];
        if (!r || d > 5 || seen.has(n)) return `<li><span class="ux-leaf">${esc(n)} <b>\xD7${fmt(q)}</b></span></li>`;
        const s2 = new Set(seen);
        s2.add(n);
        return `<li><details ${d < 1 ? "open" : ""}><summary><b>${esc(n)}</b> \xD7${fmt(q)} <small>${esc(r.s || "")}</small></summary><ul>${r.r.map(([m, k]) => tree(m, q * (parseFloat(k) || 1), d + 1, s2)).join("")}</ul></details></li>`;
      };
      const raw = (n, q, acc, d, seen) => {
        const r = rec[n];
        if (!r || d > 6 || seen.has(n)) {
          acc[n] = (acc[n] || 0) + q;
          return acc;
        }
        const s2 = new Set(seen);
        s2.add(n);
        r.r.forEach(([m, k]) => raw(m, q * (parseFloat(k) || 1), acc, d + 1, s2));
        return acc;
      };
      const draw = () => {
        history.replaceState(null, "", "?i=" + encodeURIComponent(it) + "&n=" + qty);
        const tot = Object.entries(raw(it, qty, {}, 0, /* @__PURE__ */ new Set())).sort((a, b) => b[1] - a[1]);
        kr.innerHTML = `<div class="ux-panel"><div class="ux-h">\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0435\u043C? ${hlp("\u041D\u0430\u0447\u043D\u0438 \u043F\u0438\u0441\u0430\u0442\u044C \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430 \u0438 \u0432\u044B\u0431\u0435\u0440\u0438 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430.")}</div><div class="ux-row2"><input class="ux-in" list="ux-items" value="${esc(it)}" data-k="it" aria-label="\u041F\u0440\u0435\u0434\u043C\u0435\u0442" style="flex:1 1 220px"><datalist id="ux-items">${names.map((n) => `<option value="${esc(n)}">`).join("")}</datalist><input class="ux-in ux-num" type="number" inputmode="numeric" min="1" max="9999" value="${qty}" data-k="n" aria-label="\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0448\u0442\u0443\u043A"></div><div class="ux-chips" style="margin-top:8px">${[1, 5, 10, 50].map((v) => `<button type="button" class="ux-chip ${qty == v ? "on" : ""}" data-n="${v}">\xD7${v}</button>`).join("")}</div></div>
  <div class="ux-two"><div class="ux-panel"><div class="ux-h">\u{1F9FA} \u0412\u0441\u0435\u0433\u043E \u043D\u0443\u0436\u043D\u043E \u0441\u043E\u0431\u0440\u0430\u0442\u044C</div><div class="ux-cards ux-mats">${tot.map(([n, q]) => `<a class="ux-card" href="?i=${encodeURIComponent(n)}&n=1" data-i="${esc(n)}"><div class="ux-ct">${esc(n)}</div><div class="ux-big-n" style="font-size:1.3rem">\xD7${fmt(q)}</div></a>`).join("")}</div></div>
  <div class="ux-panel"><div class="ux-h">\u{1F333} \u0418\u0437 \u0447\u0435\u0433\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C ${hlp("\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u044C, \u0438\u0437 \u0447\u0435\u0433\u043E \u0434\u0435\u043B\u0430\u0435\u0442\u0441\u044F \u0434\u0435\u0442\u0430\u043B\u044C.")}</div><ul class="ux-ctree">${tree(it, qty, 0, /* @__PURE__ */ new Set())}</ul>${(used[it] || []).length ? `<div class="ux-h" style="margin-top:12px">\u27A1\uFE0F \u0412\u043E \u0447\u0442\u043E \u0438\u0434\u0451\u0442</div><div class="ux-chips">${used[it].slice(0, 16).map((n) => `<button type="button" class="ux-chip" data-i="${esc(n)}">${esc(n)}</button>`).join("")}</div>` : ""}</div></div>`;
      };
      kr.addEventListener("change", (e) => {
        const k = e.target.dataset.k;
        if (k == "it" && rec[e.target.value]) {
          it = e.target.value;
          draw();
        }
        if (k == "n") {
          qty = Math.max(1, +e.target.value || 1);
          draw();
        }
      });
      kr.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i],[data-n]");
        if (!b) return;
        if (b.dataset.i && rec[b.dataset.i]) {
          e.preventDefault();
          it = b.dataset.i;
          draw();
          scrollTo({ top: 0, behavior: "smooth" });
        } else if (b.dataset.i) {
          e.preventDefault();
        }
        if (b.dataset.n) {
          qty = +b.dataset.n;
          draw();
        }
      });
      draw();
    });
    const fe = $("#ux-food");
    if (fe) ref().then((R) => {
      const F = R.food;
      const stats = [...new Set(F.flatMap((f) => f.b.map((b) => b.stat)))];
      const IC = { "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B": "\u{1F6E0}", "\u0410\u0442\u0430\u043A\u0430": "\u2694\uFE0F", "\u0417\u0430\u0449\u0438\u0442\u0430": "\u{1F6E1}" };
      let s = LS.get("ux_fgoal", stats.includes("\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B") ? "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B" : stats[0]);
      const draw = () => {
        LS.set("ux_fgoal", s);
        const L2 = F.filter((f) => f.b.some((b) => b.stat == s)).map((f) => [f, f.b.find((b) => b.stat == s).pct]).sort((a, b) => b[1] - a[1] || b[0].d - a[0].d);
        fe.innerHTML = `<div class="ux-panel"><div class="ux-h">\u0427\u0442\u043E \u0445\u043E\u0447\u0443? ${hlp("\u0412\u044B\u0431\u0435\u0440\u0438 \u0446\u0435\u043B\u044C \u2014 \u043F\u043E\u043A\u0430\u0436\u0443 \u0431\u043B\u044E\u0434\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0430\u044E\u0442 \u044D\u0442\u043E\u0442 \u0431\u043E\u043D\u0443\u0441, \u043B\u0443\u0447\u0448\u0438\u0435 \u043F\u0435\u0440\u0432\u044B\u043C\u0438.")}</div><div class="ux-chips">${stats.map((t) => `<button type="button" class="ux-chip ${t == s ? "on" : ""}" data-s="${esc(t)}">${IC[t] || "\u2728"} ${esc(t)}</button>`).join("")}</div></div><div class="ux-cards">${L2.map(([f, p]) => `<div class="ux-card"><div class="ux-ct">${esc(f.n)}</div><div class="ux-big-n" style="font-size:1.5rem">+${p}%</div><div class="ux-sub">\u23F1 ${f.d ? Math.round(f.d / 60) + " \u043C\u0438\u043D" : "\u2014"} \xB7 \u{1F357} \u0441\u044B\u0442\u043E\u0441\u0442\u044C ${f.nu}</div><div class="ux-sub">${f.r.map((r) => esc(r[0]) + " \xD7" + esc(r[1])).join(", ")}</div><div class="ux-sub">\u{1F373} ${esc((f.st || [])[0] || "")}</div></div>`).join("")}</div>`;
      };
      fe.addEventListener("click", (e) => {
        const b = e.target.closest("[data-s]");
        if (b) {
          s = b.dataset.s;
          draw();
        }
      });
      draw();
    });
    const nv = $("#ux-skills");
    if (nv) Promise.all([data(), ux(), ref()]).then(([D, X, R]) => {
      const A = R.act;
      let el = "", q = "", fr = false;
      const by = Object.fromEntries(D.pals.map((p) => [p.id, p]));
      const draw = () => {
        const L2 = A.filter((a) => (!el || a.el == el) && (!fr || a.f) && (!q || a.n.toLowerCase().includes(q))).sort((a, b) => (+b.pw || 0) - (+a.pw || 0));
        $("#ux-skl").innerHTML = `<div class="ux-cnt">\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ${L2.length}</div><div class="ux-cards">${L2.slice(0, 120).map((a) => `<div class="ux-card ux-sk g-${ELC[a.el] || ""}"><div class="ux-ct">${ELI[a.el] || ""} ${esc(a.n)}</div><div class="ux-chips"><span class="ux-chip">\u{1F4A5} ${esc(a.pw || "0")}</span><span class="ux-chip">\u23F1 ${esc(a.ct)} \u0441</span>${a.f ? '<span class="ux-chip on">\u{1F34E} \u0415\u0441\u0442\u044C \u043F\u043B\u043E\u0434</span>' : ""}${a.u ? '<span class="ux-chip">\u2B50 \u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439</span>' : ""}</div><div class="ux-sub">${esc(a.d)}</div>${a.f && R.fruit[a.n] ? `<div class="ux-sub">\u{1F34E} ${esc(R.fruit[a.n].filter(Boolean).slice(0, 2).join(" \xB7 "))}</div>` : ""}${a.L.length ? `<div class="ux-learn">${a.L.slice(0, 8).map(([id, l]) => by[id] && by[id].url ? `<a href="${B + by[id].url}" title="${esc(by[id].ru)} \u2014 \u0441 \u0443\u0440. ${l}"><img src="${B + by[id].thumb}" width="32" height="32" alt="${esc(by[id].ru)}" loading="lazy"></a>` : "").join("")}${a.L.length > 8 ? `<small>+${a.L.length - 8}</small>` : ""}</div>` : ""}</div>`).join("")}</div>`;
      };
      nv.innerHTML = `<div class="ux-panel"><input class="ux-in" type="search" placeholder="\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u0430\u0432\u044B\u043A\u0430" data-k="q" aria-label="\u041F\u043E\u0438\u0441\u043A \u043D\u0430\u0432\u044B\u043A\u0430" style="width:100%"><div class="ux-chips" style="margin-top:8px"><button type="button" class="ux-chip on" data-el="">\u0412\u0441\u0435</button>${Object.keys(ELI).map((e) => `<button type="button" class="ux-chip" data-el="${e}">${ELI[e]} ${e}</button>`).join("")}<button type="button" class="ux-chip" data-fr>\u{1F34E} \u0422\u043E\u043B\u044C\u043A\u043E \u0441 \u043F\u043B\u043E\u0434\u043E\u043C</button></div></div><div id="ux-skl"></div>`;
      nv.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.el != null) {
          el = b.dataset.el;
          $$("[data-el]", nv).forEach((x) => x.classList.toggle("on", x === b));
        }
        if (b.hasAttribute("data-fr")) {
          fr = !fr;
          b.classList.toggle("on", fr);
        }
        draw();
      });
      nv.addEventListener("input", (e) => {
        if (e.target.dataset.k == "q") {
          q = e.target.value.toLowerCase().trim();
          draw();
        }
      });
      draw();
    });
    const cmp = $("#cmp");
    if (cmp) Promise.all([data(), ux()]).then(([D, X]) => {
      const box = mk("section", "ux-panel ux-c4");
      cmp.after(box);
      const u = new URLSearchParams(location.search);
      let ids = (u.get("m") || "").split(",").filter(Boolean);
      if (!ids.length) {
        ["a", "b"].forEach((k) => {
          const p = u.get(k) && D.pals.find((q) => q.ru == u.get(k));
          if (p) ids.push(p.id);
        });
      }
      const draw = () => {
        const ps = ids.map((i) => D.pals.find((p) => p.id == i)).filter(Boolean);
        const st = [["\u2764\uFE0F", "HP", "hp"], ["\u2694\uFE0F", "\u0410\u0442\u0430\u043A\u0430", "atk"], ["\u{1F6E1}", "\u0417\u0430\u0449\u0438\u0442\u0430", "def"], ["\u{1F40E}", "\u0420\u044B\u0432\u043E\u043A", "sprint"]];
        const best = (k) => Math.max(...ps.map((p) => +p[k] || 0));
        const wbest = (w) => Math.max(...ps.map((p) => ((p.work || []).find((x) => x[0] == w) || [0, 0])[1]));
        const works = [...new Set(ps.flatMap((p) => (p.work || []).map((w) => w[0])))];
        box.innerHTML = `<div class="ux-h">\u2696\uFE0F \u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u0434\u043E 4 \u043F\u0430\u043B\u043E\u0432 ${hlp("\u0414\u043E\u0431\u0430\u0432\u044C \u0434\u043E \u0447\u0435\u0442\u044B\u0440\u0451\u0445 \u043F\u0430\u043B\u043E\u0432. \u041B\u0443\u0447\u0448\u0435\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 \u043A\u0430\u0436\u0434\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0435 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u043E.")}</div><div class="ux-c4g" style="--n:${Math.max(ps.length, 1)}">${ps.map((p) => `<div class="ux-c4c">${U.artHTML ? U.artHTML(X, p, 96) : ""}<b>${esc(p.ru)}</b><div>${p.el.map((e) => ELI[e]).join(" ")}</div><button type="button" class="ux-x4" data-rm="${p.id}" aria-label="\u0423\u0431\u0440\u0430\u0442\u044C ${esc(p.ru)}">\u2715</button></div>`).join("")}</div>
  ${ps.length < 4 ? '<button type="button" class="ux-btn ghost" data-add>\uFF0B \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0430\u043B\u0430</button>' : ""}
  ${ps.length >= 2 ? `<div class="ux-c4t" style="--n:${ps.length}">${st.map(([i, l, k]) => `<div class="ux-c4r"><span>${i} ${l}</span>${ps.map((p) => `<b class="${(+p[k] || 0) == best(k) && best(k) ? "best" : ""}">${p[k] || "\u2014"}</b>`).join("")}</div>`).join("")}${works.map((w) => `<div class="ux-c4r"><span>\u{1F6E0} ${esc(w)}</span>${ps.map((p) => {
          const v = ((p.work || []).find((x) => x[0] == w) || [0, 0])[1];
          return `<b class="${v && v == wbest(w) ? "best" : ""}">${v || "\u2014"}</b>`;
        }).join("")}</div>`).join("")}</div>` : ""}`;
        cmp.style.display = ps.length > 2 ? "none" : "";
        if (ps.length > 2 || u.get("m")) history.replaceState(null, "", "?m=" + ids.join(","));
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.rm) {
          ids = ids.filter((x) => x != b.dataset.rm);
          draw();
        }
        if (b.hasAttribute("data-add")) window.PW_pickPal && window.PW_pickPal(D, "\u041A\u043E\u0433\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C?", (p) => {
          if (!ids.includes(p.id) && ids.length < 4) ids.push(p.id);
          draw();
        });
      });
      draw();
    });
    const my = $("#mylists");
    if (my && "serviceWorker" in navigator && "caches" in window) {
      const o = mk("section", "ux-panel");
      o.innerHTML = `<div class="ux-h">\u{1F4F4} \u0411\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430 ${hlp("\u0421\u043E\u0445\u0440\u0430\u043D\u044E \u0433\u043B\u0430\u0432\u043D\u044B\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0438 \u0432\u0441\u0435\u0445 \u043F\u0430\u043B\u043E\u0432 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435. \u0422\u043E\u0433\u0434\u0430 \u0441\u0430\u0439\u0442 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0434\u0430\u0436\u0435 \u0431\u0435\u0437 \u0441\u0435\u0442\u0438 \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0432 \u0438\u0433\u0440\u0435 \u043D\u0430 \u043D\u043E\u0443\u0442\u0431\u0443\u043A\u0435.")}</div><button type="button" class="ux-btn" data-off>\u2B07\uFE0F \u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0434\u043B\u044F \u043E\u0444\u043B\u0430\u0439\u043D\u0430</button><div class="ux-sub" id="ux-offst"></div>`;
      my.before(o);
      $("[data-off]", o).onclick = async () => {
        const D = await data();
        const urls = ["", "gallery/", "map/", "breed/", "boss/", "compare/", "my/", "ux/", "ux/uroven/", "ux/stihii/", "2_mehaniki/rabota/", "ux/lovlya/", "assets/ux50_data.json", "assets/ux50_ref.json", "assets/breeding.json", ...D.pals.filter((p) => p.url).map((p) => p.url), ...(D.bcards || []).map((b) => b.u), ...D.pals.filter((p) => p.thumb).map((p) => p.thumb)];
        const c = await caches.open("ux-offline");
        let n = 0;
        const st = $("#ux-offst");
        for (let i = 0; i < urls.length; i += 8) {
          await Promise.all(urls.slice(i, i + 8).map((x) => c.add(B + x).then(() => n++).catch(() => {
          })));
          st.textContent = `\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E ${n} \u0438\u0437 ${urls.length}`;
        }
        LS.set("ux_off", Date.now());
        st.textContent = `\u2705 \u0413\u043E\u0442\u043E\u0432\u043E: ${n} \u0441\u0442\u0440\u0430\u043D\u0438\u0446 \u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A. \u0421\u0430\u0439\u0442 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0431\u0435\u0437 \u0441\u0435\u0442\u0438.`;
        toast("\u0413\u043E\u0442\u043E\u0432\u043E \u0434\u043B\u044F \u043E\u0444\u043B\u0430\u0439\u043D\u0430");
      };
    }
    data().then((D) => {
      try {
        botAsk(D);
      } catch (e) {
        console.error(e);
      }
    });
    bugSheet();
  };
  document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", () => setTimeout(go, 60)) : setTimeout(go, 60);
})();
