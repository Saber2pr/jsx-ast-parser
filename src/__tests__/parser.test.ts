import { parse } from '../'

describe('JsxParser', () => {
  it('Case 1', () => {
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
    expect(parse(code)).toEqual({
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
    })
  })
})
