import { parse } from '../'

describe('JsxParser', () => {
  it('Case 1', () => {
    const code = `
<div id="233" class="qwq">
  <span>"aaa"</span>
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
    })
  })
})
