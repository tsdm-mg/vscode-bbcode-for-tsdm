import path from 'node:path'
import * as vscode from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'

let client: LanguageClient

export async function activate(ctx: vscode.ExtensionContext) {
  console.log('>>> client activated')

  // Activate html extension.
  const htmlExtension = vscode.extensions.getExtension(
    'vscode.html-language-features',
  )
  await htmlExtension?.activate()

  const serverModule = ctx.asAbsolutePath(
    path.join('lsp-server', 'out', 'server.js'),
  )

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'bbcode' }],
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
}
