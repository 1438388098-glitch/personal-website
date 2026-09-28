/* ============================================================
   炜 · 个人网站 — 主 JavaScript
   极简衬线风格
   ============================================================ */

(function() {
  'use strict';

  // Projects data (global fallback)
  let currentProjects = projectsData;

  // DOM
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileControls = document.getElementById('mobileControls');
  const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
  const backToTop = document.getElementById('backToTop');
  const projectGrid = document.getElementById('projectGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  // 字号控制
  const fontDecrease = document.getElementById('fontDecrease');
  const fontIncrease = document.getElementById('fontIncrease');
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  // 语言切换
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  // ----- 移动端控件显示 (只在移动端显示汉堡菜单) -----
  function checkMobile() {
    if (window.innerWidth <= 768) {
      mobileControls.style.display = 'flex';
    } else {
      mobileControls.style.display = 'none';
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // ----- 主题 -----
  function getTheme() { return localStorage.getItem('theme') || 'light'; }

  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    themeBtns.forEach(btn => { btn.innerHTML = `<i class="fas ${icon}"></i>`; });
  }

  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    else setTheme('light');
  }

  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));

  // ----- 字号控制 -----
  const FONT_KEY = 'site_font_size';
  const FONT_MIN = 14;
  const FONT_MAX = 22;
  const FONT_DEFAULT = 16;

  function getFontSize() {
    const stored = parseInt(localStorage.getItem(FONT_KEY));
    return stored >= FONT_MIN && stored <= FONT_MAX ? stored : FONT_DEFAULT;
  }

  function setFontSize(val) {
    val = Math.max(FONT_MIN, Math.min(FONT_MAX, val));
    localStorage.setItem(FONT_KEY, val);
    document.documentElement.style.fontSize = val + 'px';
    if (fontDecrease) fontDecrease.classList.toggle('disabled', val <= FONT_MIN);
    if (fontIncrease) fontIncrease.classList.toggle('disabled', val >= FONT_MAX);
    if (fontSizeDisplay) fontSizeDisplay.textContent = val;
  }

  function initFontSize() {
    const size = getFontSize();
    document.documentElement.style.fontSize = size + 'px';
    if (fontDecrease) fontDecrease.classList.toggle('disabled', size <= FONT_MIN);
    if (fontIncrease) fontIncrease.classList.toggle('disabled', size >= FONT_MAX);
    if (fontSizeDisplay) fontSizeDisplay.textContent = size;
  }

  // 绑定事件
  if (fontDecrease) fontDecrease.addEventListener('click', () => setFontSize(getFontSize() - 1));
  if (fontIncrease) fontIncrease.addEventListener('click', () => setFontSize(getFontSize() + 1));
  if (fontSizeDisplay) fontSizeDisplay.addEventListener('click', () => setFontSize(FONT_DEFAULT));

  // ----- 语言切换 -----
  function handleLangToggle() {
    toggleLang();
    closeModal();
    closeResumeModal();
    // 触发动效
    document.body.classList.add('lang-switching');
    setTimeout(() => document.body.classList.remove('lang-switching'), 400);
  }

  if (langToggle) langToggle.addEventListener('click', handleLangToggle);
  if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

  // ----- 英文衬线字体 (Garamond) -----
  const FONT_STYLE_KEY = 'site_font_style';
  function getFontStyle() { return localStorage.getItem(FONT_STYLE_KEY) || 'default'; }
  function applyFontStyle() {
    const lang = getLang();
    const style = getFontStyle();
    // EN 模式下默认使用 Garamond，除非用户手动选择了 serif
    const useGaramond = lang === 'en' && style !== 'serif';
    document.documentElement.style.setProperty('--font-serif',
      useGaramond
        ? "'EB Garamond', 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', serif"
        : "'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', serif"
    );
  }
  // 监听语言切换自动调整字体
  document.addEventListener('langchange', applyFontStyle);

  // ----- 导航栏 -----
  function handleNavbar() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 400);

    // 高亮当前 section
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 150;
      const bottom = top + s.offsetHeight;
      if (scrollY >= top && scrollY < bottom) current = s.id;
    });
    $$('#navLinks a[href^="#"]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });

  // ----- 移动菜单 -----
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.documentElement.classList.toggle('menu-open', mobileNav.classList.contains('open'));
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.documentElement.classList.remove('menu-open');
    });
  });

  // ----- Unified project rendering -----
  function renderProjectList(source, filter) {
    const lang = getLang();
    const isEn = lang === 'en';
    const data = filter === 'all' ? source : source.filter(p => p.category === filter);

    if (data.length === 0) {
      projectGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--text-muted);padding:2rem 0">${t('projects.empty')}</p>`;
      return;
    }

    projectGrid.innerHTML = data.map((p, i) => {
      const title = isEn ? (p.title_en || p.title) : p.title;
      const summary = isEn ? (p.summary_en || p.summary) : p.summary;
      const catLabel = isEn ? (p.categoryLabel_en || p.categoryLabel) : p.categoryLabel;
      return `<div class="project-item" data-id="${p.id}" style="transition-delay:${Math.min(i * 0.08, 0.6)}s">
        <div class="meta"><span>${catLabel}</span><span>${p.date}</span></div>
        <h4>${title}</h4>
        <p>${summary}</p>
      </div>`;
    }).join('');

    projectGrid.querySelectorAll('.project-item').forEach(card => {
      observeReveal(card);
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        const proj = source.find(x => x.id === id);
        if (proj) openModal(proj);
      });
    });
  }

  function renderProjects(filter = 'all') {
    renderProjectList(currentProjects, filter);
  }

  // ----- 筛选 -----
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjectList(currentProjects, btn.dataset.filter);
    });
  });

  // ----- 模态框 -----
  function openModal(p) {
    const lang = getLang();
    const isEn = lang === 'en';

    $('#modalTitle').textContent = isEn ? (p.title_en || p.title) : p.title;
    $('#modalCategory').textContent = isEn ? (p.categoryLabel_en || p.categoryLabel) : p.categoryLabel;
    $('#modalDate').textContent = p.date;
    const desc = isEn ? (p.description_en || p.description) : p.description;
    $('#modalDesc').innerHTML = desc.replace(/\n/g, '<br>');

    const tech = isEn ? (p.tech_en || p.tech) : p.tech;
    $('#modalTech').innerHTML = tech.map(t => `<span>${t}</span>`).join('');

    let linksHTML = '';
    if (p.github) linksHTML += `<a href="${p.github}" target="_blank">GitHub</a>`;
    if (p.demo) linksHTML += `<a href="${p.demo}" target="_blank">${t('ai.demo_link')}</a>`;
    $('#modalLinks').innerHTML = linksHTML || `<span style="color:var(--text-muted);font-size:0.85rem">${t('projects.no_links')}</span>`;

    const results = isEn ? (p.results_en || p.results) : p.results;
    $('#modalResult').textContent = results ? `${t('projects.result_prefix')}${results}` : '';

    modalOverlay.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.documentElement.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  // ----- 简历预览 -----
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalClose = document.getElementById('resumeModalClose');
  const resumeFrame = document.getElementById('resumeFrame');

  function openResumeModal(url) {
    resumeFrame.src = url;
    resumeModal.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    resumeModal.classList.remove('open');
    document.documentElement.style.overflow = '';
    resumeFrame.src = '';
  }

  resumeModalClose.addEventListener('click', closeResumeModal);
  resumeModal.addEventListener('click', e => { if (e.target === resumeModal) closeResumeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeResumeModal();
    }
  });

  // ----- 表单 -----
  function validateField(input, errorId, fn) {
    const ok = fn(input.value);
    input.classList.toggle('error', !ok);
    document.getElementById(errorId).classList.toggle('show', !ok);
    return ok;
  }

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const n = validateField($('#formName'), 'nameError', v => v.trim().length > 0);
    const e2 = validateField($('#formEmail'), 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()));
    const s = validateField($('#formSubject'), 'subjectError', v => v.trim().length > 0);
    const m = validateField($('#formMessage'), 'messageError', v => v.trim().length > 0);

    if (n && e2 && s && m) {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = t('contact.sending');

      const formData = new FormData();
      formData.append('name', $('#formName').value.trim());
      formData.append('email', $('#formEmail').value.trim());
      formData.append('subject', $('#formSubject').value.trim());
      formData.append('message', $('#formMessage').value.trim());

      fetch('admin/contact.php', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            showToast(data.message || t('toast.sent_success'), 'success');
            contactForm.reset();
          } else {
            showToast(data.message || t('toast.sent_failed'), 'error');
          }
        })
        .catch(() => showToast(t('toast.network_error'), 'error'))
        .finally(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> 发送';
        });
    } else {
      showToast(t('toast.check_form'), 'error');
    }
  });

  // 失焦验证
  $$('#formName, #formEmail, #formSubject, #formMessage').forEach(el => {
    el.addEventListener('blur', function() {
      const map = {
        formName: ['nameError', v => v.trim().length > 0],
        formEmail: ['emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
        formSubject: ['subjectError', v => v.trim().length > 0],
        formMessage: ['messageError', v => v.trim().length > 0]
      };
      const [errId, fn] = map[this.id];
      validateField(this, errId, fn);
    });
  });

  // ----- Toast -----
  function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ----- 滚动动画 -----
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.skill-bar .fill').forEach(fill => {
          const w = fill.dataset.width;
          if (w) setTimeout(() => { fill.style.width = w + '%'; }, 200);
        });
        entry.target.querySelectorAll('.subhead').forEach(el => {
          el.classList.add('subhead-animated');
        });
      } else {
        entry.target.classList.remove('visible');
        entry.target.querySelectorAll('.skill-bar .fill').forEach(fill => {
          fill.style.width = '0';
        });
        entry.target.querySelectorAll('.subhead').forEach(el => {
          el.classList.remove('subhead-animated');
        });
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  function initReveal() {
    $$('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  }

  function observeReveal(el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  }

  // ----- 返回顶部 -----
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ----- 平滑滚动 -----
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----- About section -----
  function renderAbout(data) {
    const lang = getLang();
    const isEn = lang === 'en';
    const profile = data.profile;
    if (profile) {
      const aboutText = document.querySelector('.about-text');
      if (aboutText) {
        const intro = isEn ? (profile.intro_en || profile.intro) : profile.intro;
        if (intro) {
          aboutText.innerHTML = intro.split('\n\n').map(p => `<p>${p}</p>`).join('');
        }
      }

      const eduBox = document.querySelector('.edu-box');
      if (eduBox && data.education) {
        const edu = data.education;
        const school = isEn ? (edu.school_en || edu.school) : edu.school;
        const major = isEn ? (edu.major_en || edu.major) : edu.major;
        const period = isEn ? (edu.period_en || edu.period) : edu.period;
        const courses = isEn ? (edu.courses_en || edu.courses) : edu.courses;
        const coursesHtml = (courses || []).map(c => `<span>${c}</span>`).join('');
        eduBox.innerHTML = `
          <h4>${t('about.education')}</h4>
          <div class="meta">
            <span><i class="fas fa-university"></i> ${school}</span>
            <span><i class="fas fa-book"></i> ${major}</span>
            <span><i class="fas fa-calendar"></i> ${period}</span>
            ${edu.gpa ? `<span><i class="fas fa-chart-line"></i> GPA ${edu.gpa}</span>` : ''}
          </div>
          <div class="courses">${coursesHtml}</div>
        `;
      }
    }

    const honorsList = document.getElementById('honorsList');
    if (honorsList && data.honors && data.honors.length) {
      honorsList.innerHTML = data.honors.map(h => {
        const title = isEn ? (h.title_en || h.title) : h.title;
        const desc = isEn ? (h.desc_en || h.desc) : h.desc;
        return `<li><div class="date">${h.year || ''}</div><h5>${title}</h5><p>${desc}</p></li>`;
      }).join('');
    }

    const experiences = data.experiences || [];
    const internList = document.getElementById('internList');
    const expList = document.getElementById('expList');

    const internKeywords = ['法院', '律所', '公司', '实习生', '助理', '实习'];
    const isIntern = e => internKeywords.some(k => (e.title || '').includes(k));

    const interns = experiences.filter(isIntern);
    const orgExps = experiences.filter(e => !isIntern(e));

    if (internList) {
      internList.innerHTML = interns.map(e => {
        const title = isEn ? (e.title_en || e.title) : e.title;
        const desc = isEn ? (e.desc_en || e.desc) : e.desc;
        return `<li><span class="year">${e.year || ''}</span><div class="desc"><h5>${title}</h5><p>${desc}</p></div></li>`;
      }).join('');
    }

    if (expList) {
      expList.innerHTML = orgExps.map(e => {
        const title = isEn ? (e.title_en || e.title) : e.title;
        const desc = isEn ? (e.desc_en || e.desc) : e.desc;
        return `<li><span class="year">${e.year || ''}</span><div class="desc"><h5>${title}</h5><p>${desc}</p></div></li>`;
      }).join('');
    }
  }

  // ----- AI section -----
  function renderAI(ai) {
    if (!ai) return;
    function animateNumber(el, target) {
      if (!target || target === '0' || target === '--') {
        el.textContent = target || '--';
        return;
      }
      // If target contains letters (like "12.5M"), just set it directly
      if (/[a-zA-Z]/.test(target)) {
        el.textContent = target;
        return;
      }
      const num = parseInt(String(target).replace(/,/g, ''));
      if (isNaN(num)) {
        el.textContent = target;
        return;
      }
      // Format large numbers
      function fmt(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
        if (n >= 1e4) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K';
        return n.toLocaleString();
      }
      const duration = 800;
      const start = performance.now();
      const from = 0;
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = fmt(Math.round(from + (num - from) * eased));
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    animateNumber(document.getElementById('statTokens'), ai.total_tokens);
    animateNumber(document.getElementById('statRequests'), ai.total_requests);
    animateNumber(document.getElementById('statModels'), String((ai.models || []).length));

    const blogLink = document.getElementById('aiBlogLink');
    if (blogLink) blogLink.href = (ai.blog || 'http://poetry.iweistoicqc5.top/');

    const grid = document.getElementById('aiGrid');
    if (!grid || !ai.projects || !ai.projects.length) return;

    const lang = getLang();
    const isEn = lang === 'en';
    const colors = ['#165DFF','#059669','#8B5CF6','#F59E0B','#EC4899','#14B8A6'];
    grid.innerHTML = ai.projects.map((p, i) => {
      const name = isEn ? (p.name_en || p.name) : p.name;
      const desc = isEn ? (p.description_en || p.description) : p.description;
      const tokenUsage = isEn ? (p.token_usage_en || p.token_usage) : p.token_usage;
      return `<div class="ai-card" style="transition-delay:${Math.min(i * 0.06, 0.48)}s">
        <div class="ai-card-accent" style="background:${colors[i % colors.length]}"></div>
        <div class="ai-card-body">
          <h4>${name}</h4>
          <p>${desc || ''}</p>
          <div class="ai-card-meta">
            <span class="model-tag">${p.model || ''}</span>
            <span class="token">${tokenUsage || ''}</span>
          </div>
          ${p.demo ? `<div class="ai-card-demo"><a href="${p.demo}" target="_blank">${t('ai.demo_link')}</a></div>` : ''}
        </div>
      </div>`;
    }).join('');
    grid.querySelectorAll('.ai-card').forEach(card => observeReveal(card));
  }

  // ----- Projects from JSON -----
  function renderProjectsFromData(projects) {
    if (!projects.length) { renderProjects('all'); return; }

    currentProjects = projects;

    renderProjectList(currentProjects, 'all');
  }

  // ----- 初始化 -----
  async function init() {
    initFontSize();
    initTheme();
    handleNavbar();
    initReveal();
    applyI18n();
    applyFontStyle();

    const data = await loadSiteData();
    window._siteData = data; // 缓存供语言切换使用
    if (data) {
      // Social links
      const socials = data.base;
      const socialMap = [
        { id: 'social-github', href: socials.github, label: 'GitHub' },
        { id: 'social-linkedin', href: socials.linkedin, label: 'LinkedIn' },
        { id: 'social-wechat', href: socials.wechat, label: '微信' },
        { id: 'social-zhihu', href: socials.zhihu, label: '知乎' }
      ];
      socialMap.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) el.href = s.href || '#';
      });

      // Resume links — open preview modal instead of download
      const resumeEl = document.querySelectorAll('.btn-resume[download], .btn[download]');
      if (socials.resume) {
        resumeEl.forEach(el => {
          el.removeAttribute('download');
          el.href = 'javascript:void(0)';
          el.addEventListener('click', function(e) {
            e.preventDefault();
            openResumeModal(socials.resume);
          });
        });
      } else {
        resumeEl.forEach(el => {
          el.style.opacity = '0.4';
          el.style.pointerEvents = 'none';
          el.title = t('toast.resume_unavailable');
          el.removeAttribute('download');
          el.href = 'javascript:void(0)';
        });
      }

      // Avatar
      const avatarEl = document.getElementById('heroAvatar');
      if (avatarEl && socials.avatar) {
        avatarEl.innerHTML = `<img src="${socials.avatar}" alt="炜">`;
      }

      // Blog link
      const blogLink = document.getElementById('aiBlogLink');
      if (blogLink && socials.blog) blogLink.href = socials.blog;

      // AI section
      renderAI(data.ai);

      // About section
      renderAbout(data);

      // Site log
      const logList = document.getElementById('logList');
      if (logList && data.logs && data.logs.length) {
        logList.innerHTML = data.logs.map(l => `
          <div class="log-item">
            <span class="log-date">${l.date}</span>
            <span class="log-content">${l.content}</span>
          </div>
        `).join('');
        logList.querySelectorAll('.log-item').forEach(el => observeReveal(el));
      }

      // Projects from JSON (replace hardcoded)
      renderProjectsFromData(data.projects || []);
    } else {
      renderProjects('all'); // fallback
    }

    // 语言切换时同步更新全部 UI
    document.addEventListener('langchange', (e) => {
      if (!e.detail) { applyI18n(); return; }
      applyI18n();
      const siteData = window._siteData;
      if (siteData) {
        renderAbout(siteData);
        renderAI(siteData.ai);
      }
      renderProjectList(currentProjects, document.querySelector('.filter-btn.active')?.dataset?.filter || 'all');
      document.querySelectorAll('[data-i18n-lang]').forEach(el => {
        el.textContent = getLang() === 'zh' ? 'EN' : '中';
      });
      initReveal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
