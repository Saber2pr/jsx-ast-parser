/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:27
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 12:48:31
 */
import * as parsec from 'typescript-parsec'

import * as Ast from './Ast'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

// basic

export function applyNumber(token: Token): Ast.NumberExpr {
  return {
    kind: 'NumberExpr',
    value: +token.text,
  }
}

export function applyString(text: Ast.TextExpr): Ast.StringExpr {
  return {
    kind: 'StringExpr',
    value: text.value,
  }
}

export function applyKeyword(token: Token): Ast.KeywordExpr {
  return {
    kind: 'KeywordExpr',
    name: token.text,
  }
}

export function applyIdentity(
  source: [Token, [Ast.NumberExpr, Ast.TextExpr] | undefined]
): Ast.IdentityExpr {
  const [letter, tail] = source
  let name = letter.text
  if (tail) {
    const [digit, text] = tail
    if (digit) {
      name += digit.value
    }
    if (text) {
      name += text.value
    }
  }
  return {
    kind: 'IdentityExpr',
    name,
  }
}

// Jsx

export function applyProp(
  source:
    | [Ast.IdentityExpr, Ast.PropExpr['value']]
    | [Ast.IdentityExpr, undefined]
): Ast.PropExpr {
  const [name, token] = source
  let value: Ast.Expression | Ast.IdentityExpr
  if (token) {
    value = token
  } else {
    value = {
      kind: 'IdentityExpr',
      name: 'true',
    } as Ast.IdentityExpr
  }
  return {
    kind: 'PropExpr',
    key: name,
    value,
  }
}

export function applyObject(
  source:
    | [Ast.IdentityExpr, Token, Ast.Expression | Ast.IdentityExpr][]
    | undefined = []
): Ast.ObjectExpr {
  return {
    kind: 'ObjectExpr',
    props: source.reduce((acc, cur) => ({ ...acc, [cur[0].name]: cur[2] }), {}),
  }
}

export function applyArray(
  items: (Ast.Expression | Ast.IdentityExpr)[] | undefined = []
): Ast.ArrayExpr {
  return {
    kind: 'ArrayExpr',
    items: items ?? [],
  }
}

export function applyOpeningTag(
  source: [Ast.IdentityExpr, Ast.PropExpr[]]
): Ast.OpeningTagExpr {
  const [name, value] = source
  return {
    kind: 'OpeningTagExpr',
    tagName: name,
    props: value,
  }
}

export function applyClosingTag(source: Ast.IdentityExpr): Ast.ClosingTagExpr {
  return {
    kind: 'ClosingTagExpr',
    tagName: source,
  }
}

export function applyJsxSelfClosing(
  source: [Ast.IdentityExpr, Ast.PropExpr[]]
): Ast.JsxSelfClosingExpr {
  const [name, value] = source
  return {
    kind: 'JsxSelfClosingExpr',
    tagName: name,
    props: value,
  }
}

export function applyText(source: Token[]): Ast.TextExpr {
  return {
    kind: 'TextExpr',
    value: source.map(token => token.text).join(''),
  }
}

export function applyJsx(
  source: [Ast.OpeningTagExpr, Ast.JsxExpr['body'], Ast.ClosingTagExpr]
): Ast.JsxExpr {
  return {
    kind: 'JsxExpr',
    openingTag: source[0],
    body: source[1],
    closingTag: source[2],
  }
}

// Statement

export function applyArrowFunction(
  source: [Ast.IdentityExpr[] | undefined, Ast.Statement[] | undefined]
): Ast.ArrowFunctionExpr {
  const [args = [], body = []] = source
  return {
    kind: 'ArrowFunctionExpr',
    args,
    body,
  }
}

export function applyFunction(
  source: [
    Ast.IdentityExpr | undefined,
    Ast.IdentityExpr[] | undefined,
    Ast.Statement[]
  ]
): Ast.FunctionExpr {
  const [name, args = [], body = []] = source
  return {
    kind: 'FunctionExpr',
    name,
    args,
    body,
  }
}

export function applyCallChain(
  source: [
    Ast.IdentityExpr[],
    Ast.IdentityExpr[] | undefined | Ast.CallChainExpr
  ]
): Ast.CallChainExpr {
  const [chain, args = []] = source
  return {
    kind: 'CallChainExpr',
    caller: chain[0],
    chain: chain.slice(1),
    args: args,
  }
}

export function applyVariableAssign(
  source: [Ast.IdentityExpr, Ast.Expression | undefined]
): Ast.VariableAssignExpr {
  const [name, value] = source
  return {
    kind: 'VariableAssignExpr',
    name,
    value,
  }
}

export function applyDefineVariable(
  source: [Ast.KeywordExpr, Ast.VariableAssignExpr | Ast.IdentityExpr]
): Ast.DefineVariableStatement {
  const [type, assign] = source
  return {
    kind: 'DefineVariableExpr',
    type,
    assign,
  }
}

export function applyProgram(value: Ast.Program['body']): Ast.Program {
  return {
    kind: 'Program',
    body: value,
  }
}
