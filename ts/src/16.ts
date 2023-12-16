import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 16
*/

const day = '16'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let lines = readFileSync(fileName).toString().split('\n')
lines = lines.map(str => (str.trim()))
if (lines[lines.length - 1].length === 0) { lines.pop() }

// 0=up, 1=right...
const nextDirs: Record<string, Record<number, number[]>> = {
  '/': { 0: [1], 1: [0], 2: [3], 3: [2] },
  '\\': { 0: [3], 1: [2], 2: [1], 3: [0] },
  '-': { 0: [1, 3], 2: [1, 3], 1: [1], 3: [3] },
  '|': { 0: [0], 2: [2], 1: [2, 0], 3: [2, 0] },
  '.': { 0: [0], 1: [1], 2: [2], 3: [3] }
}

const height = lines.length - 1
const width = lines[0].length - 1

const nextX: Record<number, number> = { 0: 0, 1: 1, 2: 0, 3: -1 }
const nextY: Record<number, number> = { 0: -1, 1: 0, 2: 1, 3: 0 }

interface Beam {
  x: number
  y: number
  d: number
}

const beams: Beam[] = [{ x: 0, y: 0, d: 1 }]
const cache1: Beam[] = []
const seen: Record<string, number> = {}

// Part 1

let done = false
while (!done) {
  done = true
  const beamsToDelete: number[] = []
  for (let i = 0; i < beams.length; i++) {
    const b = beams[i]
    const bHash = String(b.x) + '-' + String(b.y)
    if (!(bHash in seen)) {
      seen[bHash] = 0
    }
    if (!cache1.some(item => item.x === b.x && item.y === b.y && item.d === b.d)) {
      cache1.push(b)
      const sym = lines[b.y][b.x]
      nextDirs[sym][b.d].forEach((newD, dI) => {
        const newX = b.x + nextX[newD]
        const newY = b.y + nextY[newD]
        if (newX >= 0 && newX <= width && newY >= 0 && newY <= height) {
          beams.push({ x: newX, y: newY, d: newD })
          done = false
        }
      })
      beamsToDelete.push(i)
    }
  }
  for (let i = 0; i < beamsToDelete.length; i++) {
    beams.splice(i, 1)
  }
}

const result1 = Object.keys(seen).length
console.log('Result Part 1: ', result1)

// Part 2

const xmin: number[] = [0, width + 1, 0, -1]
const xmax: number[] = [width, width + 1, width, -1]
const ymin: number[] = [-1, 0, height + 1, 0]
const ymax: number[] = [-1, height, height + 1, height]
const sDir: number[] = [2, 3, 0, 1]

let routesToGoX: number[] = []
let routesToGoY: number[] = []
let routesToGoD: number[] = []
let maxSum = 0

for (let side = 0; side < 4; side++) {
  for (let x0 = xmin[side]; x0 < xmax[side] + 1; x0++) {
    for (let y0 = ymin[side]; y0 < ymax[side] + 1; y0++) {
      const seen: Record<string, number> = {}
      routesToGoX = [x0]
      routesToGoY = [y0]
      routesToGoD = [sDir[side]]
      for (let rt = 0; rt < routesToGoX.length; rt++) {
        let alive = true
        let x = routesToGoX[rt]
        let y = routesToGoY[rt]
        let d = routesToGoD[rt]
        while (alive) {
          x = x + nextX[d]
          y = y + nextY[d]
          const hash = hashKey(x, y, d)
          if (x < 0 || x > width || y < 0 || y > height || hash in seen) {
            alive = false
          } else {
            seen[hash] = 0
            const nextDir = nextDirs[lines[y][x]][d]
            d = nextDir[0]
            if (nextDir.length > 1) {
              routesToGoX.push(x)
              routesToGoY.push(y)
              routesToGoD.push(nextDir[1])
            }
          }
        }
      }
      const grid: string[] = []
      for (const s in seen) {
        const m = s.match(/(\d+-\d+)-(\d+)/)
        if (m === null) { console.error('wrong hash'); process.exit(1) }
        if (!grid.includes(m[1])) {
          grid.push(m[1])
        }
      }
      maxSum = Math.max(maxSum, grid.length)
    }
  }
}
console.log('Result Part 2: ', maxSum)

function hashKey (x: number, y: number, d: number): string {
  return String(x) + '-' + String(y) + '-' + String(d)
}
