import { RULES, TokenKind } from '../'

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
    ]
    expect(() => verifyLL1(words, TokenKind, RULES)).not.toThrow()
  })
})
