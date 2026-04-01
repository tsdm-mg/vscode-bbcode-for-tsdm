import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from './tag'

export class ImageTag extends BBCodeTagBase {
  readonly name = 'img'

  private static readonly imageSizeRegex = /^(?<width>\d+),(?<height>\d+)$/

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

    const match = ImageTag.imageSizeRegex.exec(attr)

    if (match?.groups === undefined) {
      return [DiagErr.invalidImageSize(attr)]
    }

    const { width, height } = match.groups
    const w = Number.parseInt(width)
    const h = Number.parseInt(height)

    if (w < 0 || h < 0 || (w === 0 && h === 0)) {
      return [DiagErr.invalidImageSize(attr)]
    }

    return []
  }
}
