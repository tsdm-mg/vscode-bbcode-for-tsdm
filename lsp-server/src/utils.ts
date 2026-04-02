import { Color } from 'vscode-languageserver'

const toHex = (n: number) => n.toString(16).padStart(2, '0')

const urlSchemaRegex = /^(?<name>[\w-_.]+):\/\//

export function hexToColor(hex: string): Color | undefined {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (match) {
    return {
      red: Number.parseInt(match[1], 16) / 255,
      green: Number.parseInt(match[2], 16) / 255,
      blue: Number.parseInt(match[3], 16) / 255,
      alpha: 1,
    }
  }

  const shortMatch = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex)
  if (shortMatch) {
    return {
      red: Number.parseInt(shortMatch[1] + shortMatch[1], 16) / 255,
      green: Number.parseInt(shortMatch[2] + shortMatch[2], 16) / 255,
      blue: Number.parseInt(shortMatch[3] + shortMatch[3], 16) / 255,
      alpha: 1,
    }
  }

  return
}

export function colorToHex(color: Color): string {
  const r = Math.round(color.red * 255)
  const g = Math.round(color.green * 255)
  const b = Math.round(color.blue * 255)

  return '#' + toHex(r) + toHex(g) + toHex(b)
}

/**
 * Try extract the schema part (before `://`) from url.
 *
 * e.g. for `https://google.com` returns `https`.
 *
 * If the input string is not an valid url or no schema exists, return `undefined`.
 */
export function extractUrlSchema(s: string): string | undefined {
  return urlSchemaRegex.exec(s)?.groups?.name
}
