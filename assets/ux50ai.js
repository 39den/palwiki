(function() {
  "use strict";
  const PALAI = "https://palguide-ai.palpedia.workers.dev";
  const go = () => {
    const U = window.UX;
    if (!U) return;
    const { B, esc, data, ux, $ } = U;
    const N = (s) => (window.PW_core ? window.PW_core.norm(s) : String(s || "").toLowerCase()).trim();
    const day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const cache = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("ux_ai") || "{}");
      } catch (e) {
        return {};
      }
    })();
    const save = () => {
      try {
        sessionStorage.setItem("ux_ai", JSON.stringify(cache));
      } catch (e) {
      }
    };
    async function askAI(q, ctx) {
      if (localStorage.getItem("palai_off") === day()) return { err: "off" };
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 12e3);
        const r = await fetch(PALAI, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: q.slice(0, 500), ctx: ctx.slice(0, 6e3) }) });
        clearTimeout(t);
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.a) return { a: d.a };
        if (r.status === 429 && d.limit === "day") {
          localStorage.setItem("palai_off", day());
          return { err: "off" };
        }
        if (r.status === 429) return { err: "minute" };
        return { err: "fail" };
      } catch (e) {
        return { err: "fail" };
      }
    }
    function context(D2, X2, q) {
      const n = " " + N(q) + " ";
      const words = n.split(" ").filter((w) => w.length >= 4).map((w) => w.slice(0, Math.max(4, w.length - 2)));
      const hit = (s) => {
        const k = N(s);
        return k && (n.includes(" " + k + " ") || n.includes(" " + k) || k.split(" ").every((w) => w.length >= 4 && words.some((x) => w.startsWith(x))));
      };
      const out = [];
      const pals = D2.pals.filter((p) => hit(p.ru) || hit(p.en)).slice(0, 3);
      pals.forEach((p) => {
        const x = X2 && X2.pals[p.id] || {};
        out.push(`\u041F\u0430\u043B ${p.ru} (\u2116${p.no}). \u0421\u0442\u0438\u0445\u0438\u044F: ${p.el.join(", ")}. \u0421\u043B\u0430\u0431\u043E\u0441\u0442\u044C: ${(p.weak || []).join(", ") || "\u043D\u0435\u0442"}. \u0420\u0430\u0431\u043E\u0442\u0430: ${(p.work || []).map((w) => w[0] + " " + w[1]).join(", ") || "\u043D\u0435\u0442"}. \u041F\u0430\u0440\u0442\u043D\u0451\u0440\u0441\u043A\u0438\u0439 \u043D\u0430\u0432\u044B\u043A: ${p.psk || "\u2014"}. HP ${p.hp}, \u0430\u0442\u0430\u043A\u0430 ${p.atk}, \u0437\u0430\u0449\u0438\u0442\u0430 ${p.def}.${p.mount ? " \u0415\u0437\u0434\u043E\u0432\u043E\u0439" + (p.mount == "fly" ? ", \u043B\u0435\u0442\u0430\u0435\u0442" : "") + "." : ""} ${x.wild ? `\u0412 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435: ${x.lv ? "\u0443\u0440\u043E\u0432\u043D\u0438 " + x.lv.join("\u2013") + ", " : ""}\u0442\u043E\u0447\u0435\u043A \u0434\u043D\u0451\u043C ${(x.sp || [])[0] || "?"}, \u043D\u043E\u0447\u044C\u044E ${(x.sp || [])[1] || "?"}${(x.dng || []).length ? ", \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u044C\u044F: " + x.dng.join(", ") : ""}.` : "\u0412 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043D\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F, \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435."} ${x.egg ? "\u042F\u0439\u0446\u043E: " + x.egg + "." : ""} \u041B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438: ${Object.entries(p.bp || {}).map(([r, l]) => r + " \u2014 " + l.join(", ")).join("; ")}. ${(x.dr || []).length ? "\u0414\u0440\u043E\u043F: " + x.dr.map((d) => d[0] + " " + d[1] + " (" + d[2] + ")").join(", ") + "." : ""}${(x.ad || []).length ? " \u0414\u0440\u043E\u043F \u0430\u043B\u044C\u0444\u044B: " + x.ad.map((d) => d[0] + " (" + d[2] + ")").join(", ") + "." : ""}`);
      });
      (D2.bosses || []).filter((b) => hit(b.name.replace(/\(.*?\)/, "")) || b.pal && hit(b.pal)).slice(0, 3).forEach((b) => out.push(`\u0411\u043E\u0441\u0441 ${b.name}: ${b.kind}, ${b.place || ""}, \u0443\u0440\u043E\u0432\u0435\u043D\u044C ${b.level}, HP ${b.hp || "?"}, \u0441\u0442\u0438\u0445\u0438\u044F ${(b.el || []).join(", ")}, \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C ${(b.weak || []).join(", ")}, \u043E\u0442\u0440\u044F\u0434 \u043F\u0440\u043E\u0442\u0438\u0432: ${(b.team || []).join(", ")}.`));
      (D2.items || []).filter((i) => i.ru && i.ru.length > 3 && hit(i.ru)).slice(0, 3).forEach((i) => out.push(`\u041F\u0440\u0435\u0434\u043C\u0435\u0442 ${i.ru} (${i.type || ""}): ${String(i.desc || "").replace(/\n/g, " ")} \u0413\u0434\u0435 \u0432\u0437\u044F\u0442\u044C: ${(i.src || []).slice(0, 8).join("; ")}.`));
      (D2.passives || []).filter((p) => hit(p.name)).slice(0, 3).forEach((p) => out.push(`\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0430 ${p.name}: ${p.desc}. \u0420\u0430\u043D\u0433 ${p.rank}.${(p.nat || []).length ? " \u0421 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0443: " + p.nat.slice(0, 8).join(", ") + "." : ""}`));
      const qs = new Set(n.split(" ").filter((w) => w.length >= 4).map((w) => w.slice(0, 5)));
      (D2.faq || []).map((f) => [f, N(f.q).split(" ").filter((w) => w.length >= 4 && qs.has(w.slice(0, 5))).length]).filter((a) => a[1] >= 1).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([f]) => out.push(`\u0412\u043E\u043F\u0440\u043E\u0441: ${f.q} \u041E\u0442\u0432\u0435\u0442: ${f.a}`));
      const PL = /(посад|посев|сеять|семен|семя|ягод|грядк|огород|урожа|плантац|пшениц|томат|салат)/.test(n);
      if (PL) out.push("\u041F\u043B\u0430\u043D\u0442\u0430\u0446\u0438\u044E (\u044F\u0433\u043E\u0434\u044B, \u043F\u0448\u0435\u043D\u0438\u0446\u0430, \u0442\u043E\u043C\u0430\u0442\u044B, \u0441\u0430\u043B\u0430\u0442) \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u044E\u0442 \u0442\u0440\u0438 \u0440\u0430\u0431\u043E\u0442\u044B: \xAB\u041F\u043E\u0441\u0435\u0432 \u0441\u0435\u043C\u044F\u043D\xBB \u2014 \u0441\u0430\u0436\u0430\u044E\u0442, \xAB\u041F\u043E\u043B\u0438\u0432\xBB \u2014 \u043F\u043E\u043B\u0438\u0432\u0430\u044E\u0442, \xAB\u0421\u0431\u043E\u0440\xBB \u2014 \u0441\u043E\u0431\u0438\u0440\u0430\u044E\u0442 \u0443\u0440\u043E\u0436\u0430\u0439. \u0420\u0430\u0431\u043E\u0442\u0430 \xAB\u0424\u0435\u0440\u043C\u0435\u0440\u0441\u0442\u0432\u043E\xBB \u2014 \u044D\u0442\u043E \u0440\u0430\u043D\u0447\u043E: \u0442\u0430\u043C \u043F\u0430\u043B\u044B \u0441\u0430\u043C\u0438 \u0434\u0430\u044E\u0442 \u044F\u0439\u0446\u0430, \u0448\u0435\u0440\u0441\u0442\u044C, \u043C\u043E\u043B\u043E\u043A\u043E, \u043C\u0451\u0434, \u043A \u043F\u043B\u0430\u043D\u0442\u0430\u0446\u0438\u0438 \u043E\u043D\u0430 \u043D\u0435 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F.");
      const WK = [["\u041F\u043E\u0441\u0435\u0432 \u0441\u0435\u043C\u044F\u043D", /(посад|посев|сеять|семен|семя|ягод|грядк|огород|урожа|плантац)/], ["\u041F\u043E\u043B\u0438\u0432", /(полив|вод[аыу]|ягод|плантац|урожа)/], ["\u0421\u0431\u043E\u0440", /(сбор|собира|ягод|плантац|урожа)/], ["\u0424\u0435\u0440\u043C\u0435\u0440\u0441\u0442\u0432\u043E", PL ? /^$/ : /(ферм|ранч|яйц|шерст|молок|мёд|мед)/], ["\u0420\u0443\u0431\u043A\u0430 \u0434\u0435\u0440\u0435\u0432\u044C\u0435\u0432", /(рубк|дерев|брёвн|древесин)/], ["\u0414\u043E\u0431\u044B\u0447\u0430", /(добыч|руд|камн|копат|копа)/], ["\u0420\u0443\u0447\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430", /(крафт|создан|ручн|верстак|делат)/], ["\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430", /(перенос|транспорт|таска)/], ["\u0420\u0430\u0437\u0436\u0438\u0433\u0430\u043D\u0438\u0435 \u043E\u0433\u043D\u044F", /(огонь|огня|печ|плав|готов)/], ["\u041E\u0445\u043B\u0430\u0436\u0434\u0435\u043D\u0438\u0435", /(холод|охлажд|морозил)/], ["\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u044D\u043D\u0435\u0440\u0433\u0438\u0438", /(энерг|электр|генератор)/], ["\u0424\u0430\u0440\u043C\u0430\u0446\u0435\u0432\u0442\u0438\u043A\u0430", /(лекарств|медиц|аптек|фармац)/]];
      const early = /(начал|новичк|перв|ранн|старт)/.test(n);
      WK.filter(([w, re]) => re.test(n)).slice(0, 3).forEach(([w]) => {
        let L = D2.pals.filter((p) => (p.work || []).some((x) => x[0] === w)).map((p) => {
          const x = X2 && X2.pals[p.id] || {};
          return { p, l: (p.work.find((x2) => x2[0] === w) || [])[1] || 0, lv: x.lv ? x.lv[0] : 99, wild: x.wild };
        });
        const top = [...L].sort((a, b) => b.l - a.l).slice(0, 6);
        const easy = L.filter((a) => a.wild && a.lv <= 15).sort((a, b) => b.l - a.l || a.lv - b.lv).slice(0, 6);
        const f = (a) => `${a.p.ru} (\u0441\u0438\u043B\u0430 \u0440\u0430\u0431\u043E\u0442\u044B ${a.l}${a.wild && a.lv < 99 ? ", \u043B\u043E\u0432\u0438\u0442\u0441\u044F \u0441 \u0443\u0440\u043E\u0432\u043D\u044F \u0438\u0433\u0440\u043E\u043A\u0430 " + a.lv : ""})`;
        out.push(`\u041B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u043B\u044B \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \xAB${w}\xBB: ${top.map(f).join(", ")}.`);
        if (easy.length) out.push(`\u0414\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \xAB${w}\xBB \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u0438\u0433\u0440\u044B \u043B\u0435\u0433\u043A\u043E \u043F\u043E\u0439\u043C\u0430\u0442\u044C: ${easy.map(f).join(", ")}.`);
      });
      if (X2 && X2.gl) X2.gl.filter((g) => hit(g.t)).slice(0, 2).forEach((g) => out.push(`${g.t} \u2014 ${g.d}`));
      return out.join("\n").slice(0, 6e3);
    }
    const QW = /^(как|где|что|чем|кто|какой|какая|какие|какую|почему|зачем|можно|сколько|когда|стоит|лучше|нужно|надо|если)\b/;
    const isQuestion = (v) => {
      const n = N(v);
      return n.length >= 10 && (n.split(" ").length >= 3 || /\?/.test(v)) && (QW.test(n) || /\?/.test(v) || n.split(" ").length >= 4);
    };
    const clean = (t) => String(t).replace(/\*\*|__|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/https?:\/\/\S+/g, "").replace(/\s*\((источник|source)[^)]*\)/gi, "").trim();
    const render = (t) => {
      const L = clean(t).split(/\n+/).map((s) => s.trim()).filter(Boolean);
      let h = "", ul = false;
      for (const l of L) {
        if (/^[-•*]\s+/.test(l)) {
          if (!ul) {
            h += "<ul>";
            ul = true;
          }
          h += "<li>" + esc(l.replace(/^[-•*]\s+/, "")) + "</li>";
        } else {
          if (ul) {
            h += "</ul>";
            ul = false;
          }
          h += "<p>" + esc(l) + "</p>";
        }
      }
      return h + (ul ? "</ul>" : "");
    };
    let D = null, X = null;
    data().then((d) => D = d);
    ux().then((x) => X = x);
    let pending = null, tmr = null, last = "";
    function card(q, st) {
      const c = document.createElement("div");
      c.className = "sx-card ux-aicard" + (st.wait ? " wait" : "");
      c.dataset.q = q;
      c.setAttribute("aria-live", "polite");
      c.innerHTML = st.a ? `<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">\u2728</span><b>\u0423\u043C\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442</b></div><div class="ux-aib">${render(st.a)}</div>` : st.wait ? `<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">\u2728</span><b>\u0414\u0443\u043C\u0430\u044E \u043D\u0430\u0434 \u043E\u0442\u0432\u0435\u0442\u043E\u043C\u2026</b></div><div class="ux-skel"><i></i><i></i><i style="width:60%"></i></div>` : st.err == "minute" ? `<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">\u23F3</span><b>\u041F\u043E\u0434\u043E\u0436\u0434\u0438 \u043C\u0438\u043D\u0443\u0442\u043A\u0443 \u2014 \u043F\u043E\u043A\u0430 \u0432\u043E\u0442 \u0447\u0442\u043E \u043D\u0430\u0448\u0451\u043B \u0432 \u0431\u0430\u0437\u0435</b></div>` : "";
      return c;
    }
    function place(body, q) {
      const st = cache[N(q)];
      const old = body.querySelector(".ux-aicard");
      if (old && old.dataset.q === q && !old._stale) return;
      old && old.remove();
      if (st && (st.a || st.wait || st.err == "minute")) {
        const c = card(q, st);
        if (!c.innerHTML) return;
        const anchor = body.querySelector(".dym");
        anchor ? anchor.after(c) : body.prepend(c);
      } else if (!st && q.trim().length >= 3 && localStorage.getItem("palai_off") !== day() && body.querySelector(".sx-card.ai")) {
        if (!body.querySelector(".ux-aibtn")) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "sx-c ux-aibtn";
          b.textContent = "\u2728 \u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0443\u043C\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442";
          b.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            run(q, body, true);
          };
          const fu = body.querySelector(".sx-card.ai .sx-fu") || body.querySelector(".sx-card.ai");
          fu && fu.appendChild(b);
        }
      }
    }
    async function run(q, body, force) {
      const k = N(q);
      if (cache[k] && !cache[k].err) return place(body, q);
      if (!D) D = await data();
      if (!X) X = await ux().catch(() => null);
      cache[k] = { wait: 1 };
      place(body, q);
      const loc = [...body.querySelectorAll(".sx-card.ai:not(.ux-aicard)")].map((e) => e.innerText.replace(/✨ Спросить умный ответ/g, "").replace(/🤖 Ответ из базы/g, "").replace(/\s+/g, " ").trim()).filter(Boolean).join("\n").slice(0, 1500);
      let r = await askAI(q, (loc ? "\u0427\u0442\u043E \u043D\u0430\u0448\u0451\u043B \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u043E\u0438\u0441\u043A \u043F\u043E \u0431\u0430\u0437\u0435 (\u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043D\u0435 \u043F\u0440\u043E \u0442\u043E; \u0435\u0441\u043B\u0438 \u043D\u0438\u0436\u0435 \u0435\u0441\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u0442\u043E\u0447\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u044B \u2014 \u043E\u043F\u0438\u0440\u0430\u0439\u0441\u044F \u043D\u0430 \u043D\u0438\u0445): " + loc + "\n" : "") + context(D, X, q));
      if (r.a && /в моей базе этого (пока )?нет|в базе этого нет|нет данных/i.test(r.a.trim().slice(0, 80))) r = { err: "none" };
      cache[k] = r.a ? { a: r.a } : { err: r.err };
      if (r.a) save();
      const inp = document.getElementById("hsq");
      if (inp && N(inp.value) === k) {
        const o = body.querySelector(".ux-aicard");
        if (o) o._stale = 1;
        place(body, q);
      }
    }
    function hook() {
      const sx = document.getElementById("sxp");
      if (!sx || sx.dataset.ai) return;
      sx.dataset.ai = 1;
      const body = sx.querySelector(".sx-body"), inp = document.getElementById("hsq");
      if (!body || !inp) return;
      const check = () => {
        const q = inp.value.trim();
        if (!q) {
          return;
        }
        place(body, q);
        if (q === last) return;
        last = q;
        clearTimeout(tmr);
        const local = body.querySelector(".sx-card.ai, .sx-cmp");
        if (local || !isQuestion(q) || cache[N(q)]) return;
        tmr = setTimeout(() => {
          if (inp.value.trim() === q && !body.querySelector(".sx-card.ai, .sx-cmp")) run(q, body);
        }, 1100);
      };
      new MutationObserver(() => {
        last = "";
        check();
      }).observe(body, { childList: true });
      inp.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          const q = inp.value.trim();
          clearTimeout(tmr);
          setTimeout(() => {
            if (inp.value.trim() === q && isQuestion(q) && !body.querySelector(".sx-card.ai, .sx-cmp") && !cache[N(q)]) run(q, body);
          }, 450);
        }
      });
    }
    new MutationObserver(hook).observe(document.body, { childList: true });
    hook();
    U.askAI = askAI;
    U.aiContext = (q) => context(D, X, q);
  };
  document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", () => setTimeout(go, 80)) : setTimeout(go, 80);
})();
(() => {
  const H = document.documentElement;
  const upd = () => {
    const sx = document.getElementById("sxp");
    const inp = document.getElementById("hsq");
    const open = inp && document.activeElement === inp || sx && !sx.hidden && getComputedStyle(sx).display !== "none" && sx.querySelector(".sx-body") && sx.querySelector(".sx-body").children.length > 0 && sx.getBoundingClientRect().height > 0;
    H.classList.toggle("ux-sxon", !!open);
    const b = document.querySelector(".inst");
    const bh = b && getComputedStyle(b).display !== "none" && !open ? b.getBoundingClientRect().height : 0;
    const v = bh ? Math.round(bh + 16) + "px" : "";
    if (document.body && document.body.style.paddingBottom !== v) document.body.style.paddingBottom = v;
  };
  document.addEventListener("focusin", upd);
  document.addEventListener("input", () => setTimeout(upd, 60));
  document.addEventListener("focusout", () => setTimeout(upd, 60));
  document.addEventListener("click", () => setTimeout(upd, 60));
  const mo = new MutationObserver(() => {
    clearTimeout(mo.t);
    mo.t = setTimeout(upd, 40);
  });
  const start = () => {
    mo.observe(document.body, { childList: true });
    const sx = document.getElementById("sxp");
    sx && mo.observe(sx, { attributes: true, attributeFilter: ["hidden", "class"], childList: true });
    upd();
  };
  document.body ? start() : document.addEventListener("DOMContentLoaded", start);
})();
