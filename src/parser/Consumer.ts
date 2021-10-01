import * as parsec from 'typescript-parsec'

import * as Ast from './Ast'
import * as Factory from './Factory'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

export const applyTokenText = (token: Token): string => token.text

export const applyNumber = (token: Token): Ast.NumberExpr => ({
  kind: 'NumberExpr',
  value: +token.text,
})

export const applyBoolean = (token: Token): Ast.BooleanExpr => ({
  kind: 'BooleanExpr',
  value: { true: true, false: false }[String(token.text)],
})

export const applyName = (
  source: [Token, [string, string] | undefined]
): Ast.NameExpr => {
  const [letter, tail = []] = source
  return {
    kind: 'NameExpr',
    name: letter.text + tail.join(''),
  }
}

export const applyProp = (
  source: [
    Ast.NameExpr,
    Token[] | Ast.ObjectExpr | Ast.ArrayExpr | Ast.NumberExpr | Ast.BooleanExpr
  ]
): Ast.PropExpr => {
  const [name, tokens] = source
  let value: Ast.PropExpr['value']

  if (Array.isArray(tokens)) {
    value = tokens.reduce((acc, token) => (token ? token.text + acc : acc), '')
  } else if (Factory.isObjectExpr(tokens)) {
    value = tokens
  } else if (Factory.isArrayExpr(tokens)) {
    value = tokens
  } else if (Factory.isNumberExpr(tokens)) {
    value = tokens.value
  } else if (Factory.isBooleanExpr(tokens)) {
    value = tokens.value
  }

  return {
    kind: 'PropExpr',
    key: name,
    value,
  }
}

export const applyObject = (
  source: [Ast.NameExpr, Token, Ast.JsxExpr, Token][]
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
  source: [Ast.NameExpr, Ast.PropExpr[]]
): Ast.OpeningTagExpr => {
  const [name, value] = source
  return {
    kind: 'OpeningTagExpr',
    tagName: name,
    props: value,
  }
}

export const applyClosingTag = (source: Ast.NameExpr): Ast.ClosingTagExpr => {
  return {
    kind: 'ClosingTagExpr',
    tagName: source,
  }
}

export const applyJsxSelfClosing = (
  source: [Ast.NameExpr, Ast.PropExpr[]]
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
