import { BBCodeComponent, BBCodeTagBase } from './tag'
import { filterASTComponents } from '../ast'
import {
  DiagErr,
  DiagnosticError,
  DiagnosticMessage,
} from '../diagnostic-result'
import { colorValidator } from '../validators/color-validator'

export class ColorTag extends BBCodeTagBase {
  readonly name = 'color'

  attributeValidator(attr: string | undefined): DiagnosticError[] {
    if (attr === undefined || attr.length === 0) {
      return [DiagErr.attributeRequired()]
    }

    return colorValidator(attr)
  }

  childrenValidator(
    children: BBCodeComponent[],
  ): (DiagnosticError | DiagnosticMessage)[] {
    return filterASTComponents(
      children,
      (component: BBCodeComponent) =>
        component instanceof BBCodeTagBase && component.name === 'url',
      true,
    ).map((urlChild) =>
      (urlChild as BBCodeTagBase).makeTagHeadDiagnosticMessage(
        DiagErr.conflictStyle('color', 'url'),
      ),
    )
  }
}
