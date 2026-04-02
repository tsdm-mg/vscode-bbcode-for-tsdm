import { Position, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getComponentAtOffset, parseAST } from '../ast'
import { ComponentTypeNotHandledError } from '../error'
import { BBCodeTagBase, BBCodeText } from '../tags/tag'

export function onRepareRename(
  text: TextDocument,
  position: Position,
): Range | undefined {
  const ast = parseAST(text)
  const offset = text.offsetAt(position)
  const component = getComponentAtOffset(ast, offset)
  if (component === undefined || component instanceof BBCodeText) {
    return
  }

  if (component instanceof BBCodeTagBase) {
    const headRange = component.tagHeadNameRange()

    return {
      start: text.positionAt(headRange.start),
      end: text.positionAt(headRange.end),
    }
  }

  throw new ComponentTypeNotHandledError()
}
