/* cca-p-dojo 暂未配置云同步，留空时纯本地模式 */
const SUPABASE_CONFIG = {
  url: '',
  key: '',
};

/** 没配就整个功能隐藏 */
const CLOUD_ENABLED = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.key);
