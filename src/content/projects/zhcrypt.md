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
    value: '9 类'
    detail: 2026-08-13 审计轮修复 AEAD nonce 重用、预共享密钥身份归属、路径穿越、限流绕过、临时口令词表等，全部带回归测试
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

消息层每条推进会话密钥实现前向保密；身份首次使用信任加带外安全码比对，签名公钥意外变化即拒绝会话；可选 SPKI 证书固定防劣质 CA。审计轮修的九项都有具体场景：一次性预共享密钥批量封装改独立 nonce（原 key 加 nonce 重用触发 GCM 密钥流重用）、服务器拒绝静默覆盖他人身份的签名公钥（防预共享密钥投毒冒充）、流式解密输出名强制 basename 消毒、Argon2id 内存乘并行度钳制 2GiB 防 DoS、限流键改用不可伪造的 X-Real-IP、临时口令词表从 20 词扩到 256 词（熵约 17.3 bit 升至约 48 bit）、双棘轮消息号跳变钳制、本地文件密钥加密存储加私钥 0600、X25519 全零共享密钥拒绝。构建带依赖锁、SBOM 与 SHA256 清单。

## 验证

正确性主要靠回归测试与攻击者视角自测守住，材料全部在仓库公开。2026-08-13 授权审计轮的修复带全套回归：test_all 38/38、test_security_fixes 66/66、test_x3dh_full 25/25、test_chat 18/18，单元测试合计 161 例通过。3.2.0 批次（15 轮自动迭代）在发行说明里给出验证清单：pytest 集合 300+ 全过，TUI 冒烟加登录屏 44+31 全过，真实服务进程的本地双端 E2E 13/13，打包实测（PyInstaller 重建加 exe 级加解密往返、GUI 探活）全过，pip-audit 双依赖锁 0 已知漏洞。涉及随机字节、文件系统、线程的修复要求合入前全量 pytest 三连跑（2026-09-11 执行，三次 exit=0），全仓 TODO/FIXME 清点为 0。更早的红队自测报告走攻击者视角：实测打穿 auth token 明文落盘与 WS 不校验证书两处弱点，修复后安全回归套件从 46 项扩到 66 项全绿。构建可复现：requirements.lock.txt 锁依赖，产物带 SBOM.json、buildinfo.json 与 SHA256SUMS.txt。

## 已知失败

协议级遗留需版本升级，已列入下个大版本：Double Ratchet 的后妥协自愈只部分落地（跨链乱序预存已实现，完全重启重同步未做）；密文头 Argon2id 参数未纳入 GCM AAD，流式头字段无认证，只能靠参数钳制兜底；HKDF 用固定 salt；Shamir 秘密共享用的是 secp256k1 质数而非标准安全质数；X3DH 没有显式 AD 绑定，存在 UKS 理论面，靠带外安全号比对缓解。工程侧也有欠账：fileclient 下载全量缓冲，2GB 上限时内存峰值高，还没改流式；GUI 聊天文件传输旧管线与 send_file 双轨并存，未并入。兼容性上，3.2.0 的文件密码模式默认输出流式格式（0x05），3.1.0 无法解密新格式，升级必须双端同步。部署侧的责任无法由代码代劳：生产环境必须实际启用 HTTPS/WSS 加证书固定、token 只走环境变量，5000 端口直连时不设 ZHPREKEY_TRUST_PROXY=0 就能被伪造 X-Real-IP 绕过限流；漏掉任何一步，端到端加密的保证都会打折。
