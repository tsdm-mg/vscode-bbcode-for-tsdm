import { BBCodeTagTagBase } from './tag'

export class FontSizeTag extends BBCodeTagTagBase {
  readonly name = 'size'

  attributeValidator(attr: string | undefined): boolean {
    return attr !== undefined && ['6', '5', '4', '3', '2', '1'].includes(attr)
  }
}
