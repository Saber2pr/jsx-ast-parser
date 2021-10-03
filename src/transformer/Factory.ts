/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 10:22:21
 */
import * as Jsx from './Jsx'

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

export function createJsxAttributes(
  props: {
    [k: string]: Jsx.Type
  } = {}
): Jsx.JsxAttributes {
  return {
    $$typeof: 'jsx-attrs',
    ...props,
  }
}

export function createJsxObject(
  values: {
    [k: string]: Jsx.Type
  } = {}
): Jsx.JsxObject {
  return {
    $$typeof: 'jsx-obj',
    ...values,
  }
}

// Statement

export function isArrowFunction(
  element: Jsx.Type
): element is Jsx.ArrowFunction {
  if (!element) return false
  const func = <Jsx.ArrowFunction>element
  return func.$$typeof === 'function'
}

export function isCallChain(element: Jsx.Type): element is Jsx.CallChain {
  if (!element) return false
  const call = <Jsx.CallChain>element
  return call.$$typeof === 'call'
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

export function createJsxElement(
  tagName: string,
  props: Jsx.JsxAttributes = createJsxAttributes(),
  children: Jsx.JsxNode[] = []
): Jsx.JsxElement {
  return {
    $$typeof: 'jsx',
    tagName,
    props,
    children,
  }
}
