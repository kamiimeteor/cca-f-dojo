// 首页只展示商品信息；课程文件的访问权限由服务端检查。
(() => {
  'use strict';
  const entries = document.getElementById('courseEntries');
  const state = document.getElementById('courseCatalogState');
  const bundleArea = document.getElementById('courseBundle');
  let catalog, access = new Set(), owned = new Set(), accountReady = false, accountError = false;
  let generation = 0;
  const t = (...args) => window.HubI18n.t(...args);
  const yuan = cents => (cents / 100).toFixed(2);
  const node = (tag, className, text) => { const el = document.createElement(tag); el.className = className; el.textContent = text; return el; };
  const coursePath = course => course.companion?.local_url ? course.companion.local_url + 'learn/' : `/learn/#/c/${course.id}`;
  const lock = () => {
    const wrap = node('span', 'course-lock', ''); wrap.setAttribute('aria-label', t('unlock'));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', 'M7 10V7a5 5 0 0 1 10 0v3M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm6 4v3');
    svg.append(path); wrap.append(svg); return wrap;
  };
  const action = (tag, className, label, showArrow = true) => {
    const el = node(tag, className, '');
    el.append(node('span', '', label));
    if (showArrow) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'cta-arrow'); svg.setAttribute('viewBox', '0 0 20 20');
      svg.setAttribute('fill', 'none'); svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', 'M4 10h12m-5-5 5 5-5 5'); path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.7'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
      svg.append(path); el.append(svg);
    }
    return el;
  };
  function render() {
    if (!catalog) return;
    const courses = catalog.products.filter(c => c.kind === 'course' && c.status !== 'draft');
    const upcoming = catalog.coming_soon || [];
    const cards = document.createDocumentFragment();
    for (const [index, c] of [...courses, ...upcoming.map(c => ({...c, upcoming: true}))].entries()) {
      const unlocked = access.has(c.id);
      const card = node(c.upcoming ? 'article' : 'a', `card course-card${c.upcoming ? ' is-upcoming' : ''}`, '');
      card.dataset.courseId = c.id;
      if (!c.upcoming) card.href = unlocked ? coursePath(c) : `/learn/#/buy/${encodeURIComponent(c.id)}`;
      const heading = node('span', 'course-card-heading', '');
      heading.append(node('span', 'number', `${String(index + 1).padStart(2, '0')} / ${t('courses')}`));
      if (!c.upcoming && !unlocked) heading.append(lock());
      const bottom = node('span', 'card-bottom', '');
      if (c.upcoming) bottom.append(node('span', 'status status-soon', t('soon')));
      else {
        bottom.append(node('span', unlocked ? 'status' : 'course-price', unlocked ? t('purchased') : `¥${yuan(c.price_cents)}`));
        bottom.append(action('span', `enter${!accountReady ? ' enter--pending' : !unlocked && !accountError ? ' enter--purchase' : ''}`, !accountReady ? t('readingPurchase') : accountError ? t('checkPurchase') : unlocked ? t('continue') : t('buy'), accountReady));
      }
      card.append(heading, node('h3', '', c.companion?.name || c.title), node('p', 'description', c.upcoming ? t('preparing') : c.id === 'ai-coding' ? t('codingDescription') : t('uiDescription')), bottom);
      cards.append(card);
    }
    entries.replaceChildren(cards);
    bundleArea.replaceChildren();
    for (const b of catalog.products.filter(p => p.kind === 'bundle')) {
      const promised = b.promised_includes || b.includes;
      const waiting = upcoming.filter(c => promised.includes(c.id));
      const included = courses.filter(c => b.includes.includes(c.id));
      const original = [...included, ...waiting].reduce((n,c) => n + c.price_cents, 0);
      const box = node('section', 'bundle-offer', '');
      const copy = node('div', '', '');
      copy.append(node('p', 'number', t('bundle')), node('h3', '', t('bundleTitle', promised.length)), node('p', 'bundle-description', t('bundleDescription',included.length,waiting.map(c=>c.title))));
      const actions = node('div', 'bundle-action', '');
      const price = node('p', 'bundle-price', `¥${yuan(b.price_cents)}`);
      if (original > b.price_cents) price.append(node('s', '', `¥${yuan(original)}`), node('span', 'bundle-saving', t('saving',yuan(original-b.price_cents))));
      const link = action('a', 'bundle-button', owned.has(b.id) ? t('ownedCourses') : t('viewBundle'));
      link.href = owned.has(b.id) ? '/learn/#/me' : `/learn/#/buy/${b.id}`;
      actions.append(price, link); box.append(copy, actions); bundleArea.append(box);
    }
  }
  async function refreshAccount() {
    const request = ++generation;
    access = new Set(); owned = new Set(); accountError = false;
    accountReady = Auth.state.status !== 'loading';
    render();
    if (Auth.state.status !== 'signedin') return;
    accountReady = false; render();
    try {
      const sb = await Auth.client();
      const [rights, purchases] = await Promise.all([sb.rpc('my_course_access'), sb.from('entitlements').select('product_id')]);
      if (request !== generation) return;
      if (rights.error || purchases.error) throw new Error('access');
      access = new Set((rights.data || []).map(r => typeof r === 'string' ? r : r.course_id));
      owned = new Set((purchases.data || []).map(r=>r.product_id));
    } catch { if (request === generation) accountError = true; }
    if (request === generation) { accountReady = true; render(); }
  }
  async function loadCourses() {
    state.textContent = t('loadingCourses'); state.hidden = false;
    try {
      const response = await fetch('/learn/assets/catalog.json', {cache:'no-cache'});
      if (!response.ok) throw new Error('catalog');
      catalog = await response.json();
      if (!Array.isArray(catalog.products)) throw new Error('catalog');
      render(); state.hidden = true;
    } catch {
      state.textContent = t('courseError');
      const retry = node('button', '', t('retry')); retry.type = 'button';
      retry.addEventListener('click', loadCourses, {once:true}); state.append(' ', retry);
    }
  }
  if (location.protocol === 'file:') { state.textContent = t('localOnly'); return; }
  addEventListener('signal0-language-change', () => { render(); if(!state.hidden) loadCourses(); });
  Auth.onChange(refreshAccount);
  loadCourses(); Auth.init();
  addEventListener('pageshow', event => { if(event.persisted) refreshAccount(); });
})();
