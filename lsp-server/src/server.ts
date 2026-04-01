import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentDiagnosticReportKind,
  type DocumentDiagnosticReport,
  CodeActionTriggerKind,
} from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { parseAST } from './ast'
import { autoComplete } from './auto-complete'
import {
  DiagnosticError,
  DiagnosticSeverity as BBCodeDiagnosticSeverity,
} from './diagnostic-result'
import { onRepareRename } from './handlers/on-prepare-rename'
import { onRenameRequest } from './handlers/on-rename-request'
import { setupI18n, Translations } from './i18n/i18n'
import { allTags } from './tags'
import { diagnoseBBCodeAST } from './tags/tag'

function _buildDiagnosticMessage(
  error: DiagnosticError,
  i18n: Translations,
): string {
  const d = i18n.diagnostic

  switch (error._kind) {
    case 'DiagErrUnknownTag': {
      return d.unknownTag(error.name)
    }

    case 'DiagErrAttributeNotAllowed': {
      return d.attributeNotAllowed
    }

    case 'DiagErrAttributeRequired': {
      return d.attributeRequired
    }

    case 'DiagErrInvalidAttributeValue': {
      return d.invalidAttributeValue(error.attr, error.allowedAttr?.join(', '))
    }

    case 'DiagErrInvalidColor': {
      return d.invalidColor(error.color)
    }

    case 'DiagErrInvalidImageSize': {
      return d.invalidImageSize(error.size)
    }

    case 'DiagErrTagNotClosed': {
      return d.tagNotClosed(error.name)
    }

    case 'DiagErrTagNotOpened': {
      return d.tagNotOpened(error.name)
    }

    default: {
      throw new Error('unsupported error kind')
    }
  }
}

function _buildSeverity(
  bbcodeSeverity: BBCodeDiagnosticSeverity,
): DiagnosticSeverity {
  switch (bbcodeSeverity) {
    case 'info': {
      return DiagnosticSeverity.Information
    }

    case 'error': {
      return DiagnosticSeverity.Error
    }

    case 'warning': {
      return DiagnosticSeverity.Warning
    }

    default: {
      throw new Error('unsupported bbcode severity kind')
    }
  }
}

function _dumpDiagnosticErrors(text: TextDocument): Diagnostic[] {
  const ast = parseAST(text)
  return diagnoseBBCodeAST(ast).map((e) =>
    Diagnostic.create(
      { start: text.positionAt(e.start), end: text.positionAt(e.end) },
      _buildDiagnosticMessage(e.error, _i18n),
      _buildSeverity(e.error.severity),
      e.error._kind,
      'bbcode-tsdm',
    ),
  )
}

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const _conn = createConnection(ProposedFeatures.all)
let _i18n: Translations

_conn.console.log('>>> [conn] hello the BBCode language server is started')

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument)

let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false
// let hasDiagnosticRelatedInformationCapability = false

_conn.onInitialize((params: InitializeParams) => {
  // Setup i18n
  _i18n = setupI18n(params.locale)

  const capabilities = params.capabilities
  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  )
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  )
  // hasDiagnosticRelatedInformationCapability =
  //   !!capabilities.textDocument?.publishDiagnostics?.relatedInformation

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['['],
      },
      codeActionProvider: true,
      renameProvider: {
        prepareProvider: true,
      },
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
      // linkedEditingRangeProvider: true,
    },
  }
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    }
  }
  return result
})

