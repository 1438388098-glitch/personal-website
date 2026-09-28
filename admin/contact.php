<?php
// Contact form submission endpoint
header('Content-Type: application/json; charset=utf-8');

$dataDir = __DIR__ . '/data';
$messagesFile = $dataDir . '/messages.json';

// List mode (admin only)
if (($_GET['action'] ?? '') === 'list') {
    require_once 'auth.php';
    requireLogin();

    $messages = [];
    if (file_exists($messagesFile)) {
        $messages = json_decode(file_get_contents($messagesFile), true) ?? [];
    }

    echo json_encode([
        'total' => count($messages),
        'messages' => $messages
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '仅支持 POST']);
    exit;
}

if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

// Rate limiting: max 3 submissions per IP per 10 minutes
$rateFile = $dataDir . '/contact_rate.json';
$now = time();
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateData = [];
if (file_exists($rateFile)) {
    $rateData = json_decode(file_get_contents($rateFile), true) ?? [];
}
// Clean entries older than 10 min
$rateData = array_filter($rateData, fn($e) => ($e['t'] ?? 0) > $now - 600);
// Count hits from this IP
$ipHits = 0;
foreach ($rateData as $e) {
    if (($e['ip'] ?? '') === $ip) $ipHits++;
}
if ($ipHits >= 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => '发送过于频繁，请稍后再试']);
    exit;
}

// Read existing messages
$messages = [];
if (file_exists($messagesFile)) {
    $messages = json_decode(file_get_contents($messagesFile), true) ?? [];
}

// Honeypot: bots fill hidden field, humans don't see it
if (!empty($_POST['website'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '请求异常']);
    exit;
}

// Validate
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '请填写所有必填项']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '邮箱格式不正确']);
    exit;
}

// Save
$messages[] = [
    'time' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'read' => false
];

$json = json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$fp = fopen($messagesFile, 'c');
if (flock($fp, LOCK_EX)) {
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, $json);
    flock($fp, LOCK_UN);
}
fclose($fp);

// Track rate
$rateData[] = ['ip' => $ip, 't' => $now];
file_put_contents($rateFile, json_encode($rateData));

echo json_encode(['success' => true, 'message' => '留言已发送，我会尽快回复']);
