import * as vscode from 'vscode'
import { BBCodeCompletionItemProvider } from './auto-complete'

export async function activate(ctx: vscode.ExtensionContext) {
  const htmlExtension = vscode.extensions.getExtension('vscode.html-language-features')
  await htmlExtension?.activate()

  const autoCompleteProvider = new BBCodeCompletionItemProvider()
  ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'bbcode' }, autoCompleteProvider, '['))
}
