import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 13
*/

const day = '13'
const test: boolean = false

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const grids: string[][] = [[]]
inputLines.forEach((l, lIdx) => {
  if (l.length !== 0) {
    grids.at(-1)?.push(l)
  } else {
    if (lIdx < inputLines.length - 1) {
      grids.push([])
    }
  }
})

const results: number[] = [0, 0]
grids.forEach((g) => {
  const arrays = getArraysFromGrid(g)
  const val = findMirrorLine(arrays, 0)
  results[0] += val
  results[1] += findAlteredMirrorLine(g, val)
})

console.log('Result Task 1: ', results[0])
console.log('Result Task 2: ', results[1])

// **********************************************

function getArraysFromGrid (grid: string[]): number[][] {
  const rowSum: number[] = []
  const colSum: number[] = []
  for (let i = 0; i < grid[0].length; i++) { colSum.push(0) }
  for (let i = 0; i < grid.length; i++) { rowSum.push(0) }
  grid.forEach((l, lIdx) => {
    ;[...l].forEach((c, cIdx) => {
      if (c === '#') {
        rowSum[lIdx] += 2 ** cIdx
        colSum[cIdx] += 2 ** lIdx
      }
    })
  })
  return [colSum, rowSum]
}

function findAlteredMirrorLine (grid: string[], part1Val: number): number {
  const width = grid[0].length
  for (let lIdx = 0; lIdx < grid.length; lIdx++) {
    const line = grid[lIdx]
    const preLines = grid.slice(0, lIdx)
    const postLines = grid.slice(lIdx + 1, grid.length)
    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const c = line[cIdx]
      const aktLine = line.slice(0, cIdx) + (c === '.' ? '#' : '.') + line.slice(cIdx + 1, width)
      const newGrid = [...preLines, aktLine, ...postLines]
      const result = (findMirrorLine(getArraysFromGrid(newGrid), part1Val))
      if (result !== 0) {
        return result
      }
    }
  }
  console.log('!!! did not find alternate mirror line!\n', grid)
  return 0
}

function findMirrorLine (arrays: number[][], part1Val: number): number {
  const factor = [1, 100]
  for (let a = 0; a < arrays.length; a++) {
    const arr = arrays[a]
    const width = arr.length
    for (let x = 1; x < width; x++) {
      const rightOf = width - x
      const arrayWidth = Math.min(x, rightOf)
      const lArrayStart = Math.max(0, x - rightOf)
      const lArray = arr.slice(lArrayStart, lArrayStart + arrayWidth)
      const rArray = arr.slice(x, x + arrayWidth).reverse()
      if (lArray.every((elem, index) => elem === rArray[index])) {
        const result = x * factor[a]
        if (part1Val === 0 || result !== part1Val) {
          return result
        }
      }
    }
  }
  return 0
}
