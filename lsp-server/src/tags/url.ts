import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase, BBCodeText } from './tag'

export class UrlTag extends BBCodeTagBase {
  public readonly name = 'url'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      // Without attribute.
      const childTag = this.findTag((tag) => tag instanceof BBCodeText)
      if (childTag === undefined || childTag.textContent().length === 0) {
        return [DiagErr.urlTargetRequired()]
      }

      // TODO: Add url format check.

      return []
    }

    // With attribute.

    if (attr.length === 0) {
      return [DiagErr.urlTargetRequired()]
    }

    // TODO: Add url format check.

    return []
  }
}
