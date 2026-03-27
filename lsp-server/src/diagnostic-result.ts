/**
 * Severity level.
 *
 * The type will be mapped to severity level in vscode.
 */
export type DiagnosticSeverity = 'info' | 'warning' | 'eror'

/**
 * A diagnostic error.
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
   * Severity level.
   */
  severity: DiagnosticSeverity

  /**
   * Message
   */
  message: string
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
    name,
  }),

  attributeNotAllowed: (): DiagErrAttributeNotAllowed => ({
    _kind: 'DiagErrAttributeNotAllowed',
  }),

  attributeRequired: (): DiagErrAttributeRequired => ({
    _kind: 'DiagErrAttributeRequired',
  }),

  invalidAttributeValue: (
    attr?: string,
    allowedAttr?: string[],
  ): DiagErrInvalidAttributeValue => ({
    _kind: 'DiagErrInvalidAttributeValue',
    attr,
    allowedAttr,
  }),

  invalidColor: (): DiagErrInvalidColor => ({
    _kind: 'DiagErrInvalidColor',
  }),
}

/**
 * Unknown tag name, considered as unknown or invalid.
 */
export interface DiagErrUnknownTag {
  _kind: 'DiagErrUnknownTag'
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
}

/**
 * Attribute is required on this tag.
 */
export interface DiagErrAttributeRequired {
  _kind: 'DiagErrAttributeRequired'
}

export interface DiagErrInvalidAttributeValue {
  _kind: 'DiagErrInvalidAttributeValue'

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

  /**
   * Current invalid color value.
   */
  attr?: string
}
