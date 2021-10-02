/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:47
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 19:42:19
 */
export type Type =
  | JsxNode
  | string
  | number
  | boolean
  | JsxAttributes
  | Type[]
  | ArrowFunction
  | CallChain

// Jsx

export interface JsxAttributes {
  [k: string]: Type
}

export interface Node {
  $$typeof: string
  [k: string]: any
}

export interface JsxElement extends Node {
  $$typeof: 'jsx'
  props: JsxAttributes
  children: JsxNode[]
}

export interface TextElement extends Node {
  $$typeof: 'text'
  tagName: 'text'
  nodeValue: string
}

// Statement

export interface CallChain {
  $$typeof: 'call'
  caller: string
  chain: string[]
  args: string[]
}

export interface ArrowFunction {
  $$typeof: 'function'
  args: string[]
  body: CallChain[]
}

export type JsxNode = JsxElement | TextElement
