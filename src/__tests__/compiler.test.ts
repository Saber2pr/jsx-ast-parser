/*
 * @Author: saber2pr
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:25:24
 * @Last Modified time: 2021-10-04 10:25:25
 */
import { compiler, parser, transformer } from '../'
import { read } from './utils'

describe('Compiler', () => {
  it('compile', async () => {
    const code = await read('code-1.txt')
    expect(compiler.compile(transformer.transform(parser.parse(code)))).toEqual(
      `[${code}]`
    )
  })
})
