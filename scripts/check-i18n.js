/* 文案自检 —— 跑 `node scripts/check-i18n.js`
 *
 * 两类问题各踩过不止一次，固化成脚本：
 *   1. 中英文案 key 不对齐 —— 少一条，切语言时那一处就空了
 *   2. 含 markdown（**加粗** / `代码`）的文案被 esc() 渲染 —— 星号会原样漏到界面上
 */
const fs = require('fs');
const read = (p) => fs.readFileSync(p, 'utf8');

const I18N = new Function(read('assets/data/i18n.js') + ';return I18N')();
const src = read('assets/app.js') + read('assets/sync.js');

let bad = 0;

const zh = Object.keys(I18N.zh), en = Object.keys(I18N.en);
const miss = zh.filter((k) => !en.includes(k)).concat(en.filter((k) => !zh.includes(k)));
if (miss.length) { console.error('✗ 中英 key 不对齐:', miss.join(', ')); bad++; }
else console.log('✓ 中英 key 对齐（各 ' + zh.length + ' 条）');

const rich = zh.filter((k) => /\*\*|`/.test(String(I18N.zh[k])) || /\*\*|`/.test(String(I18N.en[k] || '')));
const escaped = [];
for (const k of rich) {
  const re = new RegExp('(esc|md)\\(\\s*t\\(\\s*[\'"]' + k + '[\'"]', 'g');
  const uses = [...src.matchAll(re)].map((m) => m[1]);
  if (uses.includes('esc')) escaped.push(k);
}
if (escaped.length) { console.error('✗ 含 markdown 却用 esc() 渲染:', escaped.join(', ')); bad++; }
else console.log('✓ ' + rich.length + ' 条含 markdown 的文案都用 md() 渲染');

process.exit(bad ? 1 : 0);
