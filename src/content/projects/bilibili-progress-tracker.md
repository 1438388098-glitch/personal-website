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

## 验证

没有自动化测试，这点如实说：仓库的 tests/ 目录在设计文档里标的是「后续补」，目前唯一的检查脚本是 scripts/check-syntax.js，对全部 13 个 JS 文件逐个做语法编译检查，报 OK 或 ERROR。正确性靠人工核验：开发者模式加载进 Chrome，到 B 站实际观看。识别覆盖三种页面形态：合集页（URL 形如 /list/ml123456）一键导入为课程，多 P 视频页每个分 P 独立导入，单视频页手动归入已有或新建课程；页面类型判定按四种 URL 模式匹配（/video/BV、/list/ml、/medialist/play/ml、/channel/collectiondetail），匹配不上的一律不记录。content.js 里埋了 [BT] 前缀的控制台日志（识别成功打 extractVideoData ok，降级路径打 fallback），识别出错能定位到哪一层没取到数据。行为口径在设计文档里有明确定义并落实到代码：进度每 5 秒轮询一次，完成判定为进度达到阈值（默认 98%），跨度超过 10 秒的拖动不计入观看时长，倍速播放按 playbackRate 折算有效时长，多个标签页开同一视频取最大进度，pause 事件加 visibilitychange 双重停止计数。

## 已知失败

页面结构依赖是最大的脆弱点：合集视频列表按写死的类名抓取（.video-list-item、.video-item、.title、.duration 这一批），视频元素要穿透 shadow DOM 搜索（bpx-player、bwp-video 等宿主标签，靠 content-patch 在 document_start 把 closed shadow root 改成 open）。B 站改版类名或播放器实现，识别和记录可能直接失效，需要更新选择器。数据提取优先读 window.__INITIAL_STATE__，取不到时降级为从 URL 抠 BV 号、从播放器 src 抠 cid，此时标题只剩 document.title，封面和 UP 主信息为空。B 站 API 限流或跨域时走 DOM 解析兜底、不阻塞流程，但手动建课程靠 API 异步补全标题和时长，补不全就只剩一列裸 BV 号。数据只存本机 IndexedDB，没有云同步，清浏览器数据前没导出 JSON 备份，进度不可恢复。安装方式只有 Chrome 开发者模式加载未打包扩展，未上架商店，也没有在 Firefox 等其他浏览器验证过。
