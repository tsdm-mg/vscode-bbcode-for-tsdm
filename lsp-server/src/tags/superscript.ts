import { BBCodeTagBase } from './tag'
import { nullValidator } from '../validators/null-validator'

export class SuperscriptTag extends BBCodeTagBase {
  readonly name = 'sup'

  attributeValidator = nullValidator
}
