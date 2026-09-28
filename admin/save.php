<?php
/* ============================================================
   API: 保存数据
   ============================================================ */
require_once 'auth.php';
require_once 'data.php';

requireLogin();

// CSRF 验证
$csrf = $_POST['csrf_token'] ?? '';
if (!verify_csrf($csrf)) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'CSRF 验证失败']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '仅支持 POST']);
    exit;
}

$action = $_POST['action'] ?? '';

switch ($action) {

    case 'save_profile':
        $content = getAllContent();
        $content['profile']['name'] = $_POST['name'] ?? '';
        $content['profile']['school'] = $_POST['school'] ?? '';
        $content['profile']['major'] = $_POST['major'] ?? '';
        $content['profile']['grade'] = $_POST['grade'] ?? '';
        $content['profile']['hometown'] = $_POST['hometown'] ?? '';
        $content['profile']['languages'] = $_POST['languages'] ?? '';
        $content['profile']['intro'] = $_POST['intro'] ?? '';
        $content['profile']['goal'] = $_POST['goal'] ?? '';
        $content['profile']['email'] = $_POST['email'] ?? '';
        $content['profile']['location'] = $_POST['location'] ?? '';
        $content['profile']['campus'] = $_POST['campus'] ?? '';
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_education':
        $content = getAllContent();
        $content['education']['school'] = $_POST['school'] ?? '';
        $content['education']['major'] = $_POST['major'] ?? '';
        $content['education']['period'] = $_POST['period'] ?? '';
        $courses = $_POST['courses'] ?? '';
        $content['education']['courses'] = array_filter(array_map('trim', explode("\n", $courses)));
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_honors':
        $content = getAllContent();
        $years = $_POST['years'] ?? [];
        $titles = $_POST['titles'] ?? [];
        $descs = $_POST['descs'] ?? [];
        $content['honors'] = [];
        foreach ($years as $i => $year) {
            if (!empty($titles[$i])) {
                $content['honors'][] = [
                    'year' => $year,
                    'title' => $titles[$i],
                    'desc' => $descs[$i] ?? ''
                ];
            }
        }
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_experiences':
        $content = getAllContent();
        $years = $_POST['years'] ?? [];
        $titles = $_POST['titles'] ?? [];
        $descs = $_POST['descs'] ?? [];
        $content['experiences'] = [];
        foreach ($years as $i => $year) {
            if (!empty($titles[$i])) {
                $content['experiences'][] = [
                    'year' => $year,
                    'title' => $titles[$i],
                    'desc' => $descs[$i] ?? ''
                ];
            }
        }
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_skills':
        $content = getAllContent();
        $names = $_POST['names'] ?? [];
        $levels = $_POST['levels'] ?? [];
        $percents = $_POST['percents'] ?? [];
        $content['skills'] = [];
        foreach ($names as $i => $name) {
            if (!empty($name)) {
                $content['skills'][] = [
                    'name' => $name,
                    'level' => $levels[$i] ?? '',
                    'percent' => intval($percents[$i] ?? 0)
                ];
            }
        }
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_tools':
        $content = getAllContent();
        $tools = $_POST['tools'] ?? '';
        $content['tools'] = array_filter(array_map('trim', explode("\n", $tools)));
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_languages':
        $content = getAllContent();
        $names = $_POST['names'] ?? [];
        $levels = $_POST['levels'] ?? [];
        $content['languages'] = [];
        foreach ($names as $i => $name) {
            if (!empty($name)) {
                $content['languages'][] = [
                    'name' => $name,
                    'level' => $levels[$i] ?? ''
                ];
            }
        }
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_soft_skills':
        $content = getAllContent();
        $skills = $_POST['skills'] ?? '';
        $content['soft_skills'] = array_filter(array_map('trim', explode("\n", $skills)));
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_project':
        $content = getAllContent();
        $projects = $content['projects'] ?? [];
        $id = intval($_POST['id'] ?? 0);
        $entry = [
            'id' => $id ?: (count($projects) > 0 ? max(array_column($projects, 'id')) + 1 : 1),
            'title' => $_POST['title'] ?? '',
            'category' => $_POST['category'] ?? 'personal',
            'categoryLabel' => $_POST['categoryLabel'] ?? '',
            'date' => $_POST['date'] ?? '',
            'summary' => $_POST['summary'] ?? '',
            'description' => $_POST['description'] ?? '',
            'tech' => array_filter(array_map('trim', explode("\n", $_POST['tech'] ?? ''))),
            'results' => $_POST['results'] ?? '',
            'github' => $_POST['github'] ?? '',
            'demo' => $_POST['demo'] ?? ''
        ];
        if ($id) {
            foreach ($projects as &$p) {
                if ($p['id'] === $id) { $p = $entry; break; }
            }
        } else {
            $projects[] = $entry;
        }
        $content['projects'] = $projects;
        writeData('site.json', $content);
        echo json_encode(['success' => true, 'id' => $entry['id']]);
        break;

    case 'delete_project':
        $content = getAllContent();
        $id = intval($_POST['id'] ?? 0);
        $content['projects'] = array_values(array_filter($content['projects'] ?? [], fn($p) => $p['id'] !== $id));
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_base':
        $content = getAllContent();
        $content['base'] = [
            'avatar'  => $_POST['avatar'] ?? '',
            'resume'  => $_POST['resume'] ?? '',
            'github'  => $_POST['github'] ?? '',
            'linkedin'=> $_POST['linkedin'] ?? '',
            'wechat'  => $_POST['wechat'] ?? '',
            'zhihu'   => $_POST['zhihu'] ?? '',
            'blog'    => $_POST['blog'] ?? 'http://poetry.iweistoicqc5.top/'
        ];
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_ai':
        $content = getAllContent();
        $models = $_POST['models'] ?? '';
        $content['ai'] = [
            'total_tokens'    => $_POST['total_tokens'] ?? '0',
            'total_requests' => $_POST['total_requests'] ?? '0',
            'models'         => array_filter(array_map('trim', explode("\n", $models))),
            'projects'       => $content['ai']['projects'] ?? []
        ];
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_ai_project':
        $content = getAllContent();
        $ai = &$content['ai'];
        if (!isset($ai['projects'])) $ai['projects'] = [];
        $id = intval($_POST['id'] ?? 0);
        $entry = [
            'id'             => $id ?: (count($ai['projects']) > 0 ? max(array_column($ai['projects'], 'id')) + 1 : 1),
            'name'           => $_POST['name'] ?? '',
            'name_en'        => $_POST['name_en'] ?? '',
            'model'          => $_POST['model'] ?? '',
            'description'    => $_POST['description'] ?? '',
            'description_en' => $_POST['description_en'] ?? '',
            'token_usage'    => $_POST['token_usage'] ?? '',
            'token_usage_en' => $_POST['token_usage_en'] ?? '',
            'demo'           => $_POST['demo'] ?? ''
        ];
        if ($id) {
            foreach ($ai['projects'] as &$p) {
                if ($p['id'] === $id) { $p = $entry; break; }
            }
        } else {
            $ai['projects'][] = $entry;
        }
        writeData('site.json', $content);
        echo json_encode(['success' => true, 'id' => $entry['id']]);
        break;

    case 'delete_ai_project':
        $content = getAllContent();
        $id = intval($_POST['id'] ?? 0);
        $content['ai']['projects'] = array_values(array_filter($content['ai']['projects'] ?? [], fn($p) => $p['id'] !== $id));
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    case 'save_logs':
        $content = getAllContent();
        $dates = $_POST['dates'] ?? [];
        $contents = $_POST['contents'] ?? [];
        $logs = [];
        foreach ($dates as $i => $date) {
            if (!empty(trim($contents[$i] ?? ''))) {
                $logs[] = [
                    'date' => $date,
                    'content' => trim($contents[$i])
                ];
            }
        }
        $content['logs'] = $logs;
        writeData('site.json', $content);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => '未知操作']);
}
