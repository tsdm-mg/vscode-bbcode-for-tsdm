import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class FontSizeTag extends BBCodeTagBase {
  static readonly fontSizes = ['6', '5', '4', '3', '2', '1']

  readonly name = 'size'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      return [DiagErr.attributeRequired()]
    }

    if (!FontSizeTag.fontSizes.includes(attr)) {
      return [DiagErr.invalidAttributeValue(attr, FontSizeTag.fontSizes)]
    }

    return []
  }
}
