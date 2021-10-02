/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:39
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 12:09:48
 */
import { buildLexer } from 'typescript-parsec'

export enum TokenKind {
  Letter,
  Digit,
  Space,
  Chars,
}

export const TokenRules: [boolean, RegExp, TokenKind][] = [
  [true, /^[a-zA-Z_$]+/g, TokenKind.Letter],
  [true, /^[0-9]+/g, TokenKind.Digit],
  [false, /^\s+/g, TokenKind.Space],
  [true, /^[<=">/{}\[\]:,']/g, TokenKind.Chars],
]

export const tokenizer = buildLexer(TokenRules)
