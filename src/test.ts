import { parse } from '.'

const code = `
<div id="233" class="qwq">
  <span>aaa</span>
  <span>1234</span>
  <span>1234asd</span>
  <span>
    12
    aa
  </span>
</div>
`
console.log(JSON.stringify(parse(code), null, 2))
