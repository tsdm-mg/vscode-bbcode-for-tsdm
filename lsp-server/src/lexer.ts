import { TagHead, TagTail, Text, Token } from './token'

/**
 * The BBCode lexer.
 */
export class Lexer {
  constructor(input: string) {
    this._input = input
    this._tokens = []
    this._currTagStartPos = 0
    this._scanPos = 0
  }

  /**
   * Original input text.
   */
  private _input: string

  /**
   * Parsed tokens.
   */
  private _tokens: Token[]

  /**
   * Position of current tag.
   */
  private _currTagStartPos: number

  /**
   * Positiion of scanning in original text.
   */
  private _scanPos: number

  /**
   * Getter of parsed tokens.
   *
   * Call this function after lexing.
   */
  tokens(): Token[] {
    return this._tokens
  }

  toBBCode(): string {
    const code: string[] = []
    for (const token of this._tokens) {
      code.push(token.toBBCode())
    }

    return code.join('')
  }

  /**
   * Do the lexing.
   */
  scanAll() {
    while (!this._isDone()) {
      this._scanText()
    }
  }

  /**
   * Is the lexer finished lexing.
   */
  private _isDone(): boolean {
    return this._currTagStartPos >= this._input.length
  }

  /**
   * Do the lexer one round.
   */
  private _scanText() {
    const buffer: string[] = []

    while (true) {
      if (this._isDone()) {
        this._appendText(buffer)
        this._currTagStartPos = this._scanPos
        return
      }

      const next = this._readChar()
      if (next === '[') {
        // Try scan head.
        // Finish the scan process no matter is valid head or not.
        // Chances are that two or more `Text`s are siblings stay beside each other.
        this._appendText(buffer, true)
        this._currTagStartPos = this._scanPos - 1

        const next2 = this._peekChar()
        if (next2 === '/') {
          // Read and drop the slash.
          // Perhaps tag tail.
          this._readChar()
          this._scanTail()
        } else if (next2 === '[') {
          // '[[', fallback to plain text.
          this._appendConsumedText('[')
          this._scanText()
        } else {
          // Perhaps tag head.
          this._scanHead()
        }

        this._currTagStartPos = this._scanPos
        return
      }

      buffer.push(next)
    }
  }

  /**
   * Try scan tag head.
   *
   * If successfully scanned a tag head, return true.
   */
  private _scanHead(): boolean {
    const nameBuffer: string[] = []
    while (true) {
      if (this._isDone()) {
        // Here indicating a incomplete tag head and reaches the end of input, fallback to plain text.
        // Don't forget to save the consumed '[' when we enter this function.
        // Use the fixed end parameter because we know the '[' where starts and length is fixed to 1.
        this._appendConsumedText('[', this._currTagStartPos + 1)
        this._currTagStartPos += 1
        this._appendText(nameBuffer)
        return false
      }

      const next = this._readChar()
      if (next === '=') {
        if (nameBuffer.length === 0) {
          // Currently we have "[=", position is at the "=".
          // It should be considered as plain text.
          this._appendConsumedText('[=')
          return false
        }

        // Header with attribute.
        // Parse the attribute.
        const attrBuffer: string[] = []
        while (true) {
          if (this._isDone()) {
            // Empty attribute string.
            break
          }

          const next2 = this._readChar()
          if (next2 === ']') {
            // Reach the end of attribute.
            // Here we can return the head scan process.
            this._appendHead(nameBuffer, attrBuffer)
            this._currTagStartPos = this._scanPos
            return true
          }

          attrBuffer.push(next2)
        }
      } else if (next === ']') {
        if (nameBuffer.length === 0) {
          // Currently we have "[]", position is at the "]".
          // It should be considered as plain text.
          this._appendConsumedText('[]')
          return false
        }

        this._appendHead(nameBuffer)
        this._currTagStartPos = this._scanPos
        return true
      }

      nameBuffer.push(next)
    }
  }

  /**
   * Try scan a tag tail `[/$NAME]`.
   *
   * If successfully scanned a tag tail, return true.
   *
   * When enter this function, position MUST be after the `[/`
   */
  private _scanTail(): boolean {
    const namedBuffer: string[] = []
    while (true) {
      if (this._isDone()) {
        // Here we reaches the end of input with incomplete tag tail.
        // Don't forget the eaten prefix '[/'.
        this._appendConsumedText('[/', this._currTagStartPos + 2)
        this._currTagStartPos += 2
        this._appendText(namedBuffer)
        return false
      }

      const next = this._readChar()
      if (next === ']') {
        if (namedBuffer.length === 0) {
          // Here we reaches the end of input with incomplete tag tail.
          // Don't forget the eaten prefix '[/'.
          this._appendConsumedText('[/]', this._currTagStartPos + 3)
          this._currTagStartPos += 3
        }
        this._appendTail(namedBuffer)
        this._currTagStartPos = this._scanPos
        return true
      }

      namedBuffer.push(next)
    }
  }

  /**
   * Build a `Text` token from `buffer` and append it to `_tokens`.
   */
  private _appendText(buffer: string[], overRead = false) {
    if (buffer.length === 0) {
      return
    }

    const end = overRead ? this._scanPos - 1 : this._scanPos

    this._tokens.push(new Text(this._currTagStartPos, end, buffer.join('')))
  }

  private _appendConsumedText(text: string, end?: number) {
    if (text.length === 0) {
      return
    }

    this._tokens.push(
      new Text(this._currTagStartPos, end ?? this._scanPos, text),
    )
  }

  private _appendHead(nameBuffer: string[], attrBuffer?: string[]) {
    if (nameBuffer.length === 0) {
      return
    }

    this._tokens.push(
      new TagHead(
        this._currTagStartPos,
        this._scanPos,
        nameBuffer.join(''),
        attrBuffer === undefined ? undefined : attrBuffer.join(''),
      ),
    )
  }

  private _appendTail(nameBuffer: string[]) {
    if (nameBuffer.length === 0) {
      return
    }

    this._tokens.push(
      new TagTail(this._currTagStartPos, this._scanPos, nameBuffer.join('')),
    )
  }

  private _readChar(): string {
    const ch = this._input[this._scanPos]
    this._scanPos += 1
    return ch
  }

  private _peekChar(): string {
    return this._input[this._scanPos]
  }
}
