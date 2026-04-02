import { Position, TextEdit } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getComponentAtOffset, parseAST } from '../ast'
import { ComponentTypeNotHandledError } from '../error'
import { BBCodeTagBase, BBCodeText } from '../tags/tag'

export function onRenameRequest(
  text: TextDocument,
  position: Position,
  newName: string,
): TextEdit[] | undefined {
  const ast = parseAST(text)
  const offset = text.offsetAt(position)
  const component = getComponentAtOffset(ast, offset)
  if (component === undefined || component instanceof BBCodeText) {
    // Can not rename here.
    return undefined
  }

  const edits: TextEdit[] = []

  if (component instanceof BBCodeTagBase) {
    const headRange = component.tagHeadNameRange()
    const tailRange = component.tagTailNameRange()

    edits.push(
      TextEdit.replace(
        {
          start: text.positionAt(headRange.start),
          end: text.positionAt(headRange.end),
        },
        newName,
      ),
    )

    // Note that for self close tags, headRange === tailRange.
    // This is a low-level implemention detail but the handler here should
    // ensure returning no duplicate TextEdits.
    //
    // Other words: we may have ability to do better renaming for tags cross
    // the self close flag:
    //
    // [hr] => [img][/img]
    // [img][/img] => [hr]
    //
    // But the rename towards self close is broken if the current tag have
    // children where self close tags cant. And for the best renaming process,
    // the example above should be [hr] => [img=xxx,xxx][/img] with attributes
    // placeholder which I think is far away from the renaming purpose.
    // We may implement such smooth renaming in the future but likely not.
    // Renaming across self close tag is not expected to often happen.
    if (tailRange !== undefined && tailRange.start !== headRange.start) {
      edits.push(
        TextEdit.replace(
          {
            start: text.positionAt(tailRange.start),
            end: text.positionAt(tailRange.end),
          },
          newName,
        ),
      )
    }

    return edits
  }

  throw new ComponentTypeNotHandledError()
}
