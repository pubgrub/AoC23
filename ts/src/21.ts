import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 21
*/

const day = '21'
const test: boolean = true
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))
if (inputLines.slice(-1)[0] === '') { inputLines.pop() }

const maxStep = test ? 6 : 64
let part2Steps = 26501365

let start: number = 0
const grid: number[] = []
const height: number = inputLines.length
const width: number = inputLines[0].length
let seen: Record<number, number> = {}

inputLines.forEach((l, lIdx) => {
  ;[...l].forEach((c, cIdx) => {
    if (c === 'S') {
      start = lIdx * width + cIdx
    }
    grid.push(c === '#' ? 1 : 0)
  })
})
const result1 = solve(start, 0, maxStep)
console.log(result1)

const result2 = solve2()

function solve (p: number, step: number, maxStep_: number): number {
  if (maxStep_ < 0) return 0
  seen[p * 1000 + step] = 1
  if (step === maxStep_) {
    return 1
  }
  let sum = 0
  const neigh: number[] = [-width, 1, width, -1]
  for (let dir = 0; dir < neigh.length; dir++) {
    const nextP = p + neigh[dir]
    if (grid[nextP] === 1) continue
    if ((nextP * 1000 + step + 1) in seen) continue
    if (nextP < 0 || nextP > grid.length - 1) continue
    const nextPX = nextP % width
    if (dir === 1 && nextPX === 0) continue
    if (dir === 3 && nextPX === width - 1) continue

    sum += solve(nextP, step + 1, maxStep_)
  }
  return sum
}

function solve2 (): number {
  part2Steps = 11

  // how many "diamonds" there are inside each other in total
  const squares = (part2Steps + 1) / 2
  // maximum theoretical hits ( every spot on every diamond)
  const theoP = 4 * squares * squares
  console.log('theoP: ', theoP)
  // uneven blocked spots on original grid
  const blocked = grid.reduce((acc, c, i) => acc + (i % 2 === 1 && c === 1 ? 1 : 0), 0)
  console.log('blocked: ', blocked)

  // base for fully covered grids
  const maxFullGridsStraightReached = Math.floor(part2Steps / width - 1)
  // number of grids fully covered by largest diamond
  const fullGridsReached = 2 * (maxFullGridsStraightReached * maxFullGridsStraightReached + maxFullGridsStraightReached) + 1
  // covered grids times blocked tiles
  const blockedInFullReachedGrids = fullGridsReached * blocked
  // number of reachable tiles minus blocked in full covered grids
  const reachableInFullGridsPlusAllOutside = theoP - blocked * fullGridsReached
  const midToBorder = (width - 1) / 2
  const straightMovesLeft = (part2Steps - midToBorder) % width

  const topMid = start - midToBorder * width
  const bottomMid = start + midToBorder * width
  const leftMid = start - midToBorder
  const rightMid = start + midToBorder

  // four tip grids straight up,down,left and right from start, counting blocked tiles to subtract from total possible
  seen = {}
  const blockedMovesRight = solve2Rec(leftMid, 0, straightMovesLeft - 1)
  seen = {}
  const blockedMovesLeft = solve2Rec(rightMid, 0, straightMovesLeft - 1)
  seen = {}
  const blockedMovesUp = solve2Rec(bottomMid, 0, straightMovesLeft - 1)
  seen = {}
  const blockedMovesDown = solve2Rec(topMid, 0, straightMovesLeft - 1)
  const reachable = reachableInFullGridsPlusAllOutside - blockedMovesDown - blockedMovesLeft - blockedMovesRight - blockedMovesUp

  // corner is beyond half of tip grid
  if (straightMovesLeft > midToBorder + 1) {
    // below tip grid
    const rightSideBelowTipGrid = solve2Rec(topMid - midToBorder, 0, straightMovesLeft - midToBorder - 1)
  }
  if (straightMovesLeft > 0) {
    // below left of tip grid
    const rightSideLeftBelowTipGrid = solve2Rec(topMid - midToBorder, 0, straightMovesLeft + width - midToBorder - 1)
  }

  console.log('fullGridsReached: ', fullGridsReached)
  console.log('blockedInFullReachedGrids: ', blockedInFullReachedGrids)
  console.log('reachable: ', reachable)
  console.log('straightMovesLeft: ', straightMovesLeft)
  console.log('remainingMovesRight: ', blockedMovesRight)
  console.log('remainingMovesLeft: ', blockedMovesLeft)
  console.log('remainingMovesUp: ', blockedMovesUp)
  console.log('remainingMovesDown: ', blockedMovesDown)
  // console.log('rightSideBelowTipGrid: ', rightSideBelowTipGrid)

  // coloredGrid(grid, width, 1)
  return 0
}

function solve2Rec (p: number, step: number, maxStep_: number): number {
  if (maxStep_ < 0) return 0
  seen[p * 1000 + step] = 1
  if (step === maxStep_) {
    return (grid[p] === 1 && p % 2 === 1) ? 1 : 0
  }
  let sum = 0
  const neigh: number[] = [-width, 1, width, -1]
  for (let dir = 0; dir < neigh.length; dir++) {
    const nextP = p + neigh[dir]
    if (maxStep_ - step === 1) {
      if (grid[nextP] !== 1) continue
    } else {
      if (grid[nextP] === 1) continue
    }
    if ((nextP * 1000 + step + 1) in seen) continue
    if (nextP < 0 || nextP > grid.length - 1) continue
    const nextPX = nextP % width
    if (dir === 1 && nextPX === 0) continue
    if (dir === 3 && nextPX === width - 1) continue

    sum += solve2Rec(nextP, step + 1, maxStep_)
  }
  return sum
}

function coloredGrid (grid: number[], width: number, mode: number) {
  const colorOn = '\x1b[42m\x1b[37m'
  const colorOff = '\x1b[0m'
  if (mode === 1) {
    let line = ''
    grid.forEach((c, i) => {
      if (c === 1) {
        line += (i % 2 === 1 ? colorOn + '#' + colorOff : '#')
      } else {
        line += '.'
      }
      if (i % width === width - 1) {
        console.log(line)
        line = ''
      }
    })
  }
}
