/**
 * Ensure that attribute does not exist.
 * Only accept undefined attribute value.
 */
export function nullValidator(attr?: string): boolean {
  return attr === undefined
}
