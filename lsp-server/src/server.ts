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
} from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { autoComplete } from './auto-complete'
import { setupI18n, Translations } from './i18n/i18n'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { allTags } from './tags'
import { BBCodeComponent, diagnoseBBCodeAST } from './tags/tag'
import {
  DiagnosticError,
  DiagnosticSeverity as BBCodeDiagnosticSeverity,
} from './diagnostic-result'

function _buildDiagnosticMessage(
  error: DiagnosticError,
  i18n: Translations,
): string {
  const d = i18n.diagnostic

  switch (error._kind) {
    case 'DiagErrUnknownTag':
      return d.unknownTag(error.name)

    case 'DiagErrAttributeNotAllowed':
      return d.attributeNotAllowed

    case 'DiagErrAttributeRequired':
      return d.attributeRequired

    case 'DiagErrInvalidAttributeValue':
      return d.invalidAttributeValue(error.attr, error.allowedAttr?.join(', '))

    case 'DiagErrInvalidColor':
      return d.invalidColor(error.attr)

    default:
      throw new Error('unsupported error kind')
  }
}

function _buildSeverity(
  bbcodeSeverity: BBCodeDiagnosticSeverity,
): DiagnosticSeverity {
  switch (bbcodeSeverity) {
    case 'info':
      return DiagnosticSeverity.Information

    case 'error':
      return DiagnosticSeverity.Error

    case 'warning':
      return DiagnosticSeverity.Warning

    default:
      throw new Error('unsupported bbcode severity kind')
  }
}

function _loadData(text: TextDocument): BBCodeComponent[] {
  const lexer = new Lexer(text.getText())
  lexer.scanAll()
  const parser = new Parser(lexer.tokens())
  parser.parse()
  return parser.ast()
}

function _dumpDiagnosticErrors(text: TextDocument): Diagnostic[] {
  const ast = _loadData(text)
  return diagnoseBBCodeAST(ast).map((e) =>
    Diagnostic.create(
      { start: text.positionAt(e.start), end: text.positionAt(e.end) },
      _buildDiagnosticMessage(e.error, _i18n),
      _buildSeverity(e.error.severity),
    ),
  )
}

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const _conn = createConnection(ProposedFeatures.all)
let _i18n: Translations

_conn.console.log('>>> [conn] hello the server started')

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument)

let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false
let hasDiagnosticRelatedInformationCapability = false

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
  hasDiagnosticRelatedInformationCapability =
    !!capabilities.textDocument?.publishDiagnostics?.relatedInformation

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['['],
      },
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
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
  if (hasWorkspaceFolderCapability) {
    _conn.workspace.onDidChangeWorkspaceFolders((_event) => {
      _conn.console.log('Workspace folder change event received.')
    })
  }
})

// The example settings
interface ExampleSettings {
  maxNumberOfProblems: number
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 }
let globalSettings: ExampleSettings = defaultSettings

// Cache the settings of all open documents
const documentSettings = new Map<string, Thenable<ExampleSettings>>()

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

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalSettings)
  }
  let result = documentSettings.get(resource)
  if (!result) {
    result = _conn.workspace.getConfiguration({
      scopeUri: resource,
      section: 'languageServerExample',
    })
    documentSettings.set(resource, result)
  }
  return result
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

async function validateTextDocument(
  textDocument: TextDocument,
): Promise<Diagnostic[]> {
  const settings = await getDocumentSettings(textDocument.uri)
  return _dumpDiagnosticErrors(textDocument).slice(
    0,
    // TODO: Use settings.maxNumberOfProblems
    100,
    // settings.maxNumberOfProblems,
  )
}

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
  _conn.console.log(
    `>>> [conn] onCompletionResolve: item=${JSON.stringify(item.label)}`,
  )
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
