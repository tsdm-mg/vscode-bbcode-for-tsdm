import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class UserMention extends BBCodeTagBase {
  readonly name = '@'

  attributeValidator = nullValidator
}
