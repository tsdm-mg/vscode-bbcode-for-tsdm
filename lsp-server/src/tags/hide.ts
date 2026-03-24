import { BBCodeTagTagBase } from './tag'

export class HideTag extends BBCodeTagTagBase {
  readonly name = 'hide'

  attributeValidator(attr: string | undefined): boolean {
    return attr === undefined || /^\d+$/.test(attr)
  }
}
