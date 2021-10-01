# @saber2pr/jsx-ast-parser

> jsx parser by parser combinator.

```bash
yarn add @saber2pr/jsx-ast-parser
```

### Feature

in working progress...

TODO:

- [x] jsx opened
- [x] jsx self closing
- [x] jsx props string-value
- [x] jsx props number-value, bool-value
- [x] jsx props object
- [ ] jsx props function
- [x] jsx props object-array
- [x] jsx props string-array, number-array

### Usage

- [see output ast.json](./public/ast.json)
- [see output jsx.json](./public/jsx.json)

```ts
import { parse, transform } from '@saber2pr/jsx-ast-parser'

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

const ast = parse(code)
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
transform(ast)
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
```
