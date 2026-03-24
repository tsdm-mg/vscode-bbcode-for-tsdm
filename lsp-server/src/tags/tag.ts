import { TagHead, TagTail } from '../token'

export type BBCodeTag = BBCodeTagTag | BBCodeTagText

class BBCodeTagText {
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

interface BBCodeTagTag {
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
  attributeValidator?(attr: string | undefined): boolean

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
  childrenValidator?(children: BBCodeTag[]): boolean

  /**
   * An optional function to validate parent tag.
   *
   * The function accepts a parent tag node and returns true if the
   * tag is valid to be direct parent node.
   *
   * If a tag should only exists when some tags are its direct parent node,
   * use this function to validate it.
   */
  parentValidator?(parent: BBCodeTag): boolean

  /**
   * All direct children tags.
   */
  children: BBCodeTag[]

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
export abstract class BBCodeTagTagBase implements BBCodeTagTag {
  constructor(head: TagHead, tail?: TagTail, children?: BBCodeTag[]) {
    this.start = head.position.start
    this.end = tail?.position.end ?? head.position.end
    this.attribute = head.attribute
    this.children = children ?? []
  }

  abstract name: string
  attribute?: string
  open = '['
  close = ']'
  start: number
  end: number
  selfClosed = false
  children: BBCodeTag[]
  attributeValidator?(attr: string | undefined): boolean
  childrenValidator?(children: BBCodeTag[]): boolean
  parentValidator?(parent: BBCodeTag): boolean

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
}
