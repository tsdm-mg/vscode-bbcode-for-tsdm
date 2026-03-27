import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class BoldTag extends BBCodeTagBase {
  readonly name = 'b'

  attributeValidator = nullValidator
}
