import { BBCodeTagBase } from './tag'
import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { colorValidator } from '../validators/color-validator'

export class BackgroundColorTag extends BBCodeTagBase {
  readonly name = 'backcolor'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      return [DiagErr.attributeRequired()]
    }

    return colorValidator(attr)
  }
}
