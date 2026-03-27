import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class CodeTag extends BBCodeTagBase {
  readonly name = 'code'

  attributeValidator = nullValidator
}
