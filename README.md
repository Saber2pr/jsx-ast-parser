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
            kind: 'IdentifierVal',
            value: 'aaa',
          },
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: 'span',
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: 'span',
            props: [],
          },
          body: {
            kind: 'NumberVal',
            value: 1234,
          },
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: 'span',
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: 'span',
            props: [],
          },
          body: {
            kind: 'IdentifierVal',
            value: '1234asd',
          },
          closingTag: {
            kind: 'ClosingTagExpr',
            tagName: 'span',
          },
        },
        {
          kind: 'JsxExpr',
          openingTag: {
            kind: 'OpeningTagExpr',
            tagName: 'span',
            props: [],
          },
          body: {
            kind: 'IdentifierVal',
            value: '12aa',
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
