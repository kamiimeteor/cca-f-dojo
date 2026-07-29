/* ===== Claude Certified Architect 备考站 =====
 *
 * XSS 说明：本文件用模板字符串构建 UI。所有插值必须满足下面三条之一：
 *   1. 来自 notes.js / questions.js / content.en.js 的作者自有内容，且经过 esc() 或 md()
 *   2. 数值 —— 经 num() 强制转成 Number
 *   3. 白名单常量（LTR、domain id 等）
 * 唯一的外部输入是「导入进度」的 JSON 文件，进入前一律走 sanitizeState()。
 *
 * i18n：t(key, ...args) 取界面文案；笔记与题目走 secView() / qView()，
 * 英文缺失时回退中文并打标记，所以可以增量补翻译。
 */
'use strict';

/* ---------------- store ---------------- */
const KEY = 'ccae.v2';
const DEFAULT_STATE = () => ({
  qstats: {},    // qid -> {seen, ok, no, streak, last}
  wrong: {},     // qid -> {added, streak, times}
  exams: [],     // {ts, score, pass, correct, total, dur, byDom, detail:[{qid,pick}]}
  marks: [],     // 收藏的 qid
  read: [],      // 读完的小节 id
  prefs: { theme: 'light', lang: 'zh' },
});

/* ---------------- 基础工具 ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LTR = ['A', 'B', 'C', 'D', 'E'];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** 数值插值统一走这里：非有限数一律归零，杜绝字符串注入 */
const num = (v, dflt = 0) => (Number.isFinite(+v) ? +v : dflt);

/** 极简行内 markdown —— 先 esc 再还原受控标记，故输出安全 */
function md(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/* 已知 id 白名单 —— 导入的数据只认这些 */
const VALID_Q = new Set(QUESTIONS.map((q) => q.id));
const VALID_SEC = new Set(Object.keys(SECTION_INDEX));
const VALID_DOM = new Set(NOTES.map((d) => d.id));

/** 把任意 JSON 收紧成合法 state：白名单 key + 强制类型 */
function sanitizeState(raw) {
  const S = DEFAULT_STATE();
  if (!raw || typeof raw !== 'object') return S;

  if (raw.qstats && typeof raw.qstats === 'object') {
    for (const [k, v] of Object.entries(raw.qstats)) {
      if (!VALID_Q.has(k) || !v || typeof v !== 'object') continue;
      S.qstats[k] = { seen: num(v.seen), ok: num(v.ok), no: num(v.no), streak: num(v.streak), last: v.last === true };
    }
  }
  if (raw.wrong && typeof raw.wrong === 'object') {
    for (const [k, v] of Object.entries(raw.wrong)) {
      if (!VALID_Q.has(k) || !v || typeof v !== 'object') continue;
      S.wrong[k] = { added: num(v.added, Date.now()), streak: num(v.streak), times: num(v.times) };
    }
  }
  if (Array.isArray(raw.exams)) {
    S.exams = raw.exams.slice(0, 50).map((e) => {
      if (!e || typeof e !== 'object') return null;
      const byDom = {};
      if (e.byDom && typeof e.byDom === 'object') {
        for (const [d, v] of Object.entries(e.byDom)) {
          if (VALID_DOM.has(d) && v && typeof v === 'object') byDom[d] = { n: num(v.n), ok: num(v.ok) };
        }
      }
      const detail = Array.isArray(e.detail)
        ? e.detail.filter((x) => x && VALID_Q.has(x.qid)).map((x) => ({
            qid: x.qid,
            // pick 可能是数字（单选）或数字数组（多选）
            pick: x.pick === null || x.pick === undefined ? null
                : Array.isArray(x.pick) ? x.pick.map((n) => num(n)).filter((n) => n >= 0 && n < 8)
                : num(x.pick, null),
          }))
        : [];
      return { ts: num(e.ts, Date.now()), score: num(e.score), pass: e.pass === true, correct: num(e.correct),
               total: num(e.total), dur: num(e.dur), timeout: e.timeout === true, byDom, detail };
    }).filter(Boolean);
  }
  if (Array.isArray(raw.marks)) S.marks = raw.marks.filter((x) => VALID_Q.has(x));
  if (Array.isArray(raw.read)) S.read = raw.read.filter((x) => VALID_SEC.has(x));
  if (raw.prefs && typeof raw.prefs === 'object') {
    S.prefs.theme = raw.prefs.theme === 'dark' ? 'dark' : 'light';
    S.prefs.lang = raw.prefs.lang === 'en' ? 'en' : 'zh';
  }
  return S;
}

let S = (() => {
  try { return sanitizeState(JSON.parse(localStorage.getItem(KEY) || 'null')); }
  catch { return DEFAULT_STATE(); }
})();
function save() {
  localStorage.setItem(KEY, JSON.stringify(S));
  // 登录了就顺带排一次云端推送（防抖）。sync.js 没加载时这里是 no-op，
  // 未登录用户完全走不到网络。
  if (typeof schedulePush === 'function') schedulePush();
}

/** 字段级合并两份进度，谁都不丢。
 *  两台设备各刷各的时用「后写覆盖」会吃掉数据，所以逐字段取并集/最大值。
 *  以后接云同步复用同一个函数。 */
function mergeState(a, b) {
  const out = DEFAULT_STATE();

  // 做题统计：次数取大；last 采信 seen 更多的那侧（它更新）
  for (const id of new Set([...Object.keys(a.qstats), ...Object.keys(b.qstats)])) {
    const x = a.qstats[id], y = b.qstats[id];
    if (!x || !y) { out.qstats[id] = { ...(x || y) }; continue; }
    out.qstats[id] = {
      seen: Math.max(x.seen, y.seen),
      ok: Math.max(x.ok, y.ok),
      no: Math.max(x.no, y.no),
      streak: Math.max(x.streak, y.streak),
      last: (x.seen >= y.seen ? x : y).last,
    };
  }

  // 错题：并集。streak 取小 —— 宁可多做两遍，也不要提前毕业
  for (const id of new Set([...Object.keys(a.wrong), ...Object.keys(b.wrong)])) {
    const x = a.wrong[id], y = b.wrong[id];
    if (!x || !y) { out.wrong[id] = { ...(x || y) }; continue; }
    out.wrong[id] = {
      added: Math.min(x.added, y.added),
      streak: Math.min(x.streak, y.streak),
      times: Math.max(x.times, y.times),
    };
  }

  // 模考：按时间戳去重，倒序留最新 50 条
  const seenTs = new Set();
  out.exams = [...a.exams, ...b.exams]
    .sort((p, q) => q.ts - p.ts)
    .filter((e) => (seenTs.has(e.ts) ? false : (seenTs.add(e.ts), true)))
    .slice(0, 50);

  out.marks = [...new Set([...a.marks, ...b.marks])];
  out.read = [...new Set([...a.read, ...b.read])];
  out.prefs = { ...a.prefs, ...b.prefs };   // b 视作较新的一侧
  return out;
}

/** 进度摘要，用于文件名与导入前对比 */
function digest(st) {
  let seen = 0, attempts = 0, right = 0;
  for (const id of Object.keys(st.qstats)) {
    const v = st.qstats[id];
    if (!v.seen) continue;
    seen++; attempts += v.seen; right += v.ok;
  }
  return {
    seen, rate: pct(right, attempts),
    wrong: Object.keys(st.wrong).length,
    read: st.read.length,
    exams: st.exams.length,
  };
}

/** cca-f-dojo-progress-2026-07-28-76q-72pct.json */
function progressFilename(st) {
  const d = digest(st);
  const day = new Date().toISOString().slice(0, 10);
  return `cca-f-dojo-progress-${day}-${d.seen}q-${d.rate}pct.json`;
}

/* ---------------- i18n ---------------- */
const LANG = () => S.prefs.lang;
/** 取界面文案；{0} {1} 按参数顺序替换。缺失的 key 回退中文。 */
function t(key, ...args) {
  let s = I18N[LANG()]?.[key] ?? I18N.zh[key] ?? key;
  args.forEach((v, i) => { s = s.split('{' + i + '}').join(v); });
  return s;
}
const scenarioName = (code) => (LANG() === 'en' ? SCENARIOS_EN[code] : SCENARIOS[code]) || code;
/** EXAM_META 里需要翻译的自由文本 */
const meta = (k) => (LANG() === 'en' && EXAM_META_EN[k] !== undefined ? EXAM_META_EN[k] : EXAM_META[k]);

/** 小节视图：英文缺失时回退中文，并打 _fallback 供界面提示 */
function secView(sec) {
  if (LANG() === 'zh') return sec;
  const en = CONTENT_EN.sections[sec.id];
  if (!en) return { ...sec, _fallback: true };
  const blocks = sec.blocks.map((b, i) => {
    const e = en.blocks?.[i];
    if (!e) return b;
    return {
      ...b,
      ...(e.v !== undefined ? { v: e.v } : {}),
      ...(e.title !== undefined ? { title: e.title } : {}),
      ...(e.head !== undefined ? { head: e.head } : {}),
      ...(e.rows !== undefined ? { rows: e.rows } : {}),
    };
  });
  return { ...sec, title: en.title ?? sec.title, tag: en.tag ?? sec.tag, blocks };
}

/** 题目视图：英文缺失时整题回退中文 */
function qView(q) {
  if (LANG() === 'zh') return q;
  const en = CONTENT_EN.questions[q.id];
  if (!en) return { ...q, _fallback: true };
  // w 不做跨语言混用：英文侧没写就当没有
  return { ...q, q: en.q, o: en.o ?? q.o, e: en.e ?? q.e, w: en.w || {} };
}

/** Domain 视图 */
function domView(d) {
  if (LANG() === 'zh') return d;
  const en = CONTENT_EN.domains[d.id];
  return en ? { ...d, ...en } : d;
}

/* ---------------- 领域工具 ---------------- */
const byId = (id) => QUESTIONS.find((q) => q.id === id);
const domOf = (id) => NOTES.find((d) => d.id === id);
const secOf = (id) => SECTION_INDEX[id]?.section;
const secTitle = (id) => { const s = secOf(id); return s ? secView(s).title : ''; };

/* 笔记里带补充标签的小节 */
const isExtra = (sec) => /官方新增|笔记缺失|官方 5\.|Newly|Missing|Official 5\./.test(sec.tag || '');

/* ---- 多选题支持（官方题型含 multiple-response）---- */
const isMulti = (q) => q.multi === true;
const normPick = (p) =>
  p === null || p === undefined ? null : JSON.stringify([].concat(p).map(Number).sort((x, y) => x - y));
const isCorrect = (q, pick) => normPick(pick) !== null && normPick(pick) === normPick(q.a);
const answerLetters = (q) => [].concat(q.a).map((i) => LTR[i]).join(LANG() === 'en' ? ', ' : '、');
const pickCount = (q) => [].concat(q.a).length;
const answerHtml = (q) => [].concat(q.a).map((i) => `<b>${esc(LTR[i])}.</b> ${md(q.o[i])}`).join('<br>');

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const fmtTime = (ms) => {
  const s = Math.max(0, Math.round(num(ms) / 1000));
  return `${String((s / 60) | 0).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
const fmtDate = (ts) => new Date(num(ts)).toLocaleString(LANG() === 'en' ? 'en-GB' : 'zh-CN',
  { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/** 记录一次作答；错题连对 2 次自动毕业 */
function record(qid, correct) {
  const st = (S.qstats[qid] ||= { seen: 0, ok: 0, no: 0, streak: 0, last: null });
  st.seen++; st.last = correct;
  if (correct) { st.ok++; st.streak++; } else { st.no++; st.streak = 0; }

  if (!correct) {
    const w = (S.wrong[qid] ||= { added: Date.now(), streak: 0, times: 0 });
    w.times++; w.streak = 0;
  } else if (S.wrong[qid]) {
    S.wrong[qid].streak++;
    if (S.wrong[qid].streak >= 2) delete S.wrong[qid];
  }
  save();
}

function domainStats(did) {
  const qs = QUESTIONS.filter((q) => q.d === did);
  let seen = 0, ok = 0;
  qs.forEach((q) => { const st = S.qstats[q.id]; if (st?.seen) { seen++; if (st.last) ok++; } });
  return { total: qs.length, seen, ok, rate: pct(ok, seen) };
}

function overall() {
  let seen = 0, attempts = 0, right = 0;
  QUESTIONS.forEach((q) => {
    const st = S.qstats[q.id];
    if (!st?.seen) return;
    seen++; attempts += st.seen; right += st.ok;
  });
  return { seen, attempts, right, total: QUESTIONS.length, rate: pct(right, attempts) };
}

const totalSections = () => NOTES.reduce((a, d) => a + d.sections.length, 0);
const bodySections = () => NOTES.reduce((a, d) => a + (d.weight ? d.sections.length : 0), 0);
const totalTaskStatements = () => NOTES.reduce((a, d) => a + d.taskCount, 0);

/* ---------------- notes 渲染 ---------------- */
function renderBlocks(blocks) {
  return blocks.map((b) => {
    switch (b.t) {
      case 'p': return `<p>${md(b.v)}</p>`;
      case 'list': return (b.title ? `<h3>${md(b.title)}</h3>` : '') +
        `<ul>${b.v.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`;
      case 'olist': return (b.title ? `<h3>${md(b.title)}</h3>` : '') +
        `<ol>${b.v.map((x) => `<li>${md(x)}</li>`).join('')}</ol>`;
      case 'table': return `<table><thead><tr>${b.head.map((h) => `<th>${md(h)}</th>`).join('')}</tr></thead>` +
        `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      case 'code': return `<pre>${esc(b.v)}</pre>`;
      case 'tree': return `<div class="box tree"><b class="bt">${md(b.title || 'Decision tree')}</b><pre>${esc(b.v)}</pre></div>`;
      case 'key': return box('key', b.title, b.v);
      case 'warn': return box('warn', b.title, b.v);
      case 'tip': return box('tip', b.title, b.v);
      case 'mnemonic': return box('mn', b.title || (LANG() === 'en' ? 'Quick recall' : '速记'), b.v);
      default: return '';
    }
  }).join('');
}
function box(kind, title, v) {
  const body = Array.isArray(v)
    ? `<ul>${v.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`
    : `<p style="margin:0">${md(v)}</p>`;
  return `<div class="box ${kind}">${title ? `<b class="bt">${esc(title)}</b>` : ''}${body}</div>`;
}

