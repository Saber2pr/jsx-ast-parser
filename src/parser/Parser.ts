/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-05 14:32:14
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
  Parser,
  rep_sc,
  rule,
  seq,
  str,
  tok,
} from 'typescript-parsec'

import * as Ast from './Ast'
import * as Consumer from './Consumer'
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
export const BLOCK = rule<TokenKind, Ast.BlockExpr>()
export const ARROWFUNCTION = rule<TokenKind, Ast.ArrowFunctionExpr>()
export const FUNCTION = rule<TokenKind, Ast.FunctionExpr>()
export const CALLCHAIN = rule<TokenKind, Ast.CallChainExpr>()
export const VARIABLEASSIGN = rule<TokenKind, Ast.VariableAssignExpr>()

// Statement
export const DECLAREVARIABLE = rule<TokenKind, Ast.DefineVariableStatement>()
export const IFSTATEMENT = rule<TokenKind, Ast.IfStatement>()

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
PARAMETER
  = ( commaSep IDENTITY )
*/
export const PARAMETER: Parser<
  TokenKind,
  (Ast.IdentityExpr | Ast.Expression)[] | undefined
> = kmid(
  str('('),
  opt(list_sc(alt(IDENTITY, EXPRESSION), str(','))),
  seq(opt(str(',')), str(')'))
)

/*
STATEMENT
  = DECLAREVARIABLE <|> VARIABLEASSIGN <|> CALLCHAIN ;
*/
export const STATEMENT = alt(
  DECLAREVARIABLE,
  VARIABLEASSIGN,
  CALLCHAIN,
  IFSTATEMENT
)

/*
NUMBER
  = digit
*/
NUMBER.setPattern(apply(tok(TokenKind.Digit), Consumer.applyNumber))

/*
TEXT
  = many $ letter <|> digit
*/
TEXT.setPattern(
  apply(
    rep_sc(alt(tok(TokenKind.Letter), tok(TokenKind.Digit))),
    Consumer.applyText
  )
)

/*
STRING
  = "TEXT"
  = 'TEXT'
*/
STRING.setPattern(
  apply(
    alt(kmid(str('"'), TEXT, str('"')), kmid(str("'"), TEXT, str("'"))),
    Consumer.applyString
  )
)

/*
KEYWORD
  = var
  = let
  = const
*/
KEYWORD.setPattern(
  apply(alt(str('var'), str('let'), str('const')), Consumer.applyKeyword)
)

/*
IDENTITY 
  = letter : many $ NUMBER : TEXT
*/
IDENTITY.setPattern(
  apply(
    seq(tok(TokenKind.Letter), opt(seq(NUMBER, TEXT))),
    Consumer.applyIdentity
  )
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
    Consumer.applyObject
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
    Consumer.applyArray
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
    Consumer.applyProp
  )
)

/*
OPENTAG
  = <IDENTITY many PROP>
*/
OPENTAG.setPattern(
  apply(
    seq(kright(str('<'), IDENTITY), kleft(rep_sc(PROP), str('>'))),
    Consumer.applyOpeningTag
  )
)

/*
CLOSETAG
  = </IDENTITY>
*/
CLOSETAG.setPattern(
  apply(
    kmid(seq(str('<'), str('/')), IDENTITY, str('>')),
    Consumer.applyClosingTag
  )
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
    Consumer.applyJsxSelfClosing
  )
)

/*
JSXOPENED
  = OPENTAG (many $ JSX <|> TEXT) CLOSETAG
*/
JSXOPENED.setPattern(
  apply(seq(OPENTAG, rep_sc(alt(JSX, TEXT)), CLOSETAG), Consumer.applyJsx)
)

/*
ARROWFUNCTION
  = PARAMETER => BLOCK
*/
ARROWFUNCTION.setPattern(
  apply(
    seq(PARAMETER, kright(seq(str('='), str('>')), BLOCK)),
    Consumer.applyArrowFunction
  )
)

/*
FUNCTION
  = function PARAMETER BLOCK
  = function IDENTITY PARAMETER BLOCK
*/
FUNCTION.setPattern(
  apply(
    seq(kright(str('function'), opt(IDENTITY)), PARAMETER, BLOCK),
    Consumer.applyFunction
  )
)

/*
CALLCHAIN
  = dotSep IDENTITY PARAMETER
*/
CALLCHAIN.setPattern(
  apply(seq(list_sc(IDENTITY, str('.')), PARAMETER), Consumer.applyCallChain)
)

/*
VARIABLEASSIGN
  = IDENTITY = EXPRESSION
*/
VARIABLEASSIGN.setPattern(
  apply(
    seq(IDENTITY, kright(str('='), EXPRESSION)),
    Consumer.applyVariableAssign
  )
)

/*
BLOCK
  = { many STATEMENT }
*/
BLOCK.setPattern(
  apply(
    kmid(str('{'), rep_sc(kleft(STATEMENT, opt(str(';')))), str('}')),
    Consumer.applyBlock
  )
)

// Statement

/*
DECLAREVARIABLE
  = KEYWORD IDENTITY
  = KEYWORD VARIABLEASSIGN
*/
DECLAREVARIABLE.setPattern(
  apply(
    seq(KEYWORD, alt(VARIABLEASSIGN, IDENTITY)),
    Consumer.applyDefineVariable
  )
)

/*
IFSTATEMENT
  = if PARAMETER BLOCK
*/
IFSTATEMENT.setPattern(
  apply(seq(kright(str('if'), PARAMETER), BLOCK), Consumer.applyIf)
)

/*
PROGRAM
  = many $ EXPRESSION <|> STATEMENT
*/
PROGRAM.setPattern(
  apply(rep_sc(alt(EXPRESSION, STATEMENT)), Consumer.applyProgram)
)

// parse ast
export function parse(code: string) {
  return expectSingleResult(expectEOF(PROGRAM.parse(tokenizer.parse(code))))
}
