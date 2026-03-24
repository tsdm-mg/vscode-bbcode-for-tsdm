import { BBCodeTagTagBase } from './tag'

export class ImageTag extends BBCodeTagTagBase {
  readonly name = 'img'

  attributeValidator(attr: string | undefined): boolean {
    // The attribute value of an `img` tag is the image's display size.
    // It is not encouraged to use `img` tag without sizes.
    //
    // For example:
    //
    // Bad: `[img][/img]`
    // Good: `[img=100,200][/img]`
    //
    // But it is the language server's responsibility to check and notify
    // the user the bad usage as a lint rule. In the parser, we should
    // allow sizeless image otherwise a parse error will occur which is
    // too early before the code analyzing stage.
    //
    // So a undefined value is considered valid.
    return attr === undefined || /^\d+,\d+$/.test(attr)
  }
}
