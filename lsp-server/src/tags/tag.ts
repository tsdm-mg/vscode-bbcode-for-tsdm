import {
  DiagErr,
  DiagnosticError,
  DiagnosticMessage,
} from '../diagnostic-result'
import { TagHead, TagTail } from '../token'

export type BBCodeComponent = BBCodeTag | BBCodeText

export class BBCodeText {
  constructor(start: number, end: number, data: string) {
    this._data = data
    this.start = start
    this.end = end
  }

  /**
   * Extra plain text data.
   */
  private _data: string

  /**
   * The start position.
   */
  start: number

  /**
   * The end position.
   */
  end: number

  toBBCode(): string {
    return this._data
  }
}

export interface BBCodeTag {
  /**
   * Tag name.
   */
  name: string

  /**
   * The open character
   */
  open: string

  /**
   * The close character
   */
  close: string

  /**
   * The start position.
   */
  start: number

  /**
   * The end position.
   */
  end: number

  /**
   * Is the tag self-closing.
   *
   * For example `[url][/url]` is not self closing because it needs a separate
   * close tag `[/url]` and `[hr]` is self closing because it does not need one.
   */
  selfClosed: boolean

  /**
   * An optional function to validate tag attribute.
   *
   * The function accepts a string as raw attribute value to validate and
   * returns true if the value is valid.
   */
  attributeValidator?(attr: string | undefined): DiagnosticError[]

  /**
   * Optional attribute value.
   *
   * Attribute is a string in the tag header.
   */
  attribute?: string

  /**
   * An optional function to validate children tags.
   *
   * The function accepts a list of tags as children to validate and
   * returns true if tags are all valid to be the children of current tag.
   */
  childrenValidator?(children: BBCodeComponent[]): DiagnosticError[]

  /**
   * An optional function to validate parent tag.
   *
   * The function accepts a parent tag node and returns true if the
   * tag is valid to be direct parent node.
   *
   * If a tag should only exists when some tags are its direct parent node,
   * use this function to validate it.
   */
  parentValidator?(parent: BBCodeComponent): DiagnosticError[]

  /**
   * An optional function to the node if self.
   *
   * The function accepts no argument as this field is here for tag-wide
   * specific usage.
   */
  additionalValidator?(): DiagnosticError[]

  /**
   * All direct children tags.
   */
  children: BBCodeComponent[]

  /**
   * Convert current tag into BBCode text.
   *
   * Produce BBCode.
   */
  toBBCode(): string

  /**
   * When the tag is considered invalid, fallback current tag to plain text.
   *
   * All children tags are also fallbacked.
   */
  fallbackToText(): string

  /**
   * BBCode of attribute.
   */
  attributeBBCode(): string
}

/**
 * The base class for all tags.
 *
 * Using attribute.
 */
export abstract class BBCodeTagBase implements BBCodeTag {
  constructor(token: TagHead | TagTail, children?: BBCodeComponent[]) {
    this.start = token.position.start
    this.end = token.position.end
    this.attribute = undefined
    if (token instanceof TagHead && token.attribute !== undefined) {
      this.attribute = token.attribute
    }
    this.children = children ?? []
    this.isClosed = false
    this.isHead = token instanceof TagHead
  }

  abstract name: string
  attribute?: string
  open = '['
  close = ']'
  start: number
  end: number
  selfClosed = false
  children: BBCodeComponent[]
  attributeValidator?(attr: string | undefined): DiagnosticError[]
  childrenValidator?(children: BBCodeComponent[]): DiagnosticError[]
  parentValidator?(parent: BBCodeComponent): DiagnosticError[]
  additionalValidator?(): DiagnosticError[]

  /**
   * Flag indicating is tag head or not.
   *
   * If false, then built from tag tail.
   */
  isHead: boolean

  /**
   * Flag indicating a tag is closed or not.
   */
  isClosed: boolean

  closeTag(tagTail: TagTail) {
    this.end = tagTail.position.end
    this.isClosed = true
  }

  toBBCode(): string {
    if (this.selfClosed) {
      return this.open + this.name + this.close
    }

    const buffer: string[] = []

    if (this.attribute === undefined) {
      buffer.push(this.open + this.name + this.close)
    } else {
      buffer.push(this.open + this.name + '=' + this.attribute + this.close)
    }

    for (const e of this.children) {
      buffer.push(e.toBBCode())
    }

    buffer.push(this.open + '/' + this.name + this.close)

    return buffer.join('')
  }

  fallbackToText(): string {
    const buffer: string[] = [
      this.open + this.name + this.attributeBBCode() + this.close,
    ]
    for (const child of this.children) {
      buffer.push(child.toBBCode())
    }
    buffer.push(
      this.open + '/' + this.name + this.attributeBBCode() + this.close,
    )
    return buffer.join('')
  }

