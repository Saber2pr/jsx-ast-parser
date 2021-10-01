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
  applyArray,
  applyClosingTag,
  applyJsx,
  applyJsxSelfClosing,
  applyName,
  applyObject,
  applyOpeningTag,
  applyProgram,
  applyProp,
  applyTokenText,
  applyNumber,
  applyBoolean,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

export const NAME = rule<TokenKind, ast.NameExpr>()
export const NUMBER = rule<TokenKind, ast.NumberExpr>()
export const BOOLEAN = rule<TokenKind, ast.BooleanExpr>()
export const PROP = rule<TokenKind, ast.PropExpr>()
export const OBJ = rule<TokenKind, ast.ObjectExpr>()
export const ARRAY = rule<TokenKind, ast.ArrayExpr>()

// Jsx Spec
export const OPENTAG = rule<TokenKind, ast.OpeningTagExpr>()
export const CLOSETAG = rule<TokenKind, ast.ClosingTagExpr>()
export const JSXSELFCLOSE = rule<TokenKind, ast.JsxSelfClosingExpr>()
export const JSXOPENED = rule<TokenKind, ast.JsxExpr>()

// Program
export const PROGRAM = rule<TokenKind, ast.Program>()

/*
JSX
  = JSXOPENED <|> JSXSELFCLOSE
*/
const JSX = alt(JSXOPENED, JSXSELFCLOSE)

/*
NUMBER
  = digit
*/
NUMBER.setPattern(apply(tok(TokenKind.Digit), applyNumber))

/*
BOOLEAN
  = True <|> False
*/
BOOLEAN.setPattern(apply(alt(str('true'), str('false')), applyBoolean))

/*
VALUE
  = many $ letter <|> digit
*/
const VALUE = apply(
  rep_sc(alt(tok(TokenKind.Letter), tok(TokenKind.Digit))),
  tokens => tokens.map(token => token.text).join('')
)

/*
NAME 
  = letter : VALUE
*/
NAME.setPattern(
  apply(
    seq(
      tok(TokenKind.Letter),
      opt(seq(apply(tok(TokenKind.Digit), applyTokenText), VALUE))
    ),
    applyName
  )
)

/*
OBJ 
  = { many $ NAME : JSX }
*/
OBJ.setPattern(
  apply(
    kmid(str('{'), rep_sc(seq(NAME, str(':'), JSX, opt(str(',')))), str('}')),
    applyObject
  )
)

/*
ARRAY
  = [ many OBJ ]
*/
ARRAY.setPattern(
  apply(kmid(str('['), rep_sc(kleft(OBJ, opt(str(',')))), str(']')), applyArray)
)

/*
PROP 
  = NAME="letter <|> digit"
  = NAME={ OBJ <|> Array }
*/
PROP.setPattern(
  apply(
    seq(
      kleft(NAME, str('=')),
      alt(
        // NAME="letter <|> digit"
        kmid(
          str('"'),
          rep_sc(alt(tok(TokenKind.Letter), tok(TokenKind.Digit))),
          str('"')
        ),
        // NAME={ OBJ <|> Array }
        kmid(str('{'), alt(OBJ, ARRAY), str('}')),
        // NAME={digit <|> True | False}
        kmid(str('{'), alt(NUMBER, BOOLEAN), str('}'))
      )
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
JSXSELFCLOSE
  = <NAME (many PROP) />
*/
JSXSELFCLOSE.setPattern(
  apply(
    seq(kright(str('<'), NAME), kleft(rep_sc(PROP), seq(str('/'), str('>')))),
    applyJsxSelfClosing
  )
)

/*
JSXOPENED
  = OPENTAG (many $ JSXOPENED <|> JSXSELFCLOSE <|> VALUE) CLOSETAG
  = SELFCLOSETAG
*/
JSXOPENED.setPattern(
  apply(
    seq(OPENTAG, rep_sc(alt(alt(JSXOPENED, JSXSELFCLOSE), VALUE)), CLOSETAG),
    applyJsx
  )
)

/*
PROGRAM
  = many $ JSX <|> JSXSELFCLOSE
*/
PROGRAM.setPattern(apply(rep_sc(JSX), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
