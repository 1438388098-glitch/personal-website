<?php
/* ============================================================
   管理员凭据配置模板
   部署时：复制本文件为 config.php，并填入真实凭据。
   config.php 已被 .gitignore 排除，绝不会进入版本库。
   生成密码哈希：php -r "echo password_hash('你的密码', PASSWORD_BCRYPT);"
   ============================================================ */

define('ADMIN_USER', 'your_username');
define('ADMIN_PASS_HASH', '$2b$10$replace-with-your-bcrypt-hash');
