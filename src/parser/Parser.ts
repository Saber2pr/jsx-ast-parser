import {
  alt,
  apply,
  expectEOF,
  expectSingleResult,
  kleft,
  kmid,
  kright,
  rep_sc,
  rule,
  seq,
  tok,
} from 'typescript-parsec'

import * as ast from './Ast'
import {
  applyClosingTag,
  applyJsx,
  applyOpeningTag,
  applyProgram,
  applyProp,
  applyValue,
  Token,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Base Spec
export const IDENTIFIER = rule<TokenKind, Token>()
export const VALUE = rule<TokenKind, ast.ValueExp>()

// Jsx Spec
export const PROP = rule<TokenKind, ast.PropExp>()
export const OPEN_TAG = rule<TokenKind, ast.OpeningTag>()
export const CLOSE_TAG = rule<TokenKind, ast.ClosingTag>()
export const JSX = rule<TokenKind, ast.JsxExp>()

// Program
export const PROGRAM = rule<TokenKind, ast.Program>()

IDENTIFIER.setPattern(tok(TokenKind.Identifier))
VALUE.setPattern(apply(tok(TokenKind.Value), applyValue))

PROP.setPattern(
  apply(
    seq(
      kleft(tok(TokenKind.Identifier), tok(TokenKind.Eq)),
      kmid(tok(TokenKind.Quote), VALUE, tok(TokenKind.Quote))
    ),
    applyProp
  )
)

OPEN_TAG.setPattern(
  apply(
    seq(
      kright(tok(TokenKind.TagLeft), tok(TokenKind.Identifier)),
      kleft(rep_sc(PROP), tok(TokenKind.TagRight))
    ),
    applyOpeningTag
  )
)

CLOSE_TAG.setPattern(
  apply(
    kmid(
      seq(tok(TokenKind.TagLeft), tok(TokenKind.CloseTagSlash)),
      tok(TokenKind.Identifier),
      tok(TokenKind.TagRight)
    ),
    applyClosingTag
  )
)

JSX.setPattern(
  apply(seq(OPEN_TAG, alt(rep_sc(JSX), VALUE), CLOSE_TAG), applyJsx)
)

PROGRAM.setPattern(apply(rep_sc(JSX), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
