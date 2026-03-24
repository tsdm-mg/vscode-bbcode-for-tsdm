import { BBCodeTagTagBase } from './tag'

export class AlignTag extends BBCodeTagTagBase {
  readonly name = 'align'

  attributeValidator(attr: string | undefined): boolean {
    return attr !== undefined && ['left', 'center', 'right'].includes(attr)
  }
}
