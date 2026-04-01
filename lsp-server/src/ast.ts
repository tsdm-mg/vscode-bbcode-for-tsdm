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

/**
 * Filter and return all components in the AST satisfy a condition.
 *
 * The returned component list is a flattened one that all components in the list
 * are targets but their children fields are kept. So if the caller traverse the
 * returned list, duplicate nodes may found.
 */
export function filterASTComponents(
  ast: BBCodeComponent[],
  pred: (c: BBCodeComponent) => boolean,
): BBCodeComponent[] {
  const result: BBCodeComponent[] = []

  function walk(component: BBCodeComponent) {
    if (pred(component)) {
      result.push(component)
    }
    if (component instanceof BBCodeText) {
      // Do nothing.
    } else if (component instanceof BBCodeTagBase) {
      for (const child of component.children) {
        walk(child)
      }
    } else {
      throw new TypeError('unhandled bbcode component type')
    }
  }

  for (const component of ast) {
    walk(component)
  }

  return result
}
