import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 15
*/

const day = '15'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
const inputLines = readFileSync(fileName).toString().split('\n')

const commands = inputLines[0].split(',')

// Part 1
let result = 0
commands.forEach((s) => {
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    sum = ((sum + s.charCodeAt(i)) * 17) % 256
  }
  result += sum
})
console.log('Result Part 1: ', result)

// Part 2
const boxes: Array<Map<string, number>> = []
for (let i = 0; i < 256; i++) { boxes.push(new Map()) }

commands.forEach((s) => {
  const m = s.match(/([a-z]+)([-=])([1-9]?)/)
  if (m !== null) {
    const label = m[1]
    const box = [...label].reduce((acc, c): number => ((acc + c.charCodeAt(0)) * 17) % 256, 0)
    const command = m[2]
    if (command === '-' && boxes[box].has(label)) {
      boxes[box].delete(label)
    } else if (command === '=') {
      boxes[box].set(label, Number(m[3]))
    }
  }
})

let sum = 0
boxes.forEach((box, bIdx) => {
  let lIdx = 1
  box.forEach((lens) => {
    sum += (bIdx + 1) * lIdx * lens
    lIdx += 1
  })
})

console.log('Result Part 2: ', sum)
