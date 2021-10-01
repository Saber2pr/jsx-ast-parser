export interface Node {
  kind: any
  [k: string]: any
}

export interface NameExpr extends Node {
  kind: 'NameExpr'
  name: string
}

export interface NumberExpr extends Node {
  kind: 'NumberExpr'
  value: number
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

export interface OpeningTagExpr extends Node {
  kind: 'OpeningTagExpr'
  tagName: NameExpr
  props: PropExpr[]
}

export interface ClosingTagExpr extends Node {
  kind: 'ClosingTagExpr'
  tagName: NameExpr
}

export interface PropExpr extends Node {
  kind: 'PropExpr'
  key: NameExpr
  value: string | number | boolean | ObjectExpr | ArrayExpr
}

export interface JsxExpr extends Node {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: (JsxExpr | string)[]
  closingTag: ClosingTagExpr
}

export interface JsxSelfClosingExpr extends Node {
  kind: 'JsxSelfClosingExpr'
  tagName: NameExpr
  props: PropExpr[]
}

export interface Program extends Node {
  kind: 'Program'
  body: JsxExpr[]
}
