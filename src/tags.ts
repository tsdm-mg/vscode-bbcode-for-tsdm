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
    label: 'li',
    attribute: {
      required: false,
      snippet: '1',
      validator: (attr) => attr === '1',
    },
    selfClosing: false,
    layout: 'block',
  },
  {
    name: 'listItem',
    label: '*',
    selfClosing: false,
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
