import { ColorInformation, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { filterASTComponents, parseAST } from '../ast'
import { BackgroundColorTag } from '../tags/background-color'
import { ColorTag } from '../tags/color'
import { BBCodeTagBase } from '../tags/tag'
import { colorToRgba, colorValidator } from '../validators/color-validator'

export function onDocumentColor(text: TextDocument): ColorInformation[] {
  const ast = parseAST(text)

  const components = filterASTComponents(
    ast,
    (c) =>
      (c instanceof ColorTag || c instanceof BackgroundColorTag) &&
      c.attribute !== undefined &&
      colorValidator(c.attribute).length === 0,
  )

  const colors: ColorInformation[] = []

  for (const component of components) {
    const tag = component as BBCodeTagBase
    const color = colorToRgba(tag.attribute)
    if (color === undefined) {
      continue
    }

    const range = tag.attrRange()
    colors.push({
      range: Range.create(
        text.positionAt(range.start),
        text.positionAt(range.end),
      ),
      color,
    })
  }

  return colors
}
