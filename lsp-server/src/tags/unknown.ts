import { TagHead, TagTail } from '../token'
import { BBCodeComponent, BBCodeTagBase } from './tag'

/**
 * Unknown tag in AST.
 *
 * The name tag is unknown but the tag may be complete.
 *
 */
export class UnknownTag extends BBCodeTagBase {
  constructor(head: TagHead | TagTail, children?: BBCodeComponent[]) {
    super(head, children)
    this.name = head.name
  }

  readonly name: string
}
