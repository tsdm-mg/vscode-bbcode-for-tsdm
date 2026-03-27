import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class ItalicTag extends BBCodeTagBase {
  readonly name = 'i'

  attributeValidator = nullValidator
}
