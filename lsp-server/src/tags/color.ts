import { BBCodeTagBase } from './tag'
import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { colorValidator } from '../validators/color-validator'

export class ColorTag extends BBCodeTagBase {
  readonly name = 'color'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      return [DiagErr.attributeRequired()]
    }

    return colorValidator(attr)
  }
}
