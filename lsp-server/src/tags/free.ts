import { BBCodeTagTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class FreeTag extends BBCodeTagTagBase {
  readonly name = 'free'

  attributeValidator = nullValidator
}
