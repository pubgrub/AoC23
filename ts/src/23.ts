import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 23
*/

const day = '23'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))
if (inputLines.slice(-1)[0] === '') { inputLines.pop() }

const grid: number[] = []
const width = inputLines[0].length
const height = inputLines.length

const tVal: Record<string, number> = { '#': -1, '.': 4, '^': 0, '>': 1, v: 2, '<': 3 }
const dOffset: number[] = [-width, 1, width, -1]

let start = -1
let end = -1
inputLines.forEach((l, lIdx) => {
  ;[...l].forEach((c, cIdx) => {
    grid.push(tVal[c])
    if (lIdx === 0 && c === '.') start = grid.length - 1
    if (lIdx === height - 1 && c === '.') end = grid.length - 1
  })
})

const result1 = solve(start, end)
console.log('Result Part 1: ', result1 - 1)
// const result2 = solve2(start, end)

// console.log('Result Part 2: ', result2 - 1)


function solve (start_: number, end_: number): number {
  return s1rec(start_, end_, [])
}

function s1rec (pos_: number, end_: number, seen_: number[]): number {
  const seen = [...seen_]
  let maxSeen = 0
  seen.push(pos_)
  let oneWayOnly = true
  let possibleNextMoves: number[] = []
  while (oneWayOnly) {
    oneWayOnly = false
    if (pos_ === end_) {
      return seen.length
    }
    possibleNextMoves = []
    for (let dir = 0; dir < 4; dir++) {
      const nextP = pos_ + dOffset[dir]
      if (nextP < 0 || nextP > grid.length - 1) continue
      if (grid[nextP] === -1) continue
      if (seen.includes(nextP)) continue
      if (grid[pos_] < 4 && dir !== grid[pos_]) continue
      possibleNextMoves.push(nextP)
    }
    if (possibleNextMoves.length === 1) {
      oneWayOnly = true
      pos_ = possibleNextMoves[0]
      seen.push(pos_)
    }
  }
  possibleNextMoves.forEach((p) => {
    maxSeen = Math.max(s1rec(p, end_, seen), maxSeen)
  })

  return maxSeen
}

function solve2 (start: number, end: number): number {

}
