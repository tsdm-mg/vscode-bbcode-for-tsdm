import { BBCodeTagTagBase } from './tag'

export class ListTag extends BBCodeTagTagBase {
  readonly name = 'list'

  attributeValidator(attr: string | undefined): boolean {
    return attr === undefined || attr === '1'
  }
}