/* ---------------- router ---------------- */
const routes = {};
const go = (hash) => { location.hash = hash; };

function router() {
  const raw = (location.hash || '#/').slice(1);
  const [path, ...rest] = raw.split('/').filter(Boolean);
  const view = routes[path || 'home'] || routes.home;
  $$('#nav a').forEach((a) => {
    const h = a.getAttribute('href').slice(1).split('/').filter(Boolean)[0] || 'home';
    a.classList.toggle('on', h === (path || 'home'));
  });
  const app = $('#app');
  app.innerHTML = '';
  app.className = '';
  view(rest);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', router);

/** 顶栏 / 页脚的静态文案随语言重绘 */
function paintChrome() {
  $('#navHome').textContent = t('nav_home');
  $('#navNotes').textContent = t('nav_notes');
  $('#navPractice').textContent = t('nav_practice');
  $('#navWrongLabel').textContent = t('nav_wrong');
  $('#navExam').textContent = t('nav_exam');
  $('#brandSub').textContent = t('brand_sub');
  $('#footPrivacy').textContent = t('foot_privacy');
  $('#progBtn').textContent = t('prog_open');
  $('#progTitle').textContent = t('prog_title');
  $('#progClose').setAttribute('aria-label', t('prog_close'));
  $('#privacyLink').textContent = t('nav_privacy');
  if (typeof paintCloudBadge === 'function') paintCloudBadge();
  $('#themeBtn').title = t('theme_toggle');
  // 按钮显示"当前"语言，下拉里勾出当前项
  $('#langCur').textContent = t('lang_name');
  $$('.lang-opt').forEach((o) => {
    const on = o.dataset.lang === LANG();
    o.classList.toggle('on', on);
    o.setAttribute('aria-selected', String(on));
  });
  document.documentElement.lang = LANG() === 'en' ? 'en' : 'zh-CN';
}

/* 语言下拉的开关 */
function setLangMenu(open) {
  $('#langMenu').hidden = !open;
  $('#langBtn').setAttribute('aria-expanded', String(open));
}

/* ================================================================
   VIEW: 总览
   ================================================================ */
routes.home = () => {
  const o = overall();
  const wrongN = Object.keys(S.wrong).length;

  $('#app').innerHTML = `
    <h1>${esc(t('home_h1'))}</h1>
    <p class="sub">${esc(t('home_sub', EXAM_META.title, EXAM_META.items, EXAM_META.minutes,
      EXAM_META.passScore, EXAM_META.fullScore))}</p>

    <div class="grid g4">
      <div class="tile"><div class="k">${esc(t('tile_coverage'))}</div>
        <div class="v">${num(o.seen)}<small> / ${num(o.total)}</small></div>
        <div class="n">${esc(t('tile_coverage_n'))}</div></div>
      <div class="tile"><div class="k">${esc(t('tile_accuracy'))}</div>
        <div class="v">${num(o.rate)}<small>%</small></div>
        <div class="n">${esc(t('tile_accuracy_n', o.right, o.attempts))}</div></div>
      <div class="tile"><div class="k">${esc(t('tile_wrong'))}</div>
        <div class="v" style="color:${wrongN ? 'var(--bad)' : 'var(--ok)'}">${num(wrongN)}</div>
        <div class="n">${esc(t('tile_wrong_n'))}</div></div>
      <div class="tile"><div class="k">${esc(t('tile_notes'))}</div>
        <div class="v">${num(S.read.length)}<small> / ${num(totalSections())}</small></div>
        <div class="n">${esc(t('tile_notes_n'))}</div></div>
    </div>

    <div class="row" style="margin-top:20px">
      <a class="btn primary" href="#/exam">${esc(t('btn_start_exam'))}</a>
      <a class="btn" href="#/practice">${esc(t('btn_practice'))}</a>
      ${wrongN ? `<a class="btn" href="#/wrong">${esc(t('btn_attack_wrong', wrongN))}</a>` : ''}
      <a class="btn ghost" href="#/notes">${esc(t('btn_browse_notes'))}</a>
    </div>

    <h2>${esc(t('home_domains'))}</h2>
    <div class="card">
      ${NOTES.filter((d) => d.weight > 0).map((d) => {
        const dv = domView(d), s = domainStats(d.id), cov = pct(s.seen, s.total);
        return `<div class="dom-row">
          <div class="nm"><b>${esc(dv.title)} <span class="tag ${esc(d.id)}">${num(d.weight)}%</span></b>
            <span>${esc(t('dom_meta', dv.zh, d.taskCount, d.sections.length, s.total))}</span></div>
          <div class="meter ${cov >= 100 ? 'ok' : ''}"><i style="width:${num(cov)}%"></i></div>
          <div class="pc">${num(s.seen)} / ${num(s.total)}<br>
            <span style="font-size:11px;color:var(--ink-3)">${
              s.seen ? esc(t('dom_accuracy', s.rate)) : esc(t('dom_notstarted'))}</span></div>
        </div>`;
      }).join('')}
    </div>

    <h2>${esc(t('home_cheatsheet'))}</h2>
    <div class="box mn"><b class="bt">${esc(t('mnemonic_title'))}</b><p style="margin:0">${md(meta('mnemonic'))}</p></div>
    <div class="box key"><b class="bt">${esc(t('scenarios_title', meta('scenarioNote')))}</b>
      <div class="chips" style="margin-top:6px">${
        meta('scenarios').map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>

    <h2>${esc(t('home_history'))}</h2>
    ${S.exams.length ? `<div class="card" style="padding:6px 16px"><table class="hist">
      <thead><tr><th>${esc(t('hist_time'))}</th><th>${esc(t('hist_score'))}</th><th>${esc(t('hist_correct'))}</th>
        <th>${esc(t('hist_dur'))}</th><th>${esc(t('hist_dom'))}</th><th></th></tr></thead>
      <tbody>${S.exams.slice(0, 12).map((e, i) => `<tr>
        <td>${esc(fmtDate(e.ts))}</td>
        <td class="s ${e.pass ? 'pass' : 'fail'}">${num(e.score)}${e.pass ? ' ✓' : ''}</td>
        <td>${num(e.correct)}/${num(e.total)}</td>
        <td>${esc(fmtTime(e.dur))}</td>
        <td style="font-size:12px;color:var(--ink-2)">${
          Object.entries(e.byDom).map(([d, v]) => `${esc(d.toUpperCase())} ${pct(v.ok, v.n)}%`).join(' · ')}</td>
        <td><button class="link-btn" data-review="${num(i)}">${esc(t('hist_review'))}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : `<div class="empty"><div class="em">◇</div>${esc(t('home_nohistory'))}</div>`}
  `;

  $$('[data-review]').forEach((b) => { b.onclick = () => go('/exam/review/' + num(b.dataset.review)); });
};

/* ================================================================
   VIEW: 复习笔记
   ================================================================ */
routes.notes = (rest) => {
  const want = rest.length ? decodeURIComponent(rest.join('/')) : NOTES[0].sections[0].id;
  const hit = SECTION_INDEX[want] || SECTION_INDEX[NOTES[0].sections[0].id];
  const sec = secView(hit.section);
  const dom = domView(domOf(hit.domainId));
  const nQ = QUESTIONS.filter((q) => q.s === sec.id).length;
  const isRead = S.read.includes(sec.id);

  $('#app').className = 'wide';
  $('#app').innerHTML = `<div class="notes-wrap">
    <aside class="toc">
      <input id="tocSearch" placeholder="${esc(t('notes_search'))}" autocomplete="off">
      <div id="tocList"></div>
    </aside>
    <section>
      <div class="note-head">
        <span class="tag ${esc(dom.id)}">${esc(dom.title)}${dom.weight ? ' · ' + num(dom.weight) + '%' : ''}</span>
        ${sec.tag ? `<span class="tag">${esc(sec.tag)}</span>` : ''}
        ${sec._fallback ? `<span class="tag fb">${esc(t('fallback_zh'))}</span>` : ''}
      </div>
      <h1>${esc(sec.id)} ${esc(sec.title)}</h1>
      <div class="note-body">${renderBlocks(sec.blocks)}</div>
      <div class="row" style="margin-top:30px;padding-top:18px;border-top:1px solid var(--line)">
        <button class="btn ${isRead ? '' : 'primary'}" id="readBtn">${
          esc(isRead ? t('notes_marked') : t('notes_mark_read'))}</button>
        ${nQ ? `<a class="btn" href="#/practice/sec/${encodeURIComponent(sec.id)}">${
          esc(t('notes_practice_n', nQ))}</a>` : ''}
        <span class="spacer"></span>
        <span id="prevNext" class="row"></span>
      </div>
    </section>
  </div>`;

  const drawToc = (filter = '') => {
    const f = filter.trim().toLowerCase();
    const html = NOTES.map((d) => {
      const dv = domView(d);
      const secs = d.sections.filter((s) => {
        if (!f) return true;
        const v = secView(s);
        return (v.id + ' ' + v.title + ' ' + JSON.stringify(v.blocks)).toLowerCase().includes(f);
      });
      if (!secs.length) return '';
      return `<div class="toc-dom"><b>${esc(dv.title)}${d.weight ? ' · ' + num(d.weight) + '%' : ''}</b>
        ${secs.map((s) => { const v = secView(s); return `<a href="#/notes/${encodeURIComponent(s.id)}"
          class="${s.id === sec.id ? 'on' : ''} ${S.read.includes(s.id) ? 'done' : ''}"
          ><span class="num">${esc(v.id)}</span><span>${esc(v.title)}${
            isExtra(v) ? `<span class="ext" title="${esc(v.tag)}">＋</span>` : ''
          }</span></a>`; }).join('')}
      </div>`;
    }).join('');
    $('#tocList').innerHTML = html || `<p style="color:var(--ink-3);font-size:13px">${esc(t('notes_nomatch'))}</p>`;
  };
  drawToc();
  $('#tocSearch').oninput = (e) => drawToc(e.target.value);

  const flat = NOTES.flatMap((d) => d.sections.map((s) => s.id));
  const i = flat.indexOf(sec.id);
  $('#prevNext').innerHTML =
    (i > 0 ? `<a class="btn sm ghost" href="#/notes/${encodeURIComponent(flat[i - 1])}">← ${esc(flat[i - 1])}</a>` : '') +
    (i < flat.length - 1 ? `<a class="btn sm ghost" href="#/notes/${encodeURIComponent(flat[i + 1])}">${esc(flat[i + 1])} →</a>` : '');

  $('#readBtn').onclick = () => {
    const k = S.read.indexOf(sec.id);
    if (k >= 0) S.read.splice(k, 1); else S.read.push(sec.id);
    save(); router();
  };
};

/* ================================================================
   VIEW: 隐私政策
   ================================================================ */
routes.privacy = () => {
  const blocks = PRIVACY[LANG()] || PRIVACY.zh;
  $('#app').innerHTML = `
    <h1>${esc(t('priv_title'))}</h1>
    <p class="sub">${esc(t('priv_updated', PRIVACY_UPDATED))}</p>
    <div class="note-body" style="max-width:760px">
      ${blocks.map((b) => {
        if (b.t === 'h') return `<h2>${esc(b.v)}</h2>`;
        if (b.t === 'list') return `<ul>${b.v.map((x) => `<li>${mdLinks(x)}</li>`).join('')}</ul>`;
        if (b.t === 'table') return `<table><thead><tr>${
          b.head.map((h) => `<th>${md(h)}</th>`).join('')}</tr></thead><tbody>${
          b.rows.map((r) => `<tr>${r.map((c) => `<td>${mdLinks(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        return `<p>${mdLinks(b.v)}</p>`;
      }).join('')}
    </div>
    <div class="row" style="margin-top:30px;padding-top:18px;border-top:1px solid var(--line)">
      <a class="btn ghost" href="#/">${esc(t('exam_back_home'))}</a>
    </div>`;
};

/** md() 之上再支持 <https://…> 自动链接。链接只允许 http(s)，防止 javascript: 之类。 */
function mdLinks(s) {
  return md(s).replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g,
    (_, url) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>`);
}

/* ================================================================
   共享：单题卡片 + 判分反馈
   ================================================================ */
function questionCard(q, opts = {}) {
  const dom = domView(domOf(q.d));
  const st = S.qstats[q.id];
  return `
    <div class="q-meta">
      ${opts.counter ? `<span>${esc(opts.counter)}</span><span>·</span>` : ''}
      <span class="tag ${esc(q.d)}">${esc(dom.title.split(' ')[0])} ${num(domOf(q.d).weight)}%</span>
      <span class="tag q">${esc(q.s)}</span>
      <span class="tag q">${esc(scenarioName(q.sc))}</span>
      <span class="tag q">${'★'.repeat(num(q.diff, 1))}</span>
      ${isMulti(q) ? `<span class="tag multi">${esc(t('q_multi', pickCount(q)))}</span>` : ''}
      ${q._fallback ? `<span class="tag fb">${esc(t('fallback_zh'))}</span>` : ''}
      ${st?.seen ? `<span>${esc(t('q_seen', st.seen, st.ok))}</span>` : ''}
      <span class="spacer"></span>
      <button class="link-btn" data-mark="${esc(q.id)}">${esc(S.marks.includes(q.id) ? t('q_marked') : t('q_mark'))}</button>
    </div>
    <p class="q-stem">${md(q.q)}</p>
    <div class="opts" id="opts">
      ${q.o.map((x, i) => `<button class="opt" data-i="${num(i)}">
        <span class="ltr">${esc(LTR[i])}</span><span class="ot">${md(x)}</span></button>`).join('')}
    </div>
    ${isMulti(q) ? `<div class="row" style="margin-top:12px">
      <button class="btn primary" id="submitMulti" disabled>${esc(t('q_submit_multi'))}</button>
      <span style="font-size:13px;color:var(--ink-3)" id="pickHint">${esc(t('q_picked', 0, pickCount(q)))}</span>
    </div>` : ''}
    <div id="verdict"></div>`;
}

function revealAnswer(q, picked, root) {
  const correct = isCorrect(q, picked);
  const ansSet = new Set([].concat(q.a));
  const pickSet = new Set(picked === null || picked === undefined ? [] : [].concat(picked));
  $$('.opt', root).forEach((b) => {
    const i = +b.dataset.i;
    b.disabled = true;
    b.classList.remove('sel');
    if (ansSet.has(i)) b.classList.add('right');
    else if (pickSet.has(i)) b.classList.add('wrong');
    if (!ansSet.has(i) && q.w && q.w[i]) {
      b.querySelector('.ot').insertAdjacentHTML('beforeend', `<span class="why">✗ ${md(q.w[i])}</span>`);
    }
  });
  const sm = $('#submitMulti', root);
  if (sm) sm.closest('.row').remove();
  $('#verdict', root).innerHTML = `
    <div class="verdict ${correct ? 'good' : 'bad'}">
      <div class="vh">${esc(correct ? t('q_right') : t('q_wrong', answerLetters(q)))}</div>
      <p>${md(q.e)}</p>
      <div class="row">
        <a class="btn sm" href="#/notes/${encodeURIComponent(q.s)}">${esc(t('q_back_to_note', q.s, secTitle(q.s)))}</a>
      </div>
    </div>`;
  return correct;
}

function bindMark(root) {
  const b = $('[data-mark]', root);
  if (!b) return;
  b.onclick = () => {
    const id = b.dataset.mark, i = S.marks.indexOf(id);
    if (i >= 0) S.marks.splice(i, 1); else S.marks.push(id);
    save();
    b.textContent = S.marks.includes(id) ? t('q_marked') : t('q_mark');
  };
}

/* ================================================================
   VIEW: 刷题
   ================================================================ */
const PRACTICE = { list: [], i: 0, results: [], label: '' };
const isWeak = (q) => { const st = S.qstats[q.id]; return !!st?.seen && (st.last === false || st.ok / st.seen < 0.7); };

routes.practice = (rest) => {
  if (!rest.length) return practiceMenu();
  const [mode, arg] = rest;
  let list = [], label = '';

  if (mode === 'go') return practiceRun();
  else if (mode === 'dom')  { if (!VALID_DOM.has(arg)) return go('/practice');
                              list = QUESTIONS.filter((q) => q.d === arg); label = domView(domOf(arg)).title; }
  else if (mode === 'sec')  { const id = decodeURIComponent(arg || '');
                              if (!VALID_SEC.has(id)) return go('/practice');
                              list = QUESTIONS.filter((q) => q.s === id); label = `${id} ${secTitle(id)}`; }
  else if (mode === 'all')  { list = [...QUESTIONS]; label = t('practice_all'); }
  else if (mode === 'new')  { list = QUESTIONS.filter((q) => !S.qstats[q.id]?.seen); label = t('practice_new'); }
  else if (mode === 'weak') { list = QUESTIONS.filter(isWeak); label = t('practice_weak'); }
  else if (mode === 'mark') { list = QUESTIONS.filter((q) => S.marks.includes(q.id)); label = t('practice_marks'); }
  /* 进阶训练：走各自的引擎，不经过 practiceRun，常规刷题流程完全不受影响 */
  else if (mode === 'blind')  return blindStart();
  else if (mode === 'degree') return degreeStart();
  else return go('/practice');

  if (!list.length) {
    $('#app').innerHTML = `<h1>${esc(label)}</h1>
      <div class="empty"><div class="em">◇</div>${esc(t('practice_empty'))}
        <div class="row" style="justify-content:center;margin-top:16px">
          <a class="btn" href="#/practice">${esc(t('practice_back'))}</a></div></div>`;
    return;
  }
  PRACTICE.list = shuffle(list); PRACTICE.i = 0; PRACTICE.results = []; PRACTICE.label = label;
  practiceRun();
};

function practiceMenu() {
  const newN = QUESTIONS.filter((q) => !S.qstats[q.id]?.seen).length;
  const weakN = QUESTIONS.filter(isWeak).length;

  $('#app').innerHTML = `
    <h1>${esc(t('practice_h1'))}</h1>
    <p class="sub">${esc(t('practice_sub'))}</p>

    <div class="grid g3">
      <a class="card" href="#/practice/all" style="text-decoration:none">
        <b>${esc(t('practice_all'))}</b><p class="sub" style="margin:6px 0 0">${esc(t('practice_all_n', QUESTIONS.length))}</p></a>
      <a class="card" href="#/practice/new" style="text-decoration:none">
        <b>${esc(t('practice_new'))}</b><p class="sub" style="margin:6px 0 0">${esc(t('practice_new_n', newN))}</p></a>
      <a class="card" href="#/practice/weak" style="text-decoration:none">
        <b>${esc(t('practice_weak'))}</b><p class="sub" style="margin:6px 0 0">${esc(t('practice_weak_n', weakN))}</p></a>
    </div>

    <h2>${esc(t('practice_by_domain'))}</h2>
    <div class="grid g2">
      ${NOTES.filter((d) => d.weight > 0).map((d) => {
        const dv = domView(d), s = domainStats(d.id), cov = pct(s.seen, s.total);
        return `<a class="card" href="#/practice/dom/${encodeURIComponent(d.id)}" style="text-decoration:none">
          <div class="row"><b>${esc(dv.title)}</b><span class="spacer"></span>
            <span class="tag ${esc(d.id)}">${num(d.weight)}%</span></div>
          <p class="sub" style="margin:6px 0 8px">${esc(t('practice_dom_n', s.seen, s.total))}${
            s.seen ? esc(t('practice_dom_rate', s.rate)) : ''}</p>
          <div class="meter ${cov >= 100 ? 'ok' : ''}"><i style="width:${num(cov)}%"></i></div></a>`;
      }).join('')}
    </div>

    <div class="adv-sep"></div>
    <h2>${esc(t('adv_h2'))}</h2>
    <p class="sub" style="max-width:760px">${t('adv_intro')}</p>
    <div class="grid g2">
      <a class="card adv" href="#/practice/blind" style="text-decoration:none">
        <b>${esc(t('adv_blind'))}</b>
        <p class="sub" style="margin:6px 0 0">${esc(t('adv_blind_n'))}</p></a>
      <a class="card adv" href="#/practice/degree" style="text-decoration:none">
        <b>${esc(t('adv_degree'))}</b>
        <p class="sub" style="margin:6px 0 0">${esc(t('adv_degree_n'))}</p></a>
    </div>
    <div class="adv-sep"></div>

    <h2>${esc(t('practice_by_section', bodySections(), totalTaskStatements()))}</h2>
    <div class="card"><div class="chips">
      ${NOTES.flatMap((d) => d.sections).map((s) => {
        const n = QUESTIONS.filter((q) => q.s === s.id).length;
        return n ? `<a class="chip" href="#/practice/sec/${encodeURIComponent(s.id)}">${esc(s.id)} ${
          esc(secView(s).title)} · ${num(n)}</a>` : '';
      }).join('')}
    </div></div>

    ${S.marks.length ? `<h2>${esc(t('practice_marks'))}</h2><div class="row">
      <a class="btn" href="#/practice/mark">${esc(t('practice_marks_btn', S.marks.length))}</a></div>` : ''}
  `;
}

/* ================================================================
   进阶训练 A：先答后看
   题干先行 → 逼出自己的判断依据 → 再展开选项 → 对照
   ================================================================ */
const BLIND = { list: [], i: 0, results: [], note: '', guess: '' };

function blindStart() {
  BLIND.list = shuffle([...QUESTIONS]);
  BLIND.i = 0; BLIND.results = [];
  blindStage1();
}

function blindShell(inner) {
  const B = BLIND;
  $('#app').innerHTML = `
    <div class="quiz">
      <div class="row" style="margin-bottom:14px">
        <a class="btn sm ghost" href="#/practice">${esc(t('adv_exit'))}</a>
        <span class="spacer"></span>
        <span style="font-size:13px;color:var(--ink-3)">${esc(t('blind_label'))} · ${
          esc(t('practice_counter', B.i + 1, B.list.length))}</span>
      </div>
      <div class="progress-strip">${B.list.map((_, i) =>
        `<i class="${i < B.i ? (B.results[i] ? 'ok' : 'no') : i === B.i ? 'cur' : ''}"></i>`).join('')}</div>
      ${inner}
    </div>`;
}

function blindStage1() {
  const B = BLIND;
  if (B.i >= B.list.length) return blindDone();
  const q = qView(B.list[B.i]);
  B.note = ''; B.guess = '';

  const secOpts = NOTES.flatMap((d) => d.sections)
    .filter((s) => QUESTIONS.some((x) => x.s === s.id))
    .map((s) => `<option value="${esc(s.id)}">${esc(s.id)} ${esc(secView(s).title)}</option>`).join('');

  blindShell(`
    <div class="stage-tag">${esc(t('blind_stage1'))}</div>
    <p class="q-stem">${md(q.q)}</p>
    <label class="fld-l">${esc(t('blind_prompt'))}</label>
    <textarea id="blindNote" class="fld" rows="3" placeholder="${esc(t('blind_placeholder'))}"></textarea>
    <label class="fld-l" style="margin-top:12px">${esc(t('blind_guess_sec'))}</label>
    <select id="blindGuess" class="fld">
      <option value="">${esc(t('blind_guess_none'))}</option>${secOpts}
    </select>
    <div class="row" style="margin-top:16px">
      <button class="btn primary" id="revealBtn">${esc(t('blind_reveal'))}</button>
    </div>`);

  $('#revealBtn').onclick = () => {
    B.note = $('#blindNote').value.trim();
    B.guess = $('#blindGuess').value;
    blindStage2();
  };
}

function blindStage2() {
  const B = BLIND;
  const q = qView(B.list[B.i]);

  blindShell(`
    <div class="stage-tag">${esc(t('blind_stage2'))}</div>
    ${questionCard(q)}`);

  bindMark($('#app'));

  const finish = (pick) => {
    const ok = revealAnswer(q, pick, $('#app'));
    record(q.id, ok);
    B.results[B.i] = ok;
    updateWrongPill();
    $$('.progress-strip i')[B.i].className = ok ? 'ok' : 'no';

    // 把作答前写下的依据摆到解析旁边，供自我对照
    const secLine = !B.guess ? ''
      : B.guess === q.s ? `<div style="color:var(--ok);font-size:13px;margin-top:8px">${
          esc(t('blind_sec_right', q.s + ' ' + secTitle(q.s)))}</div>`
      : `<div style="color:var(--bad);font-size:13px;margin-top:8px">${
          esc(t('blind_sec_wrong', B.guess, q.s + ' ' + secTitle(q.s)))}</div>`;
    $('#verdict').insertAdjacentHTML('afterbegin', `
      <div class="box key" style="margin:0 0 14px"><b class="bt">${esc(t('blind_your_note'))}</b>
        <p style="margin:0;font-size:13.5px${B.note ? '' : ';color:var(--ink-3)'}">${
          B.note ? esc(B.note) : esc(t('blind_note_empty'))}</p>${secLine}</div>`);

    const label = B.i + 1 >= B.list.length ? t('q_see_result') : t('q_next');
    $('#verdict .row').insertAdjacentHTML('beforeend', `<button class="btn sm primary" id="nextQ">${esc(label)}</button>`);
    const n = $('#nextQ');
    n.onclick = () => { B.i++; blindStage1(); };
    n.focus();
  };

  if (isMulti(q)) {
    const need = pickCount(q);
    const sel = new Set();
    $$('.opt').forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.i;
        if (sel.has(i)) sel.delete(i); else sel.add(i);
        b.classList.toggle('sel', sel.has(i));
        $('#pickHint').textContent = t('q_picked', sel.size, need);
        $('#submitMulti').disabled = sel.size !== need;
      };
    });
    $('#submitMulti').onclick = () => finish([...sel]);
  } else {
    $$('.opt').forEach((b) => { b.onclick = () => finish(+b.dataset.i); });
  }
}

