import { createBaseTag } from './tags/all'
import { BBCodeComponent, BBCodeTagBase, BBCodeText } from './tags/tag'
import { TagHead, TagTail, Text, Token } from './token'

/**
 * A stack based BBCode parser for the language server.
 *
 * Note that to use with language server, this parser does not validate attributes
 * during parse stage, some diagnostic purpose validators are bundled with tags
 * theirselves for providing more friendly diagnostic message and makes the language
 * server more tolerant.
 *
 * And the parser knows nothing about:
 *
 * - What tags are valid.
 * - What attributes/children/parent constrains with each type of tag.
 */
export class Parser {
  constructor(tokens: Token[]) {
    this._tokens = tokens
    this._currPathTags = []
    this._topTags = []
  }

  /**
   * All input tokens to parse.
   */
  private _tokens: Token[]

  /**
   * All top-level tags in the AST.
   *
   * A list acts like stack for managing parsed partial or complete BBCode tags.
   *
   * The tags store in this list are either text or unresolved tags as the parser
   * does not do diagnostic check on parsed result.
   */
  private _topTags: BBCodeComponent[]

  /**
   * All tags in the current tag path.
   *
   * For each tag in the AST, if it is not a top-level tag, then it surely
   * has a parent and a path to one of the top-level tags:
   *
   * For example, In:
   *
   * [b][size=3]foo[/size][/b]
   *
   * the text `foo` is in a path:
   *
   * BoldTag -> SizeTag(size=3) -> Text(`foo`)
   */
  private _currPathTags: BBCodeTagBase[]

  /**
   * Get the parsed AST.
   */
  ast(): BBCodeComponent[] {
    return this._topTags
  }

  parse() {
    for (const token of this._tokens) {
      if (token instanceof TagHead) {
        this._saveTagHead(token)
        continue
      } else if (token instanceof TagTail) {
        this._saveTagTail(token)
        continue
      } else if (token instanceof Text) {
        this._saveText(token)
        continue
      }
    }
  }

  private _appendToCurrent(node: BBCodeComponent) {
    const parent = this._currPathTags.at(-1)
    if (parent) {
      parent.children.push(node)
    } else {
      this._topTags.push(node)
    }
  }

  private _saveTagHead(tagHead: TagHead) {
    const tag = createBaseTag(tagHead)
    this._appendToCurrent(tag)

    if (!tag.selfClosed) {
      this._currPathTags.push(tag)
    }
  }

  private _saveTagTail(tagTail: TagTail) {
    const last = this._currPathTags.at(-1)
    if (last?.name === tagTail.name) {
      last.closeTag(tagTail)
      this._currPathTags.pop()
    } else {
      // Orphan tag tail.
      const orphan = createBaseTag(tagTail)
      this._appendToCurrent(orphan)
    }
  }

  private _saveText(text: Text) {
    const node = new BBCodeText(
      text.position.start,
      text.position.end,
      text.data,
    )
    this._appendToCurrent(node)
  }
}
