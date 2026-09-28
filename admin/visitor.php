<?php
header('Content-Type: application/json; charset=utf-8');

$dataDir = __DIR__ . '/data';
$visitorFile = $dataDir . '/visitors.json';

if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

// List mode — requires admin login
if (($_GET['action'] ?? '') === 'list') {
    require_once 'auth.php';
    if (!isLoggedIn()) {
        echo json_encode(['error' => 'unauthorized'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $visitors = [];
    if (file_exists($visitorFile)) {
        $visitors = json_decode(file_get_contents($visitorFile), true) ?? [];
    }

    // Calculate stats
    $total = count($visitors);
    $today = date('Y-m-d');
    $todayCount = 0;
    $ips = [];
    $pages = [];
    foreach ($visitors as $v) {
        if (strpos($v['time'], $today) === 0) $todayCount++;
        $ips[$v['ip']] = true;
        $page = $v['page'] ?? '/';
        $pages[$page] = ($pages[$page] ?? 0) + 1;
    }

    // Sort pages by count descending
    arsort($pages);

    echo json_encode([
        'total' => $total,
        'today' => $todayCount,
        'unique_ips' => count($ips),
        'top_pages' => array_slice($pages, 0, 10, true),
        'recent' => array_slice($visitors, -20)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Track mode (default)
$visitors = [];
if (file_exists($visitorFile)) {
    $visitors = json_decode(file_get_contents($visitorFile), true) ?? [];
}

$visit = [
    'time' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'page' => $_GET['page'] ?? '/',
    'referrer' => $_GET['referrer'] ?? '',
    'ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200)
];

$visitors[] = $visit;

// Keep last 5000 entries
if (count($visitors) > 5000) {
    $visitors = array_slice($visitors, -5000);
}

$fp = fopen($visitorFile, 'c');
if (flock($fp, LOCK_EX)) {
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($visitors, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    flock($fp, LOCK_UN);
}
fclose($fp);

echo json_encode(['success' => true]);
