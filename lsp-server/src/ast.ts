import { TextDocument } from 'vscode-languageserver-textdocument'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { rangeContainsOffset } from './range'
import { BBCodeComponent, BBCodeTagBase, BBCodeText } from './tags/tag'

export function parseAST(text: TextDocument): BBCodeComponent[] {
  const lexer = new Lexer(text.getText())
  lexer.scanAll()
  const parser = new Parser(lexer.tokens())
  parser.parse()
  return parser.ast()
}

export function getComponentAtOffset(
  ast: BBCodeComponent[],
  offset: number,
): BBCodeComponent | undefined {
  for (const component of ast) {
    const c = findComponentAtOffset(component, offset)
    if (c !== undefined) {
      return c
    }
  }

  return undefined
}

function findComponentAtOffset(
  component: BBCodeComponent,
  offset: number,
): BBCodeComponent | undefined {
  if (component instanceof BBCodeText) {
    if (component.start < offset || component.end >= offset) {
      // Not in this component.
      return undefined
    }

    // In the text.
    return component
  }

  if (component instanceof BBCodeTagBase) {
    const headRange = component.tagHeadRange()
    if (rangeContainsOffset(headRange, offset)) {
      // Offset in range header.
      return component
    }

    const tailRange = component.tagTailRange()
    if (tailRange !== undefined && rangeContainsOffset(tailRange, offset)) {
      // Offset in range tail.
      return component
    }

    for (const child of component.children) {
      const c = findComponentAtOffset(child, offset)
      if (c !== undefined) {
        return c
      }
      continue
    }

    return undefined
  }

  throw new TypeError('unhandled bbcode component type')
}
