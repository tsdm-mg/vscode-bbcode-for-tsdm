import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { allTags, Tag } from './tags'
import { AlignTag } from './tags/align'
import { FontSizeTag } from './tags/font-size'
import { colorNames } from './validators/color-validator'

const allTagCompletionItems: CompletionItem[] = allTags.flatMap((tag) =>
  tagToCompletionItem(tag),
)

const allColorCompletionItems = attrListToCompletionItems([...colorNames])
const allSizeCompletionItems = attrListToCompletionItems(FontSizeTag.fontSizes)

const allTagAttrCompletionItems = new Map<string, CompletionItem[]>([
  ['align', attrListToCompletionItems(AlignTag.alignments)],
  ['color', allColorCompletionItems],
  ['backcolor', allColorCompletionItems],
  ['size', allSizeCompletionItems],
])

function tagToCompletionItem(tag: Tag): CompletionItem[] {
  const items: CompletionItem[] = []
  let insertText
  if (tag.attribute === undefined) {
    insertText = tag.selfClosing
      ? `${tag.label}]`
      : `${tag.label}]$0[/${tag.label}]`
  } else {
    insertText = tag.selfClosing
      ? `${tag.label}=${tag.attribute.snippet}]`
      : `${tag.label}=${tag.attribute.snippet}]$0[/${tag.label}]`
  }
  items.push({
    label: tag.label,
    kind: CompletionItemKind.Snippet,
    detail: tag.name,
    insertText: insertText,
    insertTextFormat: InsertTextFormat.Snippet,
  })

  if (tag.snippets && tag.snippets.length > 0) {
    for (const snippet of tag.snippets) {
      items.push({
        label: snippet.prefix,
        kind: CompletionItemKind.Snippet,
        detail: snippet.name,
        insertText: snippet.body,
        insertTextFormat: InsertTextFormat.Snippet,
      })
    }
  }

  return items
}

function attrListToCompletionItems(attrList: string[]): CompletionItem[] {
  return attrList.map((attr) => ({
    label: attr,
    kind: CompletionItemKind.Enum,
    detail: attr,
    insertText: attr,
    insertTextFormat: InsertTextFormat.PlainText,
  }))
}

export function autoComplete(
  documents: TextDocuments<TextDocument>,
  params: TextDocumentPositionParams,
): CompletionItem[] {
  const document = documents.get(params.textDocument.uri)
  if (!document) {
    return []
  }

  const pos = params.position
  const inlineText = document.getText({
    start: { line: pos.line, character: 0 },
    end: { line: pos.line, character: pos.character },
  })

  const prefix = inlineText

  if (prefix.endsWith('[')) {
    return allTagCompletionItems
  }

  // Compute partial completion tags.
  const lastOpenIndex = prefix.lastIndexOf('[')
  if (lastOpenIndex === -1) {
    return []
  }

  const partialTag = prefix.slice(lastOpenIndex + 1)

  const attrSplitIndex = partialTag.indexOf('=')
  if (attrSplitIndex !== -1) {
    // Auto complete tag attr.
    const tagName = partialTag.slice(0, attrSplitIndex)
    const attrValue =
      attrSplitIndex >= partialTag.length - 1
        ? ''
        : partialTag.slice(attrSplitIndex + 1)
    const attrCompletionItems = allTagAttrCompletionItems.get(tagName)
    if (attrCompletionItems === undefined) {
      return []
    }

    const range = {
      start: { line: pos.line, character: pos.character - attrValue.length },
      end: pos,
    }

    return attrCompletionItems
      .filter((attr) => attr.label.startsWith(attrValue))
      .map(
        (attr): CompletionItem => ({
          label: attr.label,
          kind: attr.kind,
          detail: attr.detail,
          textEdit: {
            range,
            newText: attr.label,
          },
        }),
      )
  }

  // Auto complete tag name.

  const matchingTags = allTags.filter((tag) => tag.label.startsWith(partialTag))
  const matchingSnippets = allTags.flatMap(
    (tag) =>
      tag.snippets
        ?.filter((s) => s.prefix.startsWith(partialTag))
        .map((s) => ({
          label: s.prefix,
          kind: CompletionItemKind.Snippet,
          detail: s.name,
          insertTextFormat: InsertTextFormat.Snippet,
          insertText: `[${s.body}`,
        })) ?? [],
  )
  return [
    ...matchingTags.flatMap((tag) => tagToCompletionItem(tag)), // 包含基础和属性
    ...matchingSnippets,
  ]
}
