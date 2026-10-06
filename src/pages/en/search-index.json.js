/* 搜索索引端点（英文版）：路径 /en/search-index.json，与 /search-index.json（zh）平行。
   只收英文集合（postsEn/projectsEn/toolboxEn），kind 标签用英文；
   exam/notes 不译，不进英文索引。 */
import { collectSearchDocsEn } from '../../lib/search-docs';

export const GET = async () =>
  new Response(JSON.stringify(await collectSearchDocsEn()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
