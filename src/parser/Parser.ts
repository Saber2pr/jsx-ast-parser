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
  applyIdentity,
  applyObject,
  applyOpeningTag,
  applyProgram,
  applyProp,
  applyNumber,
  applyBoolean,
  applyString,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Primary

export const IDENTITY = rule<TokenKind, ast.IdentityExpr>()
export const NUMBER = rule<TokenKind, ast.NumberExpr>()
export const BOOLEAN = rule<TokenKind, ast.BooleanExpr>()
export const STRING = rule<TokenKind, ast.StringExpr>()
export const OBJ = rule<TokenKind, ast.ObjectExpr>()
export const ARRAY = rule<TokenKind, ast.ArrayExpr>()

// Jsx
export const PROP = rule<TokenKind, ast.PropExpr>()
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
__STRING__
  = many $ letter <|> digit
*/
const __STRING__ = apply(
  rep_sc(alt(tok(TokenKind.Letter), tok(TokenKind.Digit))),
  tokens => tokens.map(token => token.text).join('')
)

/*
STRING
  = "__STRING__"
  = '__STRING__'
*/
STRING.setPattern(
  apply(
    alt(
      kmid(str('"'), __STRING__, str('"')),
      kmid(str("'"), __STRING__, str("'"))
    ),
    applyString
  )
)

/*
IDENTITY 
  = letter : many $ NUMBER : __STRING__
*/
IDENTITY.setPattern(
  apply(seq(tok(TokenKind.Letter), opt(seq(NUMBER, __STRING__))), applyIdentity)
)

/*
OBJ 
  = { many $ IDENTITY : $ JSX <|> STRING <|> NUMBER <|> BOOLEAN <|> OBJ <|> ARRAY}
*/
OBJ.setPattern(
  apply(
    kmid(
      str('{'),
      rep_sc(
        seq(
          IDENTITY,
          str(':'),
          alt(JSX, STRING, NUMBER, BOOLEAN, OBJ, ARRAY),
          opt(str(','))
        )
      ),
      str('}')
    ),
    applyObject
  )
)

/*
ARRAY
  = [ many $ JSX <|> STRING <|> NUMBER <|> BOOLEAN <|> OBJ <|> ARRAY]
*/
ARRAY.setPattern(
  apply(
    kmid(
      str('['),
      rep_sc(
        kleft(alt(JSX, STRING, NUMBER, BOOLEAN, OBJ, ARRAY), opt(str(',')))
      ),
      str(']')
    ),
    applyArray
  )
)

/*
PROP 
  = IDENTITY=STRING
  = IDENTITY={ OBJ <|> Array <|> NUMBER <|> BOOLEAN <|> STRING}
*/
PROP.setPattern(
  apply(
    seq(
      kleft(IDENTITY, str('=')),
      alt(
        STRING,
        kmid(str('{'), alt(OBJ, ARRAY, NUMBER, BOOLEAN, STRING), str('}'))
      )
    ),
    applyProp
  )
)

/*
OPENTAG
  = <IDENTITY many PROP>
*/
OPENTAG.setPattern(
  apply(
    seq(kright(str('<'), IDENTITY), kleft(rep_sc(PROP), str('>'))),
    applyOpeningTag
  )
)

/*
CLOSETAG
  = </IDENTITY>
*/
CLOSETAG.setPattern(
  apply(kmid(seq(str('<'), str('/')), IDENTITY, str('>')), applyClosingTag)
)

/*
JSXSELFCLOSE
  = <IDENTITY many PROP />
*/
JSXSELFCLOSE.setPattern(
  apply(
    seq(
      kright(str('<'), IDENTITY),
      kleft(rep_sc(PROP), seq(str('/'), str('>')))
    ),
    applyJsxSelfClosing
  )
)

/*
JSXOPENED
  = OPENTAG (many $ JSXOPENED <|> JSXSELFCLOSE <|> __STRING__) CLOSETAG
  = SELFCLOSETAG
*/
JSXOPENED.setPattern(
  apply(
    seq(
      OPENTAG,
      rep_sc(alt(alt(JSXOPENED, JSXSELFCLOSE), __STRING__)),
      CLOSETAG
    ),
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
