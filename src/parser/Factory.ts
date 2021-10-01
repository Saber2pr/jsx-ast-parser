import * as Ast from './Ast'

export const isNumberExpr = (token: Ast.Node): token is Ast.NumberExpr =>
  (<Ast.NumberExpr>token).kind === 'NumberExpr'

export const isBooleanExpr = (token: Ast.Node): token is Ast.BooleanExpr =>
  (<Ast.BooleanExpr>token).kind === 'BooleanExpr'

export const isStringExpr = (token: Ast.Node): token is Ast.StringExpr =>
  (<Ast.StringExpr>token).kind === 'StringExpr'

export const isObjectExpr = (token: Ast.Node): token is Ast.ObjectExpr =>
  (<Ast.ObjectExpr>token).kind === 'ObjectExpr'

export const isArrayExpr = (token: Ast.Node): token is Ast.ArrayExpr =>
  (<Ast.ArrayExpr>token).kind === 'ArrayExpr'
