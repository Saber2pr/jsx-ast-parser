# @saber2pr/jsx-ast-parser

[![npm](https://img.shields.io/npm/v/@saber2pr/jsx-ast-parser.svg?color=blue)](https://www.npmjs.com/package/@saber2pr/jsx-ast-parser)
[![codecov](https://codecov.io/gh/Saber2pr/jsx-ast-parser/branch/master/graph/badge.svg?token=DI9E88OIZU)](https://codecov.io/gh/Saber2pr/jsx-ast-parser)

> jsx parser by parser combinators.

```bash
yarn add @saber2pr/jsx-ast-parser
```

### Feature

#### parser

- [x] jsx opened
- [x] jsx self closing
- [x] jsx props string-value
- [x] jsx props number-value, bool-value
- [x] jsx props object
- [x] jsx props object-array
- [x] jsx props string-array, number-array
- [x] jsx props arrow function
- [x] jsx props arrow function scope statements
- [x] jsx props function
- [x] jsx props function scope statements
- [x] statement call chain
- [x] statement arrow function
- [x] statement comment
- [ ] statement arithmetic
- [x] statement function
- [x] statement define
- [x] statement assign
- [ ] statement if else
- [ ] statement for
- [ ] statement while
- [ ] statement try catch
- [ ] statement return
- [ ] statement deconstruct
- [ ] statement as

#### transformer

- [x] transform jsx

#### traverser

- [ ] traverse ast
- [x] traverse jsx

#### compiler

- [ ] compile ast
- [x] compile jsx

### Usage

[docs](https://saber2pr.top/jsx-ast-parser/)

- [see parser output ast.json](./public/ast.json)
- [see transformer output jsx.json](./public/jsx.json)
- [see compiler output out.jsx](./public/out.jsx)

```ts
import {
  parser,
  transformer,
  compiler,
  traverser,
} from '@saber2pr/jsx-ast-parser'

const code = `
<div id="233ccc" className="qwq123">
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

const ast = parser.parse(code)
/*
{
  "kind": "Program",
  "body": [
    {
      "kind": "JsxExpr",
      "openingTag": {
        "kind": "OpeningTagExpr",
        "tagName": {
          "kind": "IdentityExpr",
          "name": "div"
        },
        "props": [
          {
            "kind": "PropExpr",
            "key": {
              "kind": "IdentityExpr",
              "name": "width"
            },
            "value": {
              "kind": "NumberExpr",
              "value": 100
            }
          },
          ... more detail see ./public/ast.json
        ]
      },
      "body": [
        ... more detail see ./public/ast.json
      ],
      "closingTag": {
        "kind": "ClosingTagExpr",
        "tagName": {
          "kind": "IdentityExpr",
          "name": "div"
        }
      }
    }
  ]
}
*/
const jsx = transformer.transform(ast)
/*
[
  {
    "tagName": "div",
    "props": {
      "width": 100,
      "contentEditable": true,
      "color": "red",
      "style": {
        "width": 100,
        "color": "red",
        "background": "blue",
        "test": {
          "color": "red"
        },
        "child": {
          "tagName": "span",
          "props": {},
          "children": [
            {
              "tagName": "text",
              "nodeValue": "233"
            }
          ]
        }
      },
      "id": "233ccc",
      "class2Name": "qwq123"
    },
    "children": [
        ... more detail see ./public/jsx.json
    ]
  }
]
*/
// compile code from jsx
compiler.compile(jsx) === code
```
