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

export interface BooleanExpr extends Node {
  kind: 'BooleanExpr'
  value: boolean
}

export interface ObjectExpr extends Node {
  kind: 'ObjectExpr'
  props: {
    [k: string]: Type
  }
}

export interface ArrayExpr extends Node {
  kind: 'ArrayExpr'
  items: Type[]
}

export type Type =
  | Jsx
  | StringExpr
  | NumberExpr
  | BooleanExpr
  | ObjectExpr
  | ArrayExpr

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
  value: Type
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

// Program

export interface Program extends Node {
  kind: 'Program'
  body: Jsx[]
}