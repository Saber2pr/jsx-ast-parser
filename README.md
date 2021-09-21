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
  <span>1234</span>
  <span>1234asd</span>
  <span>
    12
    aa
  </span>
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
        tagName: {
          kind: 'NameExpr',
          name: 'div',
        },
        props: [
          {
            kind: 'PropExpr',
            key: {
              kind: 'NameExpr',
              name: 'id',
            },
            value: '233',
          },
          {
            kind: 'PropExpr',
            key: {
              kind: 'NameExpr',
              name: 'class',
            },
            value: 'qwq',
          },
        ],
      },
      body: [
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
            props: [],
          },
          body: ['aaa'],
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
            props: [],
          },
          body: [1234],
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
            props: [],
          },
          body: [1234, 'asd'],
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
            props: [],
          },
          body: [12, 'aa'],
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: {
              kind: 'NameExpr',
              name: 'span',
            },
          },
        },
      ],
      closingTag: {
        kind: 'ClosingTagExpr',
        tagName: {
          kind: 'NameExpr',
          name: 'div',
        },
      },
    },
  ],
}
*/
```
