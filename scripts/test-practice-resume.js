/* Domain 续做逻辑回归测试 —— 跑 `node scripts/test-practice-resume.js` */
const assert = require('assert');
const fs = require('fs');

const source = fs.readFileSync('assets/app.js', 'utf8');
const match = source.match(/^function buildPracticeResume\([\s\S]*?^}\n/m);
assert(match, 'assets/app.js 缺少 buildPracticeResume()');

const buildPracticeResume = new Function(
  'shuffle',
  `${match[0]}; return buildPracticeResume;`,
)((items) => [...items]);

const questions = Array.from({ length: 44 }, (_, i) => ({ id: `q${i + 1}` }));
const qstats = Object.fromEntries(questions.slice(0, 5).map((q, i) => [
  q.id,
  { seen: 1, last: i !== 3 },
]));

const resumed = buildPracticeResume(questions, qstats);
assert.equal(resumed.i, 5, '已做 5 题后应从索引 5，即第 6 题继续');
assert.equal(resumed.list.length, 44);
assert.deepEqual(resumed.list.slice(0, 5).map((q) => q.id), ['q1', 'q2', 'q3', 'q4', 'q5']);
assert.deepEqual(resumed.results, [true, true, true, false, true]);
assert.equal(qstats[resumed.list[resumed.i].id], undefined, '当前题必须是未做题');

const restarted = buildPracticeResume(
  questions,
  Object.fromEntries(questions.map((q) => [q.id, { seen: 1, last: true }])),
);
assert.equal(restarted.i, 0, '全部完成后应从第 1 题开启新一轮');
assert.deepEqual(restarted.results, []);

console.log('✓ Domain 续做：5 / 44 后从第 6 题继续，全部完成后开启新一轮');
