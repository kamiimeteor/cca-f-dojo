/* 错题逐项解析回归测试 —— 跑 `node scripts/test-option-explanations.js` */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const read = (path) => fs.readFileSync(path, 'utf8');
const letter = (index) => String.fromCharCode(65 + index);

const zhContext = {};
vm.createContext(zhContext);
vm.runInContext(`${read('assets/data/questions.js')}\nglobalThis.__QUESTIONS__ = QUESTIONS;`, zhContext);
const questions = zhContext.__QUESTIONS__;

const enContext = { CONTENT_EN: { questions: {} } };
vm.createContext(enContext);
vm.runInContext(read('assets/data/content.en.q1.js'), enContext);
vm.runInContext(read('assets/data/content.en.q2.js'), enContext);
const english = enContext.CONTENT_EN.questions;

assert.equal(questions.length, 168, '中文题库应有 168 题');
assert.equal(Object.keys(english).length, 168, '英文题库应覆盖 168 题');
assert.deepEqual(
  Object.keys(english).sort(),
  questions.map((q) => q.id).sort(),
  '英文题目 ID 必须与中文题库逐一对应',
);

function checkContent(items, language) {
  const vague = new Set([
    '同上。', '同上', '浪费。', '灾难性。', '幻觉。', '过度工程。', '信息不足。', '局部问题。',
    'Same.', 'Same problem.', 'Not true.', 'Wasteful.', 'Excessive.', 'Brittle.',
    'Loses data.', 'Backwards.', 'A local concern.', 'Catastrophic.', 'Hallucination.',
    'That is tool_use.', 'Over-engineering.', 'Not a count problem.',
  ]);
  for (const raw of items) {
    const q = language === 'zh' ? raw : { ...raw, ...english[raw.id], a: raw.a };
    assert(q.q && q.e, `${language} ${raw.id} 缺少题干或总解析`);
    assert.equal(q.o.length, raw.o.length, `${language} ${raw.id} 选项数量与中文不一致`);
    const answers = new Set([].concat(raw.a));
    q.o.forEach((_, index) => {
      if (answers.has(index)) return;
      assert(
        q.w && typeof q.w[index] === 'string' && q.w[index].trim(),
        `${language} ${raw.id} 选项 ${letter(index)} 缺少逐项解析`,
      );
      assert(!vague.has(q.w[index].trim()), `${language} ${raw.id} 选项 ${letter(index)} 的解析过于含糊`);
    });
  }
}

checkContent(questions, 'zh');
checkContent(questions, 'en');

const app = read('assets/app.js');
const css = read('assets/styles.css');

assert.match(app, /function optionExplanations\(q\)/, 'app.js 应统一生成逐项解析数组');
assert.match(app, /answerBreakdownHtml\(q, pickSet, ansSet, correct\)/, '判分流程应统一处理答对/答错的逐项解析');
assert.match(app, /option-row correct/, '正确项应有独立状态类');
assert.match(app, /option-row picked-wrong/, '用户错选项应有独立状态类');
assert.match(css, /\.option-explanations-table/, '缺少桌面端逐项解析表样式');
assert.match(css, /\.option-explanations-table[^}]*display:\s*block/s, '小屏幕应把逐项解析表改为堆叠布局');

const normalizerSource = app.slice(
  app.indexOf('function optionExplanations(q)'),
  app.indexOf('/** Domain 视图 */'),
);
const rendererSource = app.slice(
  app.indexOf('function optionExplanationHtml(q, pickSet, ansSet)'),
  app.indexOf('function revealAnswer(q, picked, root)'),
);
const labels = {
  q_option_breakdown: '逐项解析', q_option_col: '选项', q_explanation_col: '解析',
  q_option_correct: '正确答案', q_option_selected: '你的选择',
};
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const renderFactory = new Function('t', 'esc', 'md', 'LTR',
  `${normalizerSource}\n${rendererSource}\nreturn { optionExplanations, questionView, optionExplanationHtml, answerBreakdownHtml };`);
