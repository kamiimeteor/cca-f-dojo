/* 当前部署的数据存储说明；启用云同步前须同步更新。 */
const PRIVACY_UPDATED = '2026-09-27';
const CONTACT_EMAIL = 'aicrazy@agent.qq.com';

const PRIVACY = {
  zh: [
    { t: 'p', v: 'cca-p-dojo 是 Claude Certified Architect – Professional 备考站。当前未启用云同步，学习数据只存在本机浏览器 localStorage，不上传到 Supabase。' },
    { t: 'h', v: '本地存储' },
    { t: 'list', v: [
      '`ccap.v1` 保存作答记录、错题、模考成绩、笔记进度、收藏和界面偏好。',
      '`ccap.theme` 保存深浅色主题偏好。',
    ] },
    { t: 'h', v: '管理数据' },
    { t: 'p', v: '可在「管理进度」中导出、导入或清空学习进度。导出的文件由你自行保管；清除浏览器站点数据也会删除本机存储。' },
    { t: 'h', v: '云同步状态' },
    { t: 'p', v: '仓库 cca-p-dojo 保留同步代码和 supabase/schema.sql，但当前配置的 url 与 key 均为空，登录和云同步功能未启用。启用前需要配置独立的 Supabase 项目，并按实际部署更新本说明。' },
  ],
  en: [
    { t: 'p', v: 'cca-p-dojo is a study site for Claude Certified Architect – Professional. Cloud sync is currently disabled. Study data stays in this browser’s localStorage and is not uploaded to Supabase.' },
    { t: 'h', v: 'Local storage' },
    { t: 'list', v: [
      '`ccap.v1` stores answers, missed questions, mock exam results, reading progress, bookmarks and interface preferences.',
      '`ccap.theme` stores the light or dark theme preference.',
    ] },
    { t: 'h', v: 'Managing your data' },
    { t: 'p', v: 'Use Manage progress to export, import or clear study progress. You control exported files. Clearing browser site data also removes local storage.' },
    { t: 'h', v: 'Cloud sync status' },
    { t: 'p', v: 'The cca-p-dojo repository retains sync code and supabase/schema.sql. Both configuration values, url and key, are currently empty, so sign-in and cloud sync are disabled. Enabling them requires a separate Supabase project and an updated description of the deployed service.' },
  ],
};
