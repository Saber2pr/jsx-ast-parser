/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:08
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-07 11:07:05
 */
import { parser } from '../'
import { read } from './utils'

describe('Parser', () => {
  it('Case 1', async () => {
    const code = await read('code.txt')
    expect(parser.parse(code)).toMatchSnapshot()
  })

  it('CallChainExpr', () => {
    expect(
      parser.isCallChainExpr(parser.parse('console.log(error)').body[0])
    ).toBe(true)
  })

  it('DefineVariableStatement', () => {
    expect(
      parser.isDefineVariableStatement(parser.parse('const a = "a"').body[0])
    ).toBe(true)
  })

  it('VariableAssignExpr', () => {
    expect(parser.isVariableAssignExpr(parser.parse('a = "a"').body[0])).toBe(
      true
    )
  })

  it('IfStatement', () => {
    expect(
      parser.isIfStatement(
        parser.parse(`
    if(a){
      console.log(a)
    } else if(b) {
      console.log(b)
    } else {
      console.log(c)
    }
    `).body[0]
      )
    ).toBe(true)
  })

  it('ReturnStatement', () => {
    expect(parser.isReturnStatement(parser.parse('return 233').body[0])).toBe(
      true
    )
  })

  it('JsxExpr', () => {
    expect(parser.isJsxExpr(parser.parse('<div>233</div>').body[0])).toBe(true)
  })

  it('JsxSelfClosingExpr', () => {
    expect(
      parser.isJsxSelfClosingExpr(
        parser.parse('<div className="233" />').body[0]
      )
    ).toBe(true)
  })

  it('StringExpr', () => {
    expect(parser.isStringExpr(parser.parse('"saber2pr"').body[0])).toBe(true)
  })

  it('NumberExpr', () => {
    expect(parser.isNumberExpr(parser.parse('233').body[0])).toBe(true)
  })

  it('ObjectExpr', () => {
    expect(parser.isObjectExpr(parser.parse('{a:"a"}').body[0])).toBe(true)
  })

  it('ArrayExpr', () => {
    expect(parser.isArrayExpr(parser.parse('["a", "b"]').body[0])).toBe(true)
  })

  it('ArrowFunctionExpr', () => {
    expect(
      parser.isArrowFunctionExpr(
        parser.parse('(a) => { console.log(a) }').body[0]
      )
    ).toBe(true)
  })

  it('FunctionExpr', () => {
    expect(
      parser.isFunctionExpr(
        parser.parse('function test(a){ console.log(a) }').body[0]
      )
    ).toBe(true)
  })
})
