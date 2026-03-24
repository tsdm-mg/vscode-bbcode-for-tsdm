import { BBCodeTagTagBase } from './tag'
import { colorValidator } from '../validators/color-validator'

export class BackgroundColorTag extends BBCodeTagTagBase {
  readonly name = 'backcolor'

  attributeValidator(attr: string | undefined): boolean {
    return attr !== undefined && colorValidator(attr)
  }
}