_conn.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    void _conn.client.register(DidChangeConfigurationNotification.type)
  }

  _conn.onCodeAction((params) => {
    if (params.context.triggerKind !== CodeActionTriggerKind.Invoked) {
      // Only handle invoked code actions, skip automatically triggered ones.
      return
    }
    _conn.console.log(`[conn] onCodeAction`)
    return []
  })

  _conn.onCodeActionResolve((params) => {
    _conn.console.log(`[conn] onCodeActionResolve`)
    return params
  })

  _conn.onPrepareRename((params) => {
    const document = documents.get(params.textDocument.uri)
    if (document === undefined) {
      // Unreachable.
      _conn.console.log('[conn] onPrepareRename: text document not found')
      return
    }
    return onRepareRename(document, params.position)
  })

  _conn.onRenameRequest((params) => {
    const document = documents.get(params.textDocument.uri)
    if (document === undefined) {
      // Unreachable.
      _conn.console.log('[conn] onRenameRequest: text document not found')
      return
    }

    const edits = onRenameRequest(document, params.position, params.newName)
    if (edits === undefined) {
      // Can not rename
      return
    }

    return {
      changes: {
        [params.textDocument.uri]: edits,
      },
    }
  })

  if (hasWorkspaceFolderCapability) {
    _conn.workspace.onDidChangeWorkspaceFolders((_event) => {
      _conn.console.log('Workspace folder change event received.')
    })
  }
})

// The example settings
interface BBCodeLspSettings {
  maxNumberOfProblems: number
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: BBCodeLspSettings = { maxNumberOfProblems: 1000 }
let globalSettings: BBCodeLspSettings = defaultSettings

// Cache the settings of all open documents
const documentSettings = new Map<string, Thenable<BBCodeLspSettings>>()

_conn.onDidChangeConfiguration((change) => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings
    documentSettings.clear()
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    globalSettings = change.settings.languageServerExample ?? defaultSettings
  }
  // Refresh the diagnostics since the `maxNumberOfProblems` could have changed.
  // We could optimize things here and re-fetch the setting first can compare it
  // to the existing setting, but this is out of scope for this example.
  _conn.languages.diagnostics.refresh()
})

function getDocumentSettings(resource: string): Thenable<BBCodeLspSettings> {
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalSettings)
  }
  let result = documentSettings.get(resource)
  if (!result) {
    result = _conn.workspace
      .getConfiguration({
        scopeUri: resource,
        section: 'languageServerExample',
      })
      .then((settings) => {
        if (
          !settings ||
          typeof settings !== 'object' ||
          Object.keys(settings as object).length === 0
        ) {
          return { ...defaultSettings, ...settings } as BBCodeLspSettings
        }

        return settings as BBCodeLspSettings
      })
    documentSettings.set(resource, result)
  }
  return result
}

async function validateTextDocument(
  textDocument: TextDocument,
): Promise<Diagnostic[]> {
  const settings = await getDocumentSettings(textDocument.uri)
  return _dumpDiagnosticErrors(textDocument).slice(
    0,
    settings.maxNumberOfProblems,
  )
}

// Only keep settings for open documents
documents.onDidClose((e) => {
  documentSettings.delete(e.document.uri)
})

_conn.languages.diagnostics.on(async (params) => {
  const document = documents.get(params.textDocument.uri)

  return {
    kind: DocumentDiagnosticReportKind.Full,
    items: document === undefined ? [] : await validateTextDocument(document),
  } satisfies DocumentDiagnosticReport
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
  void validateTextDocument(change.document)
})

_conn.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  _conn.console.log('We received a file change event')
})

// This handler provides the initial list of the completion items.
_conn.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  return autoComplete(documents, params)
})

// This handler resolves additional information for the item selected in
// the completion list.
_conn.onCompletionResolve((item: CompletionItem): CompletionItem => {
  const targetItem = allTags.find((e) => e.label == item.label)
  if (targetItem !== undefined) {
    item.detail = targetItem.description(_i18n)
    item.documentation = targetItem.description(_i18n)
  }

  for (const tag of allTags) {
    const snippet = tag.snippets?.find((s) => s.prefix == item.label)
    if (snippet !== undefined) {
      item.detail = snippet.description(_i18n)
      item.documentation = snippet.description(_i18n)
      break
    }
  }

  return item
})

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(_conn)

// Listen on the connection
_conn.listen()
