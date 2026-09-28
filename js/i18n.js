/* ============================================================
   炜 · 个人网站 — 中英文翻译字典
   ============================================================ */
'use strict';
const LANG_STORAGE_KEY = 'site_lang';

const i18n = {
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.projects': '项目',
    'nav.skills': '技能',
    'nav.ai': '大模型实践',
    'nav.contact': '联系',
    'nav.resume': '简历',
    'nav.download_resume': '下载简历',

    // Site logo
    'site.logo': '胡圣炜',

    // Theme
    'theme.dark': '暗色',
    'theme.light': '亮色',

    // Hero
    'hero.label': '中南财经政法大学 · 法学本科在读',
    'hero.greeting': '你好，我是<span class="accent">胡圣炜</span>',
    'hero.intro': '来自广东韶关，目前为<strong>中南财经政法大学</strong>法学本科在读。<br>正在备战法律职业资格考试，关注民商法与刑法领域。',
    'hero.download_resume': '<i class="fas fa-download"></i> 下载简历',
    'hero.view_projects': '<i class="fas fa-arrow-right"></i> 查看项目',

    // About
    'about.title': '关于我',
    'about.subtitle': '广东韶关 · 普通话 / 粤语 / 客家话',
    'about.education': '<i class="fas fa-graduation-cap" style="margin-right:0.4rem"></i>教育背景',
    'about.honors': '荣誉与奖项',
    'about.internships': '实习经历',
    'about.campus_exp': '校园经历',

    // Projects
    'projects.title': '项目作品',
    'projects.subtitle': '课程学习、个人兴趣与竞赛实践',
    'projects.filter_all': '全部',
    'projects.filter_course': '课程项目',
    'projects.filter_personal': '个人项目',
    'projects.filter_competition': '竞赛项目',
    'projects.filter_volunteer': '实践项目',
    'projects.empty': '暂无项目',
    'projects.no_links': '暂无链接',
    'projects.result_prefix': '成果：',

    // Skills
    'skills.title': '技能特长',
    'skills.tools': '软件与工具',
    'skills.languages': '语言能力',
    'skills.soft_skills': '软技能',

    // Skill items
    'skill.0.name': '法律检索与研究',
    'skill.0.level': '精通',
    'skill.1.name': '法律文书写作',
    'skill.1.level': '高级',
    'skill.2.name': '案例分析',
    'skill.2.level': '高级',
    'skill.3.name': '辩论与口头表达',
    'skill.3.level': '高级',
    'skill.4.name': '法律英语',
    'skill.4.level': '中级',

    // Tools
    'tool.0': 'Office 套件',
    'tool.1': '北大法宝',
    'tool.2': '中国裁判文书网',
    'tool.3': 'Westlaw',
    'tool.4': '法律文书系统',
    'tool.5': 'XMind',
    'tool.6': 'VS Code',

    // Languages
    'lang.0.name': '中文（普通话）',
    'lang.0.level': '母语 · 精通',
    'lang.1.name': '粤语',
    'lang.1.level': '母语 · 精通',
    'lang.2.name': '客家话',
    'lang.2.level': '母语 · 精通',
    'lang.3.name': '英语',
    'lang.3.level': 'CET-6',

    // Soft skills
    'soft.0': '沟通能力',
    'soft.1': '团队协作',
    'soft.2': '逻辑思辨',
    'soft.3': '时间管理',
    'soft.4': '责任心',
    'soft.5': '自主学习',

    // AI stats
    'stat.tokens': 'Token 总用量',
    'stat.requests': '累计请求',
    'stat.models': '使用模型',

    // Agent cards
    'agent.0.desc': 'Anthropic 官方 CLI 编程智能体，支持全栈开发、代码审查、多文件重构',
    'agent.1.desc': 'OpenAI Codex 驱动，深度集成 VS Code / JetBrains，实时补全与生成',
    'agent.2.desc': 'Google DeepMind 实验性 AI 编程智能体，主打异步任务规划与代码修复',
    'agent.1.tag': '实时补全',
    'agent.2.tag': '异步规划',

    // Contact values
    'contact.loc_val': '湖北 · 武汉 / 广东 · 韶关',
    'contact.school_val': '中南财经政法大学 · 南湖校区',

    // AI
    'ai.title': '大模型实践',
    'ai.subtitle': '本地部署 · 大模型探索',
    'ai.agents_title': 'Agent 引用',
    'ai.agents_subtitle': '熟练使用以下 AI 编码智能体',
    'ai.demo_link': '在线演示 →',
    'ai.blog': '诗集 / 博客',

    // Contact
    'contact.title': '联系我',
    'contact.subtitle': '期待与您的交流',
    'contact.email': '邮箱',
    'contact.location': '所在地',
    'contact.school': '学校',
    'contact.send': '<i class="fas fa-paper-plane"></i> 发送',
    'contact.sending': '<i class="fas fa-spinner fa-spin"></i> 发送中...',
    'contact.note': '如果您对我的背景感兴趣，欢迎通过邮箱联系我。<br>期待获得实习机会，在实务中不断学习和成长。',

    // Form
    'form.name': '姓名',
    'form.name_placeholder': '您的姓名',
    'form.email': '邮箱',
    'form.email_placeholder': 'your@email.com',
    'form.subject': '主题',
    'form.subject_placeholder': '主题',
    'form.message': '消息',
    'form.message_placeholder': '请写下你想说的话...',
    'form.error_name': '请输入姓名',
    'form.error_email': '请输入有效的邮箱地址',
    'form.error_subject': '请输入主题',
    'form.error_message': '请输入消息',

    // Footer
    'footer.copyright': '© 2026 胡圣炜',

    // Social
    'social.github': 'GitHub',
    'social.linkedin': 'LinkedIn',
    'social.wechat': '微信',
    'social.zhihu': '知乎',

    // Log
    'log.title': '更新日志',

    // Toast
    'toast.sent_success': '留言已发送，我会尽快回复',
    'toast.sent_failed': '发送失败',
    'toast.network_error': '网络错误，请稍后重试',
    'toast.check_form': '请检查表单中的错误',
    'toast.resume_unavailable': '简历暂未上传',

    // Back to top
    'back_to_top': '↑ 回到顶部',

    // Resume modal
    'resume.preview': '简历预览',

    // Menu (mobile)
    'nav.menu': '菜单',

    // Font size
    'font.decrease': '缩小字号',
    'font.reset': '重置字号',
    'font.increase': '放大字号',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.ai': 'AI Practice',
    'nav.contact': 'Contact',
    'nav.resume': 'Resume',
    'nav.download_resume': 'Download Résumé',

    // Site logo
    'site.logo': 'Sam Wayne',

    // Theme
    'theme.dark': 'Dark',
    'theme.light': 'Light',

    // Hero
    'hero.label': 'Zhongnan Univ. of Econ. & Law · Undergraduate Law Student',
    'hero.greeting': 'Hi, I\'m <span class="accent">Sam Wayne</span>',
    'hero.intro': 'From Shaoguan, Guangdong. Undergraduate law student at <strong>Zhongnan University of Economics and Law</strong>.<br>Preparing for the National Unified Legal Profession Qualification Exam, with focus on Civil & Commercial Law and Criminal Law.',
    'hero.download_resume': '<i class="fas fa-download"></i> Download Résumé',
    'hero.view_projects': '<i class="fas fa-arrow-right"></i> View Projects',

    // About
    'about.title': 'About Me',
    'about.subtitle': 'Shaoguan, Guangdong · Mandarin / Cantonese / Hakka',
    'about.education': '<i class="fas fa-graduation-cap" style="margin-right:0.4rem"></i>Education',
    'about.honors': 'Honors & Awards',
    'about.internships': 'Internships',
    'about.campus_exp': 'Campus Experience',

    // Projects
    'projects.title': 'Projects',
    'projects.subtitle': 'Coursework, Personal Interests & Competitions',
    'projects.filter_all': 'All',
    'projects.filter_course': 'Coursework',
    'projects.filter_personal': 'Personal',
    'projects.filter_competition': 'Competition',
    'projects.filter_volunteer': 'Practice',
    'projects.empty': 'No projects yet',
    'projects.no_links': 'No links available',
    'projects.result_prefix': 'Result: ',

    // Skills
    'skills.title': 'Skills',
    'skills.tools': 'Software & Tools',
    'skills.languages': 'Languages',
    'skills.soft_skills': 'Soft Skills',

    // Skill items
    'skill.0.name': 'Legal Research & Analysis',
    'skill.0.level': 'Expert',
    'skill.1.name': 'Legal Writing',
    'skill.1.level': 'Advanced',
    'skill.2.name': 'Case Analysis',
    'skill.2.level': 'Advanced',
    'skill.3.name': 'Debate & Oral Advocacy',
    'skill.3.level': 'Advanced',
    'skill.4.name': 'Legal English',
    'skill.4.level': 'Intermediate',

    // Tools
    'tool.0': 'Office Suite',
    'tool.1': 'Pkulaw (Beida Fabao)',
    'tool.2': 'China Judgments Online',
    'tool.3': 'Westlaw',
    'tool.4': 'Legal Document System',
    'tool.5': 'XMind',
    'tool.6': 'VS Code',

    // Languages
    'lang.0.name': 'Chinese (Mandarin)',
    'lang.0.level': 'Native · Proficient',
    'lang.1.name': 'Cantonese',
    'lang.1.level': 'Native · Proficient',
    'lang.2.name': 'Hakka',
    'lang.2.level': 'Native · Proficient',
    'lang.3.name': 'English',
    'lang.3.level': 'CET-6',

    // Soft skills
    'soft.0': 'Communication',
    'soft.1': 'Teamwork',
    'soft.2': 'Critical Thinking',
    'soft.3': 'Time Management',
    'soft.4': 'Responsibility',
    'soft.5': 'Self-Directed Learning',

    // AI stats
    'stat.tokens': 'Total Tokens',
    'stat.requests': 'Total Requests',
    'stat.models': 'Models Used',

    // Agent cards
    'agent.0.desc': 'Anthropic\'s official CLI coding agent, supporting full-stack development, code review, and multi-file refactoring',
    'agent.1.desc': 'Powered by OpenAI Codex, deeply integrated with VS Code and JetBrains for real-time code completion and generation',
    'agent.2.desc': 'Google DeepMind\'s experimental AI coding agent, specializing in async task planning and code repair',
    'agent.1.tag': 'Real-time Completion',
    'agent.2.tag': 'Async Planning',

    // Contact values
    'contact.loc_val': 'Wuhan, Hubei / Shaoguan, Guangdong',
    'contact.school_val': 'Zhongnan University of Economics and Law · Nanhu Campus',

    // AI
    'ai.title': 'AI Practice',
    'ai.subtitle': 'Local Deployment · LLM Exploration',
    'ai.agents_title': 'Agent References',
    'ai.agents_subtitle': 'Proficient with the following AI coding agents',
    'ai.demo_link': 'Live Demo →',
    'ai.blog': 'Poetry / Blog',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Looking forward to hearing from you',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.school': 'School',
    'contact.send': '<i class="fas fa-paper-plane"></i> Send',
    'contact.sending': '<i class="fas fa-spinner fa-spin"></i> Sending...',
    'contact.note': 'If you are interested in my background, feel free to reach out via email.<br>I look forward to internship opportunities to keep learning and growing in practice.',

    // Form
    'form.name': 'Name',
    'form.name_placeholder': 'Your Name',
    'form.email': 'Email',
    'form.email_placeholder': 'your@email.com',
    'form.subject': 'Subject',
    'form.subject_placeholder': 'Subject',
    'form.message': 'Message',
    'form.message_placeholder': 'Write your message here...',
    'form.error_name': 'Please enter your name',
    'form.error_email': 'Please enter a valid email address',
    'form.error_subject': 'Please enter a subject',
    'form.error_message': 'Please enter a message',

    // Footer
    'footer.copyright': '© 2026 Sam Wayne',

    // Social
    'social.github': 'GitHub',
    'social.linkedin': 'LinkedIn',
    'social.wechat': 'WeChat',
    'social.zhihu': 'Zhihu',

    // Log
    'log.title': 'Changelog',

    // Toast
    'toast.sent_success': 'Message sent! I\'ll get back to you soon.',
    'toast.sent_failed': 'Failed to send message.',
    'toast.network_error': 'Network error. Please try again later.',
    'toast.check_form': 'Please check the form for errors.',
    'toast.resume_unavailable': 'Resume not yet uploaded.',

    // Back to top
    'back_to_top': '↑ Back to Top',

    // Resume modal
    'resume.preview': 'Resume Preview',

    // Menu (mobile)
    'nav.menu': 'Menu',

    // Font size
    'font.decrease': 'Decrease font size',
    'font.reset': 'Reset font size',
    'font.increase': 'Increase font size',
  }
};

