/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:39
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:14:05
 */
import { buildLexer } from 'typescript-parsec'

export enum TokenKind {
  Letter,
  Digit,
  Space,
  Chars,
  Comment1,
  Comment2,
}

export const TokenRules: [boolean, RegExp, TokenKind][] = [
  [true, /^[a-zA-Z_$]+/g, TokenKind.Letter],
  [true, /^[0-9]+/g, TokenKind.Digit],
  [true, /^[<=">/{}\[\]:,'\.();]/g, TokenKind.Chars],
  [false, /^\s+/g, TokenKind.Space],
  [false, /^[/][/][^\n]*\n/g, TokenKind.Comment1],
  [false, /^{?[/]\*([^*]|\*+[^/])*\*+[/]}?/g, TokenKind.Comment2],
]

export const tokenizer = buildLexer(TokenRules)
