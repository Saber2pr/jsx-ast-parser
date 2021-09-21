import { parse } from '../';

describe('JsxParser', () => {
  it('Case 1', () => {
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
    expect(parse(code)).toEqual({
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
                value: 'ccc233',
              },
              {
                kind: 'PropExpr',
                key: {
                  kind: 'NameExpr',
                  name: 'className',
                },
                value: '123qwq',
              },
            ],
          },
          body: [
            {
              kind: 'JsxSelfClosingExpr',
              tagName: {
                kind: 'NameExpr',
                name: 'List',
              },
              props: [
                {
                  kind: 'PropExpr',
                  key: {
                    kind: 'NameExpr',
                    name: 'list',
                  },
                  value: {
                    kind: 'ArrayExpr',
                    items: [
                      {
                        kind: 'ObjectExpr',
                        props: {
                          content: {
                            kind: 'JsxExpr',
                            openingTag: {
                              kind: 'OpeningTagExpr',
                              tagName: {
                                kind: 'NameExpr',
                                name: 'View',
                              },
                              props: [
                                {
                                  kind: 'PropExpr',
                                  key: {
                                    kind: 'NameExpr',
                                    name: 'color',
                                  },
                                  value: 'red',
                                },
                              ],
                            },
                            body: [233],
                            closingTag: {
                              kind: 'ClosingTagExpr',
                              tagName: {
                                kind: 'NameExpr',
                                name: 'View',
                              },
                            },
                          },
                          logo: {
                            kind: 'JsxSelfClosingExpr',
                            tagName: {
                              kind: 'NameExpr',
                              name: 'Image',
                            },
                            props: [
                              {
                                kind: 'PropExpr',
                                key: {
                                  kind: 'NameExpr',
                                  name: 'mode',
                                },
                                value: 'test',
                              },
                            ],
                          },
                        },
                      },
                      {
                        kind: 'ObjectExpr',
                        props: {
                          content: {
                            kind: 'JsxSelfClosingExpr',
                            tagName: {
                              kind: 'NameExpr',
                              name: 'View',
                            },
                            props: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            {
              kind: 'JsxSelfClosingExpr',
              tagName: {
                kind: 'NameExpr',
                name: 'div',
              },
              props: [],
            },
            {
              kind: 'JsxSelfClosingExpr',
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
                  value: 'qwq',
                },
              ],
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
              body: [12, 'aa', 'aa', 234, 234, 'aaa'],
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
    })
  })
})
