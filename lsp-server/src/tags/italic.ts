import { BBCodeTagTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class ItalicTag extends BBCodeTagTagBase {
  readonly name = 'i'

  attributeValidator = nullValidator
}
