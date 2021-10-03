/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:36
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 09:29:07
 */
import { compiler, parser, transformer, traverser } from '../'

describe('Traverser', () => {
  const code = `
<div 
  width={100} 
  contentEditable={true}
  color={"red"}
  arr={[1,2]}
  style={{
    width: 100,
    color: "red",
    background: 'blue',
    test: {
      color: 'red'
    },
    child: <span>233</span>
  }} 
  id="233ccc" 
  class2Name="qwq123"
  onClick={onClick}
  onError={(error,test) => {
    console.log(error);
    console.log(test)
  }}
>
  <List
    list={[
      {
        content: <View color="red">233</View>,
        logo: <Image mode="test" />
      },
      {
        content: <View />
      }
    ]}
  />
  <div />
  <div id="qwq" />
  <span>aaa</span>
  <span>1234</span>
  <span>1234asd</span>
  <span>
    12
    aa
    <span>aaa</span>
    aa234
    234aaa
  </span>
</div>
  `
  const ast = parser.parse(code)
  const jsx = transformer.transform(ast)

  it('map', () => {
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

  it('findNode', () => {
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
