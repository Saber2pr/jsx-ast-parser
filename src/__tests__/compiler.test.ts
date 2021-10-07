/*
 * @Author: saber2pr
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:25:24
 * @Last Modified time: 2021-10-07 11:22:46
 */
import { compiler, parser, transformer } from '../'
import { read } from './utils'

describe('Compiler', () => {
  it('compile', async () => {
    const code = await read('code-1.txt')
    expect(compiler.compile(transformer.transform(parser.parse(code)))).toBe(
      code
    )
  })

  // const compile = (code: string) =>
  //   compiler.compile(transformer.transform(parser.parse(code).body[0]))

  // it('CallChainExpr', () => {
  //   expect(compile('console.log(error)')).toBe(`[console.log(error)]`)
  // })

  // it('DefineVariableStatement', () => {
  //   expect(transformer.isDefineVariable(transform('const a = "a"'))).toBe(true)
  // })

  // it('VariableAssignExpr', () => {
  //   expect(transformer.isVariableAssign(transform('a = "a"'))).toBe(true)
  // })

  // it('IfStatement', () => {
  //   expect(
  //     transformer.isIf(
  //       transform(`
  //       if(a){
  //         console.log(a)
  //       } else if(b) {
  //         console.log(b)
  //       } else {
  //         console.log(c)
  //       }
  //       `)
  //     )
  //   ).toBe(true)
  // })

  // it('ReturnStatement', () => {
  //   expect(
  //     transformer.isReturn(
  //       transform(`
  //         return 233
  //       `)
  //     )
  //   ).toBe(true)
  // })

  // it('JsxExpr', () => {
  //   expect(transformer.isJsxElement(transform('<div>233</div>'))).toBe(true)
  // })

  // it('JsxSelfClosingExpr', () => {
  //   expect(transformer.isJsxElement(transform('<div className="233" />'))).toBe(
  //     true
  //   )
  // })

  // it('StringExpr', () => {
  //   expect(transform('"saber2pr"')).toBe('saber2pr')
  // })

  // it('NumberExpr', () => {
  //   expect(transform('233')).toBe(233)
  // })

  // it('ObjectExpr', () => {
  //   expect(transformer.isJsxObject(transform('{a:"a"}'))).toBe(true)
  // })

  // it('ArrayExpr', () => {
  //   expect(transform('["a", "b"]')).toEqual(['a', 'b'])
  // })

  // it('ArrowFunctionExpr', () => {
  //   expect(
  //     transformer.isArrowFunction(transform('(a) => { console.log(a) }'))
  //   ).toBe(true)
  // })

  // it('FunctionExpr', () => {
  //   expect(
  //     transformer.isFunction(transform('function test(a){ console.log(a) }'))
  //   ).toBe(true)
  // })
})
