/* 搜索索引端点：路径 /search-index.json（与 SITE_PATHS.searchIndex 一致）。
   构建期把全量索引序列化成独立 JSON 资产，搜索页首次输入时 fetch——
   避免把 160KB+ 的索引内嵌进 /search/ 的 HTML。 */
import { collectSearchDocs } from '../lib/search-docs';

export const GET = async () =>
  new Response(JSON.stringify(await collectSearchDocs()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
