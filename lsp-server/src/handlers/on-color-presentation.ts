import { Color, ColorPresentation } from 'vscode-languageserver'

const toHex = (n: number) => n.toString(16).padStart(2, '0')

export function onColorPresentation(color: Color): ColorPresentation {
  const r = Math.round(color.red * 255)
  const g = Math.round(color.green * 255)
  const b = Math.round(color.blue * 255)

  return ColorPresentation.create('#' + toHex(r) + toHex(g) + toHex(b))
}
