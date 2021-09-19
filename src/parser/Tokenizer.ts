import { buildLL1 } from '../utils/buildLL1'

export enum TokenKind {
  Identifier,

  StringLiteral,
  NumberLiteral,

  EQ,
  LT,
  GT,
  PLUS,
  MINUS,
  MUL,
  DIV,
  OR,

  Comment1,
  Comment2,
  Space,
}

const words = ['1234asd', 'asd', 'aa\n', 'a']

export const tokenizer = buildLL1(
  words,
  TokenKind
)([
  [true, /^[a-zA-Z_$][a-zA-Z0-9_$]*/g, TokenKind.Identifier],

  [true, /^".*?"/g, TokenKind.StringLiteral],
  [true, /^[\+\-]?\d+(\.\d+)?/g, TokenKind.NumberLiteral],

  [true, /^\=/g, TokenKind.EQ],
  [true, /^\</g, TokenKind.LT],
  [true, /^\>/g, TokenKind.GT],
  [true, /^\+/g, TokenKind.PLUS],
  [true, /^\-/g, TokenKind.MINUS],
  [true, /^\*/g, TokenKind.MUL],
  [true, /^\//g, TokenKind.DIV],
  [true, /^\|/g, TokenKind.OR],

  [false, /^[/][/][^\n]*\n/g, TokenKind.Comment1],
  [false, /^[/]\*([^*]|\*+[^/])*\*+[/]/g, TokenKind.Comment2],
  [false, /^\s+/g, TokenKind.Space],
])
