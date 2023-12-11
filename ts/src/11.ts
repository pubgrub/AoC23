import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 11
*/

const day = '11'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

// find empty lines/cols
const emptyLines: number[] = []
const colHasGalaxy: number[] = []
inputLines.forEach((line, lIdx) => {
  if (!line.includes('#')) emptyLines.push(lIdx);
  [...line].forEach((c, cIdx) => {
    if (c === '#') colHasGalaxy.push(cIdx)
  })
})

const emptyCols: number[] = []
for (let i = 0; i < inputLines[0].length; i++) {
  if (!colHasGalaxy.includes(i)) emptyCols.push(i)
}

const galaxies: Array<[number, number]> = []
inputLines.forEach((l, lIdx) => {
  for (const m of l.matchAll(/#/g)) {
    if (m.index !== undefined) galaxies.push([m.index, lIdx])
  }
})

console.log('Result Part 1: ', calcDistances(galaxies, 1))
console.log('Result Part 2: ', calcDistances(galaxies, 999999))

function calcDistances (gal: Array<[number, number]>, f: number): number {
  let sumDistances: number = 0
  const newGal: Array<[number, number]> = []
  gal.forEach((g, gIdx) => {
    const smallerX = emptyCols.reduce((acc, n) => acc + (n < g[0] ? 1 : 0), 0)
    const smallerY = emptyLines.reduce((acc, n) => acc + (n < g[1] ? 1 : 0), 0)
    newGal.push([g[0] + smallerX * f, g[1] + smallerY * f])
  })
  newGal.forEach((g, gIdx) => {
    for (let g2 = gIdx + 1; g2 < newGal.length; g2++) {
      sumDistances += Math.abs(g[0] - newGal[g2][0]) + Math.abs(g[1] - newGal[g2][1])
    }
  })
  return sumDistances
}
