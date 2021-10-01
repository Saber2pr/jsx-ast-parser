import { writeFileSync } from 'fs'
import { parse } from './'

const code = `
<div width={true}>asd123sf</div>
`
writeFileSync('./ast.json', JSON.stringify(parse(code), null, 2))
