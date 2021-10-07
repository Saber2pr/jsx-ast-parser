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

  const compile = (code: string) =>
    compiler.compile(transformer.transform(parser.parse(code)))
  const compileExpect = (code: string) => expect(compile(code)).toBe(code)

  it('CallChainExpr', () => {
    compileExpect('console.log(error)')
  })

  it('DefineVariableStatement', () => {
    compileExpect('const a = "a"')
  })

  it('VariableAssignExpr', () => {
    compileExpect('a = "a"')
  })

  it('IfStatement', () => {
    compileExpect(
      `if(a){console.log(a)}else if(b){console.log(b)}else {console.log(c)}`
    )
  })

  it('ReturnStatement', () => {
    compileExpect(`return 233`)
  })

  it('JsxExpr', () => {
    compileExpect('<div>233</div>')
  })

  it('JsxSelfClosingExpr', () => {
    compileExpect('<div className="233"/>')
  })

  it('StringExpr', () => {
    compileExpect('"saber2pr"')
  })

  it('NumberExpr', () => {
    compileExpect('233')
  })

  it('ObjectExpr', () => {
    compileExpect('{a:"a"}')
  })

  it('ArrayExpr', () => {
    compileExpect('["a","b"]')
  })

  it('ArrowFunctionExpr', () => {
    compileExpect('(a)=>{console.log(a)}')
  })

  it('FunctionExpr', () => {
    compileExpect('function test(a){console.log(a)}')
  })
})
