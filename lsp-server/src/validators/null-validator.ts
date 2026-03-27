import { DiagErr, DiagnosticError } from '../diagnostic-result'
import { BBCodeTagBase } from '../tags/tag'

/**
 * Ensure that attribute does not exist.
 * Only accept undefined attribute value.
 */
export function nullValidator(attr?: string): DiagnosticError[] {
  return attr === undefined ? [] : [DiagErr.attributeNotAllowed()]
}
