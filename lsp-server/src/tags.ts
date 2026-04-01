import { Translations } from './i18n/i18n'
import { Snippet } from './snippets'

/**
 * Defines attribute rules for BBCode tags.
 */
export interface Attribute {
  /**
   * Is attribute required.
   */
  required: boolean

  /**
   * Attribute snippet format.
   */
  snippet: string
}

export interface Tag {
  /**
   * Readable tag name.
   */
  name: string

  /**
   * Tag label used to identify the tag.
   */
  label: string

  /**
   * Optional tag attribute related rules.
   */
  attribute?: Attribute

  /**
   * Is this tag self-closing.
   */
  selfClosing: boolean

  /**
   * Is this tag will be rendered as a whole row.
   */
  layout: 'inline' | 'block'

  /**
   * Tag related snippets.
   */
  snippets?: Snippet[]

  /**
   * The callback locating human readable description in `Translations`
   */
  description: (tr: Translations) => string
}

export const allTags: Tag[] = [
  {
    name: 'align',
    label: 'align',
    attribute: {
      required: false,
      snippet: '${1:mode}',
    },
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.align.notSpecified.description,
    snippets: [
      {
        name: 'Align Left',
        prefix: 'alignleft',
        body: 'align=left]$0[/align]',
        description: (tr) => tr.tags.align.left.description,
      },
      {
        name: 'Align Center',
        prefix: 'aligncenter',
        body: 'align=center]$0[/align]',
        description: (tr) => tr.tags.align.center.description,
      },
      {
        name: 'Align Right',
        prefix: 'alignright',
        body: 'align=right]$0[/align]',
        description: (tr) => tr.tags.align.right.description,
      },
    ],
  },
  {
    name: 'backgroundColor',
    label: 'backcolor',
    attribute: {
      required: true,
      snippet: '${1:value}',
    },
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.backgroundColor.description,
  },
  {
    name: 'bold',
    label: 'b',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.bold.description,
  },
  {
    name: 'codeBlock',
    label: 'code',
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.codeBlock.description,
  },
  {
    name: 'textColor',
    label: 'color',
    attribute: {
      required: true,
      snippet: '${1:value}',
    },
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.textColor.description,
  },
  {
    name: 'divider',
    label: 'hr',
    selfClosing: true,
    layout: 'block',
    description: (tr) => tr.tags.divider.description,
  },
  {
    name: 'fontSize',
    label: 'size',
    attribute: {
      required: true,
      snippet: '${1:value}',
    },
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.fontSize.notSpecified.description,
    snippets: [
      {
        name: 'Size 1',
        prefix: 'size1',
        body: 'size=1]$0[/size]',
        description: (tr) => tr.tags.fontSize.size1.description,
      },
      {
        name: 'Size 2',
        prefix: 'size2',
        body: 'size=2]$0[/size]',
        description: (tr) => tr.tags.fontSize.size2.description,
      },
      {
        name: 'Size 3',
        prefix: 'size3',
        body: 'size=3]$0[/size]',
        description: (tr) => tr.tags.fontSize.size3.description,
      },
      {
        name: 'Size 4',
        prefix: 'size4',
        body: 'size=4]$0[/size]',
        description: (tr) => tr.tags.fontSize.size4.description,
      },
      {
        name: 'Size 5',
        prefix: 'size5',
        body: 'size=5]$0[/size]',
        description: (tr) => tr.tags.fontSize.size5.description,
      },
      {
        name: 'Size 6',
        prefix: 'size6',
        body: 'size=6]$0[/size]',
        description: (tr) => tr.tags.fontSize.size6.description,
      },
    ],
  },
  {
    name: 'freeArea',
    label: 'free',
    attribute: {
      required: false,
      snippet: '${1:price}',
    },
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.freeArea.description,
  },
  {
    name: 'hideArea',
    label: 'hide',
    attribute: {
      required: false,
      snippet: '${1:points}',
    },
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.hideArea.description,
  },
  {
    name: 'image',
    label: 'img',
    attribute: {
      required: true,
      snippet: '${1:width},${2:height}',
    },
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.image.description,
  },
  {
    name: 'italic',
    label: 'i',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.italic.description,
  },
  {
    name: 'list',
    label: 'list',
    attribute: {
      required: false,
      snippet: '1',
    },
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.list.notSpecified.description,
    snippets: [
      {
        name: 'Ordered List',
        prefix: 'orderedlist',
        body: 'list=1]\n[*]$0\n[/list]',
        description: (tr) => tr.tags.list.ordered.description,
      },
      {
        name: 'Bullet List',
        prefix: 'bulletlist',
        body: 'list]\n[*]$0\n[/list]',
        description: (tr) => tr.tags.list.bullet.description,
      },
    ],
  },
  {
    name: 'listItem',
    label: '*',
    selfClosing: true,
    layout: 'block',
    description: (tr) => tr.tags.listItem.description,
  },
  {
    name: 'quoteBlock',
    label: 'quote',
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.quoteBlock.description,
  },
  {
    name: 'spoiler',
    label: 'spoiler',
    attribute: {
      required: true,
      snippet: '${1:summary}',
    },
    selfClosing: false,
    layout: 'block',
    description: (tr) => tr.tags.spoiler.description,
  },
  {
    name: 'strikethrough',
    label: 's',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.strikethrough.description,
  },
  {
    name: 'superscript',
    label: 'sup',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.superscript.description,
  },
  {
    name: 'subscript',
    label: 'sub',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.subscript.description,
  },
  {
    name: 'table',
    label: 'table',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.table.description,
  },
  {
    name: 'tableRow',
    label: 'tr',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.tableRow.description,
  },
  {
    name: 'tableData',
    label: 'td',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.tableData.description,
  },
  {
    name: 'underline',
    label: 'u',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.underline.description,
  },
  {
    name: 'url',
    label: 'url',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.url.normal.description,
    snippets: [
      {
        name: 'urlAttred',
        prefix: 'urlattred',
        body: 'url=$1]$0[/url]',
        description: (tr) => tr.tags.url.withAttr.description,
      },
    ],
  },
  {
    name: 'userMention',
    label: '@',
    selfClosing: false,
    layout: 'inline',
    description: (tr) => tr.tags.userMention.description,
  },
]
