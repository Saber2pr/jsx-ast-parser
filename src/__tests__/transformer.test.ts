/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:14
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2021-10-02 12:06:14
 */
import { parser, transformer } from '..'

describe('Transformer', () => {
  it('Case 1', () => {
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
    expect(transformer.transform(parser.parse(code))).toMatchSnapshot()
  })
})
