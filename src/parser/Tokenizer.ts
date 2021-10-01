import { buildLexer } from 'typescript-parsec'

export enum TokenKind {
  Letter,
  Digit,
  Space,
  Chars,
}

export const RULES: [boolean, RegExp, TokenKind][] = [
  [true, /^[a-zA-Z_$]+/g, TokenKind.Letter],
  [true, /^[0-9]+/g, TokenKind.Digit],
  [false, /^\s+/g, TokenKind.Space],
  [true, /^[<=">/{}\[\]:,']/g, TokenKind.Chars],
]

export const tokenizer = buildLexer(RULES)
