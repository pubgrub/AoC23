import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 07
*/

const day = '07'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const inChar =
  [['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
    ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']]

for (const part of [1, 2]) {
  const gameCodes: Record< string, number> = {}
  inputLines.forEach((l, idx) => {
    if (l.length === 0) return
    const game = l.match(/^([0-9TJQKA]+).*?(\d+)/)
    if (game === null) { console.error('game match did not match'); process.exit(1) }

    let cards = ((str: string) => {
      return [...str].map(c => {
        const index = inChar[part - 1].indexOf(c)
        return index >= 0 ? String.fromCharCode(index + 65) : c
      }).join('')
    })(game[1])

    let nJokers = 0
    const origcards = cards
    if (part === 2) {
      const noJokerStr = cards.replace(/A/g, '')
      nJokers = cards.length - noJokerStr.length
      cards = noJokerStr
    }

    let gameType = ((str: string) => {
      const counts = Object.values([...str].reduce<Record<string, number>>((acc, value) => {
        acc[value] = (acc[value] ?? 0) + 1
        return acc
      }, {}))
      const typeStr = counts.sort((a, b) => a - b).reverse().join('')
      return (typeStr + '00000').substring(0, 5)
    })(cards)
    if (part === 2) {
      gameType = String(Number(gameType) + nJokers * 10000)
    }
    gameCodes[gameType + origcards] = Number(game[2])
  })
  let winnings = 0
  Object.keys(gameCodes).sort().forEach((key, idx) => {
    winnings += (idx + 1) * gameCodes[key]
  })
  console.log(`Result Part ${part}: ` + winnings)
}
