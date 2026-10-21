(function() {
  "use strict";
  const go = () => {
    const U = window.UX;
    if (!U) return;
    const { B, esc, LS, $, $$, mk, hlp, data, ux, chip, ELC, ELI } = U;
    const palCard = (p, sub) => `<a class="ux-pal" href="${B + p.url}"><img src="${B + p.thumb}" alt="" loading="lazy" width="64" height="64"><span>${esc(p.ru)}</span>${sub ? `<small>${sub}</small>` : ""}</a>`;
    const hub = $("#ux-hub");
    if (hub) {
      const T = [["\u{1F9ED}", "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u043D\u0430 \u043C\u043E\u0451\u043C \u0443\u0440\u043E\u0432\u043D\u0435", "ux/uroven/", "\u041F\u043E\u0434\u0441\u043A\u0430\u0436\u0443, \u043A\u0443\u0434\u0430 \u0438\u0434\u0442\u0438 \u0438 \u043A\u043E\u0433\u043E \u043B\u043E\u0432\u0438\u0442\u044C"], ["\u{1F525}", "\u041A\u0440\u0443\u0433 \u0441\u0442\u0438\u0445\u0438\u0439", "ux/stihii/", "\u041A\u0442\u043E \u043A\u043E\u0433\u043E \u0431\u044C\u0451\u0442 \u2014 \u043E\u0434\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u043E\u0439"], ["\u{1F3AF}", "\u0428\u0430\u043D\u0441 \u043F\u043E\u0438\u043C\u043A\u0438", "ux/lovlya/", "\u041A\u0430\u043A\u0430\u044F \u0441\u0444\u0435\u0440\u0430 \u043D\u0443\u0436\u043D\u0430"], ["\u{1F9F1}", "\u0418\u0437 \u0447\u0435\u0433\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C", "ux/kraft/", "\u0414\u0435\u0440\u0435\u0432\u043E \u043A\u0440\u0430\u0444\u0442\u0430 \u0438 \u0441\u043F\u0438\u0441\u043E\u043A \u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0432"], ["\u{1F372}", "\u0415\u0434\u0430 \u0434\u043B\u044F \u0446\u0435\u043B\u0438", "ux/eda/", "\u0427\u0442\u043E \u0441\u044A\u0435\u0441\u0442\u044C \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0438 \u0431\u043E\u044F"], ["\u{1F333}", "\u0414\u0435\u0440\u0435\u0432\u043E \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F", "ux/derevo/", "\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u0438 \u0438 \u0434\u0435\u0442\u0438 \u043F\u0430\u043B\u0430"], ["\u2705", "\u0427\u0442\u043E \u043D\u043E\u0432\u043E\u0433\u043E \u0432 1.0.5", "ux/patch/", "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0430\u0442\u0447\u0435\u0439 \u043A\u043E\u0440\u043E\u0442\u043A\u043E"]];
      hub.innerHTML = `<div class="ux-tiles ux-hubt">${T.map(([i, t, u, d]) => `<a class="ux-tile" href="${B + u}"><span>${i}</span><div><b>${esc(t)}</b><br><small>${esc(d)}</small></div></a>`).join("")}</div>`;
    }
    const lvl = $("#ux-level");
    if (lvl) Promise.all([data(), ux()]).then(([D, X]) => {
      let N = LS.get("ux_lvl", 10);
      lvl.innerHTML = `<div class="ux-panel"><div class="ux-h">\u041C\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C ${hlp("\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0433\u0435\u0440\u043E\u044F \u0432\u0438\u0434\u0435\u043D \u0432 \u043B\u0435\u0432\u043E\u043C \u0432\u0435\u0440\u0445\u043D\u0435\u043C \u0443\u0433\u043B\u0443 \u044D\u043A\u0440\u0430\u043D\u0430 \u0432 \u0438\u0433\u0440\u0435. \u042F \u0437\u0430\u043F\u043E\u043C\u043D\u044E \u0435\u0433\u043E \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435.")}</div>
 <div class="ux-lvrow"><button type="button" class="ux-btn ghost" data-d="-1" aria-label="\u041C\u0435\u043D\u044C\u0448\u0435">\u2212</button><output class="ux-big-n" id="uxn">${N}</output><button type="button" class="ux-btn ghost" data-d="1" aria-label="\u0411\u043E\u043B\u044C\u0448\u0435">+</button></div>
 <input type="range" class="ux-range" id="uxr" min="1" max="80" value="${N}" aria-label="\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0433\u0435\u0440\u043E\u044F"><div class="ux-chips">${[1, 10, 20, 30, 40, 50, 60, 70, 80].map((v) => `<button type="button" class="ux-chip" data-v="${v}">${v}</button>`).join("")}</div></div><div id="uxo"></div>`;
      const by = Object.fromEntries(D.pals.map((p) => [p.id, p]));
      const draw = () => {
        LS.set("ux_lvl", N);
        $("#uxn").textContent = N;
        $("#uxr").value = N;
        $$(".ux-chip[data-v]", lvl).forEach((c) => c.classList.toggle("on", +c.dataset.v == N));
        const reg = X.reg.filter((r) => N >= r.lv[0] - 2 && N <= r.lv[1]);
        const catchP = Object.entries(X.pals).filter(([id, x]) => x.wild && x.lv && x.lv[0] <= N && x.lv[0] >= N - 12 && by[id] && by[id].url).map(([id, x]) => [by[id], x]).sort((a, b) => (b[0].rank || 0) - (a[0].rank || 0)).slice(0, 12);
        const bs = X.boss.filter((b) => typeof b.lv == "number");
        const now = bs.filter((b) => b.lv <= N + 2 && b.lv >= N - 8).slice(0, 4);
        const next = bs.filter((b) => b.lv > N + 2).sort((a, b) => a.lv - b.lv)[0];
        const bcard = (b) => {
          const bc = (D.bcards || []).find((c) => c.pal == b.pal && c.lv.includes(b.lv)) || (D.bcards || []).find((c) => c.pal == b.pal);
          return `<a class="ux-tile" href="${bc ? B + bc.u : B + "boss/"}">${bc ? `<img src="${B + bc.t}" width="40" height="40" alt="" loading="lazy">` : "<span>\u{1F451}</span>"}<div><b>${esc(b.n)}</b><br><small>\u0443\u0440. ${b.lv} \xB7 \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C ${b.w.map((w) => ELI[w] + " " + w).join(", ") || "\u2014"}</small></div></a>`;
        };
        $("#uxo").innerHTML = `<div class="ux-panel"><div class="ux-h">\u{1F5FA}\uFE0F \u041A\u0443\u0434\u0430 \u0438\u0434\u0442\u0438 ${hlp("\u0423\u0440\u043E\u0432\u043D\u0438 \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u044B\u0435: \u0434\u0438\u043A\u0438\u0435 \u043F\u0430\u043B\u044B \u0442\u0430\u043C \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0442\u0430\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F.")}</div><div class="ux-chips">${reg.map((r) => `<a class="ux-chip" href="${B}map/">${esc(r.n)} \xB7 ${r.lv[0]}\u2013${r.lv[1]}</a>`).join("") || "<span>\u0422\u044B \u043F\u0440\u043E\u0448\u0451\u043B \u0432\u0441\u0451! \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0441\u043B\u043E\u0436\u043D\u044B\u0435 \u0431\u0430\u0448\u043D\u0438 \u0438 \u0440\u0435\u0439\u0434\u044B.</span>"}</div></div>
  ${next ? `<div class="ux-panel ux-goal"><div class="ux-h">\u{1F3AF} \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0446\u0435\u043B\u044C</div><div class="ux-tiles">${bcard(next)}</div></div>` : ""}
  <div class="ux-panel"><div class="ux-h">\u{1F43E} \u041A\u043E\u0433\u043E \u043F\u043E\u0439\u043C\u0430\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441 ${hlp("\u042D\u0442\u0438 \u043F\u0430\u043B\u044B \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u044E\u0442\u0441\u044F \u0432 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043D\u0430 \u0442\u0432\u043E\u0451\u043C \u0443\u0440\u043E\u0432\u043D\u0435. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0430\u043C\u044B\u0435 \u0441\u0438\u043B\u044C\u043D\u044B\u0435.")}</div><div class="ux-grid">${catchP.map(([p, x]) => palCard(p, "\u0441 \u0443\u0440. " + x.lv[0])).join("") || "<span>\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</span>"}</div></div>
  ${now.length ? `<div class="ux-panel"><div class="ux-h">\u{1F451} \u0411\u043E\u0441\u0441\u044B \u043F\u043E \u0441\u0438\u043B\u0430\u043C</div><div class="ux-tiles">${now.map(bcard).join("")}</div></div>` : ""}`;
      };
      lvl.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.d) N = Math.max(1, Math.min(80, N + +b.dataset.d));
        if (b.dataset.v) N = +b.dataset.v;
        draw();
      });
      $("#uxr").addEventListener("input", (e) => {
        N = +e.target.value;
        draw();
      });
      draw();
    });
    const wh = $("#ux-wheel");
    if (wh) ux().then((X) => {
      const E = ["\u041E\u0433\u043E\u043D\u044C", "\u0422\u0440\u0430\u0432\u0430", "\u0417\u0435\u043C\u043B\u044F", "\u041C\u043E\u043B\u043D\u0438\u044F", "\u0412\u043E\u0434\u0430", "\u041B\u0451\u0434", "\u0414\u0440\u0430\u043A\u043E\u043D", "\u0422\u044C\u043C\u0430", "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439"];
      const C = { fire: "#ff6a2b", water: "#2f8fff", grass: "#3fb950", electric: "#f2c200", ice: "#5cc8ef", ground: "#b0763a", dark: "#8b5cf6", dragon: "#d94fc0", neutral: "#a8957a" };
      const W = 360, R = 140, cx = 180, cy = 180;
      const pos = E.map((e, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / E.length;
        return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
      });
      const ch = X.chart;
      let sel = LS.get("ux_el", "\u041E\u0433\u043E\u043D\u044C");
      const draw = () => {
        LS.set("ux_el", sel);
        const si = E.indexOf(sel);
        const beats = ch[sel] || [];
        const fear = E.filter((e) => (ch[e] || []).includes(sel));
        const arrows = [];
        E.forEach((a, i) => (ch[a] || []).forEach((d) => {
          const j = E.indexOf(d);
          if (j < 0) return;
          const [x1, y1] = pos[i], [x2, y2] = pos[j];
          const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
          const k1 = 30 / L, k2 = (L - 34) / L;
          const on = a == sel ? "out" : d == sel ? "in" : "";
          arrows.push(`<line x1="${x1 + dx * k1}" y1="${y1 + dy * k1}" x2="${x1 + dx * k2}" y2="${y1 + dy * k2}" class="ux-ar ${on}" marker-end="url(#m${on || "n"})"/>`);
        }));
        wh.innerHTML = `<p class="ux-lead">\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0441\u0442\u0438\u0445\u0438\u044E: <b class="ux-g">\u0437\u0435\u043B\u0451\u043D\u044B\u0435</b> \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u2014 \u043A\u043E\u0433\u043E \u043E\u043D\u0430 \u0431\u044C\u0451\u0442 \u0441\u0438\u043B\u044C\u043D\u0435\u0435 (\xD71,5), <b class="ux-rd">\u043A\u0440\u0430\u0441\u043D\u044B\u0435</b> \u2014 \u043A\u043E\u0433\u043E \u0435\u0439 \u0441\u0442\u043E\u0438\u0442 \u0431\u043E\u044F\u0442\u044C\u0441\u044F.</p>
  <div class="ux-wheelbox"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="\u041A\u0440\u0443\u0433 \u0441\u0442\u0438\u0445\u0438\u0439"><defs>${["n", "out", "in"].map((k) => `<marker id="m${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ux-mk ${k}"/></marker>`).join("")}</defs>${arrows.join("")}
  ${E.map((e, i) => `<g class="ux-node ${e == sel ? "on" : ""}" data-e="${e}" tabindex="0" role="button" aria-label="${e}" transform="translate(${pos[i][0]},${pos[i][1]})"><circle r="28" fill="${C[ELC[e]]}" /><text y="7" text-anchor="middle" font-size="22">${ELI[e]}</text><text y="46" text-anchor="middle" class="ux-nl">${e == "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439" ? "\u041D\u0435\u0439\u0442\u0440." : e}</text></g>`).join("")}</svg></div>
  <div class="ux-two"><div class="ux-panel"><div class="ux-h">\u{1F4AA} ${ELI[sel]} ${sel} \u0431\u044C\u0451\u0442</div><div class="ux-chips">${beats.map((e) => `<button type="button" class="ux-chip" data-e="${e}">${ELI[e]} ${e} \xD71,5</button>`).join("") || "<span>\u041D\u0438\u043A\u043E\u0433\u043E \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E</span>"}</div></div>
  <div class="ux-panel"><div class="ux-h">\u26A0\uFE0F ${ELI[sel]} ${sel} \u0431\u043E\u0438\u0442\u0441\u044F</div><div class="ux-chips">${fear.map((e) => `<button type="button" class="ux-chip" data-e="${e}">${ELI[e]} ${e}</button>`).join("") || "<span>\u041D\u0438\u043A\u043E\u0433\u043E</span>"}</div></div></div>
  <div class="ux-kid">\u{1F476} \u041F\u0440\u043E\u0449\u0435: \u0435\u0441\u043B\u0438 \u043F\u0430\u043B ${sel == "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439" ? "\u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439" : "\u0441\u0442\u0438\u0445\u0438\u0438 \xAB" + sel + "\xBB"}, \u0431\u0435\u0440\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 ${fear.length ? "\u043D\u0435\u0433\u043E \u043F\u0430\u043B\u043E\u0432 \u0441\u0442\u0438\u0445\u0438\u0438 \xAB" + fear.join("\xBB, \xAB") + "\xBB" : "\u043D\u0435\u0433\u043E \u043A\u043E\u0433\u043E \u0443\u0433\u043E\u0434\u043D\u043E"}. ${hlp("\u0423 \u043F\u0430\u043B\u0430 \u0441 \u0434\u0432\u0443\u043C\u044F \u0441\u0442\u0438\u0445\u0438\u044F\u043C\u0438 \u043C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u0438 \u043F\u0435\u0440\u0435\u043C\u043D\u043E\u0436\u0430\u044E\u0442\u0441\u044F: \xD71,5 \xD7 \xD71,5 = \xD72,25.")}</div>`;
        simpleKid();
      };
      const simpleKid = () => {
        const on = document.documentElement.classList.contains("simple");
        $$(".ux-kid", wh).forEach((e) => e.hidden = false);
      };
      wh.addEventListener("click", (e) => {
        const g = e.target.closest("[data-e]");
        if (g) {
          sel = g.dataset.e;
          draw();
        }
      });
      wh.addEventListener("keydown", (e) => {
        const g = e.target.closest("[data-e]");
        if (g && (e.key == "Enter" || e.key == " ")) {
          e.preventDefault();
          sel = g.dataset.e;
          draw();
        }
      });
      draw();
    });
    const pt = $("#ux-patch");
    if (pt) ux().then((X) => {
      pt.innerHTML = `<p class="ux-lead">\u0412\u0441\u044F \u044D\u043D\u0446\u0438\u043A\u043B\u043E\u043F\u0435\u0434\u0438\u044F \u0441\u0432\u0435\u0440\u0435\u043D\u0430 \u0441 \u0432\u0435\u0440\u0441\u0438\u0435\u0439 <b>${esc(X.ver)}</b>.</p><div class="ux-cards">${X.patch.slice().reverse().map((p) => `<div class="ux-card"><div class="ux-ct">\u0412\u0435\u0440\u0441\u0438\u044F ${esc(p.v)} <small>${esc(p.d)}</small></div><div>${esc(p.m)}</div>${p.w ? `<div class="ux-kid" style="display:block">\u{1F449} ${esc(p.w)}</div>` : ""}</div>`).join("")}</div><p><a class="ux-btn ghost" href="${B}guide/patchi/">\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E \u043F\u0440\u043E \u0432\u0441\u0435 \u043F\u0430\u0442\u0447\u0438</a></p>`;
    });
    document.dispatchEvent(new CustomEvent("ux:tools"));
  };
  document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", () => setTimeout(go, 0)) : setTimeout(go, 0);
})();