const { optionExplanations, questionView, optionExplanationHtml, answerBreakdownHtml } = renderFactory(
  (key) => labels[key] || key, escapeHtml, escapeHtml, ['A', 'B', 'C', 'D'],
);
const sample = {
  id: 'sample', o: ['<Bash>', 'Task', 'Read', 'Grep'], a: 1, e: 'Task creates subagents.',
  w: { 0: 'Runs shell commands.', 2: 'Reads a known file.', 3: 'Searches file contents.' },
};
sample.optionExplanations = optionExplanations(sample);
const rendered = optionExplanationHtml(sample, new Set([3]), new Set([1]));
assert.match(rendered, /option-row correct/, '运行时渲染应标记正确项');
assert.match(rendered, /option-row picked-wrong/, '运行时渲染应标记用户错选项');
assert.match(rendered, /&lt;Bash&gt;/, '运行时渲染必须转义选项内容');
assert.equal((rendered.match(/class="option-row/g) || []).length, 4, '运行时渲染应输出全部四个选项');
assert.equal(answerBreakdownHtml(sample, new Set([1]), new Set([1]), true), '', '答对时不应展示逐项解析');
assert.equal(answerBreakdownHtml(sample, new Set([3]), new Set([1]), false), rendered, '答错时应展示逐项解析');

const multi = {
  o: ['One', 'Two', 'Three', 'Four'], a: [0, 2], e: 'One and Three are correct.',
  w: { 1: 'Two is wrong here.', 3: 'Four is wrong here.' },
};
multi.optionExplanations = optionExplanations(multi);
const multiRendered = answerBreakdownHtml(multi, new Set([1, 3]), new Set([0, 2]), false);
assert.equal((multiRendered.match(/option-row correct/g) || []).length, 2, '多选题应标记所有正确项');
assert.equal((multiRendered.match(/option-row picked-wrong/g) || []).length, 2, '多选题应标记所有用户错选项');

const englishView = questionView(sample, 'en', { questions: {
  sample: { q: 'English question', o: ['EN A', 'EN B', 'EN C', 'EN D'], e: 'English answer',
    w: { 0: 'EN wrong A', 2: 'EN wrong C', 3: 'EN wrong D' } },
} });
assert.equal(englishView.q, 'English question', '英文视图应读取英文题干');
assert.deepEqual(englishView.optionExplanations,
  ['EN wrong A', 'English answer', 'EN wrong C', 'EN wrong D'], '英文逐项解析不得混入中文内容');

const incomplete = { ...sample, w: { 0: 'Runs shell commands.', 2: '', 3: 'Searches file contents.' } };
incomplete.optionExplanations = optionExplanations(incomplete);
assert.equal(
  optionExplanationHtml(incomplete, new Set([3]), new Set([1])), '',
  '运行时数据意外缺项时应保留原反馈，不渲染残缺表格',
);

assert.match(css, /\.option-row\.correct \.option-letter\s*\{[^}]*color:\s*var\(--paper\)/,
  '深浅主题的正确项字母应使用主题感知的高对比文字');
assert.match(css, /\.option-row\.picked-wrong \.option-letter\s*\{[^}]*color:\s*var\(--paper\)/,
  '深浅主题的错选项字母应使用主题感知的高对比文字');
assert.match(css, /\.option-row\.correct \.option-status\s*\{[^}]*color:\s*var\(--ink\)/,
  '正确状态标签应使用高对比正文色');
assert.match(css, /\.option-row\.picked-wrong \.option-status\s*\{[^}]*color:\s*var\(--ink\)/,
  '错选状态标签应使用高对比正文色');

const cssBlock = (selector) => css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] || '';
const cssValue = (block, name) => block.match(new RegExp(`--${name}:\\s*#([0-9a-f]{6})`, 'i'))?.[1];
const rgb = (hex) => hex.match(/\w\w/g).map((part) => parseInt(part, 16));
const luminance = (hex) => {
  const channel = rgb(hex).map((value) => value / 255)
    .map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel[0] + 0.7152 * channel[1] + 0.0722 * channel[2];
};
const contrast = (left, right) => {
  const [bright, dark] = [luminance(left), luminance(right)].sort((a, b) => b - a);
  return (bright + 0.05) / (dark + 0.05);
};
for (const [theme, block] of [['light', cssBlock(':root')], ['dark', cssBlock('\\[data-theme="dark"\\]')]]) {
  const paper = cssValue(block, 'paper');
  assert(contrast(paper, cssValue(block, 'ok')) >= 4.5, `${theme} 主题正确项字母对比度不足`);
  assert(contrast(paper, cssValue(block, 'bad')) >= 4.5, `${theme} 主题错选项字母对比度不足`);
}

console.log('✓ 168 道题的中英文逐项解析完整，错误答案表格仅在答错时展示');
