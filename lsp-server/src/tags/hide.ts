import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class HideTag extends BBCodeTagBase {
  readonly name = 'hide'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined || /^\d+$/.test(attr)) {
      return []
    }

    return [DiagErr.invalidAttributeValue(attr)]
  }
}
