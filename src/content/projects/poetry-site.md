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
