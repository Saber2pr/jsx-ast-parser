/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:21
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 09:44:17
 */
export interface Node {
  kind: any
  [k: string]: any
}

// Primary

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
    [k: string]: Expression
  }
}

export interface ArrayExpr extends Node {
  kind: 'ArrayExpr'
  items: Expression[]
}

export type Expression =
  | Jsx
  | StringExpr
  | NumberExpr
  | IdentityExpr
  | ObjectExpr
  | ArrayExpr
  | ArrowFunctionExpr
  | CallChainExpr
  | FunctionExpr

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
  value: Expression
}

export interface JsxExpr extends Node {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: (Jsx | TextExpr)[]
  closingTag: ClosingTagExpr
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

// Statement Expr

export interface ArrowFunctionExpr extends Node {
  kind: 'ArrowFunctionExpr'
  args: IdentityExpr[]
  body: Expression[]
}

export interface FunctionExpr extends Node {
  kind: 'FunctionExpr'
  name: IdentityExpr | undefined
  args: IdentityExpr[]
  body: Expression[]
}

export interface CallChainExpr extends Node {
  kind: 'CallChainExpr'
  caller: IdentityExpr
  chain: IdentityExpr[]
  args: IdentityExpr[] | CallChainExpr
}

// Program

export interface Program extends Node {
  kind: 'Program'
  body: Expression[]
}
