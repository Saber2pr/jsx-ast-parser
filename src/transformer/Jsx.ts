/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:47
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2021-10-02 12:07:47
 */
export type Type =
  | JsxElement
  | TextElement
  | string
  | number
  | boolean
  | JsxAttributes
  | Type[]

export interface JsxAttributes {
  [k: string]: Type
}

export interface Element {
  tagName: string
  [k: string]: any
}

export interface JsxElement extends Element {
  props: JsxAttributes
  children: (JsxElement | TextElement)[]
}

export interface TextElement extends Element {
  tagName: 'text'
  nodeValue: string
}
