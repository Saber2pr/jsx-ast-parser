import {
  alt,
  apply,
  expectEOF,
  expectSingleResult,
  kleft,
  kmid,
  kright,
  opt,
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
  applyName,
  applyOpeningTag,
  applyProgram,
  applyProp,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Jsx Spec
export const NAME = rule<TokenKind, ast.NameExpr>()
export const PROP = rule<TokenKind, ast.PropExpr>()
export const OPENTAG = rule<TokenKind, ast.OpeningTagExpr>()
export const CLOSETAG = rule<TokenKind, ast.ClosingTagExpr>()
export const JSX = rule<TokenKind, ast.JsxExpr>()

// Program
export const PROGRAM = rule<TokenKind, ast.Program>()

/*
NAME = 
  letter : many $ letter <|> digit
*/
NAME.setPattern(
  apply(seq(tok(TokenKind.Letter), opt(tok(TokenKind.Digit))), applyName)
)

/*
PROP 
  = NAME="letter <|> digit"
*/
PROP.setPattern(
  apply(
    seq(
      kleft(NAME, str('=')),
      kmid(str('"'), alt(tok(TokenKind.Letter), tok(TokenKind.Digit)), str('"'))
    ),
    applyProp
  )
)

/*
OPENTAG
  = <NAME (many PROP)>
*/
OPENTAG.setPattern(
  apply(
    seq(kright(str('<'), NAME), kleft(rep_sc(PROP), str('>'))),
    applyOpeningTag
  )
)

/*
CLOSETAG
  = </NAME>
*/
CLOSETAG.setPattern(
  apply(kmid(seq(str('<'), str('/')), NAME, str('>')), applyClosingTag)
)

/*
JSX
  = OPENTAG (many $ JSX <|> letter <|> digit) CLOSETAG
*/
JSX.setPattern(
  apply(
    seq(
      OPENTAG,
      rep_sc(
        alt(
          JSX,
          alt(
            apply(tok(TokenKind.Letter), token => token.text),
            apply(tok(TokenKind.Digit), token => +token.text)
          )
        )
      ),
      CLOSETAG
    ),
    applyJsx
  )
)

/*
PROGRAM
  = many JSX
*/
PROGRAM.setPattern(apply(rep_sc(JSX), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
