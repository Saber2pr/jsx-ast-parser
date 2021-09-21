import * as parsec from 'typescript-parsec'

import * as Ast from './Ast'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

export const applyName = (source: [Token, Token | undefined]): Ast.NameExpr => {
  return {
    kind: 'NameExpr',
    name: source.reduce((acc, token) => (token ? token.text + acc : acc), ''),
  }
}

export const applyProp = (source: [Ast.NameExpr, Token]): Ast.PropExpr => {
  const [name, value] = source
  return {
    kind: 'PropExpr',
    key: name,
    value: value.text,
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

export const applyJsx = (
  value: [Ast.OpeningTagExpr, Ast.JsxExpr['body'], Ast.ClosingTagExpr]
): Ast.JsxExpr => {
  return {
    kind: 'JsxExpr',
    openingTag: value[0],
    body: value[1],
    closingTag: value[2],
  }
}

export const applyProgram = (value: Ast.JsxExpr[]): Ast.Program => {
  return {
    kind: 'Program',
    body: value,
  }
}
