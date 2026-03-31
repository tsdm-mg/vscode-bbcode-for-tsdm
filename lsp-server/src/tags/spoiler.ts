import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class SpoilerTag extends BBCodeTagBase {
  readonly name = 'spoiler'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined || attr.length === 0) {
      return [DiagErr.attributeRequired()]
    }

    return []
  }
}
