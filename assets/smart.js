(function(root) {
  const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`", RU = "\u0439\u0446\u0443\u043A\u0435\u043D\u0433\u0448\u0449\u0437\u0445\u044A\u0444\u044B\u0432\u0430\u043F\u0440\u043E\u043B\u0434\u0436\u044D\u044F\u0447\u0441\u043C\u0438\u0442\u044C\u0431\u044E\u0451";
  const E2R = {}, R2E = {};
  for (let i = 0; i < EN.length; i++) {
    E2R[EN[i]] = RU[i];
    R2E[RU[i]] = EN[i];
  }
  const norm = (s) => (s || "").toLowerCase().replace(/ё/g, "\u0435").replace(/[«»"!?()\-–—:]/g, " ").replace(/\s+/g, " ").trim();
  const END = /(ами|ями|ого|его|ому|ему|ой|ей|ом|ем|ах|ях|ов|ев|ам|ям|ую|юю|ая|яя|ые|ие|ый|ий|а|я|у|ю|ы|и|е|о|ь)$/;
  const stem = (w) => w.length > 3 ? w.replace(END, "") : w;
  const TR = { a: "\u0430", b: "\u0431", v: "\u0432", g: "\u0433", d: "\u0434", e: "\u0435", z: "\u0437", i: "\u0438", y: "\u0438", k: "\u043A", l: "\u043B", m: "\u043C", n: "\u043D", o: "\u043E", p: "\u043F", r: "\u0440", s: "\u0441", t: "\u0442", u: "\u0443", f: "\u0444", h: "\u0445", c: "\u043A", w: "\u0432", x: "\u043A\u0441", j: "\u0434\u0436", q: "\u043A" };
  const DG = [["sch", "\u0449"], ["sh", "\u0448"], ["ch", "\u0447"], ["zh", "\u0436"], ["ts", "\u0446"], ["ya", "\u044F"], ["yu", "\u044E"], ["yo", "\u0435"], ["kh", "\u0445"], ["ph", "\u0444"]];
  function translit(s) {
    for (const [k, v] of DG) s = s.split(k).join(v);
    return [...s].map((c) => TR[c] || c).join("");
  }
  function dl(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 3) return 9;
    const d = [];
    for (let i = 0; i <= m; i++) {
      d[i] = [i];
    }
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      const c = a[i - 1] == b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[m][n];
  }
  const WORKS = [
    [/коп|добыв|добыч|шахт|руд|кам|min/, "\u0414\u043E\u0431\u044B\u0447\u0430"],
    [/руб|дерев|древес|лесоруб|бревн/, "\u0420\u0443\u0431\u043A\u0430 \u0434\u0435\u0440\u0435\u0432\u044C\u0435\u0432"],
    [/разжиг|огн|плав|печ|костр|готов/, "\u0420\u0430\u0437\u0436\u0438\u0433\u0430\u043D\u0438\u0435 \u043E\u0433\u043D\u044F"],
    [/полив|поли/, "\u041F\u043E\u043B\u0438\u0432"],
    [/посев|сажа|посад|семен/, "\u041F\u043E\u0441\u0435\u0432 \u0441\u0435\u043C\u044F\u043D"],
    [/электр|энерг|генер|ток/, "\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u044D\u043D\u0435\u0440\u0433\u0438\u0438"],
    [/ручн|крафт|ремесл|созда/, "\u0420\u0443\u0447\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430"],
    [/сбор|собир|урожа/, "\u0421\u0431\u043E\u0440"],
    [/медиц|лекар|фарма|аптек/, "\u0424\u0430\u0440\u043C\u0430\u0446\u0435\u0432\u0442\u0438\u043A\u0430"],
    [/охлаж|холодил|морози/, "\u041E\u0445\u043B\u0430\u0436\u0434\u0435\u043D\u0438\u0435"],
    [/транспорт|перенос|носи|таска/, "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430"],
    [/ферм|пастб|ранч/, "\u0424\u0435\u0440\u043C\u0435\u0440\u0441\u0442\u0432\u043E"]
  ];
  const ROLE = [[/бо[ейя]|бой|битв|рейд|босс|урон|атак|fight/, "\u0431\u043E\u0435\u0446"], [/рабоч|работ|баз|work/, "\u0440\u0430\u0431\u043E\u0447\u0438\u0439"], [/ездов|верх|маунт|скорост|mount/, "\u0435\u0437\u0434\u043E\u0432\u043E\u0439"]];
  function Core(D) {
    const K = [];
    const add = (k, kind, ref) => {
      k = norm(k);
      if (k) K.push([k, kind, ref]);
    };
    D.pals.forEach((p, i) => {
      add(p.ru, "pal", i);
      add(p.en, "pal", i);
    });
    for (const [s, t] of Object.entries(D.syn || {})) {
      const i = D.pals.findIndex((p) => p.ru == t);
      if (i >= 0) add(s, "pal", i);
    }
    D.bosses.forEach((b, i) => {
      add(b.name.replace(/\(.*?\)/, ""), "boss", i);
      b.name.split(/ и |\s*\(/)[0] && add(b.name.split(/ и /)[0], "bossn", i);
      if (b.place) add(b.place, "boss", i);
    });
    D.items.forEach((t, i) => {
      add(t.ru, "item", i);
      add(t.en, "item", i);
    });
    D.passives.forEach((t, i) => {
      add(t.name, "passive", i);
    });
    const IS = { "\u043F\u0430\u043B\u043B\u0430\u0434\u0438\u0439": "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u043F\u0430\u043B\u0434\u0438\u0443\u043C\u0430", "\u043F\u0430\u043B\u0434\u0438\u0443\u043C": "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u043F\u0430\u043B\u0434\u0438\u0443\u043C\u0430", "\u043F\u0430\u043B\u0430\u0434\u0438\u0439": "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u043F\u0430\u043B\u0434\u0438\u0443\u043C\u0430", "\u0434\u0440\u0435\u0432\u043D\u0438\u0435 \u0434\u0435\u0442\u0430\u043B\u0438": "\u0414\u0435\u0442\u0430\u043B\u044C \u0434\u0440\u0435\u0432\u043D\u0435\u0439 \u0446\u0438\u0432\u0438\u043B\u0438\u0437\u0430\u0446\u0438\u0438", "\u0434\u0440\u0435\u0432\u043D\u044F\u044F \u0434\u0435\u0442\u0430\u043B\u044C": "\u0414\u0435\u0442\u0430\u043B\u044C \u0434\u0440\u0435\u0432\u043D\u0435\u0439 \u0446\u0438\u0432\u0438\u043B\u0438\u0437\u0430\u0446\u0438\u0438", "\u0447\u0438\u043F\u044B": "\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0447\u0438\u043F" };
    for (const [s, t] of Object.entries(IS)) {
      const i = D.items.findIndex((x) => x.ru == t);
      if (i >= 0) add(s, "item", i);
    }
    const VOC = /* @__PURE__ */ new Set();
    K.forEach(([k]) => k.split(" ").forEach((w) => VOC.add(w)));
    "\u043A\u0430\u043A \u0433\u0434\u0435 \u043A\u0442\u043E \u0447\u0442\u043E \u0447\u0435\u043C \u043B\u0443\u0447\u0448\u0435 \u043B\u0443\u0447\u0448\u0438\u0439 \u043B\u0443\u0447\u0448\u0438\u0435 \u043B\u0443\u0447\u0448\u0430\u044F \u0441\u0430\u043C\u044B\u0439 \u0442\u043E\u043F \u0432\u0437\u044F\u0442\u044C \u043D\u0430\u0439\u0442\u0438 \u0434\u043E\u0431\u044B\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0441\u043A\u0440\u0435\u0441\u0442\u0438\u0442\u044C \u0431\u0438\u0442\u044C \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0430 \u0434\u043B\u044F \u0431\u043E\u0435\u0446 \u0440\u0430\u0431\u043E\u0447\u0438\u0439 \u0435\u0437\u0434\u043E\u0432\u043E\u0439 \u043A\u043E\u043F\u0430\u0435\u0442 \u0440\u0443\u0431\u0438\u0442 \u0431\u043E\u0441\u0441 \u0431\u0430\u0448\u043D\u044F \u043F\u0430\u043B \u043F\u0430\u043B\u044B \u0437\u043E\u0438 \u0441\u0435\u0440\u0443 \u0441\u0435\u0440\u0430 \u0431\u044B\u0441\u0442\u0440\u043E \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043A\u0430\u0447\u0430\u0442\u044C\u0441\u044F \u0437\u043E\u043B\u043E\u0442\u043E \u0444\u0430\u0440\u043C\u0438\u0442\u044C \u043F\u043E\u0447\u0435\u043C\u0443 \u0433\u0440\u0443\u0441\u0442\u044F\u0442 \u0431\u0430\u0437\u0430".split(" ").forEach((w) => VOC.add(w));
    D.faq.forEach((f) => norm(f.q).split(" ").forEach((w) => w.length > 2 && VOC.add(w)));
    const VS = new Set([...VOC].map(stem));
    const known = (w) => VOC.has(w) || VS.has(stem(w)) || w.length >= 5 && [...VS].some((v) => v.length >= 5 && v.startsWith(w.slice(0, 5)));
    function fixLayout(q) {
      let ch = false;
      const out = q.split(/(\s+)/).map((t) => {
        if (!t.trim()) return t;
        const l = t.toLowerCase();
        if (/^[a-z\[\];',.`]+$/.test(l)) {
          const c = [...l].map((x) => E2R[x] || x).join("").replace(/[.,]$/, "");
          const cw = norm(c);
          if (!known(l.replace(/\W/g, "")) && (known(cw) || nameHit(cw))) {
            ch = true;
            return c;
          }
        } else if (/^[а-яё]+$/.test(l)) {
          const c = [...l].map((x) => R2E[x] || x).join("");
          if (!known(norm(l)) && /^[a-z]+$/.test(c) && known(c)) {
            ch = true;
            return c;
          }
        }
        return t;
      }).join("");
      return [out, ch];
    }
    function nameHit(w) {
      return w.length >= 4 && K.some(([k]) => k == w || Math.abs(k.length - w.length) <= 2 && k[0] == w[0] && dl(k, w) <= 2);
    }
    function find(q, kinds) {
      const ws = norm(q).split(" ").filter(Boolean);
      let best = null;
      const variants = (s) => {
        const v = [s];
        if (/[a-z]/.test(s)) v.push(translit(s));
        v.push(s.replace(/(.)\1+/g, "$1"));
        v.push(s.split(" ").map(stem).join(" "));
        return [...new Set(v)];
      };
      for (let n = Math.min(4, ws.length); n >= 1; n--) for (let i = 0; i + n <= ws.length; i++) {
        const g = ws.slice(i, i + n).join(" ");
        if (g.length < 3) continue;
        for (const v of variants(g)) for (const [k, kind, ref] of K) {
          if (kinds && !kinds.includes(kind)) continue;
          let s = 0;
          if (k == v) s = 100;
          else if (stem(k) == stem(v) && v.length >= 4) s = 95;
          else if (v.length >= 5 && Math.abs(k.length - v.length) <= 3) {
            const d = dl(k, v);
            if (d == 1) s = 90;
            else if (d == 2 && v.length >= 6) s = 82;
            else if (d == 3 && v.length >= 9) s = 72;
          } else if (v.length >= 5 && k.startsWith(v)) s = 78;
          if (s) {
            s += n * 3;
            if (kind == "bossn") s -= 4;
            if (!best || s > best.s) best = { s, kind: kind == "bossn" ? "boss" : kind, ref, key: k, g };
          }
        }
      }
      return best;
    }
    function suggest(q, k = 3) {
      const v = norm(q);
      const r = [];
      for (const [key, kind, ref] of K) {
        if (kind == "bossn") continue;
        const d = dl(key, v);
        if (d <= Math.max(2, v.length / 3)) r.push([d, kind, ref, key]);
      }
      r.sort((a, b) => a[0] - b[0]);
      const seen = /* @__PURE__ */ new Set();
      return r.filter((x) => {
        const id = x[1] + x[2];
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      }).slice(0, k).map((x) => ({ kind: x[1], ref: x[2], name: label(x[1], x[2]) }));
    }
    const label = (kind, ref) => kind == "pal" ? D.pals[ref].ru : kind == "item" ? D.items[ref].ru : kind == "boss" ? D.bosses[ref].name : D.passives[ref].name;
    function topWork(w, n = 6) {
      return D.pals.map((p) => [p, (p.work.find((x) => x[0] == w) || [0, 0])[1]]).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1] || b[0].atk - a[0].atk).slice(0, n);
    }
    function topEl(e, n = 5) {
      return D.pals.filter((p) => p.el.includes(e)).sort((a, b) => b.atk - a.atk).slice(0, n);
    }
    function breed(t) {
      if (t.up) return { unique: t.up };
      const r = t.rank, pairs = [];
      const ps = D.pals.filter((p) => p.rank && !p.up && /^\d+$/.test(p.no));
      const ranks = ps.map((p) => p.rank).sort((a, b) => a - b);
      for (let i = 0; i < ps.length && pairs.length < 4; i += 7) for (const b of ps) {
        const c = Math.floor((ps[i].rank + b.rank + 1) / 2);
        let nb = ps.reduce((m, p) => Math.abs(p.rank - c) < Math.abs(m.rank - c) ? p : m);
        if (nb === t && ps[i] !== t && b !== t && !pairs.find((x) => x[0] == b || x[1] == b)) {
          pairs.push([ps[i], b]);
          break;
        }
      }
      return { pairs };
    }
    function faq(q) {
      const ws = norm(q).split(" ").filter((w) => w.length > 2).map(stem);
      if (!ws.length) return null;
      let best = null;
      for (const f of D.faq) {
        const fw = new Set(norm(f.q).split(" ").map(stem));
        let s = 0;
        ws.forEach((w) => {
          if (fw.has(w)) s += 1;
          else if ([...fw].some((x) => x.length > 4 && dl(x, w) <= 1)) s += 0.7;
        });
        s = s / Math.sqrt(ws.length * Math.max(3, fw.size) / 2);
        if (!best || s > best.s) best = { s, f };
      }
      return best && best.s >= 0.55 ? best.f : null;
    }
    function answer(raw) {
      let [q, ch] = fixLayout(raw);
      const n = norm(q);
      const res = { q, fixed: ch ? q : null };
      if (n.length < 2) return null;
      const has = (r) => r.test(n);
      const ent = find(n);
      const role = (ROLE.find(([r]) => r.test(n)) || [])[1];
      if (has(/пассив|passive|перк/) && ent && ent.kind == "pal") {
        const p = D.pals[ent.ref];
        return { ...res, type: "passives", pal: p, role: role && p.bp[role] ? role : null };
      }
      if (has(/чем бить|слабост|слаб|против|контр|weak|убить|победить|пройти/) && ent && (ent.kind == "pal" || ent.kind == "boss")) return { ...res, type: "weak", kind: ent.kind, e: ent.kind == "pal" ? D.pals[ent.ref] : D.bosses[ent.ref] };
      if (has(/где|обита|живет|живут|водит|спавн|spawn|лов[ия]т|поймат|встрет|локац|ареал|habitat|where/) && !has(/взять яйц|пассив/) && ent && ent.kind == "pal") return { ...res, type: "where", pal: D.pals[ent.ref] };
      if (has(/вывест|скрест|развед|размнож|breed|получ|завест|яйц/) && ent && ent.kind == "pal") return { ...res, type: "breed", pal: D.pals[ent.ref], b: breed(D.pals[ent.ref]) };
      if (has(/где|взять|найти|добыть|достать|фарм|получ|скрафт|крафт|купить/) && ent && ent.kind == "item") return { ...res, type: "item", item: D.items[ent.ref] };
      if (has(/(ягод|огород|грядк|плантац|урожа|пшениц|томат|салат|посев|посад)/) && !has(/ранч|яйц|шерст|молок/)) return { ...res, type: "plant", works: ["\u041F\u043E\u0441\u0435\u0432 \u0441\u0435\u043C\u044F\u043D", "\u041F\u043E\u043B\u0438\u0432", "\u0421\u0431\u043E\u0440"].map((w2) => [w2, topWork(w2)]) };
      const w = (WORKS.find(([r]) => n.split(" ").some((x) => r.test(x))) || [])[1];
      if (w && (has(/лучш|топ|кто|сильн|best|какой|какие|самый/) || !ent)) return { ...res, type: "work", work: w, top: topWork(w) };
      if (has(/(лучш|быстр|самый|топ).*(ездов|маунт|летающ|скакун|верхов)|(ездов|маунт|летающ).*(лучш|быстр)/)) {
        const fly = has(/лета/);
        return { ...res, type: "mount", fly, top: D.pals.filter((p) => fly ? p.mount == "fly" : p.mount).sort((a, b) => b.sprint - a.sprint).slice(0, 6) };
      }
      if (has(/^(как|почему|зачем|сколько|что|можно|когда|какой|какая)(\s|$)/) && n.split(" ").length >= 3) {
        const f0 = faq(n);
        if (f0) return { ...res, type: "faq", f: f0 };
      }
      if (ent && ent.s >= 78 && !has(/^(как|почему|зачем|сколько|что делать)/) || ent && ent.s >= 95) {
        const o = { ...res, type: ent.kind };
        o.e = ent.kind == "pal" ? D.pals[ent.ref] : ent.kind == "item" ? D.items[ent.ref] : ent.kind == "boss" ? D.bosses[ent.ref] : D.passives[ent.ref];
        return o;
      }
      const f = faq(n);
      if (f) return { ...res, type: "faq", f };
      if (ent && ent.s >= 72) {
        const o = { ...res, type: ent.kind };
        o.e = ent.kind == "pal" ? D.pals[ent.ref] : ent.kind == "item" ? D.items[ent.ref] : ent.kind == "boss" ? D.bosses[ent.ref] : D.passives[ent.ref];
        return o;
      }
      return { ...res, type: "none", dym: suggest(n) };
    }
    return { answer, fixLayout, find, suggest, topWork, topEl, breed, norm, D };
  }
  root.SmartCore = Core;
  if (typeof module !== "undefined") module.exports = Core;
  if (typeof document == "undefined") return;
  const BASE = (document.currentScript && document.currentScript.src || "").replace(/assets\/smart\.js.*$/, "");
  root.PW_BASE = BASE;
  const EL = { "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439": "neutral", "\u041E\u0433\u043E\u043D\u044C": "fire", "\u0412\u043E\u0434\u0430": "water", "\u0422\u0440\u0430\u0432\u0430": "grass", "\u041C\u043E\u043B\u043D\u0438\u044F": "electric", "\u041B\u0451\u0434": "ice", "\u0417\u0435\u043C\u043B\u044F": "ground", "\u0422\u044C\u043C\u0430": "dark", "\u0414\u0440\u0430\u043A\u043E\u043D": "dragon" };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const chip = (e) => `<span class="el el-${EL[e] || "neutral"}">${esc(e)}</span>`;
  root.PW_chip = chip;
  const pl = (p) => p.url ? `<a href="${BASE + p.url}">${esc(p.ru)}</a>` : esc(p.ru);
  const lk = (u, t) => u ? `<a href="${BASE + u}">${esc(t)}</a>` : esc(t);
  let core = null, loading = null;
  const real = () => loading || (loading = fetch(BASE + "assets/search_data.json").then((r) => r.json()).then((d) => {
    core = Core(d);
    root.PW_core = core;
    return d;
  }));
  const NEED = "#gallery,#potd,#cmp,#pwmap,#breed,#mylists,.pal-info,.boss-hero,#bygroup,#ask,#recent,#favs,#home-answer,.pgrid";
  root.PW_load = () => {
    if (root._pwGo) root._pwGo();
    return real();
  };
  root.PW_data = () => {
    if (loading || typeof document == "undefined" || document.querySelector(NEED)) return real();
    return root._pend || (root._pend = new Promise((r) => {
      root._pwGo = () => r(real());
      ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, () => setTimeout(root.PW_load, 1500), { once: true, passive: true }));
    }));
  };
  function render(a) {
    if (!a) return "";
    let h = "";
    const C = core.D;
    const fx = a.fixed ? `<div class="dym">\u041F\u043E\u043D\u044F\u043B \u043A\u0430\u043A: \xAB${esc(a.fixed)}\xBB</div>` : "";
    const mini = (p) => `<div class="mini">${p.thumb ? `<img src="${BASE + p.thumb}" alt="" width="64" height="64" decoding="async">` : ""}<div><h3>${pl(p)} <small>#${esc(p.no)}</small></h3>${p.el.map(chip).join("")} <span>\u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C: ${p.weak.map(chip).join("")}</span></div></div>`;
    switch (a.type) {
      case "pal":
        h = `<div class="sa-k">\u041F\u0430\u043B</div>${mini(a.e)}<div>${a.e.work.map((w) => esc(w[0]) + " " + w[1]).join(" \xB7 ")}</div><div>\u041F\u0430\u0440\u0442\u043D\u0451\u0440\u0441\u043A\u0438\u0439 \u043D\u0430\u0432\u044B\u043A: <b>${esc(a.e.psk)}</b></div><div>\u2764\uFE0F ${a.e.hp} \xB7 \u2694\uFE0F ${a.e.atk} \xB7 \u{1F6E1} ${a.e.def}</div>`;
        break;
      case "where": {
        const p = a.pal, hb = p.hab || {};
        const has = hb.d || hb.n || hb.t || hb.a;
        const R = (hb.rg || []).map((r) => `<span class="rgc">${esc(r)}</span>`).join("");
        const dg = (hb.dg || []).map((x) => `<div class="dgc"><span class="ish">\u{1F573} \u041F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u044C\u0435</span><b>${esc(x)}</b></div>`).join("") + (hb.egg ? `<div class="dgc"><span class="ish">\u{1F95A} \u042F\u0439\u0446\u043E</span><b>${esc(hb.egg)}</b></div>` : "") + (hb.mer ? '<div class="dgc"><span class="ish">\u{1F6D2} \u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446</span><b>\u041F\u0440\u043E\u0434\u0430\u0451\u0442\u0441\u044F \u0443 \u0442\u043E\u0440\u0433\u043E\u0432\u0446\u0430 \u043F\u0430\u043B\u0430\u043C\u0438</b></div>' : "");
        h = `<div class="sa-k">\u0413\u0434\u0435 \u043D\u0430\u0439\u0442\u0438 \xB7 ${esc(p.ru)}</div>${mini(p)}` + (has ? `<div class="habmap" data-pal="${esc(p.id)}" data-d="${hb.d || 0}" data-n="${hb.n || 0}" data-t="${hb.t || 0}" data-a="${hb.a || 0}"><div class="hm-bar"><div class="seg hm-tod"><button data-k="d" class="on">\u2600\uFE0F \u0414\u0435\u043D\u044C ${hb.d || 0}</button><button data-k="n">\u{1F319} \u041D\u043E\u0447\u044C ${hb.n || 0}</button></div>${hb.t && (hb.d || hb.n) ? '<div class="seg hm-w"><button data-w="p" class="on">\u041F\u0430\u043B\u043F\u0430\u0433\u043E\u0441</button><button data-w="t">\u041C\u0438\u0440\u043E\u0432\u043E\u0435 \u0434\u0440\u0435\u0432\u043E</button></div>' : ""}</div><div class="hm-box"><img class="hm-img" alt="" width="1024" height="1024" src="${BASE}assets/wtree/mini_${hb.d || hb.n || !hb.t ? "palpagos" : "tree"}.webp"><div class="hm-dots"></div></div><div class="hm-foot"><span class="hm-c"></span>${hb.lv ? `<span class="lvc">\u0443\u0440. ${hb.lv[0]}\u2013${hb.lv[1]}</span>` : ""}<a class="btn hm-full" href="${BASE}map/?pal=${encodeURIComponent(p.id)}">\u041D\u0430 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u043A\u0430\u0440\u0442\u0435</a></div></div>` : `<div class="nowild"><b>\u0412 \u0434\u0438\u043A\u043E\u0439 \u043F\u0440\u0438\u0440\u043E\u0434\u0435 \u043D\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044F</b><span>\u0422\u043E\u0447\u0435\u043A \u043D\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0439 \u043A\u0430\u0440\u0442\u0435 \u043D\u0435\u0442${dg ? " \u2014 \u0441\u043C\u043E\u0442\u0440\u0438 \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u044C\u044F, \u044F\u0439\u0446\u0430 \u0438\u043B\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435" : " \u2014 \u0432\u044B\u0432\u043E\u0434\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C"}.</span></div>`) + (R ? `<div class="rgcs">${R}</div>` : "") + (dg ? `<div class="dgcs">${dg}</div>` : "");
        setTimeout(() => root.ppHabInit && root.ppHabInit(document), 0);
        break;
      }
      case "passives": {
        const p = a.pal;
        const roles = a.role ? [a.role] : Object.keys(p.bp);
        h = `<div class="sa-k">\u041B\u0443\u0447\u0448\u0438\u0435 \u043F\u0430\u0441\u0441\u0438\u0432\u043A\u0438 \xB7 ${esc(p.ru)}${a.role ? " \xB7 " + esc(a.role) : ""}</div>${mini(p)}` + roles.map((r) => `<div><b>${r == "\u0431\u043E\u0435\u0446" ? "\u2694\uFE0F \u0411\u043E\u0435\u0446" : r == "\u0440\u0430\u0431\u043E\u0447\u0438\u0439" ? "\u{1F6E0} \u0420\u0430\u0431\u043E\u0447\u0438\u0439" : "\u{1F40E} \u0415\u0437\u0434\u043E\u0432\u043E\u0439"}:</b> ${(p.bp[r] || []).slice(0, 4).map(esc).join(", ")}</div>`).join("") + (a.role ? "" : '<div class="dym">\u0423\u0442\u043E\u0447\u043D\u0438 \u0440\u043E\u043B\u044C: \xAB\u0431\u043E\u0435\u0446\xBB, \xAB\u0440\u0430\u0431\u043E\u0447\u0438\u0439\xBB \u0438\u043B\u0438 \xAB\u0435\u0437\u0434\u043E\u0432\u043E\u0439\xBB.</div>');
        break;
      }
      case "weak": {
        const e = a.e;
        h = `<div class="sa-k">\u0427\u0435\u043C \u0431\u0438\u0442\u044C \xB7 ${esc(a.kind == "pal" ? e.ru : e.name)}</div><h3>${a.kind == "pal" ? pl(e) : lk(e.url, e.name)}</h3>${e.el.map(chip).join("")} \u2192 \u0431\u0435\u0439 \u0441\u0442\u0438\u0445\u0438\u0435\u0439 ${e.weak.map(chip).join("")}`;
        if (a.kind == "boss") h += `<div>\u0423\u0440\u043E\u0432\u0435\u043D\u044C ${e.level || "?"} \xB7 HP ${e.hp || "?"}</div><div>\u041E\u0442\u0440\u044F\u0434: ${e.team.map(esc).join(", ")}</div>`;
        e.weak.forEach((w) => h += `<div>\u0421\u0438\u043B\u044C\u043D\u044B\u0435 \u043F\u0430\u043B\u044B (${esc(w)}): ${core.topEl(w).map(pl).join(", ")}</div>`);
        break;
      }
      case "boss": {
        const e = a.e;
        h = `<div class="sa-k">\u0411\u043E\u0441\u0441 \xB7 ${esc(e.kind)}</div><h3>${lk(e.url, e.name)}</h3><div>${esc(e.place)}</div><div>\u0423\u0440\u043E\u0432\u0435\u043D\u044C ${e.level || "?"} \xB7 HP ${e.hp || "?"} \xB7 ${e.el.map(chip).join("")} \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u044C ${e.weak.map(chip).join("")}</div><div>\u041E\u0442\u0440\u044F\u0434: ${e.team.map(esc).join(", ")}</div><div>${esc(e.tactics)}</div>`;
        break;
      }
      case "item":
      case "itemq": {
        const e = a.item || a.e;
        h = `<div class="sa-k">\u0413\u0434\u0435 \u0432\u0437\u044F\u0442\u044C \xB7 ${esc(e.type)}</div><h3>${lk(e.url, e.ru)} <small>${esc(e.en)}</small></h3><ul>${e.src.slice(0, 8).map((s) => `<li>${esc(s)}</li>`).join("") || "<li>\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0431 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0430\u0445</li>"}</ul>`;
        break;
      }
      case "breed": {
        const p = a.pal, b = a.b;
        h = `<div class="sa-k">\u041A\u0430\u043A \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \xB7 ${esc(p.ru)}</div>${mini(p)}` + (b.unique ? `<div>\u041E\u0441\u043E\u0431\u0430\u044F \u043F\u0430\u0440\u0430: <b>${b.unique.map(esc).join(" + ")}</b></div>` : `<ul>${(b.pairs || []).map((x) => `<li>${pl(x[0])} + ${pl(x[1])}</li>`).join("")}</ul><div class="dym">\u041F\u0440\u0438\u043C\u0435\u0440\u044B \u043F\u0430\u0440 \u043F\u043E \u0440\u0430\u043D\u0433\u0443 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F (${p.rank}). \u0415\u0449\u0451 \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0439\u043C\u0430\u0442\u044C${p.egg ? " \u0438\u043B\u0438 \u0432\u044B\u043B\u0443\u043F\u0438\u0442\u044C \u0438\u0437 \u044F\u0439\u0446\u0430 \xAB" + esc(p.egg) + "\xBB" : ""}.</div>`);
        break;
      }
      case "plant":
        h = `<div class="sa-k">\u041E\u0433\u043E\u0440\u043E\u0434 \u0438 \u044F\u0433\u043E\u0434\u044B</div><h3>\u041F\u043E\u0441\u0435\u0432, \u041F\u043E\u043B\u0438\u0432, \u0421\u0431\u043E\u0440</h3><p>\u041F\u043B\u0430\u043D\u0442\u0430\u0446\u0438\u044E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u044E\u0442 \u0442\u0440\u0438 \u0440\u0430\u0431\u043E\u0442\u044B. \xAB\u0424\u0435\u0440\u043C\u0435\u0440\u0441\u0442\u0432\u043E\xBB \u2014 \u044D\u0442\u043E \u0440\u0430\u043D\u0447\u043E, \u043A \u044F\u0433\u043E\u0434\u0430\u043C \u043E\u043D\u043E \u043D\u0435 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F.</p>` + a.works.map(([w, t]) => `<h4>${esc(w)}</h4><ol>${t.slice(0, 5).map(([p, l]) => `<li>${pl(p)} \u2014 \u0443\u0440. ${l} ${p.el.map(chip).join("")}</li>`).join("")}</ol>`).join("");
        break;
      case "work":
        h = `<div class="sa-k">\u041B\u0443\u0447\u0448\u0438\u0435 \u0432 \u0440\u0430\u0431\u043E\u0442\u0435</div><h3>${esc(a.work)}</h3><ol>${a.top.map(([p, l]) => `<li>${pl(p)} \u2014 \u0443\u0440. ${l} ${p.el.map(chip).join("")}</li>`).join("")}</ol>`;
        break;
      case "mount":
        h = `<div class="sa-k">\u0421\u0430\u043C\u044B\u0435 \u0431\u044B\u0441\u0442\u0440\u044B\u0435 ${a.fly ? "\u043B\u0435\u0442\u0430\u044E\u0449\u0438\u0435" : "\u0435\u0437\u0434\u043E\u0432\u044B\u0435"}</div><ol>${a.top.map((p) => `<li>${pl(p)} \u2014 \u0440\u044B\u0432\u043E\u043A ${p.sprint}</li>`).join("")}</ol>`;
        break;
      case "passive":
        h = `<div class="sa-k">\u041F\u0430\u0441\u0441\u0438\u0432\u043A\u0430 \xB7 \u0440\u0430\u043D\u0433 ${esc(a.e.rank)}</div><h3>${lk(a.e.url, a.e.name)} <small>${esc(a.e.en)}</small></h3><div>${esc(a.e.desc)}</div>`;
        break;
      case "faq":
        h = `<div class="sa-k">\u041E\u0442\u0432\u0435\u0442</div><h3>${esc(a.f.q)}</h3><div>${esc(a.f.a)}</div>`;
        break;
      case "none":
        h = a.dym && a.dym.length ? `<div class="dym">\u0412\u044B \u0438\u043C\u0435\u043B\u0438 \u0432 \u0432\u0438\u0434\u0443: ${a.dym.map((d) => `<a data-q="${esc(d.name)}">${esc(d.name)}</a>`).join("")}</div>` : "";
        if (!h) return "";
        break;
    }
    return `<div class="sa">${fx}${h}</div>`;
  }
  function bind(input, out) {
    let t;
    const go = () => {
      const v = input.value;
      if (v.trim().length < 2) {
        out.innerHTML = "";
        return;
      }
      root.PW_data().then(() => {
        out.innerHTML = render(core.answer(v));
        out.querySelectorAll("[data-q]").forEach((a) => a.onclick = () => {
          input.value = a.dataset.q;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          go();
        });
      });
    };
    input.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(go, 180);
    });
    input.addEventListener("focus", () => root.PW_data());
  }
  root.PW_render = render;
  document.addEventListener("DOMContentLoaded", () => {
    const si = document.querySelector(".md-search__input");
    const sw = document.querySelector(".md-search__scrollwrap");
    if (si && sw) {
      const o = document.createElement("div");
      o.id = "smart-answer";
      sw.prepend(o);
      bind(si, o);
    }
    const hq = document.getElementById("home-q");
    if (hq) {
      bind(hq, document.getElementById("home-answer"));
      hq.addEventListener("keydown", (e) => {
        if (e.key == "Enter" && si) {
          si.value = hq.value;
          document.querySelector(".md-search__toggle") || 0;
          const tg = document.getElementById("__search");
          if (tg) {
            tg.checked = true;
          }
          si.focus();
          si.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }
  });
})(typeof window != "undefined" ? window : globalThis);
