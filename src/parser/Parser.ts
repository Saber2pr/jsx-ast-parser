/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 12:52:35
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
  applyFunction,
  applyDefineVariable,
  applyKeyword,
  applyVariableAssign,
} from './Consumer'
import { tokenizer, TokenKind } from './Tokenizer'

// Primary
export const KEYWORD = rule<TokenKind, Ast.KeywordExpr>()
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

// Expression
export const ARROWFUNCTION = rule<TokenKind, Ast.ArrowFunctionExpr>()
export const FUNCTION = rule<TokenKind, Ast.FunctionExpr>()
export const CALLCHAIN = rule<TokenKind, Ast.CallChainExpr>()
export const VARIABLEASSIGN = rule<TokenKind, Ast.VariableAssignExpr>()

// Statement
export const DECLAREVARIABLE = rule<TokenKind, Ast.DefineVariableStatement>()

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
  OBJ,
  ARRAY,
  ARROWFUNCTION,
  CALLCHAIN,
  FUNCTION
)

/*
STATEMENT
  = DECLAREVARIABLE <|> VARIABLEASSIGN <|> CALLCHAIN ;
*/
export const STATEMENT = alt(DECLAREVARIABLE, VARIABLEASSIGN, CALLCHAIN)

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
KEYWORD
  = var
  = let
  = const
*/
KEYWORD.setPattern(
  apply(alt(str('var'), str('let'), str('const')), applyKeyword)
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
      opt(
        list_sc(seq(IDENTITY, str(':'), alt(EXPRESSION, IDENTITY)), str(','))
      ),
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
      opt(list_sc(alt(EXPRESSION, IDENTITY), str(','))),
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
        alt(STRING, kmid(str('{'), alt(EXPRESSION, IDENTITY), str('}')))
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
  = (commaSep IDENTITY) => { many STATEMENT }
*/
ARROWFUNCTION.setPattern(
  apply(
    seq(
      kmid(
        str('('),
        opt(list_sc(IDENTITY, str(','))),
        seq(opt(str(',')), str(')'))
      ),
      kleft(
        kright(
          seq(str('='), str('>')),
          kmid(
            str('{'),
            alt(rep_sc(STATEMENT), list_sc(STATEMENT, str(';'))),
            seq(opt(str(';')), str('}'))
          )
        ),
        opt(str(';'))
      )
    ),
    applyArrowFunction
  )
)

/*
FUNCTION
  = function IDENTITY (commaSep IDENTITY) { many EXPRESSION }
*/
FUNCTION.setPattern(
  apply(
    seq(
      kright(str('function'), opt(IDENTITY)),
      kmid(
        str('('),
        opt(list_sc(IDENTITY, str(','))),
        seq(opt(str(',')), str(')'))
      ),
      kmid(str('{'), rep_sc(STATEMENT), str('}'))
    ),
    applyFunction
  )
)

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
VARIABLEASSIGN
  = IDENTITY = EXPRESSION
*/
VARIABLEASSIGN.setPattern(
  apply(seq(IDENTITY, kright(str('='), EXPRESSION)), applyVariableAssign)
)

// Statement

/*
DECLAREVARIABLE
  = IDENTITY IDENTITY
  = IDENTITY IDENTITY = EXPRESSION
*/
DECLAREVARIABLE.setPattern(
  apply(seq(KEYWORD, alt(VARIABLEASSIGN, IDENTITY)), applyDefineVariable)
)

/*
PROGRAM
  = many EXPRESSION <|> STATEMENT
*/
PROGRAM.setPattern(apply(rep_sc(alt(EXPRESSION, STATEMENT)), applyProgram))

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
