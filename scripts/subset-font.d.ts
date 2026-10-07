/* subset-font 自带实现但未随包发布类型声明（package.json 无 types 字段）。
   这里只声明本仓库用到的那一层：把字体 buffer 子集化后按指定格式输出。
   接口面收窄是有意的——写得比实际宽只会掩盖调用错误。 */
declare module 'subset-font' {
  interface SubsetFontOptions {
    /** 输出格式；传 'woff2' 才是我们要的产物形态 */
    targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype';
    /** 收紧可变字体的轴区间：{ wght: 400 } 定格，{ wght: { min: 400, max: 900 } } 收窄 */
    variationAxes?: Record<string, number | { min: number; max: number; default?: number }>;
    /** 保留全部字形，只用它做轴实例化 */
    keepAllGlyphs?: boolean;
    /** 保留的 name 表 id */
    preserveNameIds?: number[];
    /** 保留的 OpenType 特性标签；默认全保留 */
    keepFeatures?: string[];
  }
  function subsetFont(
    buffer: Uint8Array,
    text: string | undefined,
    options?: SubsetFontOptions,
  ): Promise<Buffer>;
  export default subsetFont;
}
