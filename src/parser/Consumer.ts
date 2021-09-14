import * as parsec from 'typescript-parsec'

import * as Ast from './Ast'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

export const applyNumber = (value: Token): Ast.NumberVal => {
  return {
    kind: 'NumberVal',
    value: +value.text,
  }
}

export const applyString = (value: Token): Ast.StringVal => {
  return {
    kind: 'StringVal',
    value: value.text.replace(/^"|"$/g, ''),
  }
}

export const applyProp = (
  value: [Token /* Identifier */, Ast.StringVal]
): Ast.PropExpr => {
  return {
    kind: 'PropExpr',
    key: value[0].text,
    value: value[1].value,
  }
}

export const applyOpeningTag = (
  value: [Token /* Identifier */, Ast.PropExpr[]]
): Ast.OpeningTagExpr => {
  return {
    kind: 'OpeningTagExpr',
    tagName: value[0].text,
    props: value[1],
  }
}

export const applyClosingTag = (value: Token): Ast.ClosingTagExpr => {
  return {
    kind: 'ClosingTagExpr',
    tagName: value.text,
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
