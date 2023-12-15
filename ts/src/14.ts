import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 14
*/

const day = '14'
const test: boolean = false

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))
if (inputLines.at(-1) === '') { inputLines.pop() }

// Part 1
const grid: string[] = [...inputLines]
let moved = true
while (moved) {
  moved = false
  for (let lIdx = 0; lIdx < grid.length - 1; lIdx++) {
    const line = grid[lIdx]
    let newLine = ''
    let newNextLine = ''
    ;[...line].forEach((c, cIdx) => {
      if (c === '.' && grid[lIdx + 1][cIdx] === 'O') {
        newLine += 'O'
        newNextLine += '.'
        moved = true
      } else {
        newLine += c
        newNextLine += grid[lIdx + 1][cIdx]
      }
    })
    grid[lIdx] = newLine
    grid[lIdx + 1] = newNextLine
  }
}
const load = grid.reduce((acc, s, idx, g) => {
  const m = s.match(/O/g)
  const factor = g.length - idx
  if (m === null) return acc
  return m ? acc + m.length * factor : acc
}, 0)

console.log('Result Part 1:', load)

// Part 2

const gridWidth = inputLines[0].length
const b0 = BigInt(0)

// build rotated orig grids
const rotOrigStringGrid: string[][] = [JSON.parse(JSON.stringify(inputLines))]
const rotHashGrid: bigint[][] = [hashGrid(rotOrigStringGrid[0])]
let rotString = inputLines
for (let i = 0; i < 3; i++) {
  rotString = rotateStringGrid(rotString)
  rotOrigStringGrid.push(rotString)
  rotHashGrid.push(hashGrid(rotString))
}

let mygrid = rockGrid(rotOrigStringGrid[0])
let myrot = 0

const hashCycle: Record<string, number> = {}
const hashRotate: Record<string, string> = {}

hashCycle[gridToString(mygrid)] = 0
let mygridString

const totalCycles = 1000000000

let beforeCycle = true
let cycle = 0
while (cycle < totalCycles) {
  cycle += 1
  for (myrot = 0; myrot < 4; myrot++) {
    mygrid = doRoll(mygrid, myrot)
    mygridString = gridToString(mygrid)
    if (mygridString in hashRotate) {
      mygrid = stringToGrid(hashRotate[mygridString])
    } else {
      mygrid = rotateGrid(mygrid)
      hashRotate[mygridString] = gridToString(mygrid)
    }
  }
  mygridString = gridToString(mygrid)
  if (mygridString in hashCycle) {
    if (beforeCycle) {
      beforeCycle = false
      const cycleLength = cycle - hashCycle[mygridString]
      const remainingCycles = (totalCycles - cycle) % cycleLength
      cycle = totalCycles - remainingCycles
    }
  } else {
    hashCycle[mygridString] = cycle
  }
}

console.log('Result Part 2:', getLoad(mygrid))
process.exit()

function getLoad (grid: bigint[]): number {
  return grid.reduce((acc, n, i, g): number => {
    let sum = 0
    for (let c = 0; c < gridWidth; c++) {
      sum += ((BigInt(2 ** c) & n) !== b0 ? 1 : 0)
    }
    return acc + sum * (g.length - i)
  }, 0)
}

function gridToString (grid: bigint[]): string {
  return grid.join('-')
}

function stringToGrid (str: string): bigint[] {
  return str.split('-').map(a => BigInt(a))
}

function doRoll (grid: bigint[], rot: number): bigint[] {
  const lclGrid: bigint[] = []
  grid.forEach((n) => {
    lclGrid.push(n)
  })
  moved = true
  while (moved) {
    moved = false
    for (let i = 1; i < grid.length; i++) {
      let oldVal
      if (!moved) { oldVal = lclGrid[i - 1] }
      ;[lclGrid[i - 1], lclGrid[i]] = doLineRoll(lclGrid[i], lclGrid[i - 1], rotHashGrid[rot][i - 1])
      if (lclGrid[i - 1] !== oldVal) { moved = true }
    }
  }
  return lclGrid
}

function doLineRoll (sourceLine: bigint, destLine: bigint, destHashLine: bigint): [bigint, bigint] {
  const destOccLine = destLine | destHashLine // Occ A alt
  const destNewLine = (destOccLine | sourceLine) & ~destHashLine // A neu = ( Occ A alt or B alt) and not A(x)
  const sourceNewLine = sourceLine & destOccLine
  return [destNewLine, sourceNewLine]
}

function rockGrid (grid: string[]): bigint[] {
  const rockList: bigint[] = grid.reduce<bigint[]>((rList, s, sIdx, g) => {
    const m = s.matchAll(/O/g)
    if (m === null) return [b0]
    let sum = b0
    for (const find of m) {
      sum += (find.index === undefined ? b0 : (BigInt(2 ** find.index)))
    }
    rList.push(sum)
    return rList
  }, [])

  return rockList
}

function hashGrid (grid: string[]): bigint[] {
  const hashList: bigint[] = []
  grid.forEach((g, gIdx) => {
    let val: bigint = b0
    ;[...g].forEach((c, cIdx) => {
      val = val + (c === '#' ? BigInt(2) ** BigInt(cIdx) : b0)
    })
    hashList.push(val)
  })
  return hashList
}

function rotateGrid (grid: bigint[]): bigint[] {
  const newGrid: bigint[] = []
  for (let i = 0; i < grid.length; i++) { newGrid.push(b0) }
  for (let l = grid.length - 1; l > -1; l--) {
    for (let c = 0; c < gridWidth; c++) {
      if ((grid[l] & BigInt(2 ** c)) !== b0) {
        newGrid[c] += BigInt(2 ** (grid.length - 1 - l))
      }
    }
  }
  return newGrid
}

// rotate right, so west is up after north
function rotateStringGrid (grid: string[]): string[] {
  const newGrid: string[] = []
  for (let i = 0; i < grid.length; i++) { newGrid.push('') }
  for (let l = grid.length - 1; l > -1; l--) {
    ;[...grid[l]].forEach((c, cIdx) => {
      newGrid[cIdx] += c
    })
  }
  return newGrid
}

function printGrid (grid: bigint[], rot: number): void {
  console.log('Printing grid: ', grid)
  const hashGrid = rotHashGrid[rot]
  let outputStr
  grid.forEach((l, lIdx) => {
    outputStr = ''
    for (let c = 0; c < gridWidth; c++) {
      if ((l & BigInt(2 ** c)) !== b0) {
        outputStr += 'O'
      } else if ((hashGrid[lIdx] & BigInt(2 ** c)) !== b0) {
        outputStr += '#'
      } else {
        outputStr += '.'
      }
    }
    console.log(outputStr)
  })
}
