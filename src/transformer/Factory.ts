/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 19:39:51
 */
import * as Jsx from './Jsx'

export function isIdentity(element: Jsx.Type): element is Jsx.Identity {
  if (!element) return false
  const identity = <Jsx.Identity>element
  return identity.$$typeof === 'identity'
}

// Jsx
export function isJsxElement(element: Jsx.Type): element is Jsx.JsxElement {
  if (!element) return false
  const jsxElement = <Jsx.JsxElement>element
  return jsxElement.$$typeof === 'jsx'
}

export function isTextElement(element: Jsx.Type): element is Jsx.TextElement {
  if (!element) return false
  const textElement = <Jsx.TextElement>element
  return textElement.$$typeof === 'text'
}

export function isProgram(element: Jsx.Type): element is Jsx.Program {
  if (!element) return false
  const textElement = <Jsx.Program>element
  return textElement.$$typeof === 'program'
}

export function createNode<T extends Jsx.Node>(
  node: T,
  kind: T['$$typeof'] = node.$$typeof
) {
  return Object.defineProperty(node, '$$typeof', {
    value: kind,
    enumerable: false,
  })
}

export function createIdentity(name: string): Jsx.Identity {
  return createNode<Jsx.Identity>({
    $$typeof: 'identity',
    name,
  })
}

export function createJsxAttributes(
  props: {
    [k: string]: Jsx.Type | Jsx.Identity
  } = {}
): Jsx.JsxAttributes {
  return createNode<Jsx.JsxAttributes>({
    $$typeof: 'jsx-attrs',
    ...props,
  })
}

export function createJsxObject(
  values: {
    [k: string]: Jsx.Type | Jsx.Identity
  } = {}
): Jsx.JsxObject {
  return createNode<Jsx.JsxObject>({
    $$typeof: 'jsx-obj',
    ...values,
  })
}

// expression

export function isArrowFunction(
  element: Jsx.Type
): element is Jsx.ArrowFunction {
  if (!element) return false
  const func = <Jsx.ArrowFunction>element
  return func.$$typeof === 'arrow-function'
}

export function isFunction(element: Jsx.Type): element is Jsx.Function {
  if (!element) return false
  const func = <Jsx.Function>element
  return func.$$typeof === 'function'
}

export function isCallChain(element: Jsx.Type): element is Jsx.CallChain {
  if (!element) return false
  const call = <Jsx.CallChain>element
  return call.$$typeof === 'call'
}

export function isVariableAssign(
  element: Jsx.Type
): element is Jsx.VariableAssign {
  if (!element) return false
  const call = <Jsx.VariableAssign>element
  return call.$$typeof === 'variable-assign'
}

// statement

export function isDefineVariable(
  element: Jsx.Type
): element is Jsx.DefineVariable {
  if (!element) return false
  const call = <Jsx.DefineVariable>element
  return call.$$typeof === 'define-variable'
}

export function isIf(element: Jsx.Type): element is Jsx.If {
  if (!element) return false
  const call = <Jsx.If>element
  return call.$$typeof === 'if'
}

export function isReturn(element: Jsx.Type): element is Jsx.Return {
  if (!element) return false
  const call = <Jsx.Return>element
  return call.$$typeof === 'return'
}

export function isJsxObject(element: Jsx.Type): element is Jsx.JsxObject {
  if (!element) return false
  const obj = <Jsx.JsxObject>element
  return obj.$$typeof === 'jsx-obj'
}

export function isJsxAttributes(
  element: Jsx.Type
): element is Jsx.JsxAttributes {
  if (!element) return false
  const obj = <Jsx.JsxAttributes>element
  return obj.$$typeof === 'jsx-attrs'
}

export function isBlock(element: Jsx.Type): element is Jsx.Block {
  if (!element) return false
  const obj = <Jsx.Block>element
  return obj.$$typeof === 'block'
}

export function createJsxElement(
  tagName: string,
  props: Jsx.JsxAttributes = createJsxAttributes(),
  children: Jsx.JsxElement['children'] = []
): Jsx.JsxElement {
  return createNode<Jsx.JsxElement>({
    $$typeof: 'jsx',
    tagName,
    props,
    children,
  })
}

export function createTextElement(nodeValue: string): Jsx.TextElement {
  return createNode<Jsx.TextElement>({
    $$typeof: 'text',
    tagName: 'text',
    nodeValue,
  })
}

export function createBlock(body: Jsx.Type[]): Jsx.Block {
  return createNode<Jsx.Block>({
    $$typeof: 'block',
    statements: body,
  })
}

export function createArrowFunction(
  args: Jsx.Parameter | Jsx.Identity,
  body: Jsx.Type
): Jsx.ArrowFunction {
  return createNode<Jsx.ArrowFunction>({
    $$typeof: 'arrow-function',
    args,
    body,
  })
}

export function createFunction(
  name: string | undefined,
  args: Jsx.Parameter = [],
  body: Jsx.Block
): Jsx.Function {
  return createNode<Jsx.Function>({
    $$typeof: 'function',
    name,
    args,
    body,
  })
}

export function createCallChain(
  caller: string,
  chain: string[],
  args: Jsx.Parameter = []
): Jsx.CallChain {
  return createNode<Jsx.CallChain>({
    $$typeof: 'call',
    caller,
    chain,
    args,
  })
}

export function createVariableAssign(
  name: string,
  value: Jsx.Type | undefined
): Jsx.VariableAssign {
  return createNode<Jsx.VariableAssign>({
    $$typeof: 'variable-assign',
    name: name,
    value: value,
  })
}

export function createDefineVariable(
  type: string,
  assign: Jsx.VariableAssign | Jsx.Identity
): Jsx.DefineVariable {
  return createNode<Jsx.DefineVariable>({
    $$typeof: 'define-variable',
    type,
    assign,
  })
}

export function createIf(
  args: Jsx.Parameter = [],
  body: Jsx.Type,
  els: Jsx.Type | undefined
): Jsx.If {
  return createNode<Jsx.If>({
    $$typeof: 'if',
    args,
    body,
    els: els,
  })
}

export function createReturn(value: Jsx.Type): Jsx.Return {
  return createNode<Jsx.Return>({
    $$typeof: 'return',
    value,
  })
}

export function createProgram(body: Jsx.Type[]): Jsx.Program {
  return createNode<Jsx.Program>({
    $$typeof: 'program',
    body,
  })
}

export function getElementEntries(element: Jsx.JsxObject | Jsx.JsxAttributes) {
  if (isJsxObject(element) || isJsxAttributes(element)) {
    return Object.entries(element).filter(([key]) => key !== '$$typeof')
  }
  return []
}
