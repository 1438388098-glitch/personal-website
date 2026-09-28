<?php
/* ============================================================
   数据读写模块 — JSON 文件持久化
   ============================================================ */

define('DATA_DIR', __DIR__ . '/data');

/**
 * 读取 JSON 数据文件
 */
function readData($filename) {
    $path = DATA_DIR . '/' . $filename;
    if (!file_exists($path)) {
        return null;
    }
    $json = file_get_contents($path);
    return json_decode($json, true);
}

/**
 * 写入 JSON 数据文件
 */
function writeData($filename, $data) {
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    $path = DATA_DIR . '/' . $filename;
    return file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

/**
 * 获取所有可编辑内容（合并默认数据 + 自定义数据）
 */
function getAllContent() {
    $content = readData('site.json');
    if (!$content) {
        // 首次：返回默认结构
        $content = [
            'profile' => [
                'name' => '炜',
                'school' => '中南财经政法大学',
                'major' => '法学',
                'grade' => '法学本科在读',
                'hometown' => '广东韶关',
                'languages' => '普通话 / 粤语 / 客家话',
                'intro' => "你好，我是炜，来自广东韶关。目前为中南财经政法大学法学本科在读。成长于粤北的多语言环境，让我对不同背景的人有着天然的理解力与沟通能力。\n\n在法律学习中，我对民商法和刑法领域产生了浓厚兴趣，通过模拟法庭、法律诊所等课程积累了初步的实务经验。目前正在全力备战国家统一法律职业资格考试，期望未来成为一名专业扎实的法律从业者。\n\n课余时间喜欢阅读、写作和参与志愿服务。期待在实习和工作中不断成长，将所学转化为真正的社会价值。",
                'intro_en' => "Hi, I'm Wei, from Shaoguan, Guangdong. I am an undergraduate law student at Zhongnan University of Economics and Law. Growing up in a multilingual environment in northern Guangdong has given me a natural ability to understand and communicate with people from diverse backgrounds.\n\nIn my legal studies, I have developed a strong interest in Civil and Commercial Law as well as Criminal Law. Through moot court competitions, legal clinics, and other coursework, I have gained foundational practical experience. I am now fully preparing for the National Unified Legal Profession Qualification Exam, with the goal of becoming a well-trained legal professional in the future.\n\nIn my spare time, I enjoy reading, writing, and participating in volunteer services. I look forward to growing through internships and practical work, transforming what I have learned into genuine social value.",
                'goal' => '正在备战法律职业资格考试，关注民商法与刑法领域。',
                'goal_en' => 'Preparing for the National Unified Legal Profession Qualification Exam, with focus on Civil & Commercial Law and Criminal Law.',
                'email' => 'wei@example.edu.cn',
                'location' => '湖北 · 武汉 / 广东 · 韶关',
                'location_en' => 'Wuhan, Hubei / Shaoguan, Guangdong',
                'campus' => '中南财经政法大学 · 南湖校区',
                'campus_en' => 'Zhongnan University of Economics and Law · Nanhu Campus'
            ],
            'education' => [
                'school' => '中南财经政法大学',
                'school_en' => 'Zhongnan University of Economics and Law',
                'major' => '法学专业',
                'major_en' => 'Law (LL.B.)',
                'period' => '法学本科在读',
                'period_en' => 'Undergraduate Law Student',
                'courses' => ['民法总论', '刑法总论', '民事诉讼法', '刑事诉讼法', '行政法与行政诉讼法', '商法', '经济法', '知识产权法', '国际法', '法律逻辑学'],
                'courses_en' => ['General Theory of Civil Law', 'General Theory of Criminal Law', 'Civil Procedure Law', 'Criminal Procedure Law', 'Administrative Law & Administrative Procedure Law', 'Commercial Law', 'Economic Law', 'Intellectual Property Law', 'International Law', 'Legal Logic']
            ],
            'honors' => [
                ['year' => '2025', 'title' => '校级一等奖学金', 'title_en' => 'First-Class University Scholarship', 'desc' => '综合测评排名专业前 10%', 'desc_en' => 'Comprehensive evaluation ranked within top 10% of the major'],
                ['year' => '2024', 'title' => '模拟法庭竞赛 · 最佳辩手', 'title_en' => 'Moot Court Competition · Best Advocate', 'desc' => '校级模拟法庭大赛，担任原告方代理人', 'desc_en' => "University-level moot court competition, served as plaintiff's representative"],
                ['year' => '2024', 'title' => '优秀学生干部', 'title_en' => 'Outstanding Student Leader', 'desc' => '担任班级学习委员，组织学风建设活动', 'desc_en' => 'Served as class academic secretary, organized academic atmosphere-building activities'],
                ['year' => '2023', 'title' => '新生辩论赛 · 团体亚军', 'title_en' => 'Freshman Debate Competition · Team Runner-Up', 'desc' => '法学院新生辩论赛，负责质询与结辩', 'desc_en' => 'Law School freshman debate, responsible for cross-examination and closing arguments']
            ],
            'experiences' => [
                ['year' => '2024–25', 'title' => '学生会学术部干事', 'title_en' => 'Academic Affairs Department, Student Union', 'desc' => '策划组织专题讲座、学术沙龙、模拟法庭', 'desc_en' => 'Planned and organized seminars, academic salons, and moot court sessions'],
                ['year' => '2024', 'title' => '法律援助志愿者', 'title_en' => 'Legal Aid Volunteer', 'desc' => '社区法律咨询，协助整理案件材料', 'desc_en' => 'Provided community legal consultations, assisted in organizing case materials'],
                ['year' => '2024–25', 'title' => '班级学习委员', 'title_en' => 'Class Academic Secretary', 'desc' => '组织学习小组和考前复习交流', 'desc_en' => 'Organized study groups and pre-exam review sessions'],
                ['year' => '2023–24', 'title' => '辩论队成员', 'title_en' => 'Debate Team Member', 'desc' => '校际辩论赛，锻炼逻辑思辨与表达能力', 'desc_en' => 'Participated in intercollegiate debates, honing logical reasoning and presentation skills']
            ],
            'skills' => [
                ['name' => '法律检索与研究', 'name_en' => 'Legal Research & Analysis', 'level' => '精通', 'level_en' => 'Expert', 'percent' => 90],
                ['name' => '法律文书写作', 'name_en' => 'Legal Writing', 'level' => '高级', 'level_en' => 'Advanced', 'percent' => 80],
                ['name' => '案例分析', 'name_en' => 'Case Analysis', 'level' => '高级', 'level_en' => 'Advanced', 'percent' => 80],
                ['name' => '辩论与口头表达', 'name_en' => 'Debate & Oral Advocacy', 'level' => '高级', 'level_en' => 'Advanced', 'percent' => 85],
                ['name' => '法律英语', 'name_en' => 'Legal English', 'level' => '中级', 'level_en' => 'Intermediate', 'percent' => 60]
            ],
            'tools' => ['Office 套件', '北大法宝', '中国裁判文书网', 'Westlaw', '法律文书系统', 'XMind', 'VS Code'],
            'tools_en' => ['Office Suite', 'Pkulaw (Beida Fabao)', 'China Judgments Online', 'Westlaw', 'Legal Document System', 'XMind', 'VS Code'],
            'languages' => [
                ['name' => '中文（普通话）', 'name_en' => 'Chinese (Mandarin)', 'level' => '母语 · 精通', 'level_en' => 'Native · Proficient'],
                ['name' => '粤语', 'name_en' => 'Cantonese', 'level' => '母语 · 精通', 'level_en' => 'Native · Proficient'],
                ['name' => '客家话', 'name_en' => 'Hakka', 'level' => '母语 · 精通', 'level_en' => 'Native · Proficient'],
                ['name' => '英语', 'name_en' => 'English', 'level' => 'CET-6', 'level_en' => 'CET-6']
            ],
            'soft_skills' => ['沟通能力', '团队协作', '逻辑思辨', '时间管理', '责任心', '自主学习'],
            'soft_skills_en' => ['Communication', 'Teamwork', 'Critical Thinking', 'Time Management', 'Responsibility', 'Self-Directed Learning'],
            'projects' => [],
            'base' => [
                'avatar' => '',
                'resume' => '',
                'github' => '',
                'linkedin' => '',
                'wechat' => '',
                'zhihu' => '',
                'blog' => 'http://poetry.iweistoicqc5.top/'
            ],
            'ai' => [
                'total_tokens' => '0',
                'total_requests' => '0',
                'models' => [],
                'projects' => []
            ],
            'logs' => [
                ['date' => '2026-05-28', 'content' => '新增字号调整与中英文切换功能', 'content_en' => 'Added font size adjustment and CN/EN language switching'],
                ['date' => '2026-05-27', 'content' => '全面改版：新增「大模型实践」板块、AI项目、真实简历内容替换、PWA支持、字体体系重构', 'content_en' => 'Major redesign: added "AI Practice" section, AI projects, real resume content, PWA support, font system restructured'],
                ['date' => '2026-05-22', 'content' => '初始上线：个人网站搭建完成，包含关于、项目、技能、联系四大板块', 'content_en' => 'Initial launch: personal website completed with About, Projects, Skills, and Contact sections']
            ]
        ];
        writeData('site.json', $content);
    }
    return $content;
}

// GET handler for main site data access
if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['action'] ?? '') === 'full') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(getAllContent(), JSON_UNESCAPED_UNICODE);
    exit;
}
