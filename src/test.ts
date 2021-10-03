/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:44
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-03 10:42:45
 */
import { writeFileSync } from 'fs'

import { compiler, parser, transformer, traverser } from './'

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
    console.log();
    console.log(console.log(test))
    Array.from([1,2,3]).map(n => n)
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
writeFileSync('./public/ast.json', JSON.stringify(ast, null, 2))

const jsx = transformer.transform(ast)
writeFileSync('./public/jsx.json', JSON.stringify(jsx, null, 2))

const out = compiler.compile(jsx)
writeFileSync('./public/out.jsx', out)

const visited: transformer.Type = []
const jsx2 = traverser.traverse(jsx, node => {
  console.log('node', node)
  visited.push(node)
  if (node) {
    if (transformer.isJsxElement(node)) {
      if (node.props && node.props.id === 'qwq') {
        return transformer.createJsxElement(node.tagName, {
          ...node.props,
          meta: 233,
        })
      }
    }
  }
})

writeFileSync('./public/jsx2.json', JSON.stringify(jsx2, null, 2))
writeFileSync('./public/visited.json', JSON.stringify(visited, null, 2))

const node = traverser.findNode(
  jsx,
  node =>
    transformer.isJsxElement(node) && node.props && node.tagName === 'List'
)
writeFileSync('./public/jsx-find.json', JSON.stringify(node, null, 2))
writeFileSync('./public/out-find.jsx', compiler.compile(node))

// get props list source code
if (transformer.isJsxElement(node[0])) {
  const result = node[0]
  const list = result.props.list
  if (Array.isArray(list)) {
    console.log(list.map((item: any) => compiler.compile(item.content)))
  }
}
