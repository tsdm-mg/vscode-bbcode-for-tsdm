/**
 * All types of token.
 *
 * A token can be either:
 *
 * - `text` plain text
 * - `tagHead` header of a tag
 * - `tagTail` tail of a tag
 */
export type TokenType = 'text' | 'tagHead' | 'tagTail'

/**
 * Describe the position of token in original input text stream.
 *
 * Each token takes a range of the text.
 */
export interface TokenPosition {
  /**
   * The start position of the token, including the position value.
   */
  start: number

  /**
   * The end position of the token, excluding the position value.
   */
  end: number
}

/**
 * Token represents a part of data of the input stream.
 *
 * After lexing, the input is constructed to a series of tokens for further analyzing.
 */
export interface Token {
  /**
   * Get the role of current token.
   */
  tokenType: TokenType

  /**
   * Get the result text when current token converts to BBCode.
   */
  toBBCode(): string

  /**
   * The position of current token in the original text stream before lexing.
   */
  position: TokenPosition

  /**
   * Get the original text length of current token.
   */
  length(): number
}

/**
 * Token for plain text.
 */
export class Text implements Token {
  constructor(start: number, end: number, data: string) {
    this.data = data
    this.position = { start, end }
  }

  readonly data: string
  readonly position: TokenPosition

  tokenType: TokenType = 'text'

  toBBCode(): string {
    return this.data
  }

  length(): number {
    return this.data.length
  }
}

/**
 * Header of BBCode tag.
 */
export class TagHead implements Token {
  constructor(
    start: number,
    end: number,
    name: string,
    attribute: string | undefined,
  ) {
    this.name = name
    this.attribute = attribute
    this.position = { start, end }
  }

  readonly name: string
  readonly attribute: string | undefined
  readonly position: TokenPosition

  tokenType: TokenType = 'tagHead'

  toBBCode(): string {
    return this.attribute === undefined
      ? `[${this.name}]`
      : `[${this.name}=${this.attribute}]`
  }

  length(): number {
    return this.position.end - this.position.start
  }
}

/**
 * Tail of BBCode tag.
 */
export class TagTail implements Token {
  constructor(start: number, end: number, name: string) {
    this.name = name
    this.position = { start, end }
  }

  readonly name: string
  readonly position: TokenPosition

  tokenType: TokenType = 'tagTail'

  toBBCode(): string {
    return `[/${this.name}]`
  }

  length(): number {
    return this.position.end - this.position.start
  }
}