/* ============================================================
   语言管理器
   ============================================================ */
let currentLang = null;

/**
 * 获取当前语言
 * 检测优先级：localStorage > 浏览器语言 > 'zh'
 */
function getLang() {
  if (currentLang) return currentLang;
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') {
      currentLang = stored;
      return currentLang;
    }
  } catch (_) {}
  // 浏览器自动检测
  const browserLang = (navigator.language || '').toLowerCase();
  currentLang = browserLang.startsWith('en') ? 'en' : 'zh';
  return currentLang;
}

/**
 * 翻译函数
 * @param {string} key - 翻译键
 * @param {object} [params] - 可选替换参数 {key: value}
 * @returns {string}
 */
function t(key, params) {
  const lang = getLang();
  const dict = i18n[lang] || i18n.zh;
  let text = dict[key] || i18n.zh[key] || key;
  if (params) {
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
    });
  }
  return text;
}

/**
 * 设置语言
 * @param {'zh'|'en'} lang
 */
function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (_) {}
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/**
 * 切换语言（中 ↔ 英）
 */
function toggleLang() {
  setLang(getLang() === 'zh' ? 'en' : 'zh');
}

/**
 * 更新所有带 data-i18n 属性的元素
 * 同时处理 data-i18n-placeholder
 */
function applyI18n() {
  // 处理仅有 data-i18n-html 没有 data-i18n 的元素（如 Hero 区域）
  document.querySelectorAll('[data-i18n-html]:not([data-i18n])').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  // 处理所有带 data-i18n 的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = t(key);
    } else {
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
      if (textNode) {
        textNode.textContent = t(key);
      } else if (!el.querySelector('i, svg, img, span[class]')) {
        el.textContent = t(key);
      } else {
        const nodes = Array.from(el.childNodes);
        nodes.forEach(n => {
          if (n.nodeType === 3 && n.textContent.trim()) {
            n.textContent = t(key);
          }
        });
      }
    }
  });
  // 更新 language toggle 按钮文字
  document.querySelectorAll('[data-i18n-lang]').forEach(el => {
    el.textContent = getLang() === 'zh' ? 'EN' : '中';
  });
  // 更新 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
}
