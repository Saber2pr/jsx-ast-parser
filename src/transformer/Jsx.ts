/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:47
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-07 11:15:11
 */
export type Type =
  | JsxNode
  | Identity
  | string
  | number
  | boolean
  | null
  | JsxObject
  | JsxAttributes
  | Type[]
  | ArrowFunction
  | CallChain
  | Function
  | DefineVariable
  | VariableAssign
  | If
  | Block
  | Return
  | Program

export type Parameter = (Identity | Type)[] | undefined

// Jsx

export interface Node {
  $$typeof: string
  [k: string]: any
}

export interface Identity extends Node {
  $$typeof: 'identity'
  name: string
}

export interface JsxObject extends Node {
  $$typeof: 'jsx-obj'
  [k: string]: Type | Identity
}

export interface JsxAttributes extends Node {
  $$typeof: 'jsx-attrs'
  [k: string]: Type | Identity
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
  args: Parameter
}

export interface Block extends Node {
  $$typeof: 'block'
  statements: Type[]
}

export interface ArrowFunction extends Node {
  $$typeof: 'arrow-function'
  args: Parameter
  body: Block
}

export interface Function extends Node {
  $$typeof: 'function'
  name: string | undefined
  args: Parameter
  body: Block
}

export interface VariableAssign extends Node {
  $$typeof: 'variable-assign'
  name: string
  value: Type | undefined
}

export interface DefineVariable extends Node {
  $$typeof: 'define-variable'
  type: string
  assign: VariableAssign | Identity
}

export interface If extends Node {
  $$typeof: 'if'
  args: Parameter
  body: Type
  els: Type | undefined
}

export interface Return extends Node {
  $$typeof: 'return'
  value: Type
}

export interface Program extends Node {
  $$typeof: 'program'
  body: Type[]
}

export type JsxNode = JsxElement | TextElement