function blindDone() {
  const B = BLIND;
  const ok = B.results.filter(Boolean).length;
  const rate = pct(ok, B.list.length);
  $('#app').innerHTML = `
    <h1>${esc(t('practice_done'))}</h1>
    <p class="sub">${esc(t('blind_label'))}</p>
    <div class="card score-hero">
      <div class="lbl">${esc(t('practice_rate'))}</div>
      <div class="big ${rate >= 72 ? 'pass' : 'fail'}">${num(rate)}%</div>
      <div class="msg">${esc(t('practice_score_n', ok, B.list.length))}</div>
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn primary" id="again">${esc(t('practice_again'))}</button>
      <a class="btn ghost" href="#/practice">${esc(t('adv_exit'))}</a>
    </div>`;
  $('#again').onclick = () => blindStart();
}

/* ================================================================
   进阶训练 B：程度判断
   只留正确项 + 一个「有 why-wrong 解析」的强干扰项，二选一
   ================================================================ */
const DEGREE = { list: [], i: 0, results: [] };

/** 能进这个模式的题：单选、且至少有一个被标注过为什么错的干扰项 */
const degreePool = () => QUESTIONS.filter((q) =>
  !isMulti(q) && q.w && Object.keys(q.w).some((k) => +k !== q.a && q.w[k]));

