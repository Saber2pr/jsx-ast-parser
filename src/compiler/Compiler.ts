/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:05:43
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 17:41:25
 */
import * as Jsx from '../transformer/Jsx'
import * as Factory from '../transformer/Factory'

// basic
export function compileString(element: string) {
  return `"${element}"`
}

export function compileNumber(element: number) {
  return `${+element}`
}

export function compileBoolean(element: boolean) {
  return `${element ? 'true' : 'false'}`
}

export function compileArray(element: Jsx.Type[]) {
  return `[${element.map(value => compile(value)).join(',')}]`
}

export function compileObject(element: object) {
  return element
    ? `{${Object.entries(element)
        .map(([key, value]) => `${key}:${compile(value)}`)
        .join(',')}}`
    : 'null'
}

// jsx
export function compileTextElement(element: Jsx.TextElement) {
  return `${element.nodeValue}`
}

export function compileJsxAttributes(element: Jsx.JsxAttributes): string {
  const entries = Object.entries(element)
  if (entries.length === 0) return ''
  return ` ${entries
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`
      }
      if (typeof value === 'number') {
        return `${key}={${value}}`
      }
      if (typeof value === 'boolean') {
        if (value) {
          return `${key}`
        } else {
          return `${key}={false}`
        }
      }
      if (Factory.isTextElement(value)) {
        return `${key}="${value.nodeValue}"`
      }
      if (Factory.isJsxElement(value)) {
        return `${key}={${compileJsxElement(value)}}`
      }
      if (Array.isArray(value)) {
        return `${key}={${compileArray(value)}}`
      }
      if (typeof value === 'object') {
        return `${key}={${compileObject(value)}}`
      }
      return `${key}=""`
    })
    .join(' ')}`
}

export function compileJsxElement(element: Jsx.JsxElement) {
  const tagName = element.tagName
  const props = element.props
  const elements = element.children

  // compile jsx element
  const attributes = compileJsxAttributes(props)
  const children = elements.map(element => compile(element)).join('')

  if (elements.length > 0) {
    // opening
    return `<${tagName}${attributes}>${children}</${tagName}>`
  }
  // self closing
  return `<${tagName}${attributes}/>`
}

// compile code
export function compile(element: Jsx.Type): string {
  // text element
  if (Factory.isTextElement(element)) {
    return compileTextElement(element)
  }
  // jsx element
  if (Factory.isJsxElement(element)) {
    return compileJsxElement(element)
  }
  // basic
  if (Array.isArray(element)) {
    return compileArray(element)
  }
  if (typeof element === 'object') {
    return compileObject(element)
  }
  if (typeof element === 'string') {
    return compileString(element)
  }
  if (typeof element === 'number') {
    return compileNumber(element)
  }
  if (typeof element === 'boolean') {
    return compileBoolean(element)
  }
  return ''
}
