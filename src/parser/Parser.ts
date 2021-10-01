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
  applyText,
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
export const TEXT = rule<TokenKind, ast.TextExpr>()

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
TEXT
  = many $ letter <|> digit
*/
TEXT.setPattern(
  apply(rep_sc(alt(tok(TokenKind.Letter), tok(TokenKind.Digit))), applyText)
)

/*
STRING
  = "TEXT"
  = 'TEXT'
*/
STRING.setPattern(
  apply(
    alt(kmid(str('"'), TEXT, str('"')), kmid(str("'"), TEXT, str("'"))),
    applyString
  )
)

/*
IDENTITY 
  = letter : many $ NUMBER : TEXT
*/
IDENTITY.setPattern(
  apply(seq(tok(TokenKind.Letter), opt(seq(NUMBER, TEXT))), applyIdentity)
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
  = IDENTITY={JSX <|> OBJ <|> Array <|> NUMBER <|> BOOLEAN <|> STRING}
*/
PROP.setPattern(
  apply(
    seq(
      kleft(IDENTITY, str('=')),
      alt(
        STRING,
        kmid(str('{'), alt(JSX, OBJ, ARRAY, NUMBER, BOOLEAN, STRING), str('}'))
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
  = OPENTAG (many $ JSX <|> TEXT) CLOSETAG
  = SELFCLOSETAG
*/
JSXOPENED.setPattern(
  apply(seq(OPENTAG, rep_sc(alt(JSX, TEXT)), CLOSETAG), applyJsx)
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
