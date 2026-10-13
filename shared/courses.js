// 首页和详情页读取同一份目录；编辑预览由本地服务提供草稿数据。
(() => {
  'use strict';
  const entries = document.getElementById('courseEntries');
  const state = document.getElementById('courseCatalogState');
  const preview = document.getElementById('coursePreviewNote');
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };

  async function loadCourses() {
    state.textContent = '正在加载 AI 课程…';
    state.hidden = false;
    try {
      const response = await fetch('/learn/assets/catalog.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Catalog: ${response.status}`);
      const catalog = await response.json();
      if (!Array.isArray(catalog.products)) throw new Error('Invalid catalog');
      const courses = catalog.products.filter(course => course.kind === 'course' &&
        course.active !== false && /^[a-z0-9-]+$/.test(course.id));
      const cards = document.createDocumentFragment();
      for (const [index, course] of courses.entries()) {
        const card = element('a', 'card', '');
        card.dataset.courseId = course.id;
        const bilingualPath = course.id === 'ai-for-ui' ? '/tutorials/aiforui/learn/'
          : course.id === 'ai-coding' ? '/tutorials/ai-coding/learn/' : null;
        const bilingualCourse = !!bilingualPath;
        card.href = bilingualPath || `/learn/#/c/${encodeURIComponent(course.id)}`;
        const sourceOnly = course.companion?.kind === 'exercises';
        const bottom = element('span', 'card-bottom', '');
        bottom.append(
          element('span', 'status', course.status === 'draft' ? '草稿 · 预览' : '开始学习'),
          element('span', 'enter', bilingualCourse ? '进入双语课程 →' : '查看课程 →'),
        );
        card.append(
          element('span', 'number', `${String(index + 1).padStart(2, '0')} / AI 课程`),
          element('h3', '', course.companion?.name || course.title),
          element('p', 'description', bilingualCourse ? (course.id === 'ai-coding' ? '中英对照课程 · 字幕视频、图文讲义与学习进度' : '中英对照课程 · 交互演示与视频') : `${course.title} · ${sourceOnly ? '原课练习资料' : '原课程'}、中文精讲与习题`),
          bottom,
        );
        cards.append(card);
      }
      entries.querySelectorAll('[data-course-id]').forEach(card => card.remove());
      entries.append(cards);
      preview.hidden = !courses.some(course => course.status === 'draft');
      state.textContent = courses.length ? '' : 'AI 课程正在准备中，发布后将在这里展示。';
      state.hidden = courses.length > 0;
    } catch {
      state.textContent = 'AI 课程暂时无法加载。';
      const retry = element('button', '', '重新加载');
      retry.type = 'button';
      retry.addEventListener('click', loadCourses, { once: true });
      state.append(' ', retry);
    }
  }
  if (location.protocol === 'file:') {
    state.textContent = '请通过本地开发服务器打开首页，以加载 AI 课程。';
    return;
  }
  loadCourses();
})();
