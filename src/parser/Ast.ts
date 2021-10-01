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
    [k: string]: JsxExpr
  }
}

export interface ArrayExpr extends Node {
  kind: 'ArrayExpr'
  items: ObjectExpr[]
}

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
  value: StringExpr | NumberExpr | BooleanExpr | ObjectExpr | ArrayExpr
}

export interface JsxExpr extends Node {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: (JsxExpr | string)[]
  closingTag: ClosingTagExpr
}

export interface JsxSelfClosingExpr extends Node {
  kind: 'JsxSelfClosingExpr'
  tagName: IdentityExpr
  props: PropExpr[]
}

// Program

export interface Program extends Node {
  kind: 'Program'
  body: JsxExpr[]
}
