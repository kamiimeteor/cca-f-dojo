/* 导入存档校验回归测试 —— 跑 `node scripts/test-import-guard.js`
 *
 * 背景：sanitizeState() 是「收紧」不是「校验」，对任何认不出的输入都返回一份空存档。
 * 所以 stageImport() 必须先用 looksLikeArchive() 把关，否则导入 `{}` 之后点「替换」
 * 会一键清空本地进度（无二次确认、不可撤销）。
 *
 * app.js 是浏览器脚本、没有模块导出，直接 require 会因为访问 DOM 而崩，
 * 所以按仓库既有测试的做法从源码里抠出目标函数，放进独立沙箱里跑。 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('assets/app.js', 'utf8');

const keysMatch = source.match(/^const ARCHIVE_KEYS = \[[\s\S]*?\];\n/m);
assert(keysMatch, 'assets/app.js 缺少 ARCHIVE_KEYS');
const fnMatch = source.match(/^function looksLikeArchive\([\s\S]*?^}\n/m);
assert(fnMatch, 'assets/app.js 缺少 looksLikeArchive()');

const sandbox = {};
vm.runInNewContext(`${keysMatch[0]}${fnMatch[0]}`, sandbox, { filename: 'looksLikeArchive.js' });
const { looksLikeArchive } = sandbox;
assert.equal(typeof looksLikeArchive, 'function', 'looksLikeArchive 未能载入');

/* ---- 必须拒绝：合法 JSON，但不是存档 ---- */
const rejects = [
  ['{}', '空对象'],
  ['[]', '空数组'],
  ['[{"qstats":{}}]', '数组包着存档'],
  ['"hello"', '字符串'],
  ['123', '数字'],
  ['null', 'null'],
  ['true', '布尔'],
  ['{"foo":"bar"}', '无关对象'],
  ['{"Qstats":{}}', 'key 大小写不符'],
];
for (const [json, label] of rejects) {
  assert.equal(
    looksLikeArchive(JSON.parse(json)), false,
    `应拒绝 ${label}：${json}`,
  );
}

/* ---- 必须接受：真实存档，包括全新用户导出的空存档 ---- */
const accepts = [
  ['{"qstats":{},"wrong":{},"exams":[],"marks":[],"read":[],"prefs":{"theme":"light","lang":"zh"}}', '全新用户的空存档'],
  ['{"qstats":{"q001":{"seen":1,"ok":1,"no":0,"streak":1,"last":true}}}', '只有 qstats'],
  ['{"prefs":{"theme":"dark"}}', '只有 prefs'],
  ['{"read":["1.1"]}', '只有 read'],
  ['{"exams":[]}', '只有 exams'],
  ['{"marks":["q005"]}', '只有 marks'],
  ['{"wrong":{}}', '只有 wrong'],
  ['{"qstats":{},"unknownFuture":1}', '带未来新增字段'],
];
for (const [json, label] of accepts) {
  assert.equal(
    looksLikeArchive(JSON.parse(json)), true,
    `应接受 ${label}：${json}`,
  );
}

/* ---- 继承来的 key 不算命中 ---- */
assert.equal(
  looksLikeArchive(Object.create({ qstats: {} })), false,
  'qstats 只在原型链上时不应算存档',
);

/* ---- stageImport 必须在 sanitizeState 之前调用这道闸 ---- */
const stage = source.match(/^function stageImport\([\s\S]*?^}\n/m);
assert(stage, 'assets/app.js 缺少 stageImport()');
const guardAt = stage[0].indexOf('looksLikeArchive');
const sanitizeAt = stage[0].indexOf('sanitizeState');
assert(guardAt !== -1, 'stageImport() 没有调用 looksLikeArchive()');
assert(sanitizeAt !== -1, 'stageImport() 没有调用 sanitizeState()');
assert(
  guardAt < sanitizeAt,
  'looksLikeArchive() 必须在 sanitizeState() 之前 —— 否则闸门形同虚设',
);

console.log(`✓ 导入校验：拒绝 ${rejects.length} 种非存档 JSON，接受 ${accepts.length} 种真实存档，闸门在 sanitizeState 之前`);
