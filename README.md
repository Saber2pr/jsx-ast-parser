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

[output ast.json](./ast.json)

```ts
import { parse } from '@saber2pr/jsx-ast-parser'

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

parse(code)
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
          ... more detail see ./ast.json
        ]
      },
      "body": [
        ... more detail see ./ast.json
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
```
