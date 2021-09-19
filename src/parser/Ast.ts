// Primitive
export interface IdentifierVal {
  kind: 'IdentifierVal'
  value: string
}

export interface NumberVal {
  kind: 'NumberVal'
  value: number
}
export interface StringVal {
  kind: 'StringVal'
  value: string
}

// Expressions

export interface OpeningTagExpr {
  kind: 'OpeningTagExpr'
  tagName: string
  props: PropExpr[]
}

export interface ClosingTagExpr {
  kind: 'ClosingTagExpr'
  tagName: string
}

export interface PropExpr {
  kind: 'PropExpr'
  key: string
  value: string
}

export interface JsxExpr {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: JsxExpr[] | IdentifierVal | NumberVal
  closingTag: ClosingTagExpr
}

export interface Program {
  kind: 'Program'
  body: JsxExpr[]
}
