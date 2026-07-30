/* 进度条状态颜色回归测试 —— 跑 `node scripts/test-progress-colors.js` */
const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('assets/styles.css', 'utf8');
const root = css.match(/:root\s*{([\s\S]*?)\n}/)?.[1] || '';
const dark = css.match(/\[data-theme="dark"\]\s*{([\s\S]*?)\n}/)?.[1] || '';
const value = (block, name) => block.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();

for (const [theme, block] of [['light', root], ['dark', dark]]) {
  const current = value(block, 'current');
  assert(current, `${theme} 主题缺少 --current 颜色`);
  assert.notEqual(current, value(block, 'bad'), `${theme} 主题的当前题不能与错题同色`);
  assert.notEqual(current, value(block, 'coral'), `${theme} 主题的当前题不能继续使用红色强调色`);
}

assert.match(
  css,
  /\.progress-strip i\.cur\s*{[^}]*background:\s*var\(--current\);[^}]*transform:\s*scaleY\(/,
  '当前题应使用独立颜色，并通过粗细与其他状态区分',
);

console.log('✓ 进度条状态：绿色答对、红色答错、紫色加粗表示当前、浅灰表示未做');
