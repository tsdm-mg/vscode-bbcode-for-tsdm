import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class SubscriptTag extends BBCodeTagBase {
  readonly name = 'sub'

  attributeValidator = nullValidator
}
