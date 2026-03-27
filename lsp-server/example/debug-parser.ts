import { exit } from 'process'
import '../src/lexer'
import { Lexer } from '../src/lexer'
import { Parser } from '../src/parser'
import { readFileSync } from 'fs'

function printHelp() {
  console.log('usage: ')
  console.log('    EXEC <path/to/bbcode.txt>')
  console.log('    EXEC <path/to/bbcode.txt> -l    Only do lexing')
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    printHelp()
    exit(1)
  }

  const filePath = args.at(0)!
  const code = readFileSync(filePath).toString()

  const lexer = new Lexer(code)
  lexer.scanAll()
  const tokens = lexer.tokens()

  if (args.some((arg) => arg == '-l')) {
    console.log('(only lexing...)')
    console.log(tokens)
    exit(0)
  }

  const parser = new Parser(tokens)
  parser.parse()
  const ast = parser.ast()
  console.log(ast)
}

main()
