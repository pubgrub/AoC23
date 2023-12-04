import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 04
*/

const day = '04'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt`: `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const lineRegex = /Card\s+(\d+):(.*)\|\s+(.*)/
const numberRegex = /(\d+)/g

let part1Sum = 0
const numCards: number[] = []
for (const l of inputLines) {
  if (l.length === 0) continue
  const match = lineRegex.exec(l)
  if (match === null) { console.error('lineRegex did not match\n', l); process.exit(1) }
  const gameNum = Number(match[1])
  numCards[gameNum - 1] = (numCards[gameNum - 1] ?? 0) + 1
  const gameCards = new Set(match[2].match(numberRegex))
  const myCards = new Set(match[3].match(numberRegex))
  const winCardNum = new Set([...gameCards].filter(c => myCards.has(c))).size
  if (winCardNum > 0) {
    // Part 1
    part1Sum += 2 ** (winCardNum - 1)
    // Part 2
    const newCards = numCards[gameNum - 1]
    for (let w = gameNum; w < gameNum + winCardNum; w++) {
      numCards[w] = (numCards[w] ?? 0) + newCards
    }
  }
}
const part2Sum = numCards.reduce((accu, value) => accu + value)

console.log('Result Part 1: ' + part1Sum)
console.log('Result Part 2: ' + part2Sum)
