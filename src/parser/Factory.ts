import * as Ast from './Ast'

export const isObjectExpr = (token: Ast.Node): token is Ast.ObjectExpr =>
  (<Ast.ObjectExpr>token).kind === 'ObjectExpr'

export const isArrayExpr = (token: Ast.Node): token is Ast.ArrayExpr =>
  (<Ast.ArrayExpr>token).kind === 'ArrayExpr'
