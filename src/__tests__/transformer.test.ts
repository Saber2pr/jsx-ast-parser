/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:14
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:26:22
 */
import { parser, transformer } from '../'
import { read } from './utils'

describe('Transformer', () => {
  it('Case 1', async () => {
    const code = await read('code.txt')
    expect(transformer.transform(parser.parse(code))).toMatchSnapshot()
  })
})
