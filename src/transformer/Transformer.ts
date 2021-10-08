/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:49
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 17:28:11
 */
import * as Ast from '../parser/Ast'
import * as Factory from '../parser/Factory'
import * as TFactory from './Factory'
import * as Jsx from './Jsx'

// basic

export function transformIdentityExpr(
  identity: Ast.IdentityExpr
): Jsx.Identity {
  return TFactory.createIdentity(identity.name)
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
        ([key, expression]) => [
          key,
          Factory.isIdentityExpr(expression)
            ? transformIdentityExpr(expression)
            : transformExpression(expression),
        ],
        {}
      )
    )
  )
}

export function transformArrayExpr(
  array: Ast.ArrayExpr
): (Jsx.Type | Jsx.Identity)[] {
  const items = array.items
  return items.map(expression =>
    Factory.isIdentityExpr(expression)
      ? transformIdentityExpr(expression)
      : transformExpression(expression)
  )
}

// Jsx

export function transformPropsExpr(props: Ast.PropExpr[]): Jsx.JsxAttributes {
  return TFactory.createJsxAttributes(
    Object.fromEntries(
      props.map(prop => {
        const key = prop.key.name
        const expression = prop.value
        return [
          key,
          Factory.isStringExpr(expression)
            ? transformStringExpr(expression)
            : transformJsxInner(expression),
        ]
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

export function transformJsxInner(
  jsx: Ast.JsxInnerExpr
): Jsx.Type | Jsx.Identity {
  return Factory.isIdentityExpr(jsx.body)
    ? transformIdentityExpr(jsx.body)
    : transformExpression(jsx.body)
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
    Array.isArray(body)
      ? body.map(node => {
          if (Factory.isTextExpr(node)) {
            return transformTextExpr(node)
          } else {
            return transformJsx(node)
          }
        })
      : transformJsxInner(body)
  )
}

// Statement

export function transformArrowFunction(
  func: Ast.ArrowFunctionExpr
): Jsx.ArrowFunction {
  const { args = [], body } = func
  return TFactory.createArrowFunction(
    transformParameter(args),
    transformBlock(body)
  )
}

export function transformFunction(func: Ast.FunctionExpr): Jsx.Function {
  const { name, args = [], body } = func
  return TFactory.createFunction(
    name?.name,
    transformParameter(args),
    transformBlock(body)
  )
}

export function transformBlock(func: Ast.BlockExpr): Jsx.Block {
  const { body } = func
  return TFactory.createBlock(
    body.map(statement => transformStatement(statement))
  )
}

export function transformParameter(
  args: Ast.Parameter = []
): (Jsx.Type | Jsx.Identity)[] {
  return args.map(arg =>
    Factory.isExpression(arg)
      ? transformExpression(arg)
      : transformIdentityExpr(arg)
  )
}

export function transformCallChain(call: Ast.CallChainExpr): Jsx.CallChain {
  const { caller, chain, args = [] } = call
  return TFactory.createCallChain(
    caller.name,
    chain.map(item => item.name),
    transformParameter(args)
  )
}

export function transformVariableAssign(
  assign: Ast.VariableAssignExpr
): Jsx.VariableAssign {
  const { name, value } = assign
  return TFactory.createVariableAssign(
    name.name,
    value ? transformExpression(value) : undefined
  )
}

// statement

export function transformDefineVariable(
  def: Ast.DefineVariableStatement
): Jsx.DefineVariable {
  const { type, assign } = def
  let value: Jsx.Identity | Jsx.VariableAssign
  if (Factory.isVariableAssignExpr(assign)) {
    value = transformVariableAssign(assign)
  } else {
    const result = transformIdentityExpr(assign)
    if (typeof result === 'boolean') {
      throw new SyntaxError(`transformDefineVariable`)
    } else {
      value = result
    }
  }
  return TFactory.createDefineVariable(type.name, value)
}

export function transformIf(ifElse: Ast.IfStatement): Jsx.If {
  const { args = [], body, els } = ifElse
  return TFactory.createIf(
    transformParameter(args),
    Factory.isBlockExpr(body) ? transformBlock(body) : transformStatement(body),
    els
      ? Factory.isBlockExpr(els)
        ? transformBlock(els)
        : transformStatement(els)
      : undefined
  )
}

export function transformReturn(ret: Ast.ReturnStatement): Jsx.Return {
  const { value } = ret
  return TFactory.createReturn(transformExpression(value))
}

export function transformExpression(expression: Ast.Expression): Jsx.Type {
  switch (expression.kind) {
    case 'ArrayExpr':
      return transformArrayExpr(expression)
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
    case 'VariableAssignExpr':
      return transformVariableAssign(expression)
    default:
      return null
  }
}

export function transformStatement(statement: Ast.Statement): Jsx.Type {
  switch (statement.kind) {
    case 'CallChainExpr':
      return transformCallChain(statement)
    case 'DefineVariableStatement':
      return transformDefineVariable(statement)
    case 'VariableAssignExpr':
      return transformVariableAssign(statement)
    case 'IfStatement':
      return transformIf(statement)
    case 'ReturnStatement':
      return transformReturn(statement)
    default:
      return null
  }
}

export function transform(program: Ast.Program): Jsx.Type
export function transform(program: Ast.Expression): Jsx.Type
export function transform(program: Ast.Statement): Jsx.Type
export function transform(
  program: Ast.Program | Ast.Expression | Ast.Statement
): Jsx.Type {
  if (Factory.isProgram(program)) {
    return TFactory.createProgram(
      program.body.map(expression => transform(expression))
    )
  } else if (Factory.isExpression(program)) {
    return transformExpression(program)
  } else {
    return transformStatement(program)
  }
}
