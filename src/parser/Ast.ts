export interface NameExpr {
  kind: 'NameExpr'
  name: string
}

export interface OpeningTagExpr {
  kind: 'OpeningTagExpr'
  tagName: NameExpr
  props: PropExpr[]
}

export interface ClosingTagExpr {
  kind: 'ClosingTagExpr'
  tagName: NameExpr
}

export interface PropExpr {
  kind: 'PropExpr'
  key: NameExpr
  value: string
}

export interface JsxExpr {
  kind: 'JsxExpr'
  openingTag: OpeningTagExpr
  body: (JsxExpr | string | number)[]
  closingTag: ClosingTagExpr
}

export interface Program {
  kind: 'Program'
  body: JsxExpr[]
}
