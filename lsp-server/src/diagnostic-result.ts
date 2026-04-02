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
  | DiagErrInvalidImageSize
  | DiagErrTagNotClosed
  | DiagErrTagNotOpened
  | DiagErrConflictStyle
  | DiagErrUrlTargetRequired

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

  invalidColor: (color: string): DiagErrInvalidColor => ({
    _kind: 'DiagErrInvalidColor',
    severity: 'error',
    color,
  }),

  invalidImageSize: (size: string): DiagErrInvalidImageSize => ({
    _kind: 'DiagErrInvalidImageSize',
    severity: 'error',
    size,
  }),

  tagNotClosed: (name: string): DiagErrTagNotClosed => ({
    _kind: 'DiagErrTagNotClosed',
    severity: 'error',
    name,
  }),

  tagNotOpened: (name: string): DiagErrTagNotOpened => ({
    _kind: 'DiagErrTagNotOpened',
    severity: 'error',
    name,
  }),

  conflictStyle: (
    outerTag: string,
    innerTag: string,
  ): DiagErrConflictStyle => ({
    _kind: 'DiagErrConflictStyle',
    severity: 'warning',
    outerTag,
    innerTag,
  }),

  urlTargetRequired: (): DiagErrUrlTargetRequired => ({
    _kind: 'DiagErrUrlTargetRequired',
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
  color: string
}

/**
 * Invalid image size format.
 */
export interface DiagErrInvalidImageSize {
  _kind: 'DiagErrInvalidImageSize'

  severity: 'error'

  /**
   * Current invalid image size value.
   */
  size: string
}

/**
 * Current tag does not have a corresponding opening tag head.
 *
 * This error does not occurs on self-closing tags.
 *
 * This error only occurs on tag tails.
 */
export interface DiagErrTagNotOpened {
  _kind: 'DiagErrTagNotOpened'

  severity: 'error'

  /**
   * Name of the tag.
   */
  name: string
}

/**
 * Current tag not closed.
 *
 * This error does not occurs on self-closing tags.
 *
 * This error only occurs on tag tails.
 */
export interface DiagErrTagNotClosed {
  _kind: 'DiagErrTagNotClosed'

  severity: 'error'

  /**
   * Name of the tag.
   */
  name: string
}

/**
 * Style conflict on tags.
 *
 * When code is converted and rendered in HTML, some tags may
 * be ineffective because their styles are overrided by other tags.
 *
 * This often occurs when inner tag has default style that overlaps
 * with outer tags.
 *
 * For example, for `[color=red][url]...[/url][/color]`, the `color`
 * tag not works because `url` tag has default color on inner contents.
 *
 * Note that style overriding is usual, this error is only used when the
 * style conflict makes tag not work.
 *
 * When rasing this error, it is recommended to target on the inner tag.
 *
 * To fix this error, generally, swap tag nesting order is a choice.
 *
 * This error is only a warning because it only breaks part of style.
 */
export interface DiagErrConflictStyle {
  _kind: 'DiagErrConflictStyle'

  severity: 'warning'

  /**
   * Tag name of the outer tag, not works.
   */
  outerTag: string

  /**
   * Tag name of the inner tag, overrides the style of `outerTag`.
   */
  innerTag: string
}

/**
 * Url tag should have an url target.
 *
 * The url target can be positioned at:
 *
 * - url tag attribute.
 * - url tag children.
 */
export interface DiagErrUrlTargetRequired {
  _kind: 'DiagErrUrlTargetRequired'

  severity: 'error'
}
