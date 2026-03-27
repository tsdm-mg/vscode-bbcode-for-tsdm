import { BBCodeTagBase } from './tag'

export class TableTag extends BBCodeTagBase {
  readonly name = 'table'
}

export class TableRowTag extends BBCodeTagBase {
  readonly name = 'tr'
}

export class TableDataTag extends BBCodeTagBase {
  readonly name = 'td'
}
