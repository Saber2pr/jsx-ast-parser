import { buildLL1 } from '../utils/buildLL1'

export enum TokenKind {
  Letter,
  Digit,
  Space,
  Chars,
}

const words = [
  'abc',
  '1234',
  'ab12',
  '12ab',
  ' ',
  '<',
  '=',
  '"',
  '>',
  '/',
  '{',
  '}',
  '[',
  ']',
  ':',
  ',',
  "'",
]

export const tokenizer = buildLL1(
  words,
  TokenKind
)([
  [true, /^[a-zA-Z_$]+/g, TokenKind.Letter],
  [true, /^[0-9]+/g, TokenKind.Digit],
  [false, /^\s+/g, TokenKind.Space],
  [true, /^[<=">/{}\[\]:,']/g, TokenKind.Chars],
])
