import { BBCodeTagSelfClosed } from './tag'
import { nullValidator } from '../validators/null-validator'

export class DividerTag extends BBCodeTagSelfClosed {
  readonly name = 'hr'

  attributeValidator = nullValidator
}
