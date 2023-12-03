import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 03
*/

const day = '03'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const testDataFile = '../testdata/' + day + '.txt'
const dataFile = '../data/' + day + '.txt'

let inputLines = readFileSync(test ? testDataFile : dataFile).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const numberRegex = /(\d+)/g
const symbolRegex = /([^\d^.])/g

// all moved one to right and down
const symbolGrid: Record<number, number[]> = {}
const starSymbolGrid: Record<number, Record<number, number[]>> = {}

let match: RegExpExecArray | null
inputLines.forEach((str, line) => {
  while ((match = symbolRegex.exec(str)) !== null) {
    if (!((line + 1) in symbolGrid)) {
      symbolGrid[line + 1] = [match.index + 1]
    } else {
      symbolGrid[line + 1].push(match.index + 1)
    }
    if (match[1] === '*') {
      if (!((line + 1) in starSymbolGrid)) {
        starSymbolGrid[line + 1] = {}
      }
      starSymbolGrid[line + 1][match.index + 1] = []
    }
  }
})

let part1Sum = 0
inputLines.forEach((str, line) => {
  while ((match = numberRegex.exec(str)) !== null) {
    let foundSymbol = false
    for (let l = line; l < line + 3; l++) {
      const leftBoundary = match.index
      const rightBoundary = leftBoundary + match[0].length + 1
      if ((l in symbolGrid) && symbolGrid[l].some(symbolPos => symbolPos >= leftBoundary && symbolPos <= rightBoundary)) {
        foundSymbol = true
      }
      if (l in starSymbolGrid) {
        for (const xPos in starSymbolGrid[l]) {
          if (Number(xPos) >= leftBoundary && Number(xPos) <= rightBoundary) {
            starSymbolGrid[l][xPos].push(Number(match[1]))
          }
        }
      }
    }
    if (foundSymbol) {
      part1Sum += Number(match[1])
    }
  }
})

let part2Sum = 0
for (const l in starSymbolGrid) {
  for (const x in starSymbolGrid[l]) {
    if (starSymbolGrid[l][Number(x)].length === 2) {
      part2Sum += starSymbolGrid[l][Number(x)].reduce((accu, current) => accu * current, 1)
    }
  }
}
console.log('Result Part 1: ' + part1Sum)
console.log('Result Part 2: ' + part2Sum)
