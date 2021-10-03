/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:47
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 10:59:12
 */
export type Type =
  | JsxNode
  | string
  | number
  | boolean
  | null
  | JsxObject
  | JsxAttributes
  | Type[]
  | ArrowFunction
  | CallChain

// Jsx

export interface Node {
  $$typeof: string
  [k: string]: any
}

export interface JsxObject extends Node {
  $$typeof: 'jsx-obj'
  [k: string]: Type
}

export interface JsxAttributes extends Node {
  $$typeof: 'jsx-attrs'
  [k: string]: Type
}

export interface JsxElement extends Node {
  $$typeof: 'jsx'
  props: JsxAttributes
  children: Type[]
}

export interface TextElement extends Node {
  $$typeof: 'text'
  tagName: 'text'
  nodeValue: string
}

// Statement

export interface CallChain extends Node {
  $$typeof: 'call'
  caller: string
  chain: string[]
  args: string[] | CallChain
}

export interface ArrowFunction extends Node {
  $$typeof: 'function'
  args: string[]
  body: Type[]
}

export type JsxNode = JsxElement | TextElement