  attributeBBCode(): string {
    return this.attribute === undefined ? '' : `=${this.attribute}`
  }

  /**
   * Find the tag satisfy some condition `pred`.
   *
   * @param pred The predication on tag, should return true if the input `tag`
   *   satisfy it.
   * @returns The tag if found or undefined if not found.
   */
  findTag(
    pred: (tag: BBCodeComponent) => boolean,
  ): BBCodeComponent | undefined {
    for (const child of this.children) {
      if (pred(child)) {
        return child
      }

      if (child instanceof BBCodeTagBase) {
        const childTarget = child.findTag(pred)
        if (childTarget !== undefined) {
          return childTarget
        }
      }
    }
  }

  diagnose(): DiagnosticMessage[] {
    const messages: DiagnosticMessage[] = []

    if (this.additionalValidator !== undefined) {
      messages.push(
        ...this.additionalValidator().map((e) =>
          this.makeTagNameDiagnosticMessage(e),
        ),
      )
    }

    if (!this.isClosed && !this.selfClosed) {
      messages.push(
        this.makeTagHeadDiagnosticMessage(
          this.isHead
            ? DiagErr.tagNotClosed(this.name)
            : DiagErr.tagNotOpened(this.name),
        ),
      )
    }

    if (this.attributeValidator !== undefined) {
      messages.push(
        ...this.attributeValidator(this.attribute).map((e) =>
          this.attribute === undefined
            ? this.makeTagNameDiagnosticMessage(e)
            : this.makeAttributeDiagnosticMessage(e),
        ),
      )
    }

    for (const child of this.children) {
      if (child instanceof BBCodeText) {
        // Do nothing.
        continue
      } else if (child instanceof BBCodeTagBase) {
        messages.push(...child.diagnose())
      } else {
        // Unreachable.
        throw new TypeError('unsupported bbcode component ty')
      }
    }

    return messages
  }

  private tagHeaderRange(): { start: number; end: number } {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.isHead) {
      // Add 1 offset to skip '[' before tag name.
      return {
        start: this.start,
        end: this.start + 1 + this.name.length + 1,
      }
    } else {
      // Add 2 offset to skip '[/' before tag name.
      return {
        start: this.start,
        end: this.start + 2 + this.name.length + 1,
      }
    }
  }

  /**
   * Get the range of tag name in head (or tail).
   */
  private tagNameRange(): { start: number; end: number } {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.isHead) {
      // Add 1 offset to skip '[' before tag name.
      return {
        start: this.start + 1,
        end: this.start + 1 + this.name.length,
      }
    } else {
      // Add 2 offset to skip '[/' before tag name.
      return {
        start: this.start + 2,
        end: this.start + 2 + this.name.length,
      }
    }
  }

  /**
   * Get the range of attribute value.
   *
   * That caller MUST ensure attribute is not undefined.
   */
  private attrRange(): { start: number; end: number } {
    return {
      start: this.start + 1 + this.name.length + 1,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      end: this.start + 1 + this.name.length + 1 + this.attribute!.length,
    }
  }

  /**
   * Produce a diagnostic message that targets on the entire tag header.
   *
   * Use this range of message for tag-wide diagnostic errors.
   */
  private makeTagHeadDiagnosticMessage(
    error: DiagnosticError,
  ): DiagnosticMessage {
    const { start, end } = this.tagHeaderRange()
    return {
      start,
      end,
      error,
    }
  }

  /**
   * Produce a diagnostic message that targets on tag name of the tag.
   *
   * Use this range of message for diagnostic errors specificly on tag name.
   */
  private makeTagNameDiagnosticMessage(
    error: DiagnosticError,
  ): DiagnosticMessage {
    const { start, end } = this.tagNameRange()
    return {
      start,
      end,
      error,
    }
  }

  /**
   * Produce a diagnostic message that targets on the attributes value string.
   *
   * Use this range of message for diagnostic errors specificly on attribute value.
   *
   * The caller MUST ensure attribute is not undefined.
   */
  private makeAttributeDiagnosticMessage(
    error: DiagnosticError,
  ): DiagnosticMessage {
    const { start, end } = this.attrRange()
    return {
      start,
      end,
      error,
    }
  }
}

export function diagnoseBBCodeAST(
  bbcode: BBCodeComponent[],
): DiagnosticMessage[] {
  const errors: DiagnosticMessage[] = []

  for (const node of bbcode) {
    if (node instanceof BBCodeText) {
      continue
    } else if (node instanceof BBCodeTagBase) {
      errors.push(...node.diagnose())
    }
  }
  return errors
}
