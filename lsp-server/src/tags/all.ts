import { TagHead, TagTail } from '../token'
import { AlignTag } from './align'
import { BackgroundColorTag } from './background-color'
import { BoldTag } from './bold'
import { CodeTag } from './code'
import { ColorTag } from './color'
import { DividerTag } from './divider'
import { FontSizeTag } from './font-size'
import { FreeTag } from './free'
import { HideTag } from './hide'
import { ImageTag } from './image'
import { ItalicTag } from './italic'
import { ListItemTag, ListTag } from './list'
import { QuoteTag } from './quote'
import { SpoilerTag } from './spoiler'
import { StrikethroughTag } from './strikethrough'
import { SubscriptTag } from './subscript'
import { SuperscriptTag } from './superscript'
import { TableDataTag, TableRowTag, TableTag } from './table'
import { BBCodeTagBase } from './tag'
import { UnderlineTag } from './underline'
import { UnknownTag } from './unknown'
import { UrlTag } from './url'
import { UserMention } from './user-mention'

type TagConstructor = new (head: TagHead | TagTail) => BBCodeTagBase

const allTagsBuilders = new Map<string, TagConstructor>([
  ['align', AlignTag],
  ['backcolor', BackgroundColorTag],
  ['b', BoldTag],
  ['code', CodeTag],
  ['color', ColorTag],
  ['hr', DividerTag],
  ['size', FontSizeTag],
  ['free', FreeTag],
  ['hide', HideTag],
  ['img', ImageTag],
  ['i', ItalicTag],
  ['list', ListTag],
  ['*', ListItemTag],
  ['quote', QuoteTag],
  ['spoiler', SpoilerTag],
  ['s', StrikethroughTag],
  ['sub', SubscriptTag],
  ['sup', SuperscriptTag],
  ['table', TableTag],
  ['tr', TableRowTag],
  ['td', TableDataTag],
  ['u', UnderlineTag],
  ['url', UrlTag],
  ['@', UserMention],
])

export const allSelfClosingTagNames = ['hr']

export function createBaseTag(token: TagHead | TagTail): BBCodeTagBase {
  const builder = allTagsBuilders.get(token.name) ?? UnknownTag
  return new builder(token)
}
