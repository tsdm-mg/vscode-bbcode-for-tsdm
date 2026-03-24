import { Token } from './token'

class Parser {
  /**
   * The original input raw text
   *
   * Use this field to fetch original text contents in specific ranges.
   */
  private _origString: string

  /**
   * All input tokens to parse.
   */
  private _tokens: Token[]
}
