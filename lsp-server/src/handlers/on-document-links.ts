import { DocumentLink } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { filterASTComponents, parseAST } from '../ast'
import { BBCodeText } from '../tags/tag'
import { UrlTag } from '../tags/url'
import { extractUrlSchema } from '../utils'

export function onDocumentLinks(
  text: TextDocument,
  prefix: string,
): DocumentLink[] {
  const ast = parseAST(text)

  const components = filterASTComponents(
    ast,
    (c) =>
      c instanceof UrlTag && c.attributeValidator(c.attribute).length === 0,
  )

  const links: DocumentLink[] = []

  for (const component of components) {
    const urlTag = component as UrlTag
    if (urlTag.attribute === undefined) {
      const plainTextList = filterASTComponents(
        [urlTag],
        (c) => c instanceof BBCodeText,
      )

      for (const plainText of plainTextList) {
        let url = plainText.textContent()
        if (extractUrlSchema(url) === undefined) {
          url = prefix + url
        }

        links.push({
          range: {
            start: text.positionAt(plainText.start),
            end: text.positionAt(plainText.end),
          },
          target: url,
          tooltip: url,
        })
      }
    } else {
      let url = urlTag.attribute
      if (extractUrlSchema(url) === undefined) {
        url = prefix + url
      }

      const range = urlTag.attrRange()

      links.push({
        range: {
          start: text.positionAt(range.start),
          end: text.positionAt(range.end),
        },
        target: url,
        tooltip: url,
      })
    }
  }

  return links
}
