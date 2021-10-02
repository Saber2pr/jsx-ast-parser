/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:06:11
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-02 17:58:28
 */
import { parser } from '..'

const verifyLL1 = (
  words: string[],
  kind: any,
  rules: [boolean, RegExp, any][]
) => {
  const conflicts: any[][] = []
  for (const word of words) {
    const matched = []
    for (const rule of rules) {
      if (word.match(rule[1])) {
        matched.push(kind[rule[2]])
      }
    }
    if (matched.length > 1) {
      conflicts.push([word, ...matched])
    }
  }
  if (conflicts.length) {
    throw new TypeError(
      `[LL1 Conflicts] \n${conflicts
        .map(row => `${row[0]}: ${row.slice(1).join(',')}`)
        .join('\n')}`
    )
  }
}

describe('Tokenizer', () => {
  it('Check LL1', () => {
    const words = [
      'abc',
      '1234',
      'ab12',
      '12ab',
      ' ',
      '<',
      '=',
      '"',
      '>',
      '/',
      '{',
      '}',
      '[',
      ']',
      ':',
      ',',
      "'",
      '.',
      '(',
      ')',
    ]
    expect(() =>
      verifyLL1(words, parser.TokenKind, parser.TokenRules)
    ).not.toThrow()
  })
})
