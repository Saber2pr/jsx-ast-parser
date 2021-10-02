/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:49
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 17:42:12
 */
import * as Ast from '../parser/Ast'
import * as Factory from '../parser/Factory'

import * as Jsx from './Jsx'

export function transformIdentityExpr(
  identity: Ast.IdentityExpr
): string | boolean {
  // pre identity
  if (identity.name === 'true') {
    return true
  }
  if (identity.name === 'false') {
    return false
  }
  return identity.name
}

export function transformNumberExpr(number: Ast.NumberExpr): number {
  return number.value
}

export function transformStringExpr(string: Ast.StringExpr): string {
  return string.value
}

export function transformTextExpr(text: Ast.TextExpr): Jsx.TextElement {
  return {
    tagName: 'text',
    nodeValue: text.value,
  }
}

export function transformObjectExpr(object: Ast.ObjectExpr): {
  [k: string]: any
} {
  const props = object.props
  return Object.fromEntries(
    Object.entries(props).map(([key, node]) => {
      switch (node.kind) {
        case 'ArrayExpr':
          return [key, transformArrayExpr(node)]
        case 'IdentityExpr':
          return [key, transformIdentityExpr(node)]
        case 'JsxExpr':
        case 'JsxSelfClosingExpr':
          return [key, transformJsx(node)]
        case 'NumberExpr':
          return [key, transformNumberExpr(node)]
        case 'ObjectExpr':
          return [key, transformObjectExpr(node)]
        case 'StringExpr':
          return [key, transformStringExpr(node)]
        default:
          return [key, null]
      }
    }, {})
  )
}

export function transformArrayExpr(array: Ast.ArrayExpr): any[] {
  const items = array.items
  return items.map(node => {
    switch (node.kind) {
      case 'ArrayExpr':
        return transformArrayExpr(node)
      case 'IdentityExpr':
        return transformIdentityExpr(node)
      case 'JsxExpr':
      case 'JsxSelfClosingExpr':
        return transformJsx(node)
      case 'NumberExpr':
        return transformNumberExpr(node)
      case 'ObjectExpr':
        return transformObjectExpr(node)
      case 'StringExpr':
        return transformStringExpr(node)
      default:
        return null
    }
  })
}

export function transformPropsExpr(props: Ast.PropExpr[]): {
  [k: string]: any
} {
  return Object.fromEntries(
    props.map(prop => {
      const key = prop.key.name
      const node = prop.value
      switch (node.kind) {
        case 'ArrayExpr':
          return [key, transformArrayExpr(node)]
        case 'IdentityExpr':
          return [key, transformIdentityExpr(node)]
        case 'JsxExpr':
        case 'JsxSelfClosingExpr':
          return [key, transformJsx(node)]
        case 'NumberExpr':
          return [key, transformNumberExpr(node)]
        case 'ObjectExpr':
          return [key, transformObjectExpr(node)]
        case 'StringExpr':
          return [key, transformStringExpr(node)]
        default:
          return [key, null]
      }
    })
  )
}

export function transformJsxSelfClosingExpr(
  jsx: Ast.JsxSelfClosingExpr
): Jsx.JsxElement {
  const tagName = jsx.tagName.name
  const props = jsx.props
  return {
    tagName,
    props: transformPropsExpr(props),
    children: [],
  }
}

export function transformJsx(jsx: Ast.Jsx): Jsx.JsxElement {
  if (Factory.isJsxSelfClosingExpr(jsx)) {
    return transformJsxSelfClosingExpr(jsx)
  }
  const tagName = jsx.openingTag.tagName.name
  const props = jsx.openingTag.props
  const body = jsx.body
  return {
    tagName,
    props: transformPropsExpr(props),
    children: body.map(node => {
      if (Factory.isTextExpr(node)) {
        return transformTextExpr(node)
      } else {
        return transformJsx(node)
      }
    }),
  }
}

export function transform(program: Ast.Program) {
  return program.body.map(jsx => transformJsx(jsx))
}
