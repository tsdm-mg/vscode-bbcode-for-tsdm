import { Range } from 'vscode-languageserver'
import { Position, TextDocument } from 'vscode-languageserver-textdocument'
import { getComponentAtOffset, parseAST } from '../ast'
import { ComponentTypeNotHandledError } from '../error'
import { rangeContainsOffset } from '../range'
import { BBCodeTagBase, BBCodeText } from '../tags/tag'

export function onHover(
  text: TextDocument,
  position: Position,
): { tagName: string; range: Range } | undefined {
  const ast = parseAST(text)
  const offset = text.offsetAt(position)
  const component = getComponentAtOffset(ast, offset)
  if (component == undefined || component instanceof BBCodeText) {
    return
  } else if (component instanceof BBCodeTagBase) {
    const headRange = component.tagHeadNameRange()
    if (rangeContainsOffset(headRange, offset)) {
      return {
        range: {
          start: text.positionAt(headRange.start),
          end: text.positionAt(headRange.start),
        },
        tagName: component.name,
      }
    }

    const tailRange = component.tagTailNameRange()
    if (tailRange !== undefined) {
      return {
        range: {
          start: text.positionAt(tailRange.start),
          end: text.positionAt(tailRange.start),
        },
        tagName: component.name,
      }
    }

    return
  } else {
    throw new ComponentTypeNotHandledError()
  }
}
