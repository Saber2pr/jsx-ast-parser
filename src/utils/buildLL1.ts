import { buildLexer } from 'typescript-parsec'

export const buildLL1: (words: string[], kind: any) => typeof buildLexer =
  (words, kind) => rules => {
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
      console.log(
        `[LL1 Conflicts] \n${conflicts
          .map(row => `${row[0]}: ${row.slice(1).join(',')}`)
          .join('\n')}`
      )
      process.exit(1)
    }
    return buildLexer(rules)
  }
