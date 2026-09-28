/* ============================================================
   项目作品数据
   ============================================================ */
const projectsData = [
  {
    id: 1,
    title: '民间借贷纠纷案例研究报告',
    category: 'course',
    categoryLabel: '课程项目',
    date: '2025.03',
    summary: '对民间借贷纠纷典型案例进行全流程分析，撰写法律分析报告。',
    description: `本报告选取最高人民法院公布的民间借贷纠纷典型案例，从案件事实、争议焦点、法律适用、判决结果四个维度进行深入分析。
    通过梳理借贷关系认定、利率保护上限、举证责任分配等核心问题，撰写了8000余字的案例分析报告。
    该项目锻炼了我的法律检索能力、案例分析方法论和法律文书写作能力，最终获得课程最高分评价。`,
    tech: ['民法典', '民间借贷司法解释', '案例分析法', '法律检索'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #165DFF, #0EA5E9)',
    github: null,
    demo: null,
    results: '课程论文获得优秀评价，被选为教学范例',
    title_en: 'Case Study Report on Private Lending Disputes',
    categoryLabel_en: 'Coursework',
    summary_en: 'Conducted a full-process analysis of a typical private lending dispute case and authored a legal analysis report.',
    description_en: `This report examines a typical private lending dispute case published by the Supreme People's Court, conducting an in-depth analysis from four dimensions: case facts, disputed issues, applicable law, and judgment outcome. By examining core issues such as determination of loan relationships, the cap on protected interest rates, and allocation of burden of proof, an 8,000-word case analysis report was produced. This project strengthened my legal research skills, case analysis methodology, and legal writing abilities, and ultimately received the highest grade in the course.`,
    results_en: 'Course paper received top grade and was selected as a teaching exemplar',
    tech_en: ['Civil Code', 'SPC Private Lending Judicial Interpretation', 'Case Analysis Method', 'Legal Research']
  },
  {
    id: 2,
    title: '模拟法庭 · 买卖合同纠纷案',
    category: 'competition',
    categoryLabel: '竞赛项目',
    date: '2024.11',
    summary: '作为原告方代理人参加校级模拟法庭竞赛，获得"最佳书状"奖。',
    description: `在2024年校级模拟法庭竞赛中，我担任原告方诉讼代理人。案件涉及买卖合同中的标的物质量瑕疵争议。
    我负责起草起诉状、代理词等法律文书，并在庭前进行了充分的证据梳理和庭审模拟。
    庭审过程中，我针对被告方的抗辩理由进行了有力的质证和法庭辩论，最终赢得合议庭支持。
    本次经历让我深刻理解了民事诉讼程序的实际运作，也锻炼了法庭表达和临场应变能力。`,
    tech: ['民事诉讼法', '合同法', '证据规则', '法律文书写作'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #059669, #10B981)',
    github: null,
    demo: null,
    results: '团队获得亚军，个人获评"最佳书状"',
    title_en: 'Moot Court · Sales Contract Dispute',
    categoryLabel_en: 'Competition',
    summary_en: "Served as plaintiff's representative in a university-level moot court competition, winning the 'Best Brief' award.",
    description_en: `In the 2024 university moot court competition, I served as the plaintiff's litigation representative. The case involved a dispute over the quality of subject matter in a sales contract. I drafted the statement of claim, agency submissions, and other legal documents, and conducted thorough evidence review and trial rehearsals. During the trial, I effectively cross-examined and debated against the defendant's arguments, ultimately securing the collegiate bench's support. This experience gave me a deep understanding of the actual operation of civil procedure and strengthened my courtroom advocacy and improvisational skills.`,
    results_en: 'Team won runner-up; personally awarded "Best Brief"',
    tech_en: ['Civil Procedure Law', 'Contract Law', 'Rules of Evidence', 'Legal Writing']
  },
  {
    id: 3,
    title: '个人诗集网站 · 「陌生的你」',
    category: 'personal',
    categoryLabel: '个人项目',
    date: '2025.05',
    summary: '创作并部署个人诗集展示网站，包含24首现代诗作与管理员后台。',
    description: `「陌生的你」是一个个人诗歌作品展示网站，收录了24首现代诗和仿写诗作。
    项目采用纯静态前端（HTML + CSS + JavaScript）搭配 PHP 管理后台的技术架构，
    部署于阿里云 ECS 服务器（CentOS + Nginx + 宝塔面板）。
    网站实现了诗作时间线展示、搜索过滤、弹窗详情、响应式适配等核心功能，
    并集成了访客统计系统（总访问量、独立IP、时段分布、设备分析等）。
    后台管理面板支持在线发布新诗作，数据持久化存储于 JSON 文件。
    该项目是我将技术能力与个人兴趣结合的完整实践。`,
    tech: ['HTML/CSS/JS', 'PHP', 'Nginx', '阿里云 ECS', '响应式设计'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    github: null,
    demo: 'http://poetry.iweistoicqc5.top/',
    results: '成功部署上线并稳定运行，日均访客50+',
    title_en: 'Personal Poetry Collection Website · "Stranger You"',
    categoryLabel_en: 'Personal',
    summary_en: 'Designed, built, and deployed a personal poetry showcase website featuring 24 modern poems with an admin dashboard.',
    description_en: `"Stranger You" is a personal poetry showcase website featuring 24 modern and imitation poems. The project uses a purely static frontend (HTML + CSS + JavaScript) with a PHP admin backend, deployed on Alibaba Cloud ECS (CentOS + Nginx + Baota Panel). Key features include timeline display, search and filtering, modal details, responsive design, and a visitor analytics system (total visits, unique IPs, time distribution, device analysis). The admin panel supports online publication of new poems with JSON-based data persistence. This project represents a complete practice of integrating technical skills with personal interests.`,
    results_en: 'Successfully deployed and running steadily with 50+ daily visitors',
    tech_en: ['HTML/CSS/JS', 'PHP', 'Nginx', 'Alibaba Cloud ECS', 'Responsive Design']
  },
  {
    id: 4,
    title: '法律咨询志愿服务 · 社区普法活动',
    category: 'volunteer',
    categoryLabel: '实践项目',
    date: '2024.07',
    summary: '参与社区法律咨询志愿服务，为居民提供基础法律问题解答。',
    description: `2024年暑假期间，我随学院法律援助中心团队赴武汉市洪山区某社区开展普法宣传活动。
    活动内容包括：为社区居民提供免费法律咨询（主要涉及婚姻家庭、邻里纠纷、消费维权等领域），
    发放普法宣传手册，举办小型法律知识讲座。
    我负责接待咨询对象、记录案件基本信息、在指导老师帮助下提供初步法律意见。
    这次经历让我认识到法律服务的现实意义，也锻炼了我将理论知识转化为实务操作的能力。`,
    tech: ['婚姻家庭法', '消费者权益保护法', '沟通技巧', '案例分析'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #F59E0B, #F97316)',
    github: null,
    demo: null,
    results: '服务居民50余人次，获得社区感谢信',
    title_en: 'Legal Aid Volunteer · Community Legal Education',
    categoryLabel_en: 'Practice',
    summary_en: 'Participated in community legal consultation services, providing basic legal guidance to residents.',
    description_en: `During the 2024 summer break, I joined the university Legal Aid Center team in conducting a legal education campaign in Hongshan District, Wuhan. Activities included free legal consultations (covering marriage and family, neighborhood disputes, consumer rights, etc.), distribution of legal education brochures, and a mini legal knowledge lecture. I was responsible for receiving clients, recording basic case information, and providing preliminary legal opinions under supervisors' guidance. This experience opened my eyes to the real-world significance of legal services and strengthened my ability to translate theoretical knowledge into practice.`,
    results_en: 'Served over 50 residents; received a letter of appreciation from the community',
    tech_en: ['Marriage & Family Law', 'Consumer Rights Protection Law', 'Communication Skills', 'Case Analysis']
  },
  {
    id: 5,
    title: '刑法案例分析 · 共同犯罪专题',
    category: 'course',
    categoryLabel: '课程项目',
    date: '2024.12',
    summary: '针对共同犯罪理论问题进行案例检索与学术综述，完成课程论文。',
    description: `本课程论文选题为"共同犯罪中主从犯的认定问题研究"。
    通过检索中国裁判文书网上近三年的相关案例，结合张明楷、周光权等学者的理论观点，
    对共同犯罪案件中主从犯认定的司法实践困境进行了系统分析。
    论文从"作用分类法"与"分工分类法"的体系冲突切入，
    探讨了犯罪事实支配理论在我国司法实践中的适用空间。
    该项目深化了我对刑法总论核心理论的理解，也锻炼了学术论文写作能力。`,
    tech: ['刑法总论', '共同犯罪理论', '案例检索', '学术写作'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #EC4899, #F43F5E)',
    github: null,
    demo: null,
    results: '论文获得任课教授好评，成绩排名班级前5%',
    title_en: 'Criminal Law Case Analysis · Joint Offenses',
    categoryLabel_en: 'Coursework',
    summary_en: 'Conducted case research and academic review on joint offense theory, completing a course paper.',
    description_en: `The topic of this course paper was "A Study on the Determination of Principal and Accessory Offenders in Joint Crimes." By searching relevant cases from the past three years on China Judgments Online and drawing on the theoretical perspectives of scholars such as Zhang Mingkai and Zhou Guangquan, I systematically analyzed the practical difficulties in distinguishing principals from accessories in joint crime cases. The paper begins with the systemic tension between the "role-based classification" and "function-based classification" approaches, and explores the applicability of the theory of control over the commission of crimes in Chinese judicial practice. This project deepened my understanding of core criminal law theory and strengthened my academic writing skills.`,
    results_en: 'Paper received praise from the professor; ranked in the top 5% of the class',
    tech_en: ['General Theory of Criminal Law', 'Joint Crime Theory', 'Case Research', 'Academic Writing']
  },
  {
    id: 6,
    title: 'Ollama 本地大模型调参部署',
    category: 'personal',
    categoryLabel: '个人项目',
    date: '2026.05',
    summary: '在本地配置 Qwen3 大模型并搭建可视化调参面板，支持局域网访问。',
    description: `本项目是在个人电脑上配置开源大语言模型 Qwen3 的完整技术实践。
    基于 Ollama 框架部署模型运行环境，针对 AMD RDNA3 架构显卡进行了 Vulkan 性能调优，
    成功将推理速度从11 tok/s 提升至45 tok/s。
    使用 HTML/CSS/JS 开发了可视化调参面板，支持实时调节温度、top_p、重复惩罚等超参数，
    并实现了局域网内多设备访问（手机、平板）。
    项目涉及 Linux 子系统、GPU 加速配置、前后端开发等技术领域，
    体现了我跨学科的技术探索能力和问题解决能力。`,
    tech: ['Ollama', 'Vulkan/GPU', 'HTML/CSS/JS', 'Linux', '局域网部署'],
    thumbnail: null,
    thumbColor: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    github: null,
    demo: null,
    results: '推理速度提升4倍，局域网多设备流畅访问',
    title_en: 'Local LLM Deployment with Ollama & Qwen3',
    categoryLabel_en: 'Personal',
    summary_en: 'Deployed the Qwen3 LLM locally and built a visual parameter-tuning dashboard with LAN access.',
    description_en: `This project is a complete technical practice of deploying the open-source Qwen3 large language model on a personal computer. Based on the Ollama framework, I configured the model runtime environment and performed Vulkan performance optimization for AMD RDNA3 architecture, successfully boosting inference speed from 11 tok/s to 45 tok/s. I developed a visual parameter-tuning dashboard using HTML/CSS/JS, supporting real-time adjustment of temperature, top_p, repetition penalty, and other hyperparameters, with multi-device LAN access (mobile phones, tablets). The project spans Linux subsystem, GPU acceleration, and frontend/backend development, demonstrating interdisciplinary technical exploration and problem-solving abilities.`,
    results_en: '4x inference speed improvement; smooth multi-device LAN access',
    tech_en: ['Ollama', 'Vulkan/GPU', 'HTML/CSS/JS', 'Linux', 'LAN Deployment']
  }
];
