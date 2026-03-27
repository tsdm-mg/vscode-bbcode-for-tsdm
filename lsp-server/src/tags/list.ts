import { BBCodeTagBase } from './tag'
import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { nullValidator } from '../validators/null-validator'

export class ListTag extends BBCodeTagBase {
  readonly name = 'list'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined || attr === '1') {
      return []
    }

    return [DiagErr.invalidAttributeValue(attr, ['1'])]
  }
}

export class ListItemTag extends BBCodeTagBase {
  readonly name = '*'

  selfClosed = true

  attributeValidator = nullValidator
}
