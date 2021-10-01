import * as parsec from 'typescript-parsec'

import * as Ast from './Ast'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

export const applyNumber = (token: Token): Ast.NumberExpr => ({
  kind: 'NumberExpr',
  value: +token.text,
})

export const applyBoolean = (token: Token): Ast.BooleanExpr => ({
  kind: 'BooleanExpr',
  value: { true: true, false: false }[String(token.text)],
})

export const applyString = (value: string): Ast.StringExpr => ({
  kind: 'StringExpr',
  value: value,
})

export const applyIdentity = (
  source: [Token, [Ast.NumberExpr, string] | undefined]
): Ast.IdentityExpr => {
  const [letter, tail] = source
  let name = letter.text
  if (tail) {
    const [digit, str] = tail
    if (digit) {
      name += digit.value
    }
    if (str) {
      name += str
    }
  }
  return {
    kind: 'IdentityExpr',
    name,
  }
}

export const applyProp = (
  source: [Ast.IdentityExpr, Ast.PropExpr['value']]
): Ast.PropExpr => {
  const [name, token] = source
  return {
    kind: 'PropExpr',
    key: name,
    value: token,
  }
}

export const applyObject = (
  source: [Ast.IdentityExpr, Token, Ast.JsxExpr, Token][]
): Ast.ObjectExpr => {
  return {
    kind: 'ObjectExpr',
    props: source.reduce((acc, cur) => ({ ...acc, [cur[0].name]: cur[2] }), {}),
  }
}

export const applyArray = (items: Ast.ObjectExpr[]): Ast.ArrayExpr => {
  return {
    kind: 'ArrayExpr',
    items,
  }
}

export const applyOpeningTag = (
  source: [Ast.IdentityExpr, Ast.PropExpr[]]
): Ast.OpeningTagExpr => {
  const [name, value] = source
  return {
    kind: 'OpeningTagExpr',
    tagName: name,
    props: value,
  }
}

export const applyClosingTag = (
  source: Ast.IdentityExpr
): Ast.ClosingTagExpr => {
  return {
    kind: 'ClosingTagExpr',
    tagName: source,
  }
}

export const applyJsxSelfClosing = (
  source: [Ast.IdentityExpr, Ast.PropExpr[]]
): Ast.JsxSelfClosingExpr => {
  const [name, value] = source
  return {
    kind: 'JsxSelfClosingExpr',
    tagName: name,
    props: value,
  }
}

export const applyJsx = (
  source: [Ast.OpeningTagExpr, Ast.JsxExpr['body'], Ast.ClosingTagExpr]
): Ast.JsxExpr => {
  return {
    kind: 'JsxExpr',
    openingTag: source[0],
    body: source[1],
    closingTag: source[2],
  }
}

export const applyProgram = (value: Ast.JsxExpr[]): Ast.Program => {
  return {
    kind: 'Program',
    body: value,
  }
}
