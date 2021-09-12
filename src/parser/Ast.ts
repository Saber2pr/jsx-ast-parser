export interface OpeningTag {
  kind: 'OpeningTag'
  tagName: string
  props: PropExp[]
}

export interface ClosingTag {
  kind: 'ClosingTag'
  tagName: string
}

export interface PropExp {
  kind: 'PropExp'
  key: string
  value: string
}

export interface ValueExp {
  kind: 'ValueExp'
  value: string
}

export interface JsxExp {
  kind: 'JsxExp'
  openingTag: OpeningTag
  body: JsxExp[] | ValueExp
  closingTag: ClosingTag
}

export interface Program {
  statements: JsxExp[]
}
