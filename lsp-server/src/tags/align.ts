import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class AlignTag extends BBCodeTagBase {
  static readonly alignments = ['left', 'center', 'right']

  readonly name = 'align'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      return [DiagErr.attributeRequired()]
    }

    if (AlignTag.alignments.includes(attr)) {
      return [DiagErr.invalidAttributeValue(attr, AlignTag.alignments)]
    }

    return []
  }
}
