---
title: poetry-site：陌生的你 · 个人诗集站
summary: 2021 到 2026 的个人诗集网站：纯 PHP 加 JSON，无框架无数据库，诗歌浏览、随机一首、访客留言、逐诗点赞与密码保护的发布后台。
group: 实验
date: 2026-09-28
featured: false
order: 5
disclaimer: 个人作品站点，仅供学习交流。
metrics:
  - label: 作品跨度
    value: '2021–2026'
    detail: 现代诗与拟古作品，全部原创
  - label: 技术栈
    value: 'PHP + JSON'
    detail: 无框架、无数据库，诗歌数据在 JSON 文件里；前端原生 HTML/CSS/JS
  - label: 部署
    value: '阿里云 ECS'
    detail: Nginx 加 PHP 环境，域名访问；凭据不入库，密码走 password_hash
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/poetry-site
---

## 问题与边界

写了几年的诗需要一个不依附任何平台的、自己说了算的角落。这个站点就是那个角落： poems.js 存诗歌数据，纯 PHP 提供留言、点赞、访问统计和发布后台，没有构建工具，前端双击 index.html 也能读全部诗。边界：留言簿、统计等交互功能需要 PHP 后端；访客数据只用于统计，不对外共享；管理后台凭据用配置模板加哈希的方式管理，不进版本库。

## 机制

功能按时间排序浏览、随机一首、暗色模式、搜索、逐诗独立点赞计数；后台在 /admin/ 路径下发布新作。访问统计走 track.php，访问控制由 check_access.php 承担。

## 验证

先如实交代：仓库里没有自动化测试，没有 CI，也没有数据校验脚本，README 通篇未提测试，这一层是空的。实际的检验靠三条路径。其一，本地可运行：README 给出的启动方式是 php -S localhost:8080，或者不起后端、直接双击 index.html 读全部诗，等于一条手工冒烟路径。其二，部署链路明确：站点跑在阿里云 ECS 的 Nginx 加 PHP 环境上，凭域名访问；后台凭据按 admin/config.example.php 模板手工复制配置，密码哈希用 php -r 调 password_hash 生成，凭据不进版本库。其三，线上实际运行：2026 年 10 月 1 日核验，线上 /poems/ 路径返回 HTTP 200，页面副标题标注作品跨度二〇二一到二〇二六，与 README 写的 2021 至 2026 一致。后端一共 5 个 PHP 文件（check_access、guestbook、likes、log_search、track），各管一件事，出问题时排查面很小。

## 已知失败

交互能力全部押在 PHP 后端上：README 明说双击 index.html 只能读诗，留言簿、点赞、访问统计这些功能都要求后端在场，没有后端就只剩一个静态阅读页。完整部署依赖 PHP 服务器环境，README 写明 Requires a PHP server environment，机器上没有 PHP 就跑不起来。发布与凭据流程全手工：部署时要手动复制配置模板、手动生成哈希、手动填入，少做一步后台即不可用；新作品也经由 /admin/ 后台人工发布，没有批量导入或自动化发布通道。数据层只有 JSON 文件，没有数据库，README 未提供并发写入、备份或恢复方案，这些都不在承诺范围内。安全承诺同样偏窄：隐私一节只保证访客数据仅用于统计、不对外共享，防滥用、限流等内容 README 完全未提。另有一处线上遗留：站点页面的 meta 描述仍写着「收录2021至2023年的现代诗与仿写诗作」，落后于实际的 2021 至 2026 跨度。
