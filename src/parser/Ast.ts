/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:21
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 19:39:03
 */
export interface Node {
  kind: any
  [k: string]: any
}

// Primary

export interface KeywordExpr extends Node {
  kind: 'KeywordExpr'
  name: string
}

export interface IdentityExpr extends Node {
  kind: 'IdentityExpr'
  name: string
}

export interface NumberExpr extends Node {
  kind: 'NumberExpr'
  value: number
}

export interface StringExpr extends Node {
  kind: 'StringExpr'
  value: string
}

export interface ObjectExpr extends Node {
  kind: 'ObjectExpr'
  props: {
    [k: string]: Expression | IdentityExpr
  }
}

export interface ArrayExpr extends Node {
  kind: 'ArrayExpr'
  items: (Expression | IdentityExpr)[]
}

export type Expression =
  | Jsx
  | StringExpr
  | NumberExpr
  | ObjectExpr
  | ArrayExpr
  | ArrowFunctionExpr
  | CallChainExpr
  | FunctionExpr
  | VariableAssignExpr
  | BlockExpr

export type Statement =
  | CallChainExpr
  | DefineVariableStatement
  | VariableAssignExpr
  | IfStatement
  | ReturnStatement
  | Jsx
  | StringExpr
  | NumberExpr
  | ObjectExpr
  | ArrayExpr
  | ArrowFunctionExpr
  | FunctionExpr

export type Parameter = (IdentityExpr | Expression)[] | undefined

// JSX

export interface OpeningTagExpr extends Node {
  kind: 'OpeningTagExpr'
  tagName: IdentityExpr
  props: PropExpr[]
}

export interface ClosingTagExpr extends Node {
  kind: 'ClosingTagExpr'
  tagName: IdentityExpr
}

export interface PropExpr extends Node {
  kind: 'PropExpr'
  key: IdentityExpr
  value: JsxInnerExpr | StringExpr
}

export interface JsxExpr extends Node {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: (Jsx | TextExpr)[] | JsxInnerExpr
  closingTag: ClosingTagExpr
}

export interface JsxInnerExpr extends Node {
  kind: 'JsxInnerExpr'
  body: Expression | IdentityExpr
}

export interface TextExpr extends Node {
  kind: 'TextExpr'
  value: string
}

export interface JsxSelfClosingExpr extends Node {
  kind: 'JsxSelfClosingExpr'
  tagName: IdentityExpr
  props: PropExpr[]
}

export type Jsx = JsxExpr | JsxSelfClosingExpr

// Expr
export interface BlockExpr extends Node {
  kind: 'BlockExpr'
  body: Statement[]
}

export interface ArrowFunctionExpr extends Node {
  kind: 'ArrowFunctionExpr'
  args: Parameter | IdentityExpr
  body: Expression
}

export interface FunctionExpr extends Node {
  kind: 'FunctionExpr'
  name: IdentityExpr | undefined
  args: Parameter
  body: BlockExpr
}

export interface CallChainExpr extends Node {
  kind: 'CallChainExpr'
  caller: IdentityExpr
  chain: IdentityExpr[]
  args: Parameter
}

export interface VariableAssignExpr extends Node {
  kind: 'VariableAssignExpr'
  name: IdentityExpr
  value: Expression | undefined
}

// Statement

export interface DefineVariableStatement extends Node {
  kind: 'DefineVariableStatement'
  type: KeywordExpr
  assign: VariableAssignExpr | IdentityExpr
}

export interface IfStatement extends Node {
  kind: 'IfStatement'
  args: Parameter
  body: Statement | BlockExpr
  els: Statement | BlockExpr | undefined
}

export interface ReturnStatement extends Node {
  kind: 'ReturnStatement'
  value: Expression
}

// Program

export interface Program extends Node {
  kind: 'Program'
  body: Statement[]
}
