import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class FreeTag extends BBCodeTagBase {
  readonly name = 'free'

  attributeValidator = nullValidator
}
