/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 09:50:32
 */
import {
  alt,
  apply,
  expectEOF,
  expectSingleResult,
  kleft,
  kmid,
  kright,
  list_sc,
  nil,
  opt,
  rep_sc,
  rule,
  seq,
  str,
  tok,
} from 'typescript-parsec'

import * as Ast from './Ast'
import {
  applyArray,
  applyArrowFunction,
  applyCallChain,
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

// Statement
export const ARROWFUNCTION = rule<TokenKind, Ast.ArrowFunctionExpr>()
export const FUNCTION = rule<TokenKind, Ast.FunctionExpr>()
export const CALLCHAIN = rule<TokenKind, Ast.CallChainExpr>()

// Program
export const PROGRAM = rule<TokenKind, Ast.Program>()

/*
JSX
  = JSXOPENED <|> JSXSELFCLOSE
*/
export const JSX = alt(JSXOPENED, JSXSELFCLOSE)

/*
EXPRESSION
  = JSX <|> STRING <|> NUMBER <|> IDENTITY <|> OBJ <|> ARRAY | <|> ARROWFUNCTION <|> CALLCHAIN
*/
export const EXPRESSION = alt(
  JSX,
  STRING,
  NUMBER,
  IDENTITY,
  OBJ,
  ARRAY,
  ARROWFUNCTION,
  CALLCHAIN
)

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
  = { commanSep $ IDENTITY : EXPRESSION}
*/
OBJ.setPattern(
  apply(
    kmid(
      str('{'),
      opt(list_sc(seq(IDENTITY, str(':'), EXPRESSION), str(','))),
      seq(opt(str(',')), str('}'))
    ),
    applyObject
  )
)

/*
ARRAY
  = [ commaSep EXPRESSION ]
*/
ARRAY.setPattern(
  apply(
    kmid(
      str('['),
      opt(list_sc(EXPRESSION, str(','))),
      seq(opt(str(',')), str(']'))
    ),
    applyArray
  )
)

/*
PROP 
  = IDENTITY
  = IDENTITY={EXPRESSION}
*/
PROP.setPattern(
  apply(
    alt(
      seq(
        kleft(IDENTITY, str('=')),
        alt(STRING, kmid(str('{'), EXPRESSION, str('}')))
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
ARROWFUNCTION
  = (commaSep IDENTITY) => { many EXPRESSION }
*/
ARROWFUNCTION.setPattern(
  apply(
    seq(
      kmid(str('('), list_sc(IDENTITY, str(',')), seq(opt(str(',')), str(')'))),
      kleft(
        kright(
          seq(str('='), str('>')),
          kmid(str('{'), rep_sc(EXPRESSION), str('}'))
        ),
        opt(str(';'))
      )
    ),
    applyArrowFunction
  )
)

/*
FUNCTION
  = function IDENTITY (commaSep IDENTITY) {  }
*/
FUNCTION

/*
CALLCHAIN
  = dotSep IDENTITY ( CALLCHAIN <|> commaSep IDENTITY )
  = dotSep IDENTITY (  )
*/
CALLCHAIN.setPattern(
  apply(
    kleft(
      seq(
        list_sc(IDENTITY, str('.')),
        kmid(
          str('('),
          opt(alt(list_sc(IDENTITY, str(',')), CALLCHAIN)),
          seq(opt(str(',')), str(')'))
        )
      ),
      opt(str(';'))
    ),
    applyCallChain
  )
)

/*
PROGRAM
  = many EXPRESSION
*/
PROGRAM.setPattern(apply(rep_sc(EXPRESSION), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
