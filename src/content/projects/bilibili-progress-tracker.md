---
title: bilibili-progress-tracker：B 站网课进度追踪扩展
summary: Chrome 扩展（MV3）自动记录 B 站网课观看进度：官方合集自动识别、多分 P 独立记录、每日学习时长与连续打卡，IndexedDB 本地存储，零第三方依赖。
group: 工程侧证
date: 2026-09-28
featured: false
order: 4
metrics:
  - label: 追踪频率
    value: '5 秒'
    detail: 播放进度轮询间隔，可在设置中调整
  - label: 完成判定
    value: '默认 98%'
    detail: 阈值可调，避免片尾拖动或预加载误判完成
  - label: 依赖
    value: '0'
    detail: 纯原生 JS，Service Worker 加 Content Script 加独立仪表盘窗口
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/bilibili-progress-tracker
---

## 问题与边界

网课合集在 B 站看到第几集、总共刷了多少小时，平台不替你记账。这个扩展在页面里自动记录进度：访问合集或播放列表页自动识别并导入为课程，多 P 视频每个分 P 独立记，也支持手动建课程（BV 号列表）。边界：本地浏览器扩展，数据存 IndexedDB 不上传；识别依赖 B 站页面结构，改版可能需要更新选择器。

## 机制

Manifest V3 架构：background Service Worker 管数据与消息路由，content script 监听播放并识别页面类型，content-patch 在 document_start 打 shadow DOM 补丁；仪表盘是独立窗口（位置尺寸记忆），用 chrome.runtime.connect 长连接实时推送。统计给今日学习时长与连续打卡天数；全量 JSON 备份、CSV 导出、JSON 恢复齐全。开发侧配了图标生成与语法检查脚本、两版设计文档。
