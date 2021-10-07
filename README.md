# @saber2pr/jsx-ast-parser

[![npm](https://img.shields.io/npm/v/@saber2pr/jsx-ast-parser.svg?color=blue)](https://www.npmjs.com/package/@saber2pr/jsx-ast-parser)
[![codecov](https://codecov.io/gh/Saber2pr/jsx-ast-parser/branch/master/graph/badge.svg?token=DI9E88OIZU)](https://codecov.io/gh/Saber2pr/jsx-ast-parser)

> jsx parser by parser combinators.

```bash
yarn add @saber2pr/jsx-ast-parser
```

### Usage

```ts
import {
  parser,
  transformer,
  compiler,
  traverser,
} from '@saber2pr/jsx-ast-parser'

const code = `<div className="hello">world</div>`

const ast = parser.parse(code) // parse ast from code string
const jsx = transformer.transform(ast) // transform ast to jsx

// compile jsx to source code
compiler.compile(jsx) === code // true

// find jsx node
traverser.findNode(jsx, node => transformer.isTextElement(node)) // [ { tagName: 'text', nodeValue: 'world' } ]
```

#### Help

1. [Api Docs](https://saber2pr.top/jsx-ast-parser/)
2. [Jsx Ast Viewer](https://jsx-ast-viewer.vercel.app/)

- Profile
  - [see parser output ast.json](./public/ast.json)
  - [see transformer output jsx.json](./public/jsx.json)
  - [see compiler output out.jsx](./public/out.jsx)

### Feature

#### Overview Grammar BNF

[jsx.bnf](./public/jsx.bnf)

#### Syntax currently supported

- [ ] parser
  - [ ] jsx
    - [x] jsx opened
    - [x] jsx self closing
    - [ ] jsx props
      - [x] jsx props string-value
      - [x] jsx props number-value, bool-value
      - [x] jsx props object
      - [x] jsx props object-array
      - [x] jsx props string-array, number-array
      - [x] jsx props arrow function
        - [x] jsx props arrow function scope statements
      - [x] jsx props function
        - [x] jsx props function scope statements
  - [ ] statement
    - [x] call chain
    - [x] arrow function
    - [x] comment
    - [ ] arithmetic
    - [x] function
    - [x] define
    - [x] assign
    - [x] if else
    - [ ] for
    - [ ] while
    - [ ] try catch
    - [x] return
    - [ ] deconstruct
    - [ ] as
- [ ] transformer
  - [x] transform jsx
- [ ] traverser
  - [ ] traverse ast
  - [x] traverse jsx
- [ ] compiler
  - [ ] compile ast
  - [x] compile jsx

### Why

It started as a project for me to learn the principles of compilation, but now I'm confident I can make it better! I will continue to provide analysis tools for JSX code.
