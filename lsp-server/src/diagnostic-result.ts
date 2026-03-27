/**
 * Severity level.
 *
 * The type will be mapped to severity level in vscode.
 */
export type DiagnosticSeverity = 'info' | 'warning' | 'error'

/**
 * A diagnostic message.
 *
 * Indicating some error or warning or info that scanned in the AST.
 *
 * Each message occurs in a range and is defined with different severity error.
 */
export interface DiagnosticMessage {
  /**
   * Start position offset.
   */
  start: number

  /**
   * End position offset.
   */
  end: number

  /**
   * The error
   */
  error: DiagnosticError
}

/**
 * All diagnostic error types.
 */
export type DiagnosticError =
  | DiagErrUnknownTag
  | DiagErrAttributeNotAllowed
  | DiagErrAttributeRequired
  | DiagErrInvalidAttributeValue
  | DiagErrInvalidColor

export const DiagErr = {
  unknownTag: (name: string): DiagErrUnknownTag => ({
    _kind: 'DiagErrUnknownTag',
    severity: 'error',
    name,
  }),

  attributeNotAllowed: (): DiagErrAttributeNotAllowed => ({
    _kind: 'DiagErrAttributeNotAllowed',
    severity: 'error',
  }),

  attributeRequired: (): DiagErrAttributeRequired => ({
    _kind: 'DiagErrAttributeRequired',
    severity: 'error',
  }),

  invalidAttributeValue: (
    attr?: string,
    allowedAttr?: string[],
  ): DiagErrInvalidAttributeValue => ({
    _kind: 'DiagErrInvalidAttributeValue',
    severity: 'error',
    attr,
    allowedAttr,
  }),

  invalidColor: (): DiagErrInvalidColor => ({
    _kind: 'DiagErrInvalidColor',
    severity: 'error',
  }),
}

/**
 * Unknown tag name, considered as unknown or invalid.
 */
export interface DiagErrUnknownTag {
  _kind: 'DiagErrUnknownTag'

  severity: 'error'

  /**
   * Tag name that is unknown.
   */
  name: string
}

/**
 * Attribute is not allowed on this tag.
 */
export interface DiagErrAttributeNotAllowed {
  _kind: 'DiagErrAttributeNotAllowed'

  severity: 'error'
}

/**
 * Attribute is required on this tag.
 */
export interface DiagErrAttributeRequired {
  _kind: 'DiagErrAttributeRequired'

  severity: 'error'
}

export interface DiagErrInvalidAttributeValue {
  _kind: 'DiagErrInvalidAttributeValue'

  severity: 'error'

  /**
   * Current invalid attribute value.
   */
  attr?: string

  /**
   * Allowed values.
   */
  allowedAttr?: string[]
}

/**
 * Expected color but the attribute is not a valid color.
 */
export interface DiagErrInvalidColor {
  _kind: 'DiagErrInvalidColor'

  severity: 'error'

  /**
   * Current invalid color value.
   */
  attr?: string
}
