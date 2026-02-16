import * as vscode from 'vscode'
import { allTags, Tag } from './tags'

const allCompletionItems: vscode.CompletionItem[] = allTags.flatMap(tag => tagToCompletionItem(tag))

function tagToCompletionItem(tag: Tag): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  const item = new vscode.CompletionItem(tag.label, vscode.CompletionItemKind.Snippet)
  item.detail = tag.name
  if (tag.attribute === undefined) {
    if (tag.selfClosing) {
      item.insertText = new vscode.SnippetString(`${tag.label}]`)
    } else {
      item.insertText = new vscode.SnippetString(`${tag.label}]$0[/${tag.label}]`)
    }
  } else {
    if (tag.selfClosing) {
      item.insertText = new vscode.SnippetString(`${tag.label}=${tag.attribute.snippet}]`)
    } else {
      item.insertText = new vscode.SnippetString(`${tag.label}=${tag.attribute.snippet}]$0[/${tag.label}]`)
    }
  }
  items.push(item)

  if (tag.snippets && tag.snippets.length > 0) {
    for (const snippet of tag.snippets) {
      const snippetItem = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet)
      snippetItem.detail = snippet.name
      // snippetItem.label = snippet.name
      snippetItem.insertText = new vscode.SnippetString(snippet.body)
      items.push(snippetItem)
    }
  }

  return items

}

export class BBCodeCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const lineText = document.lineAt(position.line).text
    const prefix = lineText.slice(0, position.character)

    if (prefix.endsWith('[')) {
      return allCompletionItems
    }

    // Completion on parial tags.
    const lastOpenIndex = prefix.lastIndexOf('[')
    if (lastOpenIndex !== -1) {
      const partialTag = lineText.slice(Math.max(0, lastOpenIndex + 1))
      return allTags.filter(tag => tag.label.startsWith(partialTag)).flatMap(tag => tagToCompletionItem(tag))
    }

    return []
  }
}