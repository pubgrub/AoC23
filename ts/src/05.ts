import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 05
*/

const day = '05'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const numbersMatch = /(\d+).*?/g

let seeds: number[] = []
const maps: number[][][] = [] // maps[ conversion_pair][line][ dest, origin, groupLen]
let haveSeeds = false
let idx: number = -1
for (const l of inputLines) {
  if (l.length === 0) continue
  if (!haveSeeds) {
    const match = l.match(numbersMatch)
    if (match === null) { console.error('Seed Match did not match'); process.exit(1) }
    seeds = match?.map(s => Number(s))
    haveSeeds = true
  } else if (l.includes('-')) {
    idx = maps.push([]) - 1
  } else {
    const match = l.match(numbersMatch)
    if (match === null) { console.error('Map Match did not match'); process.exit(1) }
    const data = match.map(d => Number(d))
    maps[idx].push([data[0] - data[1], data[1], data[1] + data[2] - 1])
    // { offset, first, last}
  }
}
for (const m of maps) {
  m.sort((a, b) => a[1] - b[1])
}

// Part 1
let minLoc
for (const s of seeds) {
  let loc = s
  for (const section of maps) {
    for (const bracket of section) {
      if (loc >= bracket[1] && loc <= bracket[2]) {
        loc += bracket[0]
        break
      }
    }
  }
  minLoc = (minLoc === undefined) ? loc : Math.min(minLoc, loc)
}
console.log('Result Part 1: ', minLoc)

// Part 2
let rangesForSection: Array<[ number, number]> = []
let resultForSection: Array<[ number, number]> = []
const firstSeedRanges: Array<[ number, number]> = []

for (let i = 0; i < seeds.length; i += 2) {
  firstSeedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1])
}

let globalMinLoc = Infinity
firstSeedRanges.forEach((firstSeedRange, sI) => {
  resultForSection = [[...firstSeedRange]]
  for (const section of maps) {
    rangesForSection = resultForSection.map(tuple => [...tuple])
    resultForSection = []
    for (const singleRange of rangesForSection) {
      let sourceFirst = singleRange[0]
      const sourceLast = singleRange[1]
      for (const sectionRow of section) {
        let tempFirst = -Infinity
        let tempLast = Infinity
        const groupFirst = sectionRow[1]
        const groupLast = sectionRow[2]
        const offset = sectionRow[0]
        if (groupFirst > sourceLast || groupLast < sourceFirst) {
          continue
        }
        if (groupFirst <= sourceFirst) {
          tempFirst = sourceFirst
        } else {
          resultForSection.push([sourceFirst, groupFirst - 1])
          tempFirst = groupFirst
        }
        if (groupLast >= sourceLast) {
          tempLast = sourceLast
        } else {
          tempLast = groupLast
          sourceFirst = groupLast + 1
        }
        if (tempLast < Infinity) {
          resultForSection.push([tempFirst + offset, tempLast + offset])
        }
      }
      if (resultForSection.length === 0) {
        resultForSection.push(...rangesForSection)
      }
    }
  }
  let minLoc = Infinity
  for (const d of resultForSection) {
    if (d[0] < minLoc) minLoc = d[0]
  }
  if (minLoc < globalMinLoc) {
    globalMinLoc = minLoc
  }
})

console.log('Result Part 2: ', globalMinLoc)
