(() => {
  'use strict';
  const copy = {
    zh: {
      switchApp:'切换应用',home:'signal0 首页',foundation:'CCA-F 备考站',professional:'CCA-P 备考站',courses:'AI 课程',
      system:'跟随系统',light:'浅色',dark:'深色',theme:'主题',login:'登录',account:'我的学习',loadingAccount:'读取账号…',
      eyebrow:'SIGNAL0 / 学习与练习',heading:'今天，学什么？',intro:'准备认证考试，或学习 AI 课程。',
      practiceHeading:'免费双语备考练习',practiceDescription:'依据 Anthropic 官方 Exam Guide 编写，提供练习、复习笔记与模拟考试。',
      foundationDescription:'168 道原创情景题 · 复习笔记与模拟考试 · 中英双语',professionalDescription:'190 道原创情景题 · 7 个考点领域 · 中英双语',
      freePractice:'免费练习',enterPractice:'进入练习站',courseDescription:'中英对照课程，配合视频、讲义与练习学习。',footer:'signal0 · 开发者学习与测验',
      unlock:'购买后解锁',soon:'即将上线',purchased:'已购买',readingPurchase:'读取购买状态…',checkPurchase:'查看购买状态',continue:'继续学习',buy:'购买课程',
      preparing:'课程正在准备中，上线后开放学习。',codingDescription:'中英对照课程 · 字幕视频、图文讲义与学习进度',uiDescription:'中英对照课程 · 交互演示与视频',
      bundle:'课程套餐',bundleTitle:n=>`${n} 门一起学`,bundleDescription:(n,titles)=>`${n} 门现在可学${titles.length ? `；${titles.join('、')} 上线后开通` : ''}。`,
      saving:n=>`比单买省 ¥${n}`,ownedCourses:'查看已购课程',viewBundle:'查看套餐',loadingCourses:'正在加载 AI 课程…',courseError:'AI 课程暂时无法加载。',retry:'重新加载',localOnly:'请通过本地开发服务器打开首页。',
    },
    en: {
      switchApp:'Switch app',home:'signal0 home',foundation:'CCA-F study',professional:'CCA-P study',courses:'AI courses',
      system:'System',light:'Light',dark:'Dark',theme:'Theme',login:'Sign in',account:'My learning',loadingAccount:'Loading account…',
      eyebrow:'SIGNAL0 / LEARN & PRACTICE',heading:'What will you learn today?',intro:'Prepare for a certification or take an AI course.',
      practiceHeading:'Free bilingual exam practice',practiceDescription:'Practice questions, revision notes and mock exams based on the official Anthropic Exam Guide.',
      foundationDescription:'168 original scenario questions · Revision notes and mock exams · Chinese and English',professionalDescription:'190 original scenario questions · 7 exam domains · Chinese and English',
      freePractice:'Free practice',enterPractice:'Start practicing',courseDescription:'Learn with bilingual videos, notes and exercises.',footer:'signal0 · Learning and practice for developers',
      unlock:'Purchase to unlock',soon:'Coming soon',purchased:'Purchased',readingPurchase:'Checking access…',checkPurchase:'Check access',continue:'Continue learning',buy:'Buy course',
      preparing:'This course is being prepared. Lessons will open when it launches.',codingDescription:'Chinese and English · Captioned videos, illustrated notes and learning progress',uiDescription:'Chinese and English · Interactive demos and videos',
      bundle:'Course bundle',bundleTitle:n=>`${n} courses together`,bundleDescription:(n,titles)=>`${n} courses available now${titles.length ? `; ${titles.join(', ')} unlocks at launch` : ''}.`,
      saving:n=>`Save ¥${n} compared with individual courses`,ownedCourses:'View your courses',viewBundle:'View bundle',loadingCourses:'Loading AI courses…',courseError:'AI courses could not be loaded.',retry:'Try again',localOnly:'Open this page through the local development server.',
    },
  };
  let lang='zh';
  try { lang=localStorage.getItem('signal0.lang') || JSON.parse(localStorage.getItem('ccae.v2'))?.prefs?.lang || 'zh'; } catch {}
  if (!copy[lang]) lang='zh';
  const t=(key,...args)=>typeof copy[lang][key] === 'function' ? copy[lang][key](...args) : copy[lang][key];
  window.HubI18n={t,get lang(){return lang;}};
  const account=document.getElementById('hubAccount');
  function updateAccount() {
    const status=typeof Auth === 'undefined' ? 'signedout' : Auth.state.status;
    account.textContent=t(status==='signedin'?'account':status==='loading'?'loadingAccount':'login');
  }
  function updateTheme() {
    const preference=Signal0Chrome.preference;
    const label=`${t('theme')}: ${t(preference)}`;
    document.getElementById('themeBtn').setAttribute('aria-label',label);
    document.getElementById('themeBtn').title=label;
    document.querySelectorAll('[data-theme-choice]').forEach(button=>{
      const selected=button.dataset.themeChoice===preference;
      button.classList.toggle('on',selected); button.setAttribute('aria-pressed',String(selected));
    });
  }
  function translate() {
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.title=t('footer');
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.getElementById('hubLangCur').textContent=lang==='zh'?'中文':'English';
    document.querySelector('.brand').setAttribute('aria-label',t('home'));
    document.getElementById('practiceEntries').setAttribute('aria-label',t('practiceHeading'));
    document.getElementById('courseEntries').setAttribute('aria-label',t('courses'));
    document.querySelectorAll('[data-hub-lang]').forEach(button=>{
      const selected=button.dataset.hubLang===lang;
      button.classList.toggle('on',selected);button.setAttribute('aria-pressed',String(selected));
    });
    updateAccount();updateTheme();dispatchEvent(new Event('signal0-language-change'));
  }
  const menus=[['hubLangBtn','hubLangMenu'],['themeBtn','themeMenu'],['appswitchBtn','appswitchMenu']];
  function closeMenus(except) {
    for(const [buttonId,menuId] of menus) if(menuId!==except){document.getElementById(menuId).hidden=true;document.getElementById(buttonId).setAttribute('aria-expanded','false');}
  }
  for(const [buttonId,menuId] of menus.slice(0,2)) {
    const button=document.getElementById(buttonId),menu=document.getElementById(menuId);
    button.addEventListener('click',()=>{const open=menu.hidden;closeMenus();menu.hidden=!open;button.setAttribute('aria-expanded',String(open));});
  }
  document.getElementById('appswitchBtn').addEventListener('click',()=>closeMenus('appswitchMenu'));
  document.addEventListener('click',event=>{if(!event.target.closest('.hub-menu-wrap,.appswitch-wrap'))closeMenus();});
  document.addEventListener('keydown',event=>{
    const open=menus.find(([,id])=>!document.getElementById(id).hidden);
    if(event.key==='Escape' && open){closeMenus();document.getElementById(open[0]).focus();}
  });
  document.querySelectorAll('[data-hub-lang]').forEach(button=>button.addEventListener('click',()=>{
    lang=button.dataset.hubLang;try{localStorage.setItem('signal0.lang',lang);}catch{}translate();closeMenus();document.getElementById('hubLangBtn').focus();
  }));
  document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{
    Signal0Chrome.setTheme(button.dataset.themeChoice);updateTheme();closeMenus();document.getElementById('themeBtn').focus();
  }));
  addEventListener('signal0-theme-change',updateTheme);
  addEventListener('storage',event=>{if(event.key==='signal0.lang'){lang=event.newValue==='en'?'en':'zh';translate();}});
  if(typeof Auth !== 'undefined') Auth.onChange(updateAccount);
  translate();
})();
