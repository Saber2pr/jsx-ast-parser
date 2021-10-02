/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:36
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 20:20:44
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
    const jsx2 = traverser.traverse(jsx[0], node => {
      if (node.props && node.props.id === 'qwq') {
        return transformer.createJsxElement(node.tagName, {
          ...node.props,
          meta: 233,
        })
      }
    })

    expect(jsx2).toMatchSnapshot()
  })

  it('findNode', () => {
    const node = traverser.findNode(jsx[0], node => {
      return node.tagName === 'List'
    })
    expect(node).toMatchSnapshot()
    expect(compiler.compile(node)).toEqual(
      `[<List list={[{content:<View color="red">233</View>,logo:<Image mode="test"/>},{content:<View/>}]}/>]`
    )

    // get props list source code
    const contents = node[0].props.list.map((item: any) =>
      compiler.compile(item.content)
    )
    expect(contents).toEqual(['<View color="red">233</View>', '<View/>'])
  })
})
