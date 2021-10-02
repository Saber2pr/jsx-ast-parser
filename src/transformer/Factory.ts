/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 15:10:57
 */
import * as Jsx from './Jsx'

export function isJsxElement(element: Jsx.Type): element is Jsx.JsxElement {
  if (!element) return false
  const jsxElement = <Jsx.JsxElement>element
  return jsxElement.tagName !== 'text' && !!jsxElement.props
}

export function isTextElement(element: Jsx.Type): element is Jsx.TextElement {
  if (!element) return false
  const textElement = <Jsx.TextElement>element
  return textElement.tagName === 'text'
}

export function createJsxElement(
  tagName: string,
  props: Jsx.JsxAttributes = {},
  children: Jsx.JsxNode[] = []
): Jsx.JsxElement {
  return {
    tagName,
    props,
    children,
  }
}
