import path from 'path'
import * as vscode from 'vscode'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node'
import { BBCodeCompletionItemProvider } from './auto-complete'

let client: LanguageClient

export async function activate(ctx: vscode.ExtensionContext) {
  console.log('>>> client activated')

  const serverModule = ctx.asAbsolutePath(path.join('lsp-server', 'out', 'server.js'))

  console.log('>>> server path:', serverModule)

  const serverOptions : ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme : 'file', language: 'bbcode' }],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc'),
    },
  }

  client = new LanguageClient(
    'bbcodeLanguageClient',
    'BBCode Language Client',
    serverOptions,
    clientOptions,
  )

  console.log('>>> client starting')

  await client.start()

  return
  const htmlExtension = vscode.extensions.getExtension('vscode.html-language-features')
  await htmlExtension?.activate()

  const autoCompleteProvider = new BBCodeCompletionItemProvider()
  ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'bbcode' }, autoCompleteProvider, '['))
}

