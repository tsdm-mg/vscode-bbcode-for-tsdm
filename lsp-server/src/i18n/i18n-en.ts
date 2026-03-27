import { Translations } from './i18n'

export const i18nEn: Translations = {
  tags: {
    align: {
      notSpecified: { description: 'Align' },
      left: { description: 'ALign Left' },
      center: { description: 'Align Center' },
      right: { description: 'Align Right' },
    },
    backgroundColor: { description: 'Background Color' },
    bold: { description: 'Bold' },
    codeBlock: { description: 'Code Block' },
    textColor: { description: 'Text Color' },
    divider: { description: 'Horizontal Divider' },
    fontSize: {
      notSpecified: { description: 'Font Size' },
      size1: { description: 'Font Size 1' },
      size2: { description: 'Font Size 2' },
      size3: { description: 'Font Size 3' },
      size4: { description: 'Font Size 4' },
      size5: { description: 'Font Size 5' },
      size6: { description: 'Font Size 6' },
    },
    freeArea: { description: 'Free Area' },
    hideArea: { description: 'Hide Area' },
    image: { description: 'Imaeg (From url)' },
    italic: { description: 'Italic' },
    list: {
      notSpecified: { description: 'List' },
      bullet: { description: 'Bullet List' },
      ordered: { description: 'Ordered List' },
    },
    listItem: { description: 'List Item' },
    quoteBlock: { description: 'Quote Block' },
    spoiler: { description: 'Expand/Collapse' },
    strikethrough: { description: 'Strikethrough' },
    superscript: { description: 'Superscript' },
    subscript: { description: 'Subscript' },
    table: { description: 'Table' },
    tableRow: { description: 'Table Row' },
    tableData: { description: 'Table Cell' },
    underline: { description: 'Underline' },
    userMention: { description: '@Someone' },
  },
  diagnostic: {
    unknownTag: function (name: string): string {
      return `Unknown tag "${name}"`
    },
    attributeNotAllowed: 'tag does not allow to have attribute',
    attributeRequired: 'tag must use with attribute',
    invalidAttributeValue: function (
      attr?: string,
      allowedAttr?: string,
    ): string {
      return (
        (attr === undefined
          ? 'invalid attribute value'
          : `invalid attribute value "${attr}"`) +
        (allowedAttr === undefined
          ? ''
          : `. allowed attributes: ${allowedAttr}`)
      )
    },
    invalidColor: function (attr?: string): string {
      return `invalid color${attr === undefined ? '' : ` ${attr}`}`
    },
  },
}
