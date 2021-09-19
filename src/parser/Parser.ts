import {
  alt,
  apply,
  expectEOF,
  expectSingleResult,
  kleft,
  kmid,
  kright,
  list_sc,
  rep_sc,
  rule,
  seq,
  str,
  tok,
} from 'typescript-parsec'

import * as ast from './Ast'
import {
  applyClosingTag,
  applyJsx,
  applyOpeningTag,
  applyProgram,
  applyProp,
  applyNumber,
  applyString,
  applyIdentifier,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Basic Spec
export const IDENTIFIER = rule<TokenKind, ast.IdentifierVal>()
export const NUMBER = rule<TokenKind, ast.NumberVal>()
export const STRING = rule<TokenKind, ast.StringVal>()

// Jsx Spec
export const PROP = rule<TokenKind, ast.PropExpr>()
export const OPENTAG = rule<TokenKind, ast.OpeningTagExpr>()
export const CLOSETAG = rule<TokenKind, ast.ClosingTagExpr>()
export const JSX = rule<TokenKind, ast.JsxExpr>()

// Program
export const PROGRAM = rule<TokenKind, ast.Program>()

IDENTIFIER.setPattern(apply(tok(TokenKind.Identifier), applyIdentifier))

NUMBER.setPattern(apply(tok(TokenKind.NumberLiteral), applyNumber))
STRING.setPattern(apply(tok(TokenKind.StringLiteral), applyString))

PROP.setPattern(
  apply(
    seq(kleft(tok(TokenKind.Identifier), tok(TokenKind.EQ)), STRING),
    applyProp
  )
)

OPENTAG.setPattern(
  apply(
    seq(
      kright(tok(TokenKind.LT), tok(TokenKind.Identifier)),
      kleft(rep_sc(PROP), tok(TokenKind.GT))
    ),
    applyOpeningTag
  )
)

CLOSETAG.setPattern(
  apply(
    kmid(
      seq(tok(TokenKind.LT), tok(TokenKind.DIV)),
      tok(TokenKind.Identifier),
      tok(TokenKind.GT)
    ),
    applyClosingTag
  )
)

/*
JSX
  = OPENTAG (IDENTIFIER, NUMBER, NUMBER+IDENTIFIER, ) CLOSETAG
  = OPENTAG JSX CLOSETAG
*/
JSX.setPattern(
  apply(
    seq(
      OPENTAG,
      alt(
        IDENTIFIER,
        NUMBER,
        apply(
          seq(NUMBER, IDENTIFIER),
          ([num, id]): ast.IdentifierVal => ({
            kind: 'IdentifierVal',
            value: `${num.value}${id.value}`,
          })
        ),
       
        rep_sc(JSX)
      ),
      CLOSETAG
    ),
    applyJsx
  )
)

PROGRAM.setPattern(apply(rep_sc(JSX), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
