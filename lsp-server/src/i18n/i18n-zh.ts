import { Translations } from './i18n'

export const i18nZh: Translations = {
  tags: {
    align: {
      notSpecified: { description: '段落对齐' },
      left: { description: '段落向左对齐' },
      center: { description: '段落居中对齐' },
      right: { description: '段落向右对齐' },
    },
    backgroundColor: { description: '背景色' },
    bold: { description: '加粗' },
    codeBlock: { description: '代码块' },
    textColor: { description: '文字颜色' },
    divider: { description: '横向分割线' },
    fontSize: {
      notSpecified: { description: '字体大小' },
      size1: { description: '字号1' },
      size2: { description: '字号2' },
      size3: { description: '字号3' },
      size4: { description: '字号4' },
      size5: { description: '字号5' },
      size6: { description: '字号6' },
    },
    freeArea: { description: '免费区域' },
    hideArea: { description: '隐藏区域' },
    image: { description: '图片（url）' },
    italic: { description: '斜体' },
    list: {
      notSpecified: { description: '列表' },
      bullet: { description: '无序列表' },
      ordered: { description: '有序列表' },
    },
    listItem: { description: '列表项' },
    quoteBlock: { description: '引用区域' },
    spoiler: { description: '折叠区域' },
    strikethrough: { description: '删除线' },
    superscript: { description: '上标' },
    subscript: { description: '下标' },
    table: { description: '表格' },
    tableRow: { description: '表格行' },
    tableData: { description: '表格单元格' },
    underline: { description: '下划线' },
    url: {
      normal: { description: '链接' },
      withAttr: { description: '链接带属性' },
    },
    userMention: { description: '艾特用户' },
  },
  diagnostic: {
    unknownTag: function (name: string): string {
      return `未知标签 ${name}`
    },
    attributeNotAllowed: '标签不允许拥有属性',
    attributeRequired: '标签必须填写属性',
    invalidAttributeValue: function (
      attr?: string,
      allowedAttr?: string,
    ): string {
      return (
        (attr === undefined ? '无效的属性' : `无效的属性值 ${attr}`) +
        (allowedAttr === undefined ? '' : `。 合法的属性值：${allowedAttr}`)
      )
    },
    invalidColor: function (attr?: string): string {
      return `无效的颜色${attr === undefined ? '' : ` ${attr}`}`
    },
    invalidImageSize: function (attr?: string): string {
      return `无效的图片大小${attr === undefined ? '' : ` ${attr}`}。应使用 width,height 例如100,200`
    },
    tagNotClosed: function (name: string): string {
      return `标签 ${name} 缺少对应的结束标签`
    },
    tagNotOpened: function (name: string): string {
      return `标签 ${name} 缺少对应的开始标签`
    },
    conflictStyle: function (outerTag: string, innerTag: string): string {
      return `标签 ${innerTag} 在 ${outerTag} 内部可能覆盖 ${outerTag} 的样式`
    },
    urlTargetRequired: '标签 url 没有填写网页链接',
  },
}
