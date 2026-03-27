import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class UnderlineTag extends BBCodeTagBase {
  readonly name = 'u'

  attributeValidator = nullValidator
}
