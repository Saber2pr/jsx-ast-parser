/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:08
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:25:57
 */
import { parser } from '../'
import { read } from './utils'

describe('Parser', () => {
  it('Case 1', async () => {
    const code = await read('code.txt')
    expect(parser.parse(code)).toMatchSnapshot()
  })
})
