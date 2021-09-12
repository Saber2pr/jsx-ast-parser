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
<div id="233" class="456">
  <span>233</span>
</div>
`

parse(code)
/*
{
  statements: [
    {
      kind: 'JsxExp',
      openingTag: {
        kind: 'OpeningTag',
        tagName: 'div',
        props: [
          {
            kind: 'PropExp',
            key: 'id',
            value: '233',
          },
          {
            kind: 'PropExp',
            key: 'class',
            value: '456',
          },
        ],
      },
      body: [
        {
          kind: 'JsxExp',
          openingTag: {
            kind: 'OpeningTag',
            tagName: 'span',
            props: [],
          },
          body: {
            kind: 'ValueExp',
            value: '233',
          },
          closingTag: {
            kind: 'ClosingTag',
            tagName: 'span',
          },
        },
      ],
      closingTag: {
        kind: 'ClosingTag',
        tagName: 'div',
      },
    },
  ],
}
*/
```
