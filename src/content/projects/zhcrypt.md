---
title: zhcrypt：端到端加密通讯工具集
summary: 给中文用户的端到端加密工具：Argon2id 派生、AES-256-GCM 认证加密、RSA-4096 混合加密、X3DH 加 Double Ratchet 前向保密，TOFU 安全码防中间人，CLI 与 GUI 双形态。
group: 工程侧证
date: 2026-09-28
featured: false
order: 2
metrics:
  - label: 单元测试
    value: '161 例'
    detail: 含 test_security_fixes 66/66、test_x3dh_full 25/25、test_chat 18/18
  - label: 授权审计修复
    value: '8 项'
    detail: 2026-08-13 审计轮修复 AEAD nonce 重用、预共享密钥身份归属、路径穿越、限流绕过等，全部带回归测试
  - label: 临时口令熵
    value: '≈48 bit'
    detail: 词表从 20 词扩到 256 词；此前约 17.3 bit
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/zhcrypt
---

## 问题与边界

端到端加密工具不少，但部署说明和威胁模型大多只有英文，参数选择也不透明。zhcrypt 把整套现代加密栈（Argon2id、AES-256-GCM、RSA-4096-OAEP、X3DH 加 Double Ratchet）装进 CLI、GUI 和自托管 Flask/WebSocket 服务器三件套，配中文手册与威胁模型文档。边界：双棘轮的后妥协自愈只部分到位（跨链乱序预存已实现，完全重启重同步未做），密文头 Argon2id 参数未纳入 GCM AAD 覆盖，这些遗留项需要协议版本升级，已列入下个大版本；生产部署必须启用 HTTPS/WSS 加证书固定，服务器 token 只走环境变量。

## 机制

消息层每条推进会话密钥实现前向保密；身份首次使用信任加带外安全码比对，签名公钥意外变化即拒绝会话；可选 SPKI 证书固定防劣质 CA。审计轮修的八项都有具体场景：一次性预共享密钥批量封装改独立 nonce（原 key 加 nonce 重用触发 GCM 密钥流重用）、服务器拒绝静默覆盖他人身份的签名公钥（防预共享密钥投毒冒充）、流式解密输出名强制 basename 消毒、Argon2id 内存乘并行度钳制 2GiB 防 DoS、限流键改用不可伪造的 X-Real-IP、双棘轮消息号跳变钳制、本地文件密钥加密存储加私钥 0600、X25519 全零共享密钥拒绝。构建带依赖锁、SBOM 与 SHA256 清单。
