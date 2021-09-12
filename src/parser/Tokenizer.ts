import { buildLexer } from 'typescript-parsec'

export enum TokenKind {
  Identifier,
  Value,
  Space,
  TagLeft,
  TagRight,
  CloseTagSlash,
  Eq,
  Quote,
}

export const tokenizer = buildLexer([
  [true, /^[a-zA-Z_][a-zA-Z0-9_]*/g, TokenKind.Identifier],
  [true, /^[a-zA-Z0-9]*/g, TokenKind.Value],

  [true, /^</g, TokenKind.TagLeft],
  [true, /^>/g, TokenKind.TagRight],
  [true, /^\//g, TokenKind.CloseTagSlash],

  [true, /^=/g, TokenKind.Eq],
  [true, /^"/g, TokenKind.Quote],

  [false, /^\s+/g, TokenKind.Space],
])
