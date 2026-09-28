<?php
/* ============================================================
   管理员后台主面板
   ============================================================ */
require_once 'auth.php';
require_once 'data.php';
requireLogin();

$content = getAllContent();
$p = $content['profile'];
$edu = $content['education'];
$honors = $content['honors'];
$experiences = $content['experiences'];
$skills = $content['skills'];
$tools = $content['tools'];
$langs = $content['languages'];
$soft = $content['soft_skills'];
$projects = $content['projects'] ?? [];
$base = $content['base'] ?? ['avatar'=>'','resume'=>'','github'=>'','linkedin'=>'','wechat'=>'','zhihu'=>'','blog'=>'http://poetry.iweistoicqc5.top/'];
$ai = $content['ai'] ?? ['total_tokens'=>'0','total_requests'=>'0','models'=>[],'projects'=>[]];

function h($s) { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>管理后台 · 炜</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Serif SC', serif;
      background: #f5f5f5; color: #1a1a1a;
    }
    .header {
      background: #fff; border-bottom: 1px solid #e8e8e8;
      padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
    }
    .header h1 { font-size: 1rem; font-weight: 900; }
    .header .links { display: flex; gap: 1rem; font-size: 0.82rem; align-items: center; }
    .header .links a { color: #999; text-decoration: none; }
    .header .links a:hover { color: #1a1a1a; }
    .header .links .btn-logout { color: #c00; }

    .layout { display: flex; min-height: calc(100vh - 56px); }
    .sidebar {
      width: 200px; background: #fff; border-right: 1px solid #e8e8e8;
      padding: 1rem 0; flex-shrink: 0;
    }
    .sidebar a {
      display: block; padding: 0.6rem 1.5rem; font-size: 0.85rem;
      color: #666; text-decoration: none; transition: 0.2s;
    }
    .sidebar a:hover, .sidebar a.active { color: #1a1a1a; background: #f5f5f5; }
    .main { flex: 1; padding: 2rem; overflow-y: auto; max-width: 800px; }

    .section-card {
      background: #fff; padding: 1.5rem 2rem; margin-bottom: 1.5rem;
      display: none;
    }
    .section-card.active { display: block; }
    .section-card h2 { font-size: 1.1rem; font-weight: 900; margin-bottom: 1.2rem; }

    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.2rem; color: #666; }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%; padding: 0.5rem 0.7rem; font-family: 'Noto Serif SC', serif;
      font-size: 0.88rem; border: 1px solid #ddd; background: #fafafa;
      outline: none; transition: 0.2s;
    }
    .form-group input:focus, .form-group textarea:focus { border-color: #1a1a1a; background: #fff; }
    .form-group textarea { min-height: 80px; resize: vertical; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; }

    .btn {
      padding: 0.5rem 1.2rem; font-family: 'Noto Serif SC', serif;
      font-size: 0.85rem; border: 1px solid #1a1a1a; cursor: pointer; transition: 0.2s;
    }
    .btn-primary { background: #1a1a1a; color: #fff; }
    .btn-primary:hover { background: #333; }
    .btn-secondary { background: #fff; color: #1a1a1a; }
    .btn-secondary:hover { background: #f5f5f5; }
    .btn-danger { border-color: #c00; color: #c00; background: #fff; }
    .btn-danger:hover { background: #c00; color: #fff; }
    .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.8rem; }

    .toast {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 100;
      padding: 0.7rem 1.2rem; border: 1px solid #1a1a1a; background: #fff;
      font-size: 0.85rem; opacity: 0; transform: translateY(60px);
      transition: 0.4s; pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }

    .list-item { padding: 0.8rem 0; border-bottom: 1px solid #eee; }
    .list-item:last-child { border-bottom: none; }
    .list-item .meta { display: flex; gap: 0.8rem; font-size: 0.8rem; color: #999; }
    .list-item h4 { font-size: 0.9rem; font-weight: 600; }
    .list-item .actions { margin-top: 0.3rem; display: flex; gap: 0.5rem; }

    .project-section { margin-top: 2rem; }

    @media (max-width: 768px) {
      .sidebar { width: 160px; }
      .main { padding: 1.5rem; }
      .form-row, .form-row-3 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="header">
  <h1>炜 · 管理后台</h1>
  <div class="links">
    <a href="../" target="_blank"><i class="fas fa-external-link-alt"></i> 查看网站</a>
    <a href="logout.php" class="btn-logout"><i class="fas fa-sign-out-alt"></i> 退出</a>
  </div>
</div>

<div class="layout">
  <nav class="sidebar">
    <a href="#" class="active" data-section="profile">个人资料</a>
    <a href="#" data-section="education">教育背景</a>
    <a href="#" data-section="honors">荣誉奖项</a>
    <a href="#" data-section="experiences">校园经历</a>
    <a href="#" data-section="skills">专业技能</a>
    <a href="#" data-section="tools">工具·语言·软技能</a>
    <a href="#" data-section="projects">项目作品</a>
    <a href="#" data-section="base">基础设置</a>
    <a href="#" data-section="ai">大模型实践</a>
    <a href="#" data-section="logs">更新日志</a>
    <a href="#" data-section="messages">留言管理</a>
    <a href="#" data-section="visitors">访客统计</a>
  </nav>

  <div class="main">
    <form id="saveForm" onsubmit="return false;">
      <input type="hidden" id="csrf_token" value="<?=htmlspecialchars(csrf_token())?>">

      <!-- ===== 个人资料 ===== -->
      <div class="section-card active" id="sec-profile">
        <h2>个人资料</h2>
        <div class="form-row">
          <div class="form-group"><label>姓名</label><input type="text" name="profile_name" value="<?=h($p['name'])?>"></div>
          <div class="form-group"><label>学校</label><input type="text" name="profile_school" value="<?=h($p['school'])?>"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>专业</label><input type="text" name="profile_major" value="<?=h($p['major'])?>"></div>
          <div class="form-group"><label>年级</label><input type="text" name="profile_grade" value="<?=h($p['grade'])?>"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>家乡</label><input type="text" name="profile_hometown" value="<?=h($p['hometown'])?>"></div>
          <div class="form-group"><label>语言</label><input type="text" name="profile_languages" value="<?=h($p['languages'])?>"></div>
        </div>
        <div class="form-group"><label>一句话目标</label><input type="text" name="profile_goal" value="<?=h($p['goal'])?>"></div>
        <div class="form-group"><label>个人简介</label><textarea name="profile_intro" rows="5"><?=h($p['intro'])?></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>邮箱</label><input type="text" name="profile_email" value="<?=h($p['email'])?>"></div>
          <div class="form-group"><label>所在地</label><input type="text" name="profile_location" value="<?=h($p['location'])?>"></div>
        </div>
        <div class="form-group"><label>校区</label><input type="text" name="profile_campus" value="<?=h($p['campus'])?>"></div>
        <button class="btn btn-primary" onclick="saveProfile()">保存</button>
      </div>

      <!-- ===== 教育背景 ===== -->
      <div class="section-card" id="sec-education">
        <h2>教育背景</h2>
        <div class="form-row">
          <div class="form-group"><label>学校</label><input type="text" name="edu_school" value="<?=h($edu['school'])?>"></div>
          <div class="form-group"><label>专业</label><input type="text" name="edu_major" value="<?=h($edu['major'])?>"></div>
        </div>
        <div class="form-group"><label>时间</label><input type="text" name="edu_period" value="<?=h($edu['period'])?>"></div>
        <div class="form-group"><label>主修课程（每行一个）</label><textarea name="edu_courses" rows="6"><?=h(implode("\n", $edu['courses']))?></textarea></div>
        <button class="btn btn-primary" onclick="saveEducation()">保存</button>
      </div>

      <!-- ===== 荣誉奖项 ===== -->
      <div class="section-card" id="sec-honors">
        <h2>荣誉奖项</h2>
        <div id="honors-list">
          <?php foreach ($honors as $i => $hon): ?>
          <div class="list-item">
            <div class="form-row-3">
              <input type="text" name="honors_year[]" value="<?=h($hon['year'])?>" placeholder="年份">
              <input type="text" name="honors_title[]" value="<?=h($hon['title'])?>" placeholder="荣誉名称">
              <input type="text" name="honors_desc[]" value="<?=h($hon['desc'])?>" placeholder="描述">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="addHonor()">+ 添加</button>
        <button class="btn btn-primary" onclick="saveHonors()" style="margin-left:0.5rem">保存</button>
      </div>

      <!-- ===== 校园经历 ===== -->
      <div class="section-card" id="sec-experiences">
        <h2>校园经历</h2>
        <div id="experiences-list">
          <?php foreach ($experiences as $i => $e): ?>
          <div class="list-item">
            <div class="form-row-3">
              <input type="text" name="exp_year[]" value="<?=h($e['year'])?>" placeholder="时间">
              <input type="text" name="exp_title[]" value="<?=h($e['title'])?>" placeholder="职位">
              <input type="text" name="exp_desc[]" value="<?=h($e['desc'])?>" placeholder="描述">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="addExp()">+ 添加</button>
        <button class="btn btn-primary" onclick="saveExperiences()" style="margin-left:0.5rem">保存</button>
      </div>

      <!-- ===== 专业技能 ===== -->
      <div class="section-card" id="sec-skills">
        <h2>专业技能</h2>
        <div id="skills-list">
          <?php foreach ($skills as $s): ?>
          <div class="list-item">
            <div class="form-row-3">
              <input type="text" name="skill_name[]" value="<?=h($s['name'])?>" placeholder="技能名称">
              <input type="text" name="skill_level[]" value="<?=h($s['level'])?>" placeholder="等级">
              <input type="number" name="skill_percent[]" value="<?=h($s['percent'])?>" placeholder="百分比" min="0" max="100">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="addSkill()">+ 添加</button>
        <button class="btn btn-primary" onclick="saveSkills()" style="margin-left:0.5rem">保存</button>
      </div>

      <!-- ===== 工具·语言·软技能 ===== -->
      <div class="section-card" id="sec-tools">
        <h2>软件与工具</h2>
        <div class="form-group"><label>工具（每行一个）</label><textarea name="tools" rows="5"><?=h(implode("\n", $tools))?></textarea></div>
        <button class="btn btn-primary" onclick="saveTools()">保存</button>

        <h2 style="margin-top:2rem">语言能力</h2>
        <div id="langs-list">
          <?php foreach ($langs as $l): ?>
          <div class="list-item">
            <div class="form-row">
              <input type="text" name="lang_name[]" value="<?=h($l['name'])?>" placeholder="语言">
              <input type="text" name="lang_level[]" value="<?=h($l['level'])?>" placeholder="水平">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="addLang()">+ 添加</button>
        <button class="btn btn-primary" onclick="saveLanguages()" style="margin-left:0.5rem">保存</button>

        <h2 style="margin-top:2rem">软技能</h2>
        <div class="form-group"><label>软技能（每行一个）</label><textarea name="soft_skills" rows="5"><?=h(implode("\n", $soft))?></textarea></div>
        <button class="btn btn-primary" onclick="saveSoftSkills()">保存</button>
      </div>

      <!-- ===== 项目作品 ===== -->
      <div class="section-card" id="sec-projects">
        <h2>项目作品</h2>
        <?php foreach ($projects as $proj): ?>
        <div class="project-section">
          <div class="list-item">
            <div class="meta"><span><?=h($proj['categoryLabel'])?></span><span><?=h($proj['date'])?></span></div>
            <h4><?=h($proj['title'])?></h4>
            <div class="actions">
              <button class="btn btn-secondary btn-sm" onclick='editProject(<?=json_encode($proj, JSON_UNESCAPED_UNICODE)?>)'>编辑</button>
              <button class="btn btn-danger btn-sm" onclick='deleteProject(<?=$proj['id']?>)'>删除</button>
            </div>
          </div>
        </div>
        <?php endforeach; ?>

        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #eee">
          <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.8rem">添加/编辑项目</h3>
          <input type="hidden" id="project_id" value="0">
          <div class="form-row">
            <div class="form-group"><label>项目名称</label><input type="text" id="proj_title"></div>
            <div class="form-group"><label>完成时间</label><input type="text" id="proj_date" placeholder="2025.03"></div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>分类</label>
              <select id="proj_category">
                <option value="course">课程项目</option>
                <option value="personal">个人项目</option>
                <option value="competition">竞赛项目</option>
                <option value="volunteer">实践项目</option>
              </select>
            </div>
            <div class="form-group"><label>分类标签</label><input type="text" id="proj_categoryLabel" placeholder="如：课程项目"></div>
          </div>
          <div class="form-group"><label>简介</label><input type="text" id="proj_summary"></div>
          <div class="form-group"><label>详细描述</label><textarea id="proj_description" rows="6"></textarea></div>
          <div class="form-group"><label>技术栈（每行一个）</label><textarea id="proj_tech" rows="3"></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>成果/收获</label><input type="text" id="proj_results"></div>
            <div class="form-group"><label>GitHub 链接</label><input type="text" id="proj_github"></div>
          </div>
          <div class="form-group"><label>在线演示链接</label><input type="text" id="proj_demo"></div>
          <button class="btn btn-primary" onclick="saveProject()">保存项目</button>
          <button class="btn btn-secondary" onclick="clearProjectForm()" style="margin-left:0.5rem">清空</button>
        </div>
      </div>

    <!-- ===== 基础设置 ===== -->
      <div class="section-card" id="sec-base">
        <h2>基础设置</h2>
        <div class="form-group"><label>头像 URL</label><input type="text" name="base_avatar" value="<?=h($base['avatar'])?>" placeholder="https://..."></div>
        <div class="form-group"><label>简历 PDF URL</label><input type="text" name="base_resume" value="<?=h($base['resume'])?>" placeholder="https://..."></div>
        <div class="form-row">
          <div class="form-group"><label>GitHub</label><input type="text" name="base_github" value="<?=h($base['github'])?>" placeholder="https://github.com/..."></div>
          <div class="form-group"><label>LinkedIn</label><input type="text" name="base_linkedin" value="<?=h($base['linkedin'])?>" placeholder="https://linkedin.com/in/..."></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>微信</label><input type="text" name="base_wechat" value="<?=h($base['wechat'])?>" placeholder="微信链接或二维码图片"></div>
          <div class="form-group"><label>知乎</label><input type="text" name="base_zhihu" value="<?=h($base['zhihu'])?>" placeholder="https://www.zhihu.com/..."></div>
        </div>
        <div class="form-group"><label>博客 / 诗集地址</label><input type="text" name="base_blog" value="<?=h($base['blog'])?>" placeholder="http://poetry.iweistoicqc5.top/"></div>
        <button class="btn btn-primary" onclick="saveBase()">保存</button>
      </div>

      <!-- ===== 大模型实践 ===== -->
      <div class="section-card" id="sec-ai">
        <h2>大模型实践</h2>
        <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.8rem;margin-top:1rem">统计数据</h3>
        <div class="form-row">
          <div class="form-group"><label>Token 总用量</label><input type="text" name="ai_total_tokens" value="<?=h($ai['total_tokens'])?>" placeholder="如：12.5M"></div>
          <div class="form-group"><label>累计请求数</label><input type="text" name="ai_total_requests" value="<?=h($ai['total_requests'])?>" placeholder="如：2847"></div>
        </div>
        <div class="form-group"><label>使用模型（每行一个）</label><textarea name="ai_models" rows="4"><?=h(implode("\n", $ai['models']))?></textarea></div>
        <button class="btn btn-primary" onclick="saveAI()">保存统计</button>

        <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.8rem;margin-top:1.5rem">AI 项目</h3>
        <div id="ai-projects-list">
          <?php foreach (($ai['projects'] ?? []) as $ap): ?>
          <div class="list-item">
            <div class="meta"><span><?=h($ap['model'])?></span><span><?=h($ap['token_usage'])?></span></div>
            <h4><?=h($ap['name'])?></h4>
            <div class="actions">
              <button class="btn btn-secondary btn-sm" onclick='editAIProject(<?=json_encode($ap, JSON_UNESCAPED_UNICODE)?>)'>编辑</button>
              <button class="btn btn-danger btn-sm" onclick='deleteAIProject(<?=$ap['id']?>)'>删除</button>
            </div>
          </div>
          <?php endforeach; ?>
        </div>

        <div style="margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid #eee">
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:0.8rem">添加 / 编辑项目</h4>
          <input type="hidden" id="ai_project_id" value="0">
          <div class="form-group"><label>项目名称</label><input type="text" id="ai_proj_name"></div>
          <div class="form-row">
            <div class="form-group"><label>模型</label><input type="text" id="ai_proj_model" placeholder="如：Qwen3:8B (Ollama)"></div>
            <div class="form-group"><label>Token 用量</label><input type="text" id="ai_proj_token" placeholder="如：3.2M tokens"></div>
          </div>
          <div class="form-group"><label>描述</label><textarea id="ai_proj_desc" rows="3"></textarea></div>
          <div class="form-group"><label>演示链接</label><input type="text" id="ai_proj_demo" placeholder="https://..."></div>
          <button class="btn btn-primary" onclick="saveAIProject()">保存项目</button>
          <button class="btn btn-secondary" onclick="clearAIProjectForm()" style="margin-left:0.5rem">清空</button>
        </div>
      </div>

    <!-- ===== 更新日志 ===== -->
      <div class="section-card" id="sec-logs">
        <h2>更新日志</h2>
        <p style="font-size:0.82rem;color:#999;margin-bottom:1rem">每行一条，按时间倒序排列（最近在上）</p>
        <div id="logs-list">
          <?php foreach (($content['logs'] ?? []) as $log): ?>
          <div class="list-item">
            <div class="form-row" style="gap:0.8rem">
              <input type="text" name="log_date[]" value="<?=h($log['date'])?>" placeholder="日期如 2026-05-27">
              <input type="text" name="log_content[]" value="<?=h($log['content'])?>" placeholder="更新内容" style="flex:1">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="addLog()">+ 添加</button>
        <button class="btn btn-primary" onclick="saveLogs()" style="margin-left:0.5rem">保存</button>
      </div>

      <!-- ===== 留言管理 ===== -->
      <div class="section-card" id="sec-messages">
        <h2>留言管理</h2>
        <div id="messagesList"></div>
      </div>

      <!-- ===== 访客统计 ===== -->
      <div class="section-card" id="sec-visitors">
        <h2>访客统计</h2>
        <div id="visitorStats"></div>
        <div id="visitorList" style="margin-top:1.5rem;max-height:400px;overflow-y:auto"></div>
      </div>

    </form>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = 'toast show';
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2500);
}

// 导航切换
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.sidebar a').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.section-card').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + this.dataset.section).classList.add('active');
  });
});

// API 调用
function api(action, data, cb) {
  const form = new FormData();
  form.append('action', action);
  form.append('csrf_token', document.getElementById('csrf_token').value);
  Object.keys(data).forEach(k => {
    if (Array.isArray(data[k])) {
      data[k].forEach(v => form.append(k + '[]', v));
    } else {
      form.append(k, data[k]);
    }
  });
  fetch('save.php', { method: 'POST', body: form })
    .then(r => r.json())
    .then(d => { if (d.success) toast('保存成功'); else toast('保存失败: ' + d.message); if (cb) cb(d); })
    .catch(() => toast('网络错误'));
}

function val(name) { return document.querySelector('[name="'+name+'"]')?.value || ''; }

// 各保存函数
function saveProfile() {
  api('save_profile', {
    name: val('profile_name'), school: val('profile_school'), major: val('profile_major'),
    grade: val('profile_grade'), hometown: val('profile_hometown'), languages: val('profile_languages'),
    intro: val('profile_intro'), goal: val('profile_goal'), email: val('profile_email'),
    location: val('profile_location'), campus: val('profile_campus')
  });
}
function saveEducation() {
  api('save_education', { school: val('edu_school'), major: val('edu_major'), period: val('edu_period'), courses: val('edu_courses') });
}
function saveHonors() {
  const years = [...document.querySelectorAll('[name="honors_year[]"]')].map(e => e.value);
  const titles = [...document.querySelectorAll('[name="honors_title[]"]')].map(e => e.value);
  const descs = [...document.querySelectorAll('[name="honors_desc[]"]')].map(e => e.value);
  api('save_honors', { years, titles, descs });
}
function saveExperiences() {
  const years = [...document.querySelectorAll('[name="exp_year[]"]')].map(e => e.value);
  const titles = [...document.querySelectorAll('[name="exp_title[]"]')].map(e => e.value);
  const descs = [...document.querySelectorAll('[name="exp_desc[]"]')].map(e => e.value);
  api('save_experiences', { years, titles, descs });
}
function saveSkills() {
  const names = [...document.querySelectorAll('[name="skill_name[]"]')].map(e => e.value);
  const levels = [...document.querySelectorAll('[name="skill_level[]"]')].map(e => e.value);
  const percents = [...document.querySelectorAll('[name="skill_percent[]"]')].map(e => e.value);
  api('save_skills', { names, levels, percents });
}
function saveTools() {
  api('save_tools', { tools: val('tools') });
}
function saveLanguages() {
  const names = [...document.querySelectorAll('[name="lang_name[]"]')].map(e => e.value);
  const levels = [...document.querySelectorAll('[name="lang_level[]"]')].map(e => e.value);
  api('save_languages', { names, levels });
}
function saveSoftSkills() {
  api('save_soft_skills', { skills: val('soft_skills') });
}

function addHonor() {
  const div = document.createElement('div'); div.className = 'list-item';
  div.innerHTML = `<div class="form-row-3"><input type="text" name="honors_year[]" placeholder="年份"><input type="text" name="honors_title[]" placeholder="荣誉名称"><input type="text" name="honors_desc[]" placeholder="描述"></div>`;
  document.getElementById('honors-list').appendChild(div);
}
function addExp() {
  const div = document.createElement('div'); div.className = 'list-item';
  div.innerHTML = `<div class="form-row-3"><input type="text" name="exp_year[]" placeholder="时间"><input type="text" name="exp_title[]" placeholder="职位"><input type="text" name="exp_desc[]" placeholder="描述"></div>`;
  document.getElementById('experiences-list').appendChild(div);
}
function addSkill() {
  const div = document.createElement('div'); div.className = 'list-item';
  div.innerHTML = `<div class="form-row-3"><input type="text" name="skill_name[]" placeholder="技能名称"><input type="text" name="skill_level[]" placeholder="等级"><input type="number" name="skill_percent[]" placeholder="百分比" min="0" max="100"></div>`;
  document.getElementById('skills-list').appendChild(div);
}
function addLang() {
  const div = document.createElement('div'); div.className = 'list-item';
  div.innerHTML = `<div class="form-row"><input type="text" name="lang_name[]" placeholder="语言"><input type="text" name="lang_level[]" placeholder="水平"></div>`;
  document.getElementById('langs-list').appendChild(div);
}

// 项目
function editProject(p) {
  document.getElementById('project_id').value = p.id || 0;
  document.getElementById('proj_title').value = p.title || '';
  document.getElementById('proj_date').value = p.date || '';
  document.getElementById('proj_category').value = p.category || 'personal';
  document.getElementById('proj_categoryLabel').value = p.categoryLabel || '';
  document.getElementById('proj_summary').value = p.summary || '';
  document.getElementById('proj_description').value = p.description || '';
  document.getElementById('proj_tech').value = (p.tech || []).join('\n');
  document.getElementById('proj_results').value = p.results || '';
  document.getElementById('proj_github').value = p.github || '';
  document.getElementById('proj_demo').value = p.demo || '';
  window.scrollTo({ top: document.querySelector('#sec-projects').scrollHeight, behavior: 'smooth' });
}
function clearProjectForm() {
  document.getElementById('project_id').value = '0';
  ['proj_title','proj_date','proj_categoryLabel','proj_summary','proj_description','proj_tech','proj_results','proj_github','proj_demo'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('proj_category').value = 'personal';
}
function saveProject() {
  const data = {
    id: document.getElementById('project_id').value,
    title: document.getElementById('proj_title').value,
    date: document.getElementById('proj_date').value,
    category: document.getElementById('proj_category').value,
    categoryLabel: document.getElementById('proj_categoryLabel').value,
    summary: document.getElementById('proj_summary').value,
    description: document.getElementById('proj_description').value,
    tech: document.getElementById('proj_tech').value,
    results: document.getElementById('proj_results').value,
    github: document.getElementById('proj_github').value,
    demo: document.getElementById('proj_demo').value
  };
  api('save_project', data, () => { setTimeout(() => location.reload(), 1000); });
}
function deleteProject(id) {
  if (!confirm('确定删除此项目？')) return;
  api('delete_project', { id }, () => { setTimeout(() => location.reload(), 1000); });
}

function saveBase() {
  api('save_base', {
    avatar: val('base_avatar'), resume: val('base_resume'),
    github: val('base_github'), linkedin: val('base_linkedin'),
    wechat: val('base_wechat'), zhihu: val('base_zhihu'),
    blog: val('base_blog')
  });
}
function saveAI() {
  api('save_ai', {
    total_tokens: val('ai_total_tokens'), total_requests: val('ai_total_requests'),
    models: val('ai_models')
  });
}
function editAIProject(p) {
  document.getElementById('ai_project_id').value = p.id || 0;
  document.getElementById('ai_proj_name').value = p.name || '';
  document.getElementById('ai_proj_model').value = p.model || '';
  document.getElementById('ai_proj_token').value = p.token_usage || '';
  document.getElementById('ai_proj_desc').value = p.description || '';
  document.getElementById('ai_proj_demo').value = p.demo || '';
  document.getElementById('sec-ai').scrollIntoView({ behavior: 'smooth' });
}
function clearAIProjectForm() {
  document.getElementById('ai_project_id').value = '0';
  ['ai_proj_name','ai_proj_model','ai_proj_token','ai_proj_desc','ai_proj_demo'].forEach(id => document.getElementById(id).value = '');
}
function saveAIProject() {
  api('save_ai_project', {
    id: document.getElementById('ai_project_id').value,
    name: document.getElementById('ai_proj_name').value,
    model: document.getElementById('ai_proj_model').value,
    description: document.getElementById('ai_proj_desc').value,
    token_usage: document.getElementById('ai_proj_token').value,
    demo: document.getElementById('ai_proj_demo').value
  }, () => { setTimeout(() => location.reload(), 1000); });
}
function deleteAIProject(id) {
  if (!confirm('确定删除？')) return;
  api('delete_ai_project', { id }, () => { setTimeout(() => location.reload(), 1000); });
}
function addLog() {
  const div = document.createElement('div'); div.className = 'list-item';
  div.innerHTML = `<div class="form-row" style="gap:0.8rem"><input type="text" name="log_date[]" placeholder="日期"><input type="text" name="log_content[]" placeholder="更新内容" style="flex:1"></div>`;
  document.getElementById('logs-list').appendChild(div);
}
function saveLogs() {
  const dates = [...document.querySelectorAll('[name="log_date[]"]')].map(e => e.value);
  const contents = [...document.querySelectorAll('[name="log_content[]"]')].map(e => e.value);
  api('save_logs', { dates, contents });
}

// 留言管理
function loadMessages() {
  fetch('contact.php?action=list')
    .then(r => r.json())
    .then(data => {
      var msgs = data.messages || [];
      if (msgs.length === 0) {
        document.getElementById('messagesList').innerHTML = '<p style="color:#999">暂无留言</p>';
        return;
      }
      var html = '';
      function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
      msgs.reverse().forEach(function(m) {
        html += '<div style="padding:1rem 0;border-bottom:1px solid #eee">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">' +
          '<strong style="font-size:0.9rem">' + esc(m.name) + '</strong>' +
          '<span style="color:#999;font-size:0.8rem">' + esc(m.time) + '</span></div>' +
          '<div style="font-size:0.82rem;color:#666;margin-bottom:0.3rem">' + esc(m.email) + (m.subject ? ' · ' + esc(m.subject) : '') + '</div>' +
          '<div style="font-size:0.88rem">' + esc(m.message) + '</div>' +
          '</div>';
      });
      document.getElementById('messagesList').innerHTML = html;
    })
    .catch(function() { document.getElementById('messagesList').innerHTML = '<p style="color:#999">加载失败</p>'; });
}

document.querySelector('[data-section="messages"]').addEventListener('click', function() {
  setTimeout(loadMessages, 100);
});

// 访客统计
function loadVisitors() {
  fetch('visitor.php?action=list')
    .then(r => r.json())
    .then(data => {
      if (data.error) {
        document.getElementById('visitorStats').innerHTML = '<p style="color:#999">请先登录</p>';
        return;
      }
      document.getElementById('visitorStats').innerHTML =
        '<div style="display:flex;gap:2rem;margin-bottom:1rem">' +
        '<div><strong>' + data.total + '</strong><br><span style="color:#999;font-size:0.8rem">总访问</span></div>' +
        '<div><strong>' + data.today + '</strong><br><span style="color:#999;font-size:0.8rem">今日</span></div>' +
        '<div><strong>' + data.unique_ips + '</strong><br><span style="color:#999;font-size:0.8rem">独立IP</span></div>' +
        '</div>';

      var recent = data.recent || [];
      var html = '<h3 style="font-size:0.9rem;margin-bottom:0.8rem">最近访问</h3>';
      recent.reverse().forEach(function(v) {
        html += '<div style="padding:0.4rem 0;border-bottom:1px solid #eee;font-size:0.82rem">' +
          '<span style="color:#999">' + v.time + '</span> ' +
          '<span>' + (v.page || '/') + '</span> ' +
          '<span style="color:#999">' + (v.ip || '') + '</span></div>';
      });
      document.getElementById('visitorList').innerHTML = html;
    })
    .catch(function() { document.getElementById('visitorStats').innerHTML = '<p style="color:#999">暂无数据</p>'; });
}

document.querySelector('[data-section="visitors"]').addEventListener('click', function() {
  setTimeout(loadVisitors, 100);
});
</script>
</body>
</html>
