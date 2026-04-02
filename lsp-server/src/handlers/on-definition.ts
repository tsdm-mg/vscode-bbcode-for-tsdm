import { Range } from 'vscode-languageserver'
import { Position, TextDocument } from 'vscode-languageserver-textdocument'
import { getComponentAtOffset, parseAST } from '../ast'
import { ComponentTypeNotHandledError } from '../error'
import { rangeContainsOffset } from '../range'
import { BBCodeTagBase, BBCodeText } from '../tags/tag'

export function onDefinition(
  text: TextDocument,
  position: Position,
): Range | undefined {
  const ast = parseAST(text)
  const offset = text.offsetAt(position)
  const currentComponent = getComponentAtOffset(ast, offset)
  if (currentComponent === undefined) {
    return
  } else if (currentComponent instanceof BBCodeText) {
    // Text does not support go to definition.
    return
  } else if (currentComponent instanceof BBCodeTagBase) {
    const headRange = currentComponent.tagHeadRange()
    if (currentComponent.selfClosed) {
      // Go to itself if self closed.
      return {
        start: text.positionAt(headRange.start),
        end: text.positionAt(headRange.end),
      }
    }

    const tailRange = currentComponent.tagTailRange()
    if (tailRange === undefined) {
      // Unreachable.
      return
    }
    if (rangeContainsOffset(headRange, offset)) {
      return {
        start: text.positionAt(tailRange.start),
        end: text.positionAt(tailRange.end),
      }
    } else if (rangeContainsOffset(tailRange, offset)) {
      return {
        start: text.positionAt(headRange.start),
        end: text.positionAt(headRange.end),
      }
    } else {
      // Unreachable.
      return
    }
  } else {
    throw new ComponentTypeNotHandledError()
  }
}
