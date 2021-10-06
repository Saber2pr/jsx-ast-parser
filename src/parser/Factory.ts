/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:15
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 12:14:03
 */
import * as Ast from './Ast'

export function isIdentityExpr(token: Ast.Node): token is Ast.IdentityExpr {
  return (<Ast.IdentityExpr>token).kind === 'IdentityExpr'
}

export function isNumberExpr(token: Ast.Node): token is Ast.NumberExpr {
  return (<Ast.NumberExpr>token).kind === 'NumberExpr'
}

export function isStringExpr(token: Ast.Node): token is Ast.StringExpr {
  return (<Ast.StringExpr>token).kind === 'StringExpr'
}

export function isObjectExpr(token: Ast.Node): token is Ast.ObjectExpr {
  return (<Ast.ObjectExpr>token).kind === 'ObjectExpr'
}

export function isArrayExpr(token: Ast.Node): token is Ast.ArrayExpr {
  return (<Ast.ArrayExpr>token).kind === 'ArrayExpr'
}

export function isJsxExpr(token: Ast.Node): token is Ast.JsxExpr {
  return (<Ast.JsxExpr>token).kind === 'JsxExpr'
}

export function isTextExpr(token: Ast.Node): token is Ast.TextExpr {
  return (<Ast.TextExpr>token).kind === 'TextExpr'
}

export function isJsxSelfClosingExpr(
  token: Ast.Node
): token is Ast.JsxSelfClosingExpr {
  return (<Ast.JsxSelfClosingExpr>token).kind === 'JsxSelfClosingExpr'
}

export function isBlockExpr(token: Ast.Node): token is Ast.BlockExpr {
  return (<Ast.BlockExpr>token).kind === 'BlockExpr'
}

export function isVariableAssignExpr(
  token: Ast.Node
): token is Ast.VariableAssignExpr {
  return (<Ast.VariableAssignExpr>token).kind === 'VariableAssignExpr'
}

export function isExpression(token: Ast.Node): token is Ast.Expression {
  switch ((<Ast.Expression>token).kind) {
    case 'JsxExpr':
    case 'StringExpr':
    case 'NumberExpr':
    case 'ObjectExpr':
    case 'ArrayExpr':
    case 'ArrowFunctionExpr':
    case 'CallChainExpr':
    case 'FunctionExpr':
    case 'VariableAssignExpr':
      return true
    default:
      return false
  }
}

export function isStatement(token: Ast.Node): token is Ast.Statement {
  switch ((<Ast.Statement>token).kind) {
    case 'CallChainExpr':
    case 'DefineVariableStatement':
      return true
    default:
      return false
  }
}
