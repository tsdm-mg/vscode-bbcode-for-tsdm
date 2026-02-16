import { Snippet } from './snippets'
import { colorValidator } from './tags/color-validator'

/**
 * Defines attribute rules for BBCode tags.
 */
export interface Attribute {
  /**
   * Is attribute required.
   */
  required: boolean,

  /**
   * Attribute snippet format.
   */
  snippet: string,

  /**
   * Validate attributes format.
   * 
   * @param attr Raw attribute value to check
   * @returns if the `attr` is valid.
   */
  validator?: (attr: string) => boolean,
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
}

export const allTags: Tag[] = [
  {
    name: 'align',
    label: 'align',
    attribute: {
      required: false,
      snippet: '${1:mode}',
      validator: (attr) => ['left', 'center', 'right'].includes(attr),
    },
    selfClosing: false,
    layout: 'block',
    snippets: [
      {
        name: 'Align Left',
        prefix: 'alignleft',
        body: 'align=left]$0[/align]',
      },
      {
        name: 'Align Center',
        prefix: 'aligncenter',
        body: 'align=center]$0[/align]',
      },
      {
        name: 'Align Right',
        prefix: 'alignright',
        body: 'align=right]$0[/align]',
      },
    ],
  },
  {
    name: 'backgroundColor',
    label: 'backcolor',
    attribute: {
      required: true,
      snippet: '${1:value}',
      validator: colorValidator,
    },
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'bold',
    label: 'b',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'codeBlock',
    label: 'code',
    selfClosing: false,
    layout: 'block',
  },
  {
    name: 'textColor',
    label: 'color',
    attribute: {
      required: true,
      snippet: '${1:value}',
      validator: colorValidator,
    },
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'divider',
    label: 'hr',
    selfClosing: true,
    layout: 'block',
  },
  {
    name: 'fontSize',
    label: 'size',
    attribute: {
      required: true,
      snippet: '${1:value}',
      validator: (attr) => ['1', '2', '3', '4', '5', '6'].includes(attr),
    },
    selfClosing: false,
    layout: 'inline',
    snippets: [
      {
        name: 'Size 1',
        prefix: 'size1',
        body: 'size=1]$0[/size]',
      },
      {
        name: 'Size 2',
        prefix: 'size2',
        body: 'size=2]$0[/size]',
      },
      {
        name: 'Size 3',
        prefix: 'size3',
        body: 'size=3]$0[/size]',
      },
      {
        name: 'Size 4',
        prefix: 'size4',
        body: 'size=4]$0[/size]',
      },
      {
        name: 'Size 5',
        prefix: 'size5',
        body: 'size=5]$0[/size]',
      },
      {
        name: 'Size 6',
        prefix: 'size6',
        body: 'size=6]$0[/size]',
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
  },
  {
    name: 'image',
    label: 'img',
    attribute: {
      required: true,
      snippet: '${1:width},${2:height}',
      validator: (attr) => (/^\d+,\d+/.exec(attr) !== null),
    },
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'italic',
    label: 'i',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'list',
    label: 'list',
    attribute: {
      required: false,
      snippet: '1',
      validator: (attr) => attr === '1',
    },
    selfClosing: false,
    layout: 'block',
    snippets: [
      {
        name: 'Ordered List',
        prefix: 'orderedlist',
        body: 'list=1]\n[*]$0\n[/list]',
      },
      {
        name: 'Bullet List',
        prefix: 'bulletlist',
        body: 'list]\n[*]$0\n[/list]',
      },
    ],
  },
  {
    name: 'listItem',
    label: '*',
    selfClosing: true,
    layout: 'block',
  },
  {
    name: 'quoteBlock',
    label: 'quote',
    selfClosing: false,
    layout: 'block',
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
  },
  {
    name: 'strikethrough',
    label: 's',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'superscript',
    label: 'sup',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'subscript',
    label: 'sub',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'table',
    label: 'table',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'tableRow',
    label: 'tr',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'tableData',
    label: 'td',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'underline',
    label: 'u',
    selfClosing: false,
    layout: 'inline',
  },
  {
    name: 'userMention',
    label: '@',
    selfClosing: false,
    layout: 'inline',
  },
]
