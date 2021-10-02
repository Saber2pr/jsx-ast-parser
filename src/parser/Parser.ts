/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 17:35:48
 */
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
  nil,
} from 'typescript-parsec'

import * as Ast from './Ast'
import {
  applyArray,
  applyClosingTag,
  applyIdentity,
  applyJsx,
  applyJsxSelfClosing,
  applyNumber,
  applyObject,
  applyOpeningTag,
  applyProgram,
  applyProp,
  applyString,
  applyText,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Primary
export const IDENTITY = rule<TokenKind, Ast.IdentityExpr>()
export const NUMBER = rule<TokenKind, Ast.NumberExpr>()
export const STRING = rule<TokenKind, Ast.StringExpr>()
export const OBJ = rule<TokenKind, Ast.ObjectExpr>()
export const ARRAY = rule<TokenKind, Ast.ArrayExpr>()

// Jsx
export const PROP = rule<TokenKind, Ast.PropExpr>()
export const OPENTAG = rule<TokenKind, Ast.OpeningTagExpr>()
export const CLOSETAG = rule<TokenKind, Ast.ClosingTagExpr>()
export const JSXSELFCLOSE = rule<TokenKind, Ast.JsxSelfClosingExpr>()
export const JSXOPENED = rule<TokenKind, Ast.JsxExpr>()
export const TEXT = rule<TokenKind, Ast.TextExpr>()

// Program
export const PROGRAM = rule<TokenKind, Ast.Program>()

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
  = { many $ IDENTITY : $ JSX <|> STRING <|> NUMBER <|> IDENTITY <|> OBJ <|> ARRAY}
*/
OBJ.setPattern(
  apply(
    kmid(
      str('{'),
      rep_sc(
        seq(
          IDENTITY,
          str(':'),
          alt(JSX, STRING, NUMBER, IDENTITY, OBJ, ARRAY),
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
  = [ many $ JSX <|> STRING <|> NUMBER <|> IDENTITY <|> OBJ <|> ARRAY]
*/
ARRAY.setPattern(
  apply(
    kmid(
      str('['),
      rep_sc(
        kleft(alt(JSX, STRING, NUMBER, IDENTITY, OBJ, ARRAY), opt(str(',')))
      ),
      str(']')
    ),
    applyArray
  )
)

/*
PROP 
  = IDENTITY
  = IDENTITY={JSX <|> OBJ <|> Array <|> NUMBER <|> STRING <|> IDENTITY}
*/
PROP.setPattern(
  apply(
    alt(
      seq(
        kleft(IDENTITY, str('=')),
        alt(
          STRING,
          kmid(
            str('{'),
            alt(JSX, OBJ, ARRAY, NUMBER, STRING, IDENTITY),
            str('}')
          )
        )
      ),
      seq(IDENTITY, nil())
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
  = many JSX
*/
PROGRAM.setPattern(apply(rep_sc(JSX), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
