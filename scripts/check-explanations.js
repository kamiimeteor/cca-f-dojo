/* 逐项解析完整性自检 —— 跑 `node scripts/check-explanations.js` */
const fs = require('fs');
const read = (path) => fs.readFileSync(path, 'utf8');

const QUESTIONS = new Function(read('assets/data/questions.js') + ';return QUESTIONS')();
const CONTENT_EN = { questions: {} };
new Function('CONTENT_EN', read('assets/data/content.en.q1.js'))(CONTENT_EN);
new Function('CONTENT_EN', read('assets/data/content.en.q2.js'))(CONTENT_EN);

let bad = 0;
const fail = (message) => {
  console.error('✗ ' + message);
  bad++;
};
const hasExplanation = (w, index) =>
  w && typeof w[index] === 'string' && w[index].trim().length > 0;
const indexSet = (w, optionCount, label) => {
  const indexes = Object.keys(w || {});
  for (const rawIndex of indexes) {
    const index = Number(rawIndex);
    const valid = /^(0|[1-9]\d*)$/.test(rawIndex) &&
      Number.isSafeInteger(index) && index < optionCount;
    if (!valid) fail(`${label} w 下标 ${rawIndex} 非法（选项数：${optionCount}）`);
  }
  return indexes.sort((left, right) => Number(left) - Number(right));
};

for (const question of QUESTIONS) {
  const english = CONTENT_EN.questions[question.id];
  if (!english) {
    fail(`${question.id} 缺少英文题目`);
    continue;
  }

  const answers = new Set([].concat(question.a));
  for (let index = 0; index < question.o.length; index++) {
    if (answers.has(index)) continue;
    const key = `${question.id}#${index}`;

    if (!hasExplanation(question.w, index)) {
      fail(`${key} 缺少中文 w`);
    } else if (Array.from(question.w[index].trim()).length < 10) {
      fail(`${key} 中文 w 过短（${Array.from(question.w[index].trim()).length} 字，至少 10 字）`);
    }

    if (!hasExplanation(english.w, index)) {
      fail(`${key} 缺少英文 w`);
    } else if (english.w[index].trim().length < 20) {
      fail(`${key} 英文 w 过短（${english.w[index].trim().length} 字符，至少 20 字符）`);
    }
  }

  if (question.near !== undefined && question.near !== null) {
    const key = `${question.id}#${question.near}`;
    if (!Number.isInteger(question.near) || question.near < 0 || question.near >= question.o.length) {
      fail(`${question.id} 的 near=${question.near} 不是有效选项下标`);
    } else if (answers.has(question.near)) {
      fail(`${key} 的 near 命中正确答案`);
    } else {
      if (!hasExplanation(question.w, question.near)) fail(`${key} 是 near，但缺少中文 w`);
      if (!hasExplanation(english.w, question.near)) fail(`${key} 是 near，但缺少英文 w`);
    }
  }

  const zhIndexes = indexSet(question.w, question.o.length, `${question.id} 中文`);
  const enIndexes = indexSet(english.w, question.o.length, `${question.id} 英文`);
  if (zhIndexes.join(',') !== enIndexes.join(',')) {
    fail(`${question.id} 中英 w 下标不一致（zh: ${zhIndexes.join(',') || '无'}；en: ${enIndexes.join(',') || '无'}）`);
  }
}

const known = new Set(QUESTIONS.map((question) => question.id));
for (const id of Object.keys(CONTENT_EN.questions)) {
  if (!known.has(id)) fail(`${id} 只有英文题目，没有对应中文题目`);
}

if (!bad) console.log(`✓ ${QUESTIONS.length} 道题的中英文逐项解析完整，长度、near 和 w 下标均通过校验`);
process.exit(bad ? 1 : 0);
