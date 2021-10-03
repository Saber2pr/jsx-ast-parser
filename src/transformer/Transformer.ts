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
      Object.entries(props).map(
        ([key, node]) => [key, transformExpression(node)],
        {}
      )
    )
  )
}

export function transformArrayExpr(array: Ast.ArrayExpr): Jsx.Type[] {
  const items = array.items
  return items.map(expression => transformExpression(expression))
}

// Jsx

export function transformPropsExpr(props: Ast.PropExpr[]): Jsx.JsxAttributes {
  return TFactory.createJsxAttributes(
    Object.fromEntries(
      props.map(prop => {
        const key = prop.key.name
        const expression = prop.value
        return [key, transformExpression(expression)]
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
    body.map(expression => transformExpression(expression))
  )
}

export function transformFunction(func: Ast.FunctionExpr): Jsx.Function {
  const { name, args, body = [] } = func
  return TFactory.createFunction(
    name?.name,
    args.map(arg => arg.name),
    body.map(expression => transformExpression(expression))
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

export function transformExpression(expression: Ast.Expression): Jsx.Type {
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
    case 'FunctionExpr':
      return transformFunction(expression)
    case 'CallChainExpr':
      return transformCallChain(expression)
    default:
      return null
  }
}

export function transform(program: Ast.Program): Jsx.Type {
  return program.body.map(expression => transformExpression(expression))
}
