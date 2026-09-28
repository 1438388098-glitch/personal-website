<?php
/* ============================================================
   管理员登录页面
   ============================================================ */
require_once 'auth.php';

// 已登录则跳转到后台
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';

// 登录频率限制
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}
if (!isset($_SESSION['login_lockout'])) {
    $_SESSION['login_lockout'] = 0;
}

// 检查是否处于锁定状态
if ($_SESSION['login_lockout'] > time()) {
    $remaining = $_SESSION['login_lockout'] - time();
    $minutes = ceil($remaining / 60);
    $error = "登录尝试过多，请 {$minutes} 分钟后再试";
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (login($username, $password)) {
        // 登录成功，重置计数
        $_SESSION['login_attempts'] = 0;
        $_SESSION['login_lockout'] = 0;
        header('Location: index.php');
        exit;
    } else {
        $_SESSION['login_attempts']++;
        if ($_SESSION['login_attempts'] >= 5) {
            $_SESSION['login_lockout'] = time() + 900; // 锁定 15 分钟
            $error = '登录尝试过多，请 15 分钟后再试';
        } else {
            $remaining = 5 - $_SESSION['login_attempts'];
            $error = "用户名或密码错误，还可尝试 {$remaining} 次";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>管理员登录 · 炜</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Serif SC', serif;
      background: #f5f5f5;
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-box {
      background: #fff;
      padding: 2.5rem;
      max-width: 380px;
      width: 100%;
    }
    h1 { font-size: 1.2rem; font-weight: 900; text-align: center; margin-bottom: 0.3rem; }
    p.sub { text-align: center; font-size: 0.82rem; color: #999; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; }
    input {
      width: 100%; padding: 0.6rem 0.8rem;
      font-family: 'Noto Serif SC', serif; font-size: 0.9rem;
      border: 1px solid #ddd; background: #fafafa;
      outline: none; transition: border 0.2s;
    }
    input:focus { border-color: #1a1a1a; background: #fff; }
    .btn {
      width: 100%; padding: 0.7rem;
      font-family: 'Noto Serif SC', serif; font-size: 0.9rem;
      border: 1px solid #1a1a1a; background: #1a1a1a; color: #fff;
      cursor: pointer; transition: 0.2s;
    }
    .btn:hover { background: #333; }
    .error { color: #c00; font-size: 0.82rem; text-align: center; margin-bottom: 1rem; }
    .back-link { display: block; text-align: center; margin-top: 1.5rem; font-size: 0.82rem; color: #999; }
    .back-link a { color: #999; }
    .back-link a:hover { color: #1a1a1a; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>管理员登录</h1>
    <p class="sub">炜 · 个人网站后台</p>

    <?php if ($error): ?>
      <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="post">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" name="username" required autocomplete="username">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit" class="btn">登录</button>
    </form>

    <div class="back-link"><a href="../">&larr; 返回网站</a></div>
  </div>
</body>
</html>
