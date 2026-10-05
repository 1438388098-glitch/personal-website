import { describe, it, expect } from 'vitest';
import { escapeHtml, highlight, makeSnippet, scoreDoc, jsonForScript } from './search';

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
