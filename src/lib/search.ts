/* 站内搜索的纯逻辑：被 search.astro 的客户端脚本与测试共用。
   全部函数必须是浏览器安全的纯函数——不引入 node 专用 API；
   转义在这里集中，任何进入 innerHTML 的文本都要先过 escapeHtml。 */

/** 待检索的文档条目（projects/exam/notes/toolbox 各自映射成这个形状） */
export interface SearchDoc {
  title: string;
  description?: string;
  tags?: string[];
  text?: string;
  [key: string]: unknown;
}

/** HTML 元字符转实体：这是全站唯一把用户输入拼进 innerHTML 的地方，必须逐个转义 */
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c);
}

/** 把待内嵌 <script type="application/json"> 的数据序列化：把 < 转义成 \u003c 六字符，
    防止正文含 </script> 时提前闭合脚本标签。JSON 里 \u003c 与 < 等价，解析结果不变。 */
export function jsonForScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** 命中词高亮：先转义原文再包 mark，搜索词里的正则元字符先转义防注入 */
export function highlight(text: string, terms: string[]): string {
  let out = escapeHtml(text);
  for (const t of terms) {
    if (!t) continue;
    const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, (m) => `<mark>${m}</mark>`);
  }
  return out;
}

/** 取摘要：以首个命中词为锚点向前留 40 字，截 len 字；锚点靠后时以省略号表明前文被截。
    返回纯文本（不含 HTML 标签），高亮由 highlight 在渲染层叠加。 */
export function makeSnippet(text: string, terms: string[], len = 160): string {
  const first = (terms[0] ?? '').toLowerCase();
  const i = first ? text.toLowerCase().indexOf(first) : -1;
  const start = Math.max(0, (i < 0 ? 0 : i) - 40);
  return (start > 0 ? '…' : '') + text.slice(start, start + len) + (start + len < text.length ? '…' : '');
}

/** 评分：标题 +10 / 标签 +5 / 描述 +3 / 正文 +1；多词时任一未命中即返回 null（AND 语义） */
export function scoreDoc(doc: SearchDoc, terms: string[]): number | null {
  const title = doc.title.toLowerCase();
  const desc = (doc.description ?? '').toLowerCase();
  const tags = (doc.tags ?? []).join(' ').toLowerCase();
  const text = (doc.text ?? '').toLowerCase();
  let score = 0;
  for (const raw of terms) {
    const t = raw.toLowerCase();
    const inTitle = title.includes(t);
    const inDesc = desc.includes(t);
    const inTags = tags.includes(t);
    const inText = text.includes(t);
    if (!inTitle && !inDesc && !inTags && !inText) return null;
    if (inTitle) score += 10;
    if (inDesc) score += 3;
    if (inTags) score += 5;
    if (inText) score += 1;
  }
  return score;
}
