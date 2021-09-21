import { writeFileSync } from 'fs'
import { parse } from './'

const code = `
<div id="233ccc" className="qwq123">
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
    aa234
    234aaa
  </span>
</div>
`
writeFileSync('./ast.json', JSON.stringify(parse(code), null, 2))
