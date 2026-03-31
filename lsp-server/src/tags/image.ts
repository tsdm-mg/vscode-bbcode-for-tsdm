import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class ImageTag extends BBCodeTagBase {
  readonly name = 'img'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    // The attribute value of an `img` tag is the image's display size.
    // It is not encouraged to use `img` tag without sizes.
    //
    // For example:
    //
    // Bad: `[img][/img]`
    // Good: `[img=100,200][/img]`

    if (attr === undefined) {
      return [DiagErr.attributeRequired()]
    }

    if (!/^\d+,\d+$/.test(attr)) {
      return [DiagErr.invalidImageSize(attr)]
    }

    return []
  }
}
