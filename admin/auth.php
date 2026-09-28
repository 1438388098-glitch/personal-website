<?php
/* ============================================================
   管理员认证模块
   ============================================================ */

// 安全的 Session 配置（必须在 session_start 之前）
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.cookie_secure', 0); // 未启用HTTPS时设为0

session_start();

// 管理员凭据：从本地 config.php 读取（不入库）
// 部署时复制 config.example.php 为 config.php 并填入真实值
if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    exit('缺少 admin/config.php：请复制 config.example.php 为 config.php 并填入管理员凭据');
}
require_once __DIR__ . '/config.php';

/**
 * 验证登录
 */
function login($username, $password) {
    if ($username === ADMIN_USER && password_verify($password, ADMIN_PASS_HASH)) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $username;
        return true;
    }
    return false;
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * 登出
 */
function logout() {
    $_SESSION = [];
    session_destroy();
}

/**
 * 未登录则跳转
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

/**
 * 生成 CSRF Token
 */
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * 验证 CSRF Token
 */
function verify_csrf($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
