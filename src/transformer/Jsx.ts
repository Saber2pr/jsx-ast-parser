export interface JsxElement {
  tagName: string
  props: { [k: string]: any }
  children: (JsxElement | TextElement)[]
}

export interface TextElement {
  tagName: 'text'
  nodeValue: string
}
