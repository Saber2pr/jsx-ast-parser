import { writeFileSync } from 'fs'
import { parse } from './'

const code = `
<div width={100} test={true} color={"red"} style={{
  width: 100,
  color: "red",
  background: 'blue',
  test: {
    color: 'red'
  },
  child: <span>233</span>
}} id="233ccc" class2Name="qwq123">
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
