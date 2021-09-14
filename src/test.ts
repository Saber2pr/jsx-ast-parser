import { parse } from '.'

const code = `
<div id="233" class="qwq">
  <span>"aaa"</span>
</div>
`
console.log(JSON.stringify(parse(code), null, 2))
