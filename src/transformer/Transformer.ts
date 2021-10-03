/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:49
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 11:09:12
 */
import * as Ast from '../parser/Ast'
import * as Factory from '../parser/Factory'
import * as TFactory from './Factory'
import * as Jsx from './Jsx'

// basic

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
  return TFactory.createTextElement(text.value)
}

export function transformObjectExpr(object: Ast.ObjectExpr): Jsx.JsxObject {
  const props = object.props
  return TFactory.createJsxObject(
    Object.fromEntries(
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
          case 'ArrowFunctionExpr':
            return [key, transformArrowFunction(node)]
          case 'CallChainExpr':
            return [key, transformCallChain(node)]
          default:
            return [key, null]
        }
      }, {})
    )
  )
}

export function transformArrayExpr(array: Ast.ArrayExpr): Jsx.Type[] {
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
      case 'ArrowFunctionExpr':
        return transformArrowFunction(node)
      case 'CallChainExpr':
        return transformCallChain(node)
      default:
        return null
    }
  })
}

// Jsx

export function transformPropsExpr(props: Ast.PropExpr[]): Jsx.JsxAttributes {
  return TFactory.createJsxAttributes(
    Object.fromEntries(
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
          case 'ArrowFunctionExpr':
            return [key, transformArrowFunction(node)]
          case 'CallChainExpr':
            return [key, transformCallChain(node)]
          default:
            return [key, null]
        }
      })
    )
  )
}

export function transformJsxSelfClosingExpr(
  jsx: Ast.JsxSelfClosingExpr
): Jsx.JsxElement {
  const tagName = jsx.tagName.name
  const props = jsx.props
  return TFactory.createJsxElement(tagName, transformPropsExpr(props), [])
}

export function transformJsx(jsx: Ast.Jsx): Jsx.JsxElement {
  if (Factory.isJsxSelfClosingExpr(jsx)) {
    return transformJsxSelfClosingExpr(jsx)
  }
  const tagName = jsx.openingTag.tagName.name
  const props = jsx.openingTag.props
  const body = jsx.body
  return TFactory.createJsxElement(
    tagName,
    transformPropsExpr(props),
    body.map(node => {
      if (Factory.isTextExpr(node)) {
        return transformTextExpr(node)
      } else {
        return transformJsx(node)
      }
    })
  )
}

// Statement

export function transformArrowFunction(
  func: Ast.ArrowFunctionExpr
): Jsx.ArrowFunction {
  const { args, body = [] } = func
  return TFactory.createArrowFunction(
    args.map(arg => arg.name),
    body.map(statement => transformCallChain(statement))
  )
}

export function transformCallChain(call: Ast.CallChainExpr): Jsx.CallChain {
  const { caller, chain, args } = call
  return TFactory.createCallChain(
    caller.name,
    chain.map(item => item.name),
    Array.isArray(args) ? args.map(arg => arg.name) : transformCallChain(args)
  )
}

export function transform(program: Ast.Program): Jsx.Type {
  return program.body.map(expression => {
    switch (expression.kind) {
      case 'ArrayExpr':
        return transformArrayExpr(expression)
      case 'IdentityExpr':
        return transformIdentityExpr(expression)
      case 'JsxExpr':
      case 'JsxSelfClosingExpr':
        return transformJsx(expression)
      case 'NumberExpr':
        return transformNumberExpr(expression)
      case 'ObjectExpr':
        return transformObjectExpr(expression)
      case 'StringExpr':
        return transformStringExpr(expression)
      case 'ArrowFunctionExpr':
        return transformArrowFunction(expression)
      case 'CallChainExpr':
        return transformCallChain(expression)
      default:
        return null
    }
  })
}
