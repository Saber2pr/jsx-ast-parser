import { writeFileSync } from 'fs'

import { parse } from './'
import { transform } from './transformer'

const code = `
<div 
  width={100} 
  contentEditable={true} 
  color={"red"} 
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
>
  <List
    list={[
      {
        content: <View color="red">233</View>,
        logo: <Image mode="test" />
      },
      {
        content: <View/>
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

const ast = parse(code)
writeFileSync('./public/ast.json', JSON.stringify(ast, null, 2))
writeFileSync('./public/jsx.json', JSON.stringify(transform(ast), null, 2))
