import { Translations } from './i18n/i18n'

export interface Snippet {
  name: string
  prefix: string
  body: string
  description: (tr: Translations) => string
}
