# i18n 上线与 IP 语言层部署手册

> 本文档交付双语骨架上线步骤与「按 IP 切语言」的服务器/边缘层配置。
> 双语骨架本身已随构建产出（`/en/` 路由 + hreflang + 切换器 + 首访跳转脚本），
> 本文只讲需要人工在服务器/Cloudflare 执行的部分。**发布公网前需用户确认。**
>
> 状态（2026-10-09）：站点已上线（地址见 README 顶部），§1 的人工清单已执行过；
> en 产物已从写稿时的 48 页增长到 200+ 页（全栏目同名配对，check-i18n 门禁强制），
> 本文保留作「按 IP 切语言」层的部署参考。

## 1. 上线清单（部署时）

1. `npm run build`（产物含 48 个 en 页面）。
2. 照常同步 `dist/` 到服务器站点根目录（宝塔流程不变，`/en/` 是普通子目录，无需额外配置）。
3. 上线后浏览器验证四件事：
   - `/` 页头出现 EN 切换器，点击落 `site-lang` cookie 并跳 `/en/`；
   - `/en/` 页头出现「中文」切换器；
   - 首页 view-source 含 `<link rel="alternate" hreflang="zh-CN|en|x-default">`；
   - `/en/search/` 搜 statute 能出结果（索引 `/en/search-index.json` 非空）。

## 2. 语言信号顺序（已实现的客户端层）

`BaseHead` 注入的协商脚本只作用于 zh 页：

1. bot/Lighthouse UA → 永不跳转；
2. 有 `site-lang` cookie → 尊重既有选择；
3. 无 cookie + 首访 + `navigator.languages[0]` 以 en 开头 → 仅对 `/` 根路径 302 到 `/en/`（`location.replace`，不进历史记录）；
4. 其余语言（含 zh）→ 落 `site-lang` cookie 后不再协商。

语言切换器点击即写 cookie，用户显式选择永远压过自动协商。

## 3. IP 地理层（可选增强，默认不上）

IP 只该做 Accept-Language 的**兜底**（浏览器语言缺失/伪造时的次优信号），且必须保住两条底线：
Googlebot 从美国爬，纯 IP 跳转会切断中文收录；用户必须永远有手动否决权。推荐顺序：
cookie > Accept-Language > IP，且**只对根路径 `/` 做一次跳转**，深链接永不重定向。

### 3a. Cloudflare Redirect Rule（免费版即可，10 条配额）

Dashboard → Rules → Redirect Rules → Create：

```
If:  hostname eq iweistoicqc5.top
AND  http.request.uri.path eq "/"
AND  not http.user_agent contains "bot"
AND  not http.user_agent contains "crawl"
AND  not http.user_agent contains "spider"
AND  not any(http.request.headers["cookie"][*] contains "site-lang=")
AND  http.request.headers["cf-ipcountry"][0] in {"US" "GB" "CA" "AU" "DE" "FR" "JP" "KR" "SG" "MY"}
AND  not any(http.request.headers["accept-language"][*] contains "zh")
Then: 302 → https://iweistoicqc5.top/en/
```

要点：CF-IPCountry 在免费版**只读**（不能按国家写表达式变量以外的动作，但作为规则条件完全可用）；
Accept-Language 条件压在 IP 前面；cookie 条件保证用户选过一次就不再被打扰。

### 3b. 源站 nginx（备选，不依赖 CF 规则配额）

宝塔 → 站点 → 配置文件，`server` 块内、`location /` 之前加：

```nginx
# 语言兜底跳转：信任 CF 回源头，直连流量不生效（防伪造需配合 allow/deny 或 realip 模块）
map $http_cf_ipcountry $geo_en {
    default 0;
    US 1; GB 1; CA 1; AU 1; DE 1; FR 1; JP 1; KR 1; SG 1; MY 1;
}
if ($request_uri = /) {
    set $do_geo $geo_en;
}
# Accept-Language 主导：首选拉丁语系且无 cookie 才跳
set $lang_cookie 0;
if ($http_cookie ~* "site-lang=") {
    set $lang_cookie 1;
}
if ($http_accept_language !~* "^zh") {
    set $al_en 1;
}
if ($do_geo = 1) {
    set $jump "${al_en}${lang_cookie}";  # 仅 10 = IP是EN区 且 AL是EN 且 无cookie
}
if ($jump = 10) {
    return 302 https://iweistoicqc5.top/en/;
}
```

注意：nginx `if` 的组合语义脆弱，上配置写法经过等价改写（跳转变量拼接）；
直连流量（绕过 CF）拿不到 `cf-ipcountry`，此层自动失效——这是防伪造的天然属性，不是缺陷。

## 4. 后续内容运营

- 新博文要出英文版：在 `src/content-en/posts/` 建同名 `.md`，跑 `npm run check:i18n` 会强制对齐
  （日期/分类/标签/relatedPosts/数字保真/无汉字渗漏/长度比）。
- 新增受控词（分类/标签/分组）：先在 `src/lib/categories.ts` 与 `src/lib/i18n.ts` 的 EN 对照表各补一条
  （`src/lib/i18n.test.ts` 会查缺）。
- 中文内容是金标：`npm run check:golden` 失败 = 中文内容被改动，须显式 `--update` 再生并说明原因。
- 部署后若用了 CF 规则/nginx 层，先带 cookie 访问一遍验证不被弹跳，再清 cookie 验证首访行为。
