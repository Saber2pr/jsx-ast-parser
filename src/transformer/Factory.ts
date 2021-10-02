/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 19:49:29
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

export function createJsxElement(
  tagName: string,
  props: Jsx.JsxAttributes = {},
  children: Jsx.JsxNode[] = []
): Jsx.JsxElement {
  return {
    $$typeof: 'jsx',
    tagName,
    props,
    children,
  }
}
