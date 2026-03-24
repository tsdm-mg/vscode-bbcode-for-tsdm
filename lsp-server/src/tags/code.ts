import { BBCodeTagTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class CodeTag extends BBCodeTagTagBase {
  readonly name = 'code'

  attributeValidator = nullValidator
}
