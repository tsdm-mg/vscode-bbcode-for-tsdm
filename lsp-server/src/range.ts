/**
 * Range in the BBCode document.
 *
 * The range is inclusive on start and exclusive on end: `[start, end)`.
 */
export interface DocRange {
  start: number
  end: number
}

export function rangeContainsOffset(range: DocRange, offset: number): boolean {
  return range.start <= offset && offset < range.end
}
