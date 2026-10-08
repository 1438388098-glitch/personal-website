import { strings, type Lang } from './i18n';
import { SITE } from './site';

/** JSON-LD Person 实体单源：全站 author/about 节点从这里出。
    @id 固定为中文关于页（同一实体只有一个规范标识），url 按语言落地，
    sameAs 把 GitHub 与另一语言关于页并进来，alternateName 补另一署名，
    避免搜索引擎把「胡圣炜 / Samwaye Woo / GitHub」拆成三个独立实体。 */
export function personJsonLd(lang: Lang, jobTitle?: string) {
  const zhAbout = new URL('/about/', SITE.url).toString();
  const enAbout = new URL('/en/about/', SITE.url).toString();
  return {
    '@type': 'Person',
    '@id': zhAbout,
    name: strings(lang).authorName,
    /* 拉丁转写 Hu Shengwei 仅供结构化数据；页头品牌行用的是全大写展示体 */
    alternateName: lang === 'en' ? ['Hu Shengwei', strings('zh').authorName] : [strings('en').authorName],
    url: lang === 'en' ? enAbout : zhAbout,
    sameAs: [SITE.github, lang === 'en' ? zhAbout : enAbout],
    ...(jobTitle ? { jobTitle } : {})
  };
}
