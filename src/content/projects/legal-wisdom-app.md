---
title: legal-wisdom-app：法律智库本地法条库
summary: 覆盖 257 部中国法律法规的桌面法条库：FTS5 全文检索、条文交叉引用、结合当前条文作答的 AI 问答，87MB 数据库可从公开来源一键重建。
group: 法律主线
date: 2026-09-29
featured: false
order: 8
metrics:
  - label: 语料规模
    value: '257 部'
    detail: 法律 70、行政法规 132、司法解释 53、监察法规 2，数据更新至 2026
  - label: 数据可复现
    value: '87MB'
    detail: 数据库不进仓库（体积与再分发边界），按 docs/repro.md 从官方公开来源一条流水线重建
  - label: 界面语言
    value: '中 / 英'
    detail: 标题栏菜单切换，仅覆盖界面文案，法条原文不翻译
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/legal-wisdom-app
---

## 问题与边界

查法条要快、要离线、要知道这条和哪条有关联。这个桌面应用把 257 部法律法规装进本地 SQLite，检索、阅读、书签、AI 问答都在本机完成。边界交代清楚两点：全文检索是 FTS5 加 LIKE 的混合，unicode61 分词器下连续汉字算一个 token，中文子串查询主要靠 LIKE 兜底，这是关键词检索而非语义检索，带引用溯源的混合检索在 statute-rag 里演进；宪法、民法典、刑法等核心法典尚未入库（源语料缺失），截图用的是 7 部公法节选的演示库。

## 机制

PySide6 桌面端，内置阅读器自动高亮章标题和条号；阅读时自动建议关联条文，一键跳转；AI 面板可切换 DeepSeek、OpenAI、硅基流动、智谱，点「结合当前法条」让模型基于正在阅读的条文作答。搜索命中高亮，常用条文可收藏。PDF/DOCX 解析入库走 pdfminer 和 python-docx，检索主路径与条文引用有单元测试。数据库目录默认在用户目录下，可用环境变量重定向；发行二进制不打包，PyInstaller 脚本自取。
