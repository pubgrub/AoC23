import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 01
*/

const day = '01'
const test: boolean = false
const testPart1: boolean = false
const testPart2: boolean = true

const testDataFile = '../testdata/' + day + '.txt'
const dataFile = '../data/' + day + '.txt'

let inputLines = readFileSync(test ? testDataFile : dataFile).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

// Part 1

const reFirstNumber = /(\d)/
const reLastNumber = /(\d)(?!.*\d)/

let firstMatch, lastMatch
let sum = 0

if (!test || testPart1) {
  for (let i = 0; i < inputLines.length; i++) {
    const s = inputLines[i]
    if (s.length === 0) continue
    firstMatch = s.match(reFirstNumber)
    lastMatch = s.match(reLastNumber)
    if (firstMatch != null && lastMatch != null) {
      sum += Number(firstMatch[1] + lastMatch[1])
    } else {
      console.log('oops')
      process.exit(1)
    }
  }
}

console.log('Result part 1: ', sum)

// Part 2

const replacements: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
}

const wordRegex = new RegExp('^(' + Object.keys(replacements).join('|') + ')')
const digitRegex = /'^(\\d)'/

if (!test || testPart2) {
  sum = 0
  for (let line = 0; line < inputLines.length; line++) {
    let firstNum = '0'
    let lastNum = '0'
    const s = inputLines[line]
    if (s.length === 0) continue
    for (let start = 0; start < s.length; start++) {
      const substr = s.substring(start)
      let match = digitRegex.exec(substr)
      if (match != null) {
        if (firstNum === '0') {
          firstNum = match[0]
        }
        lastNum = match[0]
        continue
      }
      match = wordRegex.exec(substr)
      if (match != null) {
        if (firstNum === '0') {
          firstNum = replacements[match[0]]
        }
        lastNum = replacements[match[0]]
        continue
      }
    }
    if (firstNum !== '0' && lastNum !== '0') {
      sum += Number(firstNum + lastNum)
    } else {
      console.log('oops')
      process.exit(1)
    }
  }

  console.log('Result part 2: ', sum)
}
