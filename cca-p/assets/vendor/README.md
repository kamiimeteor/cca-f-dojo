# vendor

第三方运行时依赖，**刻意收进仓库自托管**，不走 CDN。

## supabase-js-2.111.0.umd.js

- 来源：`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0/dist/umd/supabase.js`
- 官方 UMD 独立构建，自包含无外部依赖，加载后挂在 `window.supabase`

### 为什么不从 CDN 动态加载

原先是 `import('https://esm.sh/@supabase/supabase-js@2')`，三个问题：

1. **中国大陆访问不稳定** —— 本站主要面向中文用户，esm.sh 经常慢或不可达，登录会直接失败
2. **隐私政策没披露的第三方请求** —— 登录时会向 esm.sh 发请求，与「无第三方追踪」的定位冲突
3. **多一个运行时外部依赖 = 多一类线上故障**

自托管同时保留了懒加载：未登录用户不会加载这个文件，一个字节都不下。

### 升级方式

```bash
V=2.111.0   # 换成目标版本
curl -sL "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@$V/dist/umd/supabase.js" \
  -o assets/vendor/supabase-js-$V.umd.js
```

然后改 `assets/sync.js` 里的 `SDK_PATH`，删掉旧版本文件，并在 `index.html` 里提升 `?v=` 版本号。
