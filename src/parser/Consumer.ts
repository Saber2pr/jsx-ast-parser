import * as parsec from 'typescript-parsec'

import {
  ClosingTag,
  JsxExp,
  OpeningTag,
  Program,
  PropExp,
  ValueExp,
} from './Ast'
import { TokenKind } from './Tokenizer'

export type Token = parsec.Token<TokenKind>

export const applyValue = (value: Token): ValueExp => {
  return {
    kind: 'ValueExp',
    value: value.text,
  }
}

export const applyProp = (
  value: [Token /* Identifier */, ValueExp]
): PropExp => {
  return {
    kind: 'PropExp',
    key: value[0].text,
    value: value[1].value,
  }
}

export const applyOpeningTag = (
  value: [Token /* Identifier */, PropExp[]]
): OpeningTag => {
  return {
    kind: 'OpeningTag',
    tagName: value[0].text,
    props: value[1],
  }
}

export const applyClosingTag = (value: Token): ClosingTag => {
  return {
    kind: 'ClosingTag',
    tagName: value.text,
  }
}

export const applyJsx = (
  value: [OpeningTag, JsxExp['body'], ClosingTag]
): JsxExp => {
  return {
    kind: 'JsxExp',
    openingTag: value[0],
    body: value[1],
    closingTag: value[2],
  }
}

export const applyProgram = (value: JsxExp[]): Program => {
  return {
    statements: value,
  }
}
