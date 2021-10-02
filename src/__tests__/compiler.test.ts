/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:06
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 12:09:35
 */
import { parser, transformer, compiler } from '..'

describe('Compiler', () => {
  it('compile', () => {
    const code = `<div width={100} contentEditable color="red" test={false} style={{width:100,color:"red",background:"blue",test:{color:"red"},child:<span>233</span>}} id="233ccc" class2Name="qwq123"><List list={[{content:<View color="red">233</View>,logo:<Image mode="test"/>},{content:<View/>}]}/><div/><div id="qwq"/><span>aaa</span><span>1234</span><span>1234asd</span><span>12aa<span>aaa</span>aa234234aaa</span></div>`
    expect(compiler.compile(transformer.transform(parser.parse(code)))).toEqual(
      `[${code}]`
    )
  })
})
