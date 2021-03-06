/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:07:15
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 17:10:18
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

export function isJsxInnerExpr(token: Ast.Node): token is Ast.JsxInnerExpr {
  return (<Ast.JsxInnerExpr>token).kind === 'JsxInnerExpr'
}

export function isBlockExpr(token: Ast.Node): token is Ast.BlockExpr {
  return (<Ast.BlockExpr>token).kind === 'BlockExpr'
}

export function isCallChainExpr(token: Ast.Node): token is Ast.CallChainExpr {
  return (<Ast.CallChainExpr>token).kind === 'CallChainExpr'
}

export function isArrowFunctionExpr(
  token: Ast.Node
): token is Ast.ArrowFunctionExpr {
  return (<Ast.ArrowFunctionExpr>token).kind === 'ArrowFunctionExpr'
}

export function isFunctionExpr(token: Ast.Node): token is Ast.FunctionExpr {
  return (<Ast.FunctionExpr>token).kind === 'FunctionExpr'
}

export function isDefineVariableStatement(
  token: Ast.Node
): token is Ast.DefineVariableStatement {
  return (<Ast.DefineVariableStatement>token).kind === 'DefineVariableStatement'
}

export function isVariableAssignExpr(
  token: Ast.Node
): token is Ast.VariableAssignExpr {
  return (<Ast.VariableAssignExpr>token).kind === 'VariableAssignExpr'
}

export function isIfStatement(token: Ast.Node): token is Ast.IfStatement {
  return (<Ast.IfStatement>token).kind === 'IfStatement'
}

export function isReturnStatement(
  token: Ast.Node
): token is Ast.ReturnStatement {
  return (<Ast.ReturnStatement>token).kind === 'ReturnStatement'
}

export function isProgram(token: Ast.Node): token is Ast.Program {
  return (<Ast.Program>token).kind === 'Program'
}

export function isExpression(token: Ast.Node): token is Ast.Expression {
  switch ((<Ast.Expression>token).kind) {
    case 'ArrayExpr':
    case 'ArrowFunctionExpr':
    case 'BlockExpr':
    case 'CallChainExpr':
    case 'FunctionExpr':
    case 'JsxExpr':
    case 'JsxSelfClosingExpr':
    case 'NumberExpr':
    case 'ObjectExpr':
    case 'StringExpr':
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
    case 'IfStatement':
    case 'ReturnStatement':
    case 'VariableAssignExpr':
    // expression
    case 'ArrayExpr':
    case 'ArrowFunctionExpr':
    case 'FunctionExpr':
    case 'JsxExpr':
    case 'JsxSelfClosingExpr':
    case 'NumberExpr':
    case 'ObjectExpr':
    case 'StringExpr':
      return true
    default:
      return false
  }
}
