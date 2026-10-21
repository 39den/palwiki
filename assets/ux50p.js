(function() {
  "use strict";
  const go = () => {
    const U = window.UX;
    if (!U) return;
    const { B, esc, LS, $, $$, mk, hlp, data, ux, chip, ELC, ELI } = U;
    let BJ = null;
    const bj = () => BJ || (BJ = fetch(B + "assets/breeding.json").then((r) => r.json()));
    U.artHTML = (X, p, sz, cls) => {
      const k = X.art && X.art[p.id];
      if (!k) return `<span class="ux-art ux-art-p ${cls || ""}"><img src="${B + p.thumb}" alt="" loading="lazy" width="${sz}" height="${sz}"></span>`;
      return `<span class="ux-art ux-art-${k} ${cls || ""}"><img src="${B}ux_art/${p.id}-${sz > 200 ? 512 : 256}.webp" alt="" loading="lazy" width="${sz}" height="${sz}"></span>`;
    };
    const pc = (X, p, sub, href) => `<a class="ux-pal" href="${href || B + p.url}">${U.artHTML(X, p, 96)}<span>${esc(p.ru)}</span>${sub ? `<small>${sub}</small>` : ""}</a>`;
    U.palCard = pc;
    const BG = (X) => X.ws && X.ws.types ? Object.fromEntries(X.ws.types.map((t) => [t.ru, t])) : {};
    function heroSpeed() {
      return LS.get("ux_hero", 100);
    }
    const pals = document.querySelector(".pal-info[data-pal]");
    if (pals) Promise.all([data(), ux()]).then(([D, X]) => {
      const id = pals.dataset.pal;
      const p = D.pals.find((x2) => x2.id == id), x = X.pals[id];
      if (!p || !x) return;
      const qa = $(".ux-qa");
      const host = mk("section", "ux-palx");
      host.setAttribute("aria-label", "\u041A\u043E\u0440\u043E\u0442\u043A\u043E \u043E \u043F\u0430\u043B\u0435");
      (qa || $(".pal-hero") || pals).after(host);
      const habTab = $$(".tabbed-labels label").find((l) => /Где водится/i.test(l.textContent));
      const hab = `<div class="ux-tilebig"><div class="ux-h">\u{1F4CD} \u0413\u0434\u0435 \u0436\u0438\u0432\u0451\u0442 ${hlp("\u0413\u0434\u0435 \u043F\u0430\u043B \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435. \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u0441 \u0442\u043E\u0447\u043A\u0430\u043C\u0438 \u0434\u043D\u0451\u043C \u0438 \u043D\u043E\u0447\u044C\u044E \u2014 \u043F\u043E \u043A\u043D\u043E\u043F\u043A\u0435.")}</div>
  ${x.wild ? `<div class="ux-chips">${x.sp && +x.sp[0] ? `<span class="ux-chip">\u2600\uFE0F ${x.sp[0]} \u0442\u043E\u0447\u0435\u043A \u0434\u043D\u0451\u043C</span>` : ""}${x.sp && +x.sp[1] ? `<span class="ux-chip">\u{1F319} ${x.sp[1]} \u043D\u043E\u0447\u044C\u044E</span>` : ""}${x.lv ? `<span class="ux-chip">\u0443\u0440. ${x.lv[0]}\u2013${x.lv[1]}</span>` : ""}${(x.dng || []).slice(0, 2).map((d) => `<span class="ux-chip">\u{1F573}\uFE0F ${esc(d)}</span>`).join("")}</div>` : `<div class="ux-chips"><span class="ux-chip">\u{1F95A} \u0412 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043D\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435</span></div>`}
  <div class="ux-row2"><a class="ux-btn" href="${B}map/?pal=${encodeURIComponent(id)}">\u{1F5FA}\uFE0F \u041D\u0430 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u043A\u0430\u0440\u0442\u0435</a>${habTab ? '<button type="button" class="ux-btn ghost" data-hab>\u2600\uFE0F\u{1F319} \u0414\u0435\u043D\u044C \u0438 \u043D\u043E\u0447\u044C</button>' : ""}</div></div>`;
      const top = (p.work || []).slice().sort((a, b) => b[1] - a[1]);
      const good = [];
      if (top[0] && top[0][1] >= 3) good.push("\u{1F3E0} " + top[0][0] + " " + top[0][1]);
      if (p.mount) good.push(p.mount == "fly" ? "\u{1F985} \u041B\u0435\u0442\u0430\u0435\u0442 \u2014 \u043C\u043E\u0436\u043D\u043E \u043B\u0435\u0442\u0430\u0442\u044C \u0432\u0435\u0440\u0445\u043E\u043C" : "\u{1F40E} \u0415\u0437\u0434\u043E\u0432\u043E\u0439");
      if (/бо[её]ц|боец|dps|атак/i.test(x.roles || "") || p.atk >= 120) good.push("\u2694\uFE0F \u0411\u043E\u0435\u0446");
      if (/баффер|поддерж/i.test(x.roles || "")) good.push("\u2728 \u0423\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u0443");
      (x.pros || []).slice(0, 2).forEach((t) => good.push("\u{1F44D} " + t));
      const goodH = `<div class="ux-tilebig"><div class="ux-h">\u{1F4A1} \u0414\u043B\u044F \u0447\u0435\u0433\u043E \u0445\u043E\u0440\u043E\u0448</div><div class="ux-chips">${good.map((g) => `<span class="ux-chip">${esc(g)}</span>`).join("") || '<span class="ux-chip">\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435</span>'}</div></div>`;
      const T = BG(X), hs = heroSpeed();
      const work = `<div class="ux-tilebig ux-wide"><div class="ux-h">\u{1F6E0} \u0420\u0430\u0431\u043E\u0442\u0430 \u043D\u0430 \u0431\u0430\u0437\u0435 ${hlp("\u041F\u043E\u043B\u043E\u0441\u043A\u0430 \u2014 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u043E\u0442 1 \u0434\u043E 10. \xAB\xD7N\xBB \u2014 \u0432\u043E \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437 \u043F\u0430\u043B \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0442\u0432\u043E\u0435\u0433\u043E \u0433\u0435\u0440\u043E\u044F \u0441\u043E \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C\u044E \u0440\u0430\u0431\u043E\u0442\u044B " + hs + ". \u0421\u0432\u043E\u044E \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043C\u043E\u0436\u043D\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u0435 \xAB\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B\xBB.")}</div>
  ${top.map(([w, l]) => {
        const t = T[w];
        const pw = t && t.levels ? t.levels[Math.min(l, 10) - 1] : null;
        const k = pw && t.kind == "speed" ? pw / hs : null;
        return `<div class="ux-wb"><span class="ux-wl">${esc(t && t.emoji || "\u{1F527}")} ${esc(w)}</span><span class="ux-bar" role="img" aria-label="${l} \u0438\u0437 10">${Array.from({ length: 10 }, (_, i) => `<i class="${i < l ? "on" : ""}"></i>`).join("")}</span><b>${l}</b>${k ? `<small class="ux-x">${k >= 1 ? "\xD7" + (k >= 10 ? Math.round(k) : k.toFixed(1).replace(".", ",")) + " \u0433\u0435\u0440\u043E\u044F" : "\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u0435\u0435 \u0433\u0435\u0440\u043E\u044F"}</small>` : ""}</div>`;
      }).join("") || "<span>\u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0431\u0430\u0437\u0435</span>"}</div>`;
      const an = (X.anim || []).includes(id) ? `<button type="button" class="ux-anim" aria-label="\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044E"><img src="${B}ux_art/${id}-still.webp" data-anim="${B}ux_art/${id}-anim.webp" data-still="${B}ux_art/${id}-still.webp" alt="${esc(p.ru)}" width="160" height="160" loading="lazy"><span>\u25B6 \u041D\u0430\u0436\u043C\u0438</span></button>` : "";
      const when = x.lv ? `<div class="ux-tilebig ux-wide"><div class="ux-h">\u23F3 \u041A\u043E\u0433\u0434\u0430 \u043B\u043E\u0432\u0438\u0442\u044C ${hlp("\u0428\u043A\u0430\u043B\u0430 \u2014 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0433\u0435\u0440\u043E\u044F \u043E\u0442 1 \u0434\u043E 80. \u041C\u0435\u0442\u043A\u0430 \u2014 \u0441 \u043A\u0430\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F \u043F\u0430\u043B \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0432 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435.")}</div><div class="ux-tl"><div class="ux-tlbar">${X.reg.map((r) => `<span style="left:${(r.lv[0] - 1) / 79 * 100}%;width:${(r.lv[1] - r.lv[0]) / 79 * 100}%" title="${esc(r.n)}"></span>`).join("")}<b style="left:${(x.lv[0] - 1) / 79 * 100}%">\u0443\u0440. ${x.lv[0]}</b></div><div class="ux-tlx"><span>1</span><span>20</span><span>40</span><span>60</span><span>80</span></div></div><p class="ux-sub">${esc((X.reg.find((r) => x.lv[0] >= r.lv[0] && x.lv[0] <= r.lv[1]) || {}).n || "")}${x.cap ? ` \xB7 \u043B\u043E\u0432\u0438\u0442\u0441\u044F ${+x.cap > 1 ? "\u043B\u0435\u0433\u0447\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E" : +x.cap < 1 ? "\u0442\u0440\u0443\u0434\u043D\u0435\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E" : "\u043E\u0431\u044B\u0447\u043D\u043E"} ${hlp("\u041C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0438\u043C\u043A\u0438 \xD7" + String(x.cap).replace(".", ",") + ". \u0411\u043E\u043B\u044C\u0448\u0435 \u2014 \u043B\u043E\u0432\u0438\u0442\u044C \u043B\u0435\u0433\u0447\u0435.")}` : ""}</p></div>` : "";
      host.innerHTML = `<div class="ux-tiles2">${hab}${goodH}${an ? `<div class="ux-tilebig ux-animt">${an}</div>` : ""}${work}${when}</div>`;
      const hb = $("[data-hab]", host);
      if (hb) hb.onclick = () => {
        habTab.click();
        habTab.scrollIntoView({ behavior: "smooth", block: "center" });
      };
      const ab = $(".ux-anim", host);
      if (ab) {
        const im = $("img", ab);
        const on = () => {
          im.src = im.dataset.anim;
          ab.classList.add("on");
        }, off = () => {
          im.src = im.dataset.still;
          ab.classList.remove("on");
        };
        if (matchMedia("(hover:hover)").matches) {
          ab.addEventListener("mouseenter", on);
          ab.addEventListener("mouseleave", off);
        }
        ab.addEventListener("click", () => ab.classList.contains("on") ? off() : on());
      }
      const bp = x.bp || {};
      $$(".psets a.psv[data-psv], .pset a.psv").forEach((a) => {
        const n = a.dataset.psv;
        if (a.nextElementSibling && a.nextElementSibling.classList.contains("ux-ptag")) return;
        const t = [];
        if ((bp["\u0431\u043E\u0435\u0446"] || []).includes(n)) t.push("\u2694\uFE0F \u0442\u043E\u043F \u0434\u043B\u044F \u0431\u043E\u044F");
        if ((bp["\u0440\u0430\u0431\u043E\u0447\u0438\u0439"] || []).includes(n)) t.push("\u{1F6E0} \u0442\u043E\u043F \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B");
        if ((bp["\u0435\u0437\u0434\u043E\u0432\u043E\u0439"] || []).includes(n)) t.push("\u{1F40E} \u0434\u043B\u044F \u0435\u0437\u0434\u044B");
        if (t.length) a.insertAdjacentHTML("afterend", `<small class="ux-ptag">${t.join(" \xB7 ")}</small>`);
      });
      const ps = $(".psets");
      if (ps && !$(".ux-pbreed")) ps.insertAdjacentHTML("afterend", `<div class="ux-pbreed">${["\u0431\u043E\u0435\u0446", "\u0440\u0430\u0431\u043E\u0447\u0438\u0439"].filter((r) => (bp[r] || []).length).map((r) => `<a class="ux-btn ghost" href="${B}ux/s-passivkami/?pal=${encodeURIComponent(id)}&p=${encodeURIComponent((bp[r] || []).slice(0, 4).join("|"))}">\u{1F9EC} \u041A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 ${r == "\u0431\u043E\u0435\u0446" ? "\u0431\u043E\u0439\u0446\u0430" : "\u0440\u0430\u0431\u043E\u0442\u044F\u0433\u0443"} \u0441 \u044D\u0442\u0438\u043C\u0438 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0430\u043C\u0438</a>`).join("")}</div>`);
      const nPairs = (X.brc || {})[p.ru] || 0, special = (X.brs || {})[p.ru];
      let badge = "";
      if (special && nPairs <= 1) badge = '<span class="ux-badge gold">\u{1F511} \u0422\u043E\u043B\u044C\u043A\u043E \u043E\u0441\u043E\u0431\u0430\u044F \u043F\u0430\u0440\u0430</span>';
      else if (!x.wild && nPairs <= 3) badge = '<span class="ux-badge gold">\u{1F511} \u0415\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u2014 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435</span>';
      else if (nPairs && nPairs <= 6) badge = `<span class="ux-badge">\u{1F48E} \u0420\u0435\u0434\u043A\u0430\u044F \u043F\u0430\u0440\u0430: \u0432\u0441\u0435\u0433\u043E ${nPairs}</span>`;
      if (badge) {
        const v = $(".ux-ver");
        (v || $("article h1")).insertAdjacentHTML("afterend", badge);
      }
      const sim = D.pals.filter((q) => q.url && q.id != id && q.el[0] == p.el[0]).map((q) => {
        const qt = (q.work || []).slice().sort((a, b) => b[1] - a[1])[0];
        const sw = top[0] && qt && qt[0] == top[0][0] ? 1 : 0;
        return [q, sw * 1e3 - Math.abs((q.rank || 0) - (p.rank || 0)) / 10];
      }).sort((a, b) => b[1] - a[1]).slice(0, 8).map((a) => a[0]);
      if (sim.length) {
        const s = mk("section", "ux-panel ux-sim");
        s.innerHTML = `<div class="ux-h">\u{1F501} \u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u043F\u0430\u043B\u044B ${hlp("\u0422\u0430 \u0436\u0435 \u0441\u0442\u0438\u0445\u0438\u044F, \u043F\u043E\u0445\u043E\u0436\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u0438 \u0441\u0438\u043B\u0430.")}</div><div class="ux-hscroll">${sim.map((q) => pc(X, q, (q.atk > p.atk ? "\u0441\u0438\u043B\u044C\u043D\u0435\u0435" : "\u0441\u043B\u0430\u0431\u0435\u0435") + " \u0432 \u0431\u043E\u044E")).join("")}</div>`;
        const nx = $(".ux-next");
        nx ? nx.before(s) : $("article").appendChild(s);
      }
    });
    const sp = $("#ux-spass");
    if (sp) Promise.all([data(), ux(), bj()]).then(([D, X, J]) => {
      const u = new URLSearchParams(location.search);
      const by = (n) => D.pals.find((p2) => p2.ru == n);
      let p = D.pals.find((q) => q.id == u.get("pal")) || by(u.get("pal")) || D.pals.find((q) => q.id == "Anubis");
      const want = (u.get("p") || "").split("|").filter(Boolean);
      const draw = () => {
        const ix = Object.fromEntries(J.pals.map((q, i) => [q.ru, i]));
        const me = ix[p.ru];
        const carriers = want.map((n) => {
          const q = D.passives.find((z) => z.name == n);
          return [n, q];
        });
        const pairs = [];
        for (const k in J.pairs) if (J.pairs[k] == me) {
          const [i, j] = k.split(",").map(Number);
          if (i != me && j != me) pairs.push([J.pals[i].ru, J.pals[j].ru]);
          if (pairs.length > 40) break;
        }
        J.special.filter((s) => s.child == p.ru).forEach((s) => pairs.unshift([s.a, s.b]));
        const step = (n, t, body) => `<li class="ux-step"><span class="ux-sn">${n}</span><div><b>${t}</b>${body}</div></li>`;
        const how = (q) => !q ? "" : q.nat && q.nat.length ? `\u0415\u0441\u0442\u044C \u0441 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0443: ${q.nat.slice(0, 6).map((n) => {
          const z = by(n);
          return z ? `<a class="ux-mini" href="${B + z.url}"><img src="${B + z.thumb}" width="28" height="28" alt="">${esc(n)}</a>` : esc(n);
        }).join(" ")}` : q.how == "gold" ? "\u041C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043D\u0430 \u041E\u043F\u0435\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u043C \u0441\u0442\u043E\u043B\u0435 \u0437\u0430 \u0437\u043E\u043B\u043E\u0442\u043E." : q.how == "disposable" ? "\u041C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0438\u043C\u043F\u043B\u0430\u043D\u0442\u043E\u043C \u0438\u0437 \u0414\u0440\u0435\u0432\u043D\u0438\u0445 \u0440\u0435\u043B\u0438\u043A\u0432\u0438\u0439." : "\u0412\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u0443 \u0434\u0438\u043A\u0438\u0445 \u043F\u0430\u043B\u043E\u0432 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E \u2014 \u043B\u043E\u0432\u0438 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0438 \u0441\u043C\u043E\u0442\u0440\u0438 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438.";
        sp.innerHTML = `<div class="ux-panel"><div class="ux-h">\u041A\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0438\u043C</div><div class="ux-row2"><button type="button" class="ux-pick">${U.artHTML(X, p, 64)} <b>${esc(p.ru)}</b> <small>\u0441\u043C\u0435\u043D\u0438\u0442\u044C</small></button></div><div class="ux-chips" style="margin-top:8px">${want.map((w) => `<span class="ux-chip on">\u2728 ${esc(w)}</span>`).join("") || "<span>\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043F\u0430\u043B\u0430</span>"}</div></div>
  <ol class="ux-steps">${step(1, `\u041F\u043E\u043B\u0443\u0447\u0438 ${esc(p.ru)}`, `<div class="ux-sub">${(X.pals[p.id] || {}).wild ? "\u041F\u043E\u0439\u043C\u0430\u0439 \u0432 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u0438\u043B\u0438 \u0432\u044B\u0432\u0435\u0434\u0438 \u043F\u0430\u0440\u043E\u0439:" : "\u0412 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043D\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F \u2014 \u0432\u044B\u0432\u0435\u0434\u0438 \u043F\u0430\u0440\u043E\u0439:"}</div><div class="ux-chips">${pairs.slice(0, 4).map(([a, b]) => `<a class="ux-chip" href="${B}breed/?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}">${esc(a)} + ${esc(b)}</a>`).join("")}</div>`)}
  ${carriers.map(([n, q], i) => step(i + 2, `\u041D\u0430\u0439\u0434\u0438 \u043F\u0430\u043B\u0430 \u0441 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u043E\u0439 \xAB${esc(n)}\xBB`, `<div class="ux-sub">${how(q)}</div>`)).join("")}
  ${step(carriers.length + 2, `\u0421\u043A\u0440\u0435\u0441\u0442\u0438 \u0438\u0445 \u043D\u0430 \u0420\u0430\u043D\u0447\u043E \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F`, `<div class="ux-sub">\u0420\u0435\u0431\u0451\u043D\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u0443\u043D\u0430\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u043E\u0431\u043E\u0438\u0445 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439. \u0415\u0441\u043B\u0438 \u0432\u0438\u0434 \u0440\u0435\u0431\u0451\u043D\u043A\u0430 \u043D\u0435 ${esc(p.ru)} \u2014 \u0432\u043E\u0437\u044C\u043C\u0438 \u043F\u0430\u0440\u0443 \u0438\u0437 \u0448\u0430\u0433\u0430 1, \u0433\u0434\u0435 \u043E\u0434\u0438\u043D \u0438\u0437 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u2014 \u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438.</div>`)}
  ${step(carriers.length + 3, "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0439 \u0441 \u043B\u0443\u0447\u0448\u0438\u043C \u0440\u0435\u0431\u0451\u043D\u043A\u043E\u043C", '<div class="ux-sub">\u0421\u043A\u0440\u0435\u0449\u0438\u0432\u0430\u0439 \u0440\u0435\u0431\u0451\u043D\u043A\u0430 \u0441 \u043D\u043E\u0441\u0438\u0442\u0435\u043B\u0435\u043C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438, \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441\u043E\u0431\u0435\u0440\u0451\u0448\u044C \u0432\u0441\u0435 \u043D\u0443\u0436\u043D\u044B\u0435. \u0422\u043E\u0440\u0442 \u0443\u0441\u043A\u043E\u0440\u044F\u0435\u0442 \u044F\u0439\u0446\u0430.</div>')}</ol>`;
        $(".ux-pick", sp).onclick = () => window.PW_pickPal && window.PW_pickPal(D, "\u041A\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0438\u043C?", (q) => {
          p = q;
          history.replaceState(null, "", "?pal=" + q.id + "&p=" + encodeURIComponent(want.join("|")));
          draw();
        });
      };
      draw();
    });
    const brd = $("#breed");
    if (brd && !$("#ux-own")) Promise.all([data(), ux()]).then(([D, X]) => {
      const box = mk("section", "ux-panel");
      box.id = "ux-own";
      brd.after(box);
      let own = LS.get("ux_own", []);
      const draw = () => {
        LS.set("ux_own", own);
        const ps = own.map((i) => D.pals.find((p) => p.id == i)).filter(Boolean);
        box.innerHTML = `<div class="ux-h">\u{1F392} \u0423 \u043C\u0435\u043D\u044F \u0435\u0441\u0442\u044C ${hlp("\u041E\u0442\u043C\u0435\u0442\u044C \u043F\u0430\u043B\u043E\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0432 \u0442\u0432\u043E\u0451\u043C \u041F\u0430\u043B\u0431\u043E\u043A\u0441\u0435. \u042F \u043F\u043E\u043A\u0430\u0436\u0443, \u043A\u043E\u0433\u043E \u043C\u043E\u0436\u043D\u043E \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u043D\u0438\u0445. \u0425\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435.")}</div><div class="ux-chips">${ps.map((p) => `<button type="button" class="ux-chip on" data-rm="${p.id}"><img src="${B + p.thumb}" width="24" height="24" alt="">${esc(p.ru)} \u2715</button>`).join("")}<button type="button" class="ux-chip" data-add>\uFF0B \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0430\u043B\u0430</button></div>${ps.length >= 2 ? '<button type="button" class="ux-btn" data-calc style="margin-top:10px">\u{1F9EC} \u041A\u043E\u0433\u043E \u044F \u043C\u043E\u0433\u0443 \u0432\u044B\u0432\u0435\u0441\u0442\u0438?</button>' : ""}<div id="ux-ownres"></div>`;
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.rm) {
          own = own.filter((x) => x != b.dataset.rm);
          draw();
        }
        if (b.hasAttribute("data-add")) window.PW_pickPal && window.PW_pickPal(D, "\u041A\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C?", (p) => {
          if (!own.includes(p.id)) own.push(p.id);
          draw();
        });
        if (b.hasAttribute("data-calc")) bj().then((J) => {
          const ix = Object.fromEntries(J.pals.map((q, i) => [q.ru, i]));
          const ps = own.map((i) => D.pals.find((p) => p.id == i)).filter(Boolean);
          const res = /* @__PURE__ */ new Map();
          const sp2 = {};
          J.special.forEach((s) => sp2[[s.a, s.b].sort().join("|")] = s.child);
          for (let i = 0; i < ps.length; i++) for (let j = i; j < ps.length; j++) {
            const a = ps[i], b2 = ps[j];
            let c = sp2[[a.ru, b2.ru].sort().join("|")];
            if (!c) {
              const x1 = ix[a.ru], x2 = ix[b2.ru];
              if (x1 == null || x2 == null) continue;
              const k = Math.min(x1, x2) + "," + Math.max(x1, x2);
              if (J.pairs[k] == null) continue;
              c = J.pals[J.pairs[k]].ru;
            }
            if (own.includes((D.pals.find((p) => p.ru == c) || {}).id)) continue;
            if (!res.has(c)) res.set(c, [a.ru, b2.ru]);
          }
          const out = [...res.entries()].map(([c, ab]) => [D.pals.find((p) => p.ru == c), ab]).filter((a) => a[0] && a[0].url).sort((a, b2) => (b2[0].rank || 0) - (a[0].rank || 0));
          $("#ux-ownres").innerHTML = out.length ? `<div class="ux-sub" style="margin:10px 0">\u041D\u043E\u0432\u044B\u0435 \u043F\u0430\u043B\u044B \u0438\u0437 \u0442\u0432\u043E\u0438\u0445: ${out.length}</div><div class="ux-grid">${out.map(([c, ab]) => pc(X, c, esc(ab[0]) + " + " + esc(ab[1]), B + "breed/?a=" + encodeURIComponent(ab[0]) + "&b=" + encodeURIComponent(ab[1]))).join("")}</div>` : '<div class="ux-sub">\u0418\u0437 \u044D\u0442\u0438\u0445 \u043F\u0430\u043B\u043E\u0432 \u043D\u043E\u0432\u044B\u0445 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F \u2014 \u0434\u043E\u0431\u0430\u0432\u044C \u0435\u0449\u0451.</div>';
        });
      });
      draw();
    });
    const tr = $("#ux-tree");
    if (tr) Promise.all([data(), ux(), bj()]).then(([D, X, J]) => {
      const u = new URLSearchParams(location.search);
      let p = D.pals.find((q) => q.id == u.get("pal")) || D.pals.find((q) => q.id == "Anubis");
      const by = (n) => D.pals.find((q) => q.ru == n);
      const ix = Object.fromEntries(J.pals.map((q, i) => [q.ru, i]));
      const draw = () => {
        const me = ix[p.ru];
        const par = [];
        J.special.filter((s) => s.child == p.ru).forEach((s) => par.push([s.a, s.b, 1]));
        for (const k in J.pairs) if (J.pairs[k] == me) {
          const [i, j] = k.split(",").map(Number);
          if (i != me && j != me) par.push([J.pals[i].ru, J.pals[j].ru, 0]);
        }
        const pop = (n) => {
          const z = by(n);
          if (!z) return 20;
          const w = (X.pals[z.id] || {}).wild;
          return (z.rarity || 5) + (w ? 0 : 6);
        };
        par.sort((a, b) => b[2] - a[2] || pop(a[0]) + pop(a[1]) - pop(b[0]) - pop(b[1]));
        const kids = /* @__PURE__ */ new Map();
        for (const k in J.pairs) {
          const [i, j] = k.split(",").map(Number);
          if (i == me || j == me) {
            const o = i == me ? j : i;
            const c = J.pals[J.pairs[k]].ru;
            if (c != p.ru && !kids.has(c)) kids.set(c, J.pals[o].ru);
          }
        }
        const kk = [...kids.entries()].map(([c, o]) => [by(c), o]).filter((a) => a[0] && a[0].url).sort((a, b) => (b[0].rank || 0) - (a[0].rank || 0)).slice(0, 12);
        const node = (n, cls) => {
          const z = by(n);
          return z ? `<button type="button" class="ux-tn ${cls || ""}" data-id="${z.id}">${U.artHTML(X, z, 64)}<span>${esc(n)}</span></button>` : `<span class="ux-tn">${esc(n)}</span>`;
        };
        const nP = par.length, badge = par.some((x) => x[2]) && nP == 1 ? '<span class="ux-badge gold">\u{1F511} \u0415\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431</span>' : nP && nP <= 6 ? `<span class="ux-badge">\u{1F48E} \u0420\u0435\u0434\u043A\u0430\u044F \u043F\u0430\u0440\u0430: ${nP}</span>` : "";
        tr.innerHTML = `<p class="ux-lead">\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u043B\u044E\u0431\u043E\u0433\u043E \u043F\u0430\u043B\u0430 \u2014 \u043E\u043D \u0441\u0442\u0430\u043D\u0435\u0442 \u0432 \u0446\u0435\u043D\u0442\u0440. \u0421\u043B\u0435\u0432\u0430 \u2014 \u043E\u0442 \u043A\u043E\u0433\u043E \u043E\u043D \u0440\u043E\u0436\u0434\u0430\u0435\u0442\u0441\u044F, \u0441\u043F\u0440\u0430\u0432\u0430 \u2014 \u043A\u043E\u0433\u043E \u043C\u043E\u0436\u043D\u043E \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0441 \u043D\u0438\u043C.</p>
  <div class="ux-tree"><div class="ux-tcol"><div class="ux-h">\u{1F46A} \u0420\u043E\u0434\u0438\u0442\u0435\u043B\u0438 <small>${nP} \u043F\u0430\u0440</small></div>${par.slice(0, 8).map(([a, b, s]) => `<div class="ux-tpair ${s ? "sp" : ""}">${node(a)}<span class="ux-plus">+</span>${node(b)}${s ? '<small class="ux-badge gold">\u043E\u0441\u043E\u0431\u0430\u044F</small>' : ""}</div>`).join("") || '<span class="ux-sub">\u041D\u0435 \u0432\u044B\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0438\u043C\u043A\u0430</span>'}</div>
  <div class="ux-tcen">${node(p.ru, "big")}${badge}<a class="ux-btn ghost" href="${B + p.url}">\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0430\u043B\u0430</a></div>
  <div class="ux-tcol"><div class="ux-h">\u{1F423} \u0414\u0435\u0442\u0438 <small>\u0441 \u043A\u0435\u043C \u2192 \u043A\u0442\u043E</small></div>${kk.map(([c, o]) => `<div class="ux-tpair"><small>+ ${esc(o)} \u2192</small>${node(c.ru)}</div>`).join("")}</div></div>`;
      };
      tr.addEventListener("click", (e) => {
        const b = e.target.closest("[data-id]");
        if (!b) return;
        p = D.pals.find((q) => q.id == b.dataset.id);
        history.replaceState(null, "", "?pal=" + p.id);
        draw();
        tr.scrollIntoView({ behavior: "smooth" });
      });
      draw();
    });
  };
  document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", () => setTimeout(go, 30)) : setTimeout(go, 30);
})();
