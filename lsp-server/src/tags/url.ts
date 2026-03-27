import { DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase, BBCodeText } from './tag'

export class UrlTag extends BBCodeTagBase {
  readonly name = 'url'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined) {
      // Without attribute.
      const childTag = this.findTag((tag) => tag instanceof BBCodeText)
      if (childTag === undefined) {
        // ???
        return []
      }

      // TODO: Add url format check.

      return []
    }

    // With attribute.

    // TODO: Add url format check.

    return []
  }
}
