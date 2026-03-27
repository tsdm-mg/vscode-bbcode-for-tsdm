import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class QuoteTag extends BBCodeTagBase {
  readonly name = 'quote'

  attributeValidator = nullValidator
}
