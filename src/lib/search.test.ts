import { describe, it, expect } from 'vitest';
import { escapeHtml, fillN, highlight, makeSnippet, scoreDoc, jsonForScript, matchTerm } from './search';
import { strings } from './i18n';

describe('jsonForScript', () => {
  it('把 < 转义成 \\u003c，正文含 </script> 时不残留裸闭合标签', () => {
    const payload = [{ text: 'a</script><b>x</b>' }];
    const out = jsonForScript(payload);
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script');
    // 转义后仍是合法 JSON，parse 可还原原文
    expect(JSON.parse(out)).toEqual(payload);
  });
});

describe('fillN', () => {
  it('替换 {n} 占位符', () => {
    expect(fillN('{n} 条结果', 12)).toBe('12 条结果');
    expect(fillN('{n} results', 0)).toBe('0 results');
  });

  it('文案不含占位符时原样返回', () => {
    expect(fillN('没有匹配的内容', 3)).toBe('没有匹配的内容');
  });
});

/* 回归护栏：search-config 走 JSON.stringify 注入页面，函数值会被静默丢弃，
   前端调用 undefined() 抛错 —— 曾导致搜索页一律显示「索引加载失败」。
   i18n 里 search.client 的任何一项都必须能过 JSON 往返且仍可调用。 */
describe('search.client 必须可 JSON 序列化', () => {
  it.each(['zh', 'en'] as const)('%s 每一项都是纯字符串', (lang) => {
    const client = strings(lang).search.client;
    const roundTripped = JSON.parse(JSON.stringify(client)) as Record<string, unknown>;
    for (const [key, value] of Object.entries(client)) {
      expect(typeof value, `${lang}.search.client.${key} 必须是字符串，函数无法注入前端`).toBe('string');
      expect(roundTripped[key]).toBe(value);
    }
  });

  it.each(['zh', 'en'] as const)('%s 的 loaded/results/resultsOne 都带 {n} 占位符', (lang) => {
    const client = strings(lang).search.client;
    expect(client.loaded).toContain('{n}');
    expect(client.results).toContain('{n}');
    expect(client.resultsOne).toContain('{n}');
    expect(fillN(client.results, 7)).toContain('7');
    expect(fillN(client.loaded, 7)).not.toContain('{n}');
  });
});

describe('escapeHtml', () => {
  it('把 HTML 元字符转成实体，不残留裸尖括号', () => {
    const out = escapeHtml('<img src=x onerror=alert(1)>');
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(out).toContain('&lt;img');
    expect(out).toContain('&gt;');
    expect(escapeHtml('"\'')).toBe('&quot;&#39;');
  });
});

describe('highlight', () => {
  it('搜索词含正则元字符时不抛错，且按字面量高亮', () => {
    expect(() => highlight('a.b', ['.'])).not.toThrow();
    expect(highlight('a.b', ['.'])).toBe('a<mark>.</mark>b');
    expect(highlight('a+b', ['+'])).toBe('a<mark>+</mark>b');
  });

  it('原文里的标签先被转义，不会被当作 HTML 解析', () => {
    const out = highlight('<b>x</b>', ['x']);
    expect(out).toContain('&lt;b&gt;');
    expect(out).toContain('<mark>x</mark>');
    expect(out).not.toContain('<b>');
  });
});

describe('scoreDoc', () => {
  const doc = { title: '法条检索', description: '混合检索底座', tags: ['法律工具'], text: 'BM25 与向量召回' };

  it('AND 语义：多词时任一词未命中即返回 null', () => {
    expect(scoreDoc(doc, ['法条', '检索'])).toBeGreaterThan(0);
    expect(scoreDoc(doc, ['法条', '这个词不存在'])).toBeNull();
  });

  it('命中 title 的分数高于只命中 text', () => {
    const titleHit = scoreDoc({ title: '检索', description: '', tags: [], text: '' }, ['检索'])!;
    const textHit = scoreDoc({ title: '无关', description: '', tags: [], text: '检索' }, ['检索'])!;
    expect(titleHit).toBeGreaterThan(textHit);
  });

  it('权重：tags(+5) 高于 description(+3) 高于 text(+1)', () => {
    const descHit = scoreDoc({ title: '无关', description: '检索', tags: [], text: '' }, ['检索'])!;
    const tagHit = scoreDoc({ title: '无关', description: '', tags: ['检索'], text: '' }, ['检索'])!;
    const textHit = scoreDoc({ title: '无关', description: '', tags: [], text: '检索' }, ['检索'])!;
    expect(tagHit).toBeGreaterThan(descHit);
    expect(descHit).toBeGreaterThan(textHit);
  });
});

describe('makeSnippet', () => {
  it('目标词靠后时以省略号开头并保留命中词', () => {
    const text = 'x'.repeat(100) + '关键词' + 'y'.repeat(50);
    const out = makeSnippet(text, ['关键词']);
    expect(out.startsWith('…')).toBe(true);
    expect(out).toContain('关键词');
  });

  it('返回纯文本，不注入任何 HTML 标签', () => {
    const out = makeSnippet('前文关键词后文', ['关键词']);
    expect(out).toBe('前文关键词后文');
    expect(out).not.toContain('<');
    expect(out).not.toContain('<mark>');
  });

  it('尊重 len 上限并截断末尾', () => {
    const out = makeSnippet('a'.repeat(500), ['a'], 160);
    expect(out).toContain('…');
    // 前 160 字 + 省略号（无前置省略号，因锚点在开头）
    expect(out.length).toBe(161);
  });
});

describe('matchTerm（en 词边界）', () => {
  const doc = { title: 'Statute retrieval', description: 'recall@5 92.0%', tags: [], text: 'the art of starting small' };

  it('纯 ASCII 词按词边界匹配，art 不命中 starting', () => {
    expect(matchTerm('the art of starting small', 'art')).toBe(true);
    expect(matchTerm('start small', 'start')).toBe(true);
    expect(matchTerm('starting small', 'start')).toBe(false);
    expect(scoreDoc(doc, ['art'])).not.toBeNull();
    expect(scoreDoc(doc, ['statute'])).not.toBeNull();
    /* art 不应因 starting 里的子串而多命中（词边界内只在 the art 处命中一次） */
    expect(scoreDoc(doc, ['art'])).toBe(1);
  });

  it('中文词保持子串语义', () => {
    expect(matchTerm('法条检索底座', '检索')).toBe(true);
    expect(scoreDoc({ title: '法条检索', description: '', tags: [], text: '' }, ['检索'])).toBe(10);
  });

  it('makeSnippet 锚点按词边界定位', () => {
    const s = makeSnippet('the art of starting small and other things to fill the snippet length beyond forty characters for sure', ['art']);
    expect(s).toContain('art');
    expect(s.startsWith('…')).toBe(false);
  });
});
