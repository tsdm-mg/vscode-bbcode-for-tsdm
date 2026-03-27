import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class StrikethroughTag extends BBCodeTagBase {
  readonly name = 's'

  attributeValidator = nullValidator
}
