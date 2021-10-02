/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:47
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 15:10:06
 */
export type Type = JsxNode | string | number | boolean | JsxAttributes | Type[]

export interface JsxAttributes {
  [k: string]: Type
}

export interface Element {
  tagName: string
  [k: string]: any
}

export interface JsxElement extends Element {
  props: JsxAttributes
  children: JsxNode[]
}

export interface TextElement extends Element {
  tagName: 'text'
  nodeValue: string
}

export type JsxNode = JsxElement | TextElement
