import { BBCodeTagTagBase } from './tag'
import { colorValidator } from '../validators/color-validator'

export class ColorTag extends BBCodeTagTagBase {
  readonly name = 'color'

  attributeValidator(attr: string | undefined): boolean {
    return attr !== undefined && colorValidator(attr)
  }
}
