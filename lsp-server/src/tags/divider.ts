import { BBCodeTagTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class DividerTag extends BBCodeTagTagBase {
  readonly name = 'hr'

  selfClosed = true

  attributeValidator = nullValidator
}
