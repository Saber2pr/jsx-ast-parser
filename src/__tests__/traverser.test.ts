/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:36
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-04 10:27:50
 */
import { compiler, parser, transformer, traverser } from '../'
import { read } from './utils'

describe('Traverser', () => {
  it('map', async () => {
    const code = await read('code.txt')
    const ast = parser.parse(code)
    const jsx = transformer.transform(ast)

    const jsx2 = traverser.traverse(jsx, node => {
      if (transformer.isJsxElement(node)) {
        if (node.props && node.props.id === 'qwq') {
          return transformer.createJsxElement(node.tagName, {
            ...node.props,
            meta: 233,
          })
        }
      }
    })

    expect(jsx2).toMatchSnapshot()
  })

  it('findNode', async () => {
    const code = await read('code.txt')
    const ast = parser.parse(code)
    const jsx = transformer.transform(ast)

    const node = traverser.findNode(jsx, node => {
      return transformer.isJsxElement(node) && node.tagName === 'List'
    })
    expect(node).toMatchSnapshot()
    expect(compiler.compile(node)).toEqual(
      `[<List list={[{content:<View color="red">233</View>,logo:<Image mode="test"/>},{content:<View/>}]}/>]`
    )

    // get props list source code
    const result = node[0]
    const contents: string[] = []
    if (transformer.isJsxElement(result)) {
      const list = result.props.list
      if (Array.isArray(list)) {
        list.forEach((item: any) =>
          contents.push(compiler.compile(item.content))
        )
      }
    }
    expect(contents).toEqual(['<View color="red">233</View>', '<View/>'])
  })
})