function degreeStart() {
  const pool = degreePool();
  if (!pool.length) {
    $('#app').innerHTML = `<h1>${esc(t('degree_label'))}</h1>
      <div class="empty"><div class="em">◇</div>${esc(t('degree_none'))}
        <div class="row" style="justify-content:center;margin-top:16px">
          <a class="btn" href="#/practice">${esc(t('practice_back'))}</a></div></div>`;
    return;
  }
  DEGREE.list = shuffle(pool);
  DEGREE.i = 0; DEGREE.results = [];
  degreeRun();
}

function degreeRun() {
  const D = DEGREE;
  if (D.i >= D.list.length) return degreeDone();
  const raw = D.list[D.i];
  const q = qView(raw);

  // 从有解析的错误项里挑一个当对手；英文侧若没写 w 就退回中文侧的下标集合
  const wSrc = (q.w && Object.keys(q.w).length) ? q.w : (raw.w || {});
  const foils = Object.keys(wSrc).map(Number).filter((i) => i !== q.a && i < q.o.length);
  if (!foils.length) { D.i++; return degreeRun(); }
  const foil = foils[(Math.random() * foils.length) | 0];
  const pair = shuffle([q.a, foil]);

  $('#app').innerHTML = `
    <div class="quiz">
      <div class="row" style="margin-bottom:14px">
        <a class="btn sm ghost" href="#/practice">${esc(t('adv_exit'))}</a>
        <span class="spacer"></span>
        <span style="font-size:13px;color:var(--ink-3)">${esc(t('degree_label'))} · ${
          esc(t('practice_counter', D.i + 1, D.list.length))}</span>
      </div>
      <div class="progress-strip">${D.list.map((_, i) =>
        `<i class="${i < D.i ? (D.results[i] ? 'ok' : 'no') : i === D.i ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="q-meta">
        <span class="tag ${esc(q.d)}">${esc(q.s)}</span>
        <span class="tag q">${esc(scenarioName(q.sc))}</span>
        <span class="tag multi">${esc(t('degree_q'))}</span>
      </div>
      <p class="q-stem">${md(q.q)}</p>
      <div class="opts">
        ${pair.map((i) => `<button class="opt" data-i="${num(i)}">
          <span class="ltr">${esc(LTR[pair.indexOf(i)])}</span><span class="ot">${md(q.o[i])}</span></button>`).join('')}
      </div>
      <div id="verdict"></div>
    </div>`;

  $$('.opt').forEach((b) => {
    b.onclick = () => {
      const pickIdx = +b.dataset.i;
      const ok = pickIdx === q.a;
      $$('.opt').forEach((x) => {
        const i = +x.dataset.i;
        x.disabled = true;
        x.classList.add(i === q.a ? 'right' : 'wrong');
      });
      record(q.id, ok);
      D.results[D.i] = ok;
      updateWrongPill();
      $$('.progress-strip i')[D.i].className = ok ? 'ok' : 'no';

      const foilWhy = wSrc[foil];
      $('#verdict').innerHTML = `
        <div class="verdict ${ok ? 'good' : 'bad'}">
          <div class="vh">${esc(ok ? t('q_right') : t('q_wrong', LTR[pair.indexOf(q.a)]))}</div>
          <p>${md(q.e)}</p>
          ${foilWhy ? `<div class="box warn" style="margin:12px 0 0"><b class="bt">${esc(t('degree_why'))}</b>
            <p style="margin:0;font-size:13.5px">${md(foilWhy)}</p></div>` : ''}
          <div class="row" style="margin-top:12px">
            <a class="btn sm" href="#/notes/${encodeURIComponent(q.s)}">${
              esc(t('q_back_to_note', q.s, secTitle(q.s)))}</a>
            <button class="btn sm primary" id="nextQ">${
              esc(D.i + 1 >= D.list.length ? t('q_see_result') : t('q_next'))}</button>
          </div>
        </div>`;
      const n = $('#nextQ');
      n.onclick = () => { D.i++; degreeRun(); };
      n.focus();
    };
  });
}

function degreeDone() {
  const D = DEGREE;
  const ok = D.results.filter(Boolean).length;
  const rate = pct(ok, D.list.length);
  $('#app').innerHTML = `
    <h1>${esc(t('practice_done'))}</h1>
    <p class="sub">${esc(t('degree_label'))}</p>
    <div class="card score-hero">
      <div class="lbl">${esc(t('practice_rate'))}</div>
      <div class="big ${rate >= 72 ? 'pass' : 'fail'}">${num(rate)}%</div>
      <div class="msg">${esc(t('practice_score_n', ok, D.list.length))}</div>
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn primary" id="again">${esc(t('practice_again'))}</button>
      <a class="btn ghost" href="#/practice">${esc(t('adv_exit'))}</a>
    </div>`;
  $('#again').onclick = () => degreeStart();
}

function practiceRun() {
  const P = PRACTICE;
  if (!P.list.length) return go('/practice');
  if (P.i >= P.list.length) return practiceDone();
  const q = qView(P.list[P.i]);

  $('#app').innerHTML = `
    <div class="quiz">
      <div class="row" style="margin-bottom:14px">
        <a class="btn sm ghost" href="#/practice">${esc(t('practice_switch'))}</a>
        <span class="spacer"></span>
        <span style="font-size:13px;color:var(--ink-3)">${esc(P.label)}</span>
      </div>
      <div class="progress-strip">${P.list.map((_, i) =>
        `<i class="${i < P.i ? (P.results[i] ? 'ok' : 'no') : i === P.i ? 'cur' : ''}"></i>`).join('')}</div>
      ${questionCard(q, { counter: t('practice_counter', P.i + 1, P.list.length) })}
    </div>`;

  bindMark($('#app'));

  const finish = (pick) => {
    const ok = revealAnswer(q, pick, $('#app'));
    record(q.id, ok);
    P.results[P.i] = ok;
    updateWrongPill();
    $$('.progress-strip i')[P.i].className = ok ? 'ok' : 'no';
    const label = P.i + 1 >= P.list.length ? t('q_see_result') : t('q_next');
    $('#verdict .row').insertAdjacentHTML('beforeend', `<button class="btn sm primary" id="nextQ">${esc(label)}</button>`);
    const n = $('#nextQ');
    n.onclick = () => { P.i++; practiceRun(); };
    n.focus();
  };

  if (isMulti(q)) {
    const need = pickCount(q);
    const sel = new Set();
    $$('.opt').forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.i;
        if (sel.has(i)) sel.delete(i); else sel.add(i);
        b.classList.toggle('sel', sel.has(i));
        $('#pickHint').textContent = t('q_picked', sel.size, need);
        $('#submitMulti').disabled = sel.size !== need;
      };
    });
    $('#submitMulti').onclick = () => finish([...sel]);
  } else {
    $$('.opt').forEach((b) => { b.onclick = () => finish(+b.dataset.i); });
  }
}

function practiceDone() {
  const P = PRACTICE;
  const ok = P.results.filter(Boolean).length;
  const rate = pct(ok, P.list.length);
  const wrongQs = P.list.filter((_, i) => !P.results[i]).map(qView);

  $('#app').innerHTML = `
    <h1>${esc(t('practice_done'))}</h1>
    <p class="sub">${esc(P.label)}</p>
    <div class="card score-hero">
      <div class="lbl">${esc(t('practice_rate'))}</div>
      <div class="big ${rate >= 72 ? 'pass' : 'fail'}">${num(rate)}%</div>
      <div class="msg">${esc(t('practice_score_n', ok, P.list.length))}</div>
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn primary" id="again">${esc(t('practice_again'))}</button>
      <a class="btn" href="#/practice">${esc(t('practice_switch').replace('← ', ''))}</a>
      ${wrongQs.length ? `<a class="btn" href="#/wrong">${esc(t('practice_goto_wrong'))}</a>` : ''}
    </div>
    ${wrongQs.length ? `<h2>${esc(t('practice_wrong_n', wrongQs.length))}</h2>${wrongQs.map((q) => `
      <div class="item">
        <div class="ih"><span class="tag ${esc(q.d)}">${esc(q.s)}</span><span>${esc(secTitle(q.s))}</span>
          <span class="spacer"></span>
          <a class="link-btn" href="#/notes/${encodeURIComponent(q.s)}">${esc(t('back_to_note'))}</a></div>
        <div class="iq">${md(q.q)}</div>
        <div class="iq" style="margin-top:8px;color:var(--ok)">${answerHtml(q)}</div>
      </div>`).join('')}` : ''}`;

  $('#again').onclick = () => { P.list = shuffle(P.list); P.i = 0; P.results = []; practiceRun(); };
}

/* ================================================================
   VIEW: 错题集
   ================================================================ */
routes.wrong = (rest) => {
  const ids = Object.keys(S.wrong).filter((id) => VALID_Q.has(id));

  if (rest[0] === 'run') {
    if (!ids.length) return go('/wrong');
    PRACTICE.list = shuffle(ids.map(byId));
    PRACTICE.i = 0; PRACTICE.results = []; PRACTICE.label = t('wrong_label');
    return practiceRun();
  }

  if (!ids.length) {
    $('#app').innerHTML = `<h1>${esc(t('wrong_h1'))}</h1>
      <div class="empty"><div class="em">✓</div>${esc(t('wrong_empty'))}<br>
        <span style="font-size:13px">${esc(t('wrong_empty_n'))}</span>
        <div class="row" style="justify-content:center;margin-top:18px">
          <a class="btn primary" href="#/practice">${esc(t('wrong_go_practice'))}</a></div></div>`;
    return;
  }

  const grouped = {};
  ids.forEach((id) => { const q = byId(id); (grouped[q.d] ||= []).push(q); });

  $('#app').innerHTML = `
    <h1>${esc(t('wrong_h1'))} <span class="tag">${num(ids.length)}</span></h1>
    <p class="sub">${t('wrong_sub')}</p>
    <div class="row" style="margin-bottom:22px">
      <a class="btn primary" href="#/wrong/run">${esc(t('wrong_start', ids.length))}</a>
      <button class="btn ghost" id="clearWrong">${esc(t('wrong_clear'))}</button>
    </div>
    ${NOTES.filter((d) => grouped[d.id]).map((d) => `
      <h2>${esc(domView(d).title)} <span class="tag ${esc(d.id)}">${num(d.weight)}%</span>
        <span style="font-size:13px;color:var(--ink-3);font-family:var(--sans)">${
          esc(t('wrong_n_items', grouped[d.id].length))}</span></h2>
      ${grouped[d.id].map((raw) => {
        const q = qView(raw), w = S.wrong[q.id];
        return `<div class="item">
          <div class="ih">
            <span class="tag q">${esc(q.s)}</span><span>${esc(secTitle(q.s))}</span>
            <span>${esc(t('wrong_times', w.times))}</span>
            ${w.streak ? `<span style="color:var(--ok)">${esc(t('wrong_streak', w.streak))}</span>` : ''}
            <span class="spacer"></span>
            <a class="link-btn" href="#/notes/${encodeURIComponent(q.s)}">${esc(t('back_to_note'))}</a>
          </div>
          <div class="iq">${md(q.q)}</div>
          <details style="margin-top:8px">
            <summary style="cursor:pointer;font-size:13px;color:var(--ink-3)">${esc(t('wrong_show_answer'))}</summary>
            <div class="iq" style="margin-top:8px;color:var(--ok)">${answerHtml(q)}</div>
            <p style="font-size:13.5px;color:var(--ink-2);margin:8px 0 0">${md(q.e)}</p>
          </details>
        </div>`;
      }).join('')}`).join('')}`;

  $('#clearWrong').onclick = () => {
    if (confirm(t('wrong_confirm_clear', ids.length))) {
      S.wrong = {}; save(); updateWrongPill(); router();
    }
  };
};

/* ================================================================
   VIEW: 模拟考试（规格固定为官方值，不再提供自定义）
   ================================================================ */
let EXAM = null;
let examTimerId = null;

routes.exam = (rest) => {
  if (rest[0] === 'run' && EXAM) return examRun();
  if (rest[0] === 'result' && EXAM?.saved) return examResult(EXAM.saved);
  if (rest[0] === 'review') {
    const e = S.exams[num(rest[1], -1)];
    return e ? examResult(e) : go('/');
  }
  examIntro();
};

/** 按 Domain 权重抽题；从 6 个场景随机取 4 个优先出题 */
function buildExam(len) {
  const doms = NOTES.filter((d) => d.weight > 0);
  const totalW = doms.reduce((a, d) => a + d.weight, 0);
  const picked = shuffle(Object.keys(SCENARIOS).filter((k) => k !== 'gen')).slice(0, 4);
  const scSet = new Set([...picked, 'gen']);

  const counts = doms.map((d) => ({ d: d.id, n: Math.round((d.weight / totalW) * len) }));
  let diff = len - counts.reduce((a, c) => a + c.n, 0);
  for (let i = 0; diff !== 0; i = (i + 1) % counts.length) {
    counts[i].n += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }

  const qs = [];
  counts.forEach(({ d, n }) => {
    const pool = QUESTIONS.filter((q) => q.d === d);
    const pref = shuffle(pool.filter((q) => scSet.has(q.sc)));
    const rest = shuffle(pool.filter((q) => !scSet.has(q.sc)));
    qs.push(...[...pref, ...rest].slice(0, n));
  });
  return { qs: shuffle(qs), scenarios: picked };
}

function examIntro() {
  const len = EXAM_META.items, min = EXAM_META.minutes;
  $('#app').innerHTML = `
    <h1>${esc(t('exam_h1'))}</h1>
    <p class="sub">${esc(t('exam_sub', len, min, EXAM_META.fullScore, EXAM_META.passScore))}</p>

    <div class="card">
      <div class="grid g2">
        <div>
          <h3 style="margin-top:0">${esc(t('exam_dist'))}</h3>
          ${NOTES.filter((d) => d.weight > 0).map((d) => `
            <div class="dom-row">
              <div class="nm"><b>${esc(domView(d).title)}</b><span>${num(d.weight)}%</span></div>
              <div class="meter"><i style="width:${num(d.weight) * 3.7}%"></i></div>
              <div class="pc">${esc(t('exam_n_items', Math.round((d.weight / 100) * len)))}</div>
            </div>`).join('')}
        </div>
        <div>
          <h3 style="margin-top:0">${esc(t('exam_spec'))}</h3>
          <div class="box tip"><b class="bt">${esc(t('exam_spec_title'))}</b>
            <p style="margin:0;font-size:13px">${esc(t('exam_spec_body',
              meta('format'), meta('guessNote'), meta('scenarioNote')))}
              <a href="${esc(EXAM_META.guideUrl)}" target="_blank" rel="noopener">${esc(t('exam_guide_link'))}</a></p></div>
          <div class="box key" style="margin-top:14px"><b class="bt">${esc(t('exam_official_more'))}</b>
            <p style="margin:0;font-size:13px">
              ${esc(t('exam_code'))} ${esc(EXAM_META.code)} · ${esc(t('exam_fee'))} ${esc(EXAM_META.fee)} ·
              ${esc(t('exam_validity'))} ${esc(meta('validity'))}<br>
              ${esc(t('exam_delivery_l'))}：${esc(meta('delivery'))}<br>
              ${esc(t('exam_result_l'))}：${esc(meta('resultReporting'))}</p></div>
        </div>
      </div>
      <div class="row" style="margin-top:20px">
        <button class="btn primary" id="startExam">${esc(t('exam_start', len, min))}</button>
        ${S.exams.length ? `<a class="btn ghost" href="#/">${esc(t('exam_see_history'))}</a>` : ''}
      </div>
    </div>`;

  $('#startExam').onclick = () => {
    const built = buildExam(EXAM_META.items);
    EXAM = { qs: built.qs, scenarios: built.scenarios, ans: {}, flags: {}, i: 0,
             start: Date.now(), limit: EXAM_META.minutes * 60000, saved: null };
    go('/exam/run');
  };
}

function examRun() {
  const E = EXAM;
  const raw = E.qs[E.i];
  const q = qView(raw);
  clearInterval(examTimerId);

  $('#app').innerHTML = `
    <div class="exam-bar">
      <strong style="font-family:var(--serif);font-size:16px">${esc(t('exam_h1'))}</strong>
      <span style="font-size:13px;color:var(--ink-3)">${
        esc(t('exam_progress', E.i + 1, E.qs.length, Object.keys(E.ans).length))}</span>
      <span class="spacer"></span>
      <span class="timer" id="timer">--:--</span>
      <button class="btn sm" id="flagBtn">${esc(E.flags[q.id] ? t('exam_flagged') : t('exam_flag'))}</button>
      <button class="btn sm primary" id="submitBtn">${esc(t('exam_submit'))}</button>
    </div>
    <div class="quiz">
      <div class="q-meta">
        <span class="tag ${esc(q.d)}">${esc(domView(domOf(q.d)).title.split(' ')[0])}</span>
        <span class="tag q">${esc(scenarioName(q.sc))}</span>
        ${isMulti(q) ? `<span class="tag multi">${esc(t('q_multi', pickCount(q)))}</span>` : ''}
      </div>
      <p class="q-stem">${md(q.q)}</p>
      <div class="opts">
        ${q.o.map((x, i) => {
          const cur = E.ans[q.id];
          const on = isMulti(q) ? Array.isArray(cur) && cur.includes(i) : cur === i;
          return `<button class="opt ${on ? 'sel' : ''}" data-i="${num(i)}">
            <span class="ltr">${esc(LTR[i])}</span><span class="ot">${md(x)}</span></button>`;
        }).join('')}
      </div>
      ${isMulti(q) ? `<div class="row" style="margin-top:10px">
        <span style="font-size:13px;color:var(--ink-3)">${esc(t('exam_multi_hint',
          Array.isArray(E.ans[q.id]) ? E.ans[q.id].length : 0, pickCount(q)))}</span>
      </div>` : ''}
      <div class="row" style="margin-top:20px">
        <button class="btn" id="prevBtn" ${E.i === 0 ? 'disabled' : ''}>${esc(t('exam_prev'))}</button>
        <button class="btn" id="nextBtn" ${E.i === E.qs.length - 1 ? 'disabled' : ''}>${esc(t('exam_next'))}</button>
        <span class="spacer"></span>
        <button class="link-btn" id="clearAns">${esc(t('exam_clear_ans'))}</button>
      </div>
      <h3>${esc(t('exam_card'))}</h3>
      <div class="qnav">${E.qs.map((qq, i) =>
        `<button data-jump="${num(i)}" class="${E.ans[qq.id] !== undefined ? 'ans' : ''} ${
          i === E.i ? 'cur' : ''} ${E.flags[qq.id] ? 'flag' : ''}">${num(i + 1)}</button>`).join('')}</div>
    </div>`;

  const tick = () => {
    const el = $('#timer');
    if (!el) return clearInterval(examTimerId);
    const left = E.limit - (Date.now() - E.start);
    el.textContent = fmtTime(left);
    el.classList.toggle('low', left < 5 * 60000);
    if (left <= 0) { clearInterval(examTimerId); examSubmit(true); }
  };
  tick();
  examTimerId = setInterval(tick, 1000);

  $$('.opt').forEach((b) => {
    b.onclick = () => {
      const i = +b.dataset.i;
      if (isMulti(q)) {
        const cur = Array.isArray(E.ans[q.id]) ? E.ans[q.id] : [];
        E.ans[q.id] = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
        if (!E.ans[q.id].length) delete E.ans[q.id];
      } else {
        E.ans[q.id] = i;
        if (E.i < E.qs.length - 1) E.i++;
      }
      examRun();
    };
  });
  $('#prevBtn').onclick = () => { E.i--; examRun(); };
  $('#nextBtn').onclick = () => { E.i++; examRun(); };
  $('#clearAns').onclick = () => { delete E.ans[q.id]; examRun(); };
  $('#flagBtn').onclick = () => { E.flags[q.id] = !E.flags[q.id]; examRun(); };
  $$('[data-jump]').forEach((b) => { b.onclick = () => { E.i = num(b.dataset.jump); examRun(); }; });
  $('#submitBtn').onclick = () => {
    const un = E.qs.length - Object.keys(E.ans).length;
    if (un && !confirm(t('exam_confirm_submit', un))) return;
    examSubmit(false);
  };
}

function examSubmit(timeout) {
  clearInterval(examTimerId);
  const E = EXAM;
  const byDom = {};
  let correct = 0;

  const detail = E.qs.map((q) => {
    const pick = E.ans[q.id];
    const ok = isCorrect(q, pick);
    if (ok) correct++;
    const b = (byDom[q.d] ||= { n: 0, ok: 0 });
    b.n++; if (ok) b.ok++;
    record(q.id, ok);
    return { qid: q.id, pick: pick === undefined ? null : pick };
  });

  const rec = {
    ts: Date.now(),
    score: Math.round((correct / E.qs.length) * EXAM_META.fullScore),
    correct, total: E.qs.length, dur: Date.now() - E.start,
    timeout: !!timeout, byDom, detail,
  };
  rec.pass = rec.score >= EXAM_META.passScore;

  S.exams.unshift(rec);
  S.exams = S.exams.slice(0, 50);
  save(); updateWrongPill();
  EXAM.saved = rec;
  go('/exam/result');
}

function examResult(e) {
  const wrongN = e.detail.filter((d) => { const q = byId(d.qid); return q && !isCorrect(q, d.pick); }).length;

  $('#app').innerHTML = `
    <div class="card score-hero">
      <div class="lbl">${esc(t('exam_score_label', EXAM_META.passScore))}</div>
      <div class="big ${e.pass ? 'pass' : 'fail'}">${num(e.score)}</div>
      <div class="msg">
        ${e.pass ? t('exam_passed') : t('exam_failed')} ·
        ${esc(t('exam_result_line', e.correct, e.total, fmtTime(e.dur)))}${
          e.timeout ? ` · <span style="color:var(--bad)">${esc(t('exam_timeout'))}</span>` : ''}
      </div>
      <div class="meter ${e.pass ? 'ok' : ''}" style="max-width:420px;margin:18px auto 0">
        <i style="width:${Math.min(100, (num(e.score) / 1000) * 100)}%"></i></div>
      <div style="font-size:11.5px;color:var(--ink-3);margin-top:6px">
        ${esc(e.pass ? t('exam_over_pass', e.score - EXAM_META.passScore)
                     : t('exam_under_pass', EXAM_META.passScore - e.score))}</div>
    </div>

    <h2>${esc(t('exam_by_domain'))}</h2>
    <div class="card">
      ${NOTES.filter((d) => e.byDom[d.id]).map((d) => {
        const v = e.byDom[d.id], r = pct(v.ok, v.n);
        const note = r < 60 ? ` · <span style="color:var(--bad)">${esc(t('exam_need_work'))}</span>`
                   : r >= 85 ? ` · <span style="color:var(--ok)">${esc(t('exam_solid'))}</span>` : '';
        return `<div class="dom-row">
          <div class="nm"><b>${esc(domView(d).title)} <span class="tag ${esc(d.id)}">${num(d.weight)}%</span></b>
            <span>${num(v.ok)} / ${num(v.n)}${note}</span></div>
          <div class="meter ${r >= 80 ? 'ok' : ''}"><i style="width:${num(r)}%"></i></div>
          <div class="pc">${num(r)}%</div>
        </div>`;
      }).join('')}
    </div>

    <div class="row" style="margin-top:20px">
      <a class="btn primary" href="#/exam">${esc(t('exam_retake'))}</a>
      ${Object.keys(S.wrong).length ? `<a class="btn" href="#/wrong">${
        esc(t('btn_attack_wrong', Object.keys(S.wrong).length))}</a>` : ''}
      <a class="btn ghost" href="#/">${esc(t('exam_back_home'))}</a>
    </div>

    <h2>${esc(t('exam_review_all', wrongN))}</h2>
    ${e.detail.map((d, i) => {
      const rawQ = byId(d.qid);
      if (!rawQ) return '';
      const q = qView(rawQ);
      const ok = isCorrect(q, d.pick);
      const mark = ok ? t('exam_item_right')
        : d.pick === null || d.pick === undefined ? t('exam_item_blank')
        : t('exam_item_wrong', [].concat(d.pick).map((x) => LTR[x]).join(LANG() === 'en' ? ', ' : '、'));
      return `<div class="item" style="border-left:3px solid ${ok ? 'var(--ok)' : 'var(--bad)'}">
        <div class="ih">
          <span>${num(i + 1)}.</span>
          <span class="tag ${esc(q.d)}">${esc(q.s)}</span>
          <span>${esc(secTitle(q.s))}</span>
          <span style="color:${ok ? 'var(--ok)' : 'var(--bad)'}">${esc(mark)}</span>
          <span class="spacer"></span>
          <a class="link-btn" href="#/notes/${encodeURIComponent(q.s)}">${esc(t('back_to_note'))}</a>
        </div>
        <div class="iq">${md(q.q)}</div>
        ${ok ? '' : `
          <div class="iq" style="margin-top:8px;color:var(--ok)"><b>${esc(t('q_correct_answer'))}</b><br>${answerHtml(q)}</div>
          <p style="font-size:13.5px;color:var(--ink-2);margin:8px 0 0">${md(q.e)}</p>`}
      </div>`;
    }).join('')}`;
}

/* ================================================================
   底部工具 & 启动
   ================================================================ */
function updateWrongPill() {
  const n = Object.keys(S.wrong).length;
  const p = $('#wrongPill');
  p.hidden = !n;
  p.textContent = String(n);
}

function applyTheme() {
  document.documentElement.dataset.theme = S.prefs.theme;
  $('#themeBtn').textContent = S.prefs.theme === 'dark' ? '☀' : '◐';
}

$('#themeBtn').onclick = () => {
  S.prefs.theme = S.prefs.theme === 'dark' ? 'light' : 'dark';
  save(); applyTheme();
};

$('#langBtn').onclick = (e) => {
  e.stopPropagation();
  setLangMenu($('#langMenu').hidden);
};

$$('.lang-opt').forEach((o) => {
  o.onclick = (e) => {
    e.stopPropagation();
    setLangMenu(false);
    const next = o.dataset.lang === 'en' ? 'en' : 'zh';
    if (next === LANG()) return;          // 选的就是当前语言，不必重绘
    S.prefs.lang = next;
    save(); paintChrome(); router();
    // 进度面板开着的话也要跟着换语言，否则它会卡在旧语言里
    if (!$('#progModal').hidden) renderProgressBody();
  };
});

// 点空白处或按 Esc 收起
document.addEventListener('click', () => setLangMenu(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#langMenu').hidden) { setLangMenu(false); $('#langBtn').focus(); }
});

/* ================================================================
   进度管理面板
   导出（下载 / 复制）· 导入（拖拽 / 选择 / 粘贴）· 导入前对比 · 合并或替换
   ================================================================ */
let PENDING = null;   // 待导入的 state，等用户选合并还是替换

function openProgress() {
  $('#progModal').hidden = false;
  renderProgressBody();
}

/** 面板正文。抽成独立函数是为了让 sync.js 在同步状态变化时能重绘。 */
function renderProgressBody() {
  const d = digest(S);
  const c = typeof cloudState === 'function' ? cloudState() : { enabled: false };
  $('#progBody').innerHTML = `
    <p class="sub" style="margin-top:0">${esc(t('prog_sub'))}</p>

    ${c.enabled ? cloudSectionHtml(c) : ''}

    <h3>${esc(t('prog_current'))}</h3>
    <div class="chips">
      <span class="chip">${esc(t('prog_stat_q', d.seen, QUESTIONS.length))}</span>
      <span class="chip">${esc(t('prog_stat_rate', d.rate))}</span>
      <span class="chip">${esc(t('prog_stat_wrong', d.wrong))}</span>
      <span class="chip">${esc(t('prog_stat_notes', d.read))}</span>
      <span class="chip">${esc(t('prog_stat_exams', d.exams))}</span>
    </div>
    ${d.seen === 0 && d.read === 0 ? `<p class="sub" style="color:var(--warn)">${esc(t('prog_empty_warn'))}</p>` : ''}

    <h3>${esc(t('prog_export_h'))}</h3>
    <div class="row">
      <button class="btn primary" id="pDownload">${esc(t('prog_download'))}</button>
      <button class="btn" id="pCopy">${esc(t('prog_copy'))}</button>
    </div>
    <p class="sub" style="margin:8px 0 0;font-size:12px">${esc(t('prog_filename', progressFilename(S)))}</p>

    <h3>${esc(t('prog_import_h'))}</h3>
    <div class="dropzone" id="pDrop">
      <div class="dz-main">${esc(t('prog_drop'))}</div>
      <div class="dz-sub">${esc(t('prog_drop_or'))} <button class="link-btn" id="pPick">${esc(t('prog_pick'))}</button></div>
    </div>
    <details style="margin-top:10px">
      <summary style="cursor:pointer;font-size:13px;color:var(--ink-3)">${esc(t('prog_paste'))}</summary>
      <textarea id="pPaste" class="fld" rows="3" style="margin-top:8px" placeholder='{"qstats":…}'></textarea>
      <div class="row" style="margin-top:8px">
        <button class="btn sm" id="pPasteGo">${esc(t('prog_paste_btn'))}</button>
      </div>
    </details>

    <h3 style="color:var(--bad)">${esc(t('prog_danger_h'))}</h3>
    <div class="row"><button class="btn ghost" id="pReset">${esc(t('foot_reset'))}</button></div>
  `;

  $('#pDownload').onclick = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = progressFilename(S);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  $('#pCopy').onclick = async () => {
    const btn = $('#pCopy');
    try {
      await navigator.clipboard.writeText(JSON.stringify(S));
      btn.textContent = t('prog_copied');
      btn.classList.add('ok-flash');
      setTimeout(() => { btn.textContent = t('prog_copy'); btn.classList.remove('ok-flash'); }, 1800);
    } catch { btn.textContent = t('prog_copy_fail'); }
  };

  $('#pPick').onclick = () => $('#importFile').click();
  $('#pPasteGo').onclick = () => stageImport($('#pPaste').value);

  const dz = $('#pDrop');
  ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => {
    e.preventDefault(); dz.classList.add('over'); $('.dz-main', dz).textContent = t('prog_dropping');
  }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => {
    e.preventDefault(); dz.classList.remove('over'); $('.dz-main', dz).textContent = t('prog_drop');
  }));
  dz.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files[0];
    if (f) f.text().then(stageImport);
  });

  $('#pReset').onclick = () => {
    if (!confirm(t('confirm_reset'))) return;
    const { lang, theme } = S.prefs;
    S = DEFAULT_STATE();
    S.prefs.lang = lang; S.prefs.theme = theme;   // 清空进度不该顺带重置界面偏好
    save(); applyTheme(); paintChrome(); updateWrongPill(); router();
    openProgress();
  };

  if (c.enabled) bindCloudSection();
}

/* ---------------- 云同步区块（渲染 + 事件）---------------- */

/* 验证码位数不写死：Supabase 的 Email OTP Length 是可配的（6–10，本项目当前是 8），
 * 而客户端读不到这个配置，所以按区间放行，交给服务端判对错。 */
const OTP_MIN = 6, OTP_MAX = 10;

function cloudSectionHtml(c) {
  const box = (inner) => `<div class="cloud-box">${inner}</div>`;

  if (c.status === 'signedin' || c.status === 'syncing') {
    return `<h3>${esc(t('cloud_h'))}</h3>${box(`
      <div class="row" style="align-items:baseline">
        <span class="cloud-dot ok"></span>
        <b>${esc(t('cloud_signed_as'))}</b>
        <code>${esc(c.email)}</code>
        <span class="spacer"></span>
        <span class="sub" style="margin:0;font-size:12.5px">${
          esc(c.status === 'syncing' ? t('cloud_syncing') : t('cloud_synced', ''))}</span>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn sm" id="cSyncNow">${esc(t('cloud_sync_now'))}</button>
        <button class="btn sm ghost" id="cSignOut">${esc(t('cloud_signout'))}</button>
      </div>
      <p class="sub" style="margin:10px 0 0;font-size:12.5px">${md(t('cloud_signout_note'))}</p>
      <details style="margin-top:12px">
        <summary style="cursor:pointer;font-size:13px;color:var(--bad)">${esc(t('cloud_danger_h'))}</summary>
        <p class="sub" style="margin:8px 0;font-size:12.5px">${md(t('cloud_danger_note'))}</p>
        <button class="btn sm ghost" id="cDelete" style="color:var(--bad);border-color:var(--bad)">${
          esc(t('cloud_delete'))}</button>
      </details>`)}`;
  }

  if (c.status === 'error') {
    return `<h3>${esc(t('cloud_h'))}</h3>${box(`
      <div class="box warn" style="margin:0"><b class="bt">${esc(t('cloud_err_title', c.error))}</b>
        <p style="margin:0;font-size:13px">${esc(t('cloud_err_box'))}</p></div>
      <div class="row" style="margin-top:12px">
        <button class="btn sm" id="cRetry">${esc(t('cloud_sync_now'))}</button>
        <button class="btn sm ghost" id="cSignOut">${esc(t('cloud_signout'))}</button>
      </div>`)}`;
  }

  if (c.status === 'loading') {
    return `<h3>${esc(t('cloud_h'))}</h3>${box(`<p class="sub" style="margin:0">${esc(t('cloud_loading'))}</p>`)}`;
  }

  // 未登录
  const linkErr = c.linkError
    ? `<div class="box warn" style="margin:0 0 12px"><b class="bt">${esc(t('cloud_link_err_h'))}</b>
         <p style="margin:0;font-size:13px">${esc(t(c.linkError.key, c.linkError.arg))}</p></div>`
    : '';

  // 第二步：验证码已发出，等用户输入
  if (c.pendingEmail) {
    return `<h3>${esc(t('cloud_h'))}</h3>${box(`
      <div class="box tip" style="margin:0 0 12px"><b class="bt">${esc(t('cloud_sent_h'))}</b>
        <p style="margin:0;font-size:13px">${esc(t('cloud_sent', c.pendingEmail))}<br>
          <span style="color:var(--ink-3)">${esc(t('cloud_sent_spam'))}</span></p></div>
      <label class="fld-l" for="cCode">${esc(t('cloud_code_l'))}</label>
      <input id="cCode" class="fld code-input" inputmode="numeric" autocomplete="one-time-code"
             maxlength="${OTP_MAX}" placeholder="${'0'.repeat(OTP_MIN)}">
      <div class="row" style="margin-top:12px">
        <button class="btn primary" id="cVerify">${esc(t('cloud_verify'))}</button>
        <button class="btn sm ghost" id="cResend">${esc(t('cloud_resend'))}</button>
        <span class="spacer"></span>
        <button class="btn sm ghost" id="cBack">${esc(t('cloud_change_email'))}</button>
      </div>
      <div id="cMsg"></div>`)}`;
  }

  // 第一步：填邮箱
  return `<h3>${esc(t('cloud_h'))}</h3>${box(`
    ${linkErr}
    <p class="sub" style="margin:0 0 12px">${t('cloud_intro')}</p>
    <label class="fld-l" for="cEmail">${esc(t('cloud_email_l'))}</label>
    <input id="cEmail" class="fld" type="email" autocomplete="email"
           placeholder="${esc(t('cloud_email_ph'))}">
    <div class="row" style="margin-top:12px">
      <button class="btn primary" id="cSend">${esc(t('cloud_send'))}</button>
      <a class="link-btn" href="#/privacy">${esc(t('nav_privacy'))}</a>
    </div>
    <div id="cMsg"></div>`)}`;
}

function bindCloudSection() {
  const cErr = (msg) =>
    ($('#cMsg').innerHTML = `<p class="sub" style="color:var(--bad);margin:10px 0 0">${esc(msg)}</p>`);
  /* Supabase 的报错不能直接甩给用户看：发信失败时 GoTrue 会返回 500 +
   * 空 JSON body，message 字面上就是 "{}"，显示出来是「发送失败：{}」。
   * 这里把能识别的情况翻成人话，实在认不出来才退回原文。 */
  const sendFail = (e) => {
    const raw = (e && e.message) || '';
    const status = e && e.status;
    if (raw === 'sdk_load_failed') return t('cloud_sdk_fail');
    if (/rate|limit|too many/i.test(raw) || status === 429) return t('cloud_rate');
    if (status >= 500 || /^\{\}?$/.test(raw.trim()) || e?.name === 'AuthRetryableFetchError')
      return t('cloud_send_5xx');
    if (/invalid|email/i.test(raw) && status === 400) return t('cloud_bad_email');
    return t('cloud_send_fail', raw || t('cloud_unknown_err'));
  };

  /* ── 第一步：发验证码 ── */
  const send = $('#cSend');
  if (send) {
    send.onclick = async () => {
      const email = ($('#cEmail').value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return cErr(t('cloud_bad_email'));

      send.disabled = true; send.textContent = t('cloud_sending');
      try {
        await cloudSendCode(email);
        CLOUD.linkError = null;        // 重来一次，上一条链接的报错先撤掉
        renderProgressBody();          // 切到「输验证码」那一步
        $('#cCode')?.focus();
      } catch (e) {
        cErr(sendFail(e));
        send.textContent = t('cloud_send'); send.disabled = false;
      }
    };
  }

  /* ── 第二步：验码登录 ── */
  const verify = $('#cVerify');
  if (verify) {
    const submit = async () => {
      const code = ($('#cCode').value || '').replace(/\D/g, '');
      if (code.length < OTP_MIN || code.length > OTP_MAX) return cErr(t('cloud_bad_code_len', OTP_MIN, OTP_MAX));

      verify.disabled = true; verify.textContent = t('cloud_verifying');
      try {
        await cloudVerifyCode(CLOUD.pendingEmail, code);
        renderProgressBody();          // 成功后这里会重绘成「已登录」
      } catch (e) {
        const raw = (e && e.message) || '';
        cErr(/expired|invalid|token/i.test(raw) ? t('cloud_bad_code') : sendFail(e));
        verify.textContent = t('cloud_verify'); verify.disabled = false;
      }
    };
    verify.onclick = submit;
    // 6 位敲完直接回车即可，不用去够按钮
    $('#cCode').onkeydown = (e) => { if (e.key === 'Enter') submit(); };
  }

  const resend = $('#cResend');
  if (resend) {
    resend.onclick = async () => {
      resend.disabled = true; resend.textContent = t('cloud_sending');
      try {
        await cloudSendCode(CLOUD.pendingEmail);
        $('#cMsg').innerHTML = `<p class="sub" style="margin:10px 0 0">${esc(t('cloud_resent'))}</p>`;
      } catch (e) { cErr(sendFail(e)); }
      resend.textContent = t('cloud_resend'); resend.disabled = false;
    };
  }

  const back = $('#cBack');
  if (back) back.onclick = () => { CLOUD.pendingEmail = ''; renderProgressBody(); };

  const so = $('#cSignOut');
  if (so) so.onclick = async () => { await cloudSignOut(); renderProgressBody(); };

  const now = $('#cSyncNow') || $('#cRetry');
  if (now) now.onclick = async () => {
    if (CLOUD.user) await cloudOnSignedIn(CLOUD.user, { silent: false });
    renderProgressBody();
  };

  const del = $('#cDelete');
  if (del) del.onclick = async () => {
    if (!confirm(t('cloud_delete_confirm', CLOUD.user?.email || ''))) return;
    del.disabled = true;
    try {
      await cloudDeleteAccount();
      alert(t('cloud_deleted'));
      renderProgressBody();
    } catch (e) {
      alert(t('cloud_delete_fail', e.message || e));
      del.disabled = false;
    }
  };
}

/** 解析待导入内容并展示对比，让用户选合并还是替换。
 *  opts.fromCloud = true 时，来源列标题改成「云端」，且合并后会回推云端。 */
function stageImport(text, opts = {}) {
  let incoming;
  try { incoming = sanitizeState(JSON.parse(text)); }
  catch { alert(t('import_bad')); return; }

  PENDING = incoming;
  const f = digest(incoming), n = digest(S), m = digest(mergeState(S, incoming));
  const row = (label, key, suffix = '') =>
    `<tr><td>${esc(label)}</td><td>${num(f[key])}${suffix}</td><td>${num(n[key])}${suffix}</td>
     <td><b>${num(m[key])}${suffix}</b></td></tr>`;

  $('#progBody').innerHTML = `
    <h3 style="margin-top:0">${esc(opts.fromCloud ? t('cloud_merge_h') : t('prog_preview_h'))}</h3>
    <p class="sub">${esc(opts.fromCloud ? t('cloud_merge_sub') : t('prog_preview_sub'))}</p>
    <table class="hist">
      <thead><tr><th></th><th>${esc(opts.fromCloud ? t('cloud_col_cloud') : t('prog_col_file'))}</th>
        <th>${esc(t('prog_col_now'))}</th>
        <th>${esc(t('prog_col_after'))}</th></tr></thead>
      <tbody>
        ${row(t('prog_row_q'), 'seen')}
        ${row(t('prog_row_wrong'), 'wrong')}
        ${row(t('prog_row_notes'), 'read')}
        ${row(t('prog_row_exams'), 'exams')}
      </tbody>
    </table>
    <p class="sub" style="font-size:12.5px">${esc(t('prog_merge_note'))}</p>
    <div class="row" style="margin-top:14px">
      <button class="btn primary" id="pMerge">${esc(t('prog_do_merge'))}</button>
      <button class="btn" id="pReplace">${esc(t('prog_do_replace'))}</button>
      <span class="spacer"></span>
      <button class="link-btn" id="pCancel">${esc(t('prog_cancel'))}</button>
    </div>`;

  const finish = (msg) => {
    save(); applyTheme(); paintChrome(); updateWrongPill(); router();
    PENDING = null;
    // 云端来的：用户已经做了选择，把结果推回去，两边收敛到同一份
    if (opts.fromCloud && typeof cloudPush === 'function' && CLOUD.status !== 'signedout') {
      cloudPush().catch(() => {});
    }
    openProgress();
    alert(msg);
  };
  $('#pMerge').onclick = () => { S = mergeState(S, PENDING); finish(t('prog_merged')); };
  $('#pReplace').onclick = () => { S = PENDING; finish(t('prog_replaced')); };
  $('#pCancel').onclick = () => { PENDING = null; openProgress(); };
}

$('#progBtn').onclick = openProgress;
$('#progClose').onclick = () => { $('#progModal').hidden = true; };
$('#progModal').onclick = (e) => { if (e.target.id === 'progModal') $('#progModal').hidden = true; };
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#progModal').hidden) $('#progModal').hidden = true;
});

$('#importFile').onchange = (ev) => {
  const f = ev.target.files[0];
  if (f) f.text().then(stageImport);
  ev.target.value = '';
};

applyTheme();
paintChrome();
updateWrongPill();
router();

// sync.js 在本文件之后加载，延一拍再初始化。
// cloudInit() 内部会判断：没登录过就直接返回，一个网络请求都不发。
setTimeout(() => { if (typeof cloudInit === 'function') cloudInit(); }, 0);
