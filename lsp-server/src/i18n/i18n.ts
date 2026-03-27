import { i18nEn } from './i18n-en'
import { i18nZh } from './i18n-zh'

export function setupI18n(locale: string | undefined): Translations {
  return locale?.startsWith('zh') ? i18nZh : i18nEn
}

export interface Translations {
  tags: I18nTags
  diagnostic: {
    unknownTag: (name: string) => string
    attributeNotAllowed: string
    attributeRequired: string
    invalidAttributeValue: (attr?: string, allowedAttr?: string) => string
    invalidColor: (attr?: string) => string
  }
}

export interface I18nTags {
  align: {
    notSpecified: I18nTag
    left: I18nTag
    center: I18nTag
    right: I18nTag
  }
  backgroundColor: I18nTag
  bold: I18nTag
  codeBlock: I18nTag
  textColor: I18nTag
  divider: I18nTag
  fontSize: {
    notSpecified: I18nTag
    size1: I18nTag
    size2: I18nTag
    size3: I18nTag
    size4: I18nTag
    size5: I18nTag
    size6: I18nTag
  }
  freeArea: I18nTag
  hideArea: I18nTag
  image: I18nTag
  italic: I18nTag
  list: {
    notSpecified: I18nTag
    bullet: I18nTag
    ordered: I18nTag
  }
  listItem: I18nTag
  quoteBlock: I18nTag
  spoiler: I18nTag
  strikethrough: I18nTag
  superscript: I18nTag
  subscript: I18nTag
  table: I18nTag
  tableRow: I18nTag
  tableData: I18nTag
  underline: I18nTag
  userMention: I18nTag
}

interface I18nTag {
  description: string
}
