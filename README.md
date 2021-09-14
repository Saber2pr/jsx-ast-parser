# @saber2pr/jsx-ast-parser

> jsx parser by parser combinator.

```bash
yarn add @saber2pr/jsx-ast-parser
```

### Feature

in working progress...

### Usage

```ts
import { parse } from '@saber2pr/jsx-ast-parser'

const code = `
<div id="233" class="qwq">
  <span>aaa</span>
</div>
`

parse(code)
/*
{
  kind: 'Program',
  body: [
    {
      kind: 'JsxExpr',
      openingTag: {
        kind: 'OpeningTagExpr',
        tagName: 'div',
        props: [
          {
            kind: 'PropExpr',
            key: 'id',
            value: '233',
          },
          {
            kind: 'PropExpr',
            key: 'class',
            value: 'qwq',
          },
        ],
      },
      body: [
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: 'span',
            props: [],
          },
          body: {
            kind: 'StringVal',
            value: 'aaa',
          },
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: 'span',
          },
        },
      ],
      closingTag: {
        kind: 'ClosingTagExpr',
        tagName: 'div',
      },
    },
  ],
}
*/
```
