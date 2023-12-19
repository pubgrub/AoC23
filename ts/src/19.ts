import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 19
*/

const day = '19'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

let section = 0

interface rule {
  tests: string[]
  targets: string[]
  default: string
}
const rules: Record<string, rule> = {}
const data: Array<Record<string, string>> = []

inputLines.forEach((l) => {
  if (l.length === 0) {
    section++
  } else {
    if (section === 0) {
      const matches1 = l.matchAll(/(^[a-z]+)|([amsx][<>][0-9]+:[a-zA-Z]+,)|([a-z-A-Z]+)/g)
      let ruleName = ''
      if (matches1 !== null) {
        for (const m of matches1) {
          if (m[1] !== undefined) {
            rules[m[1]] = { tests: [], targets: [], default: '' }
            ruleName = m[1]
          }
          if (m[2] !== undefined) {
            const matches2 = m[2].match(/(.*?):(.*?),/)
            if (matches2 !== null) {
              rules[ruleName].tests.push(matches2[1])
              rules[ruleName].targets.push(matches2[2])
            }
          }
          if (m[3] !== undefined) {
            rules[ruleName].default = m[3]
          }
        }
      }
    } else if (section === 1) {
      const matches1 = l.matchAll(/([xmas])|(\d+)/g)
      const val: Record<string, string> = {}
      let v: string = ''
      if (matches1 !== null) {
        for (const m of matches1) {
          if (m[1] !== undefined) {
            v = m[1]
          } else if (m[2] !== undefined) {
            val[v] = m[2]
          }
        }
        data.push({ x: val.x, m: val.m, a: val.a, s: val.s })
      }
    }
  }
})

const result = solve1(rules, data)
console.log('Result Part 1: ', result)

const result2 = solve2(rules)
console.log('Result Part 2: ', result2)

function solve1 (rules_: Record<string, rule>, data_: Array<Record<string, string>>): number {
  return data.reduce((acc, d) => acc + calcData(rules_, d), 0)
}

function calcData (rules_: Record<string, rule>, d: Record<string, string>): number {
  let func = rules_.in
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const x = d.x
  const m = d.m
  const a = d.a
  const s = d.s
  /* eslint-enable */
  const sum = Object.values(d).reduce((acc, item) => acc + Number(item), 0)
  while (true) {
    let foundNextFunc = false
    for (let t = 0; t < func.tests.length; t++) {
      let evString = func.tests[t]
      Object.keys(d).forEach(key => {
        const regex = new RegExp(key)
        evString = evString.replace(regex, d[key])
      })
      // eslint-disable-next-line no-eval
      const ev: boolean = eval(evString)
      if (ev) {
        if (func.targets[t] === 'A') return sum
        if (func.targets[t] === 'R') return 0
        func = rules_[func.targets[t]]
        foundNextFunc = true
        break
      }
    }
    if (!foundNextFunc) {
      if (func.default === 'A') return sum
      if (func.default === 'R') return 0
      func = rules_[func.default]
    }
  }
}

function solve2 (rules_: Record<string, rule>): number {
  const minVals: number[] = [1, 1, 1, 1]
  const maxVals: number[] = [4000, 4000, 4000, 4000]
  return solve2Rec(rules_, 'in', minVals, maxVals)
}

function solve2Rec (rules_: Record<string, rule>, str_: string, minVals_: number[], maxVals_: number[]): number {
  if (str_ === 'A') return minVals_.reduce((acc, m, i) => acc * (maxVals_[i] - m + 1), 1)
  if (str_ === 'R') return 0

  const vI: Record<string, number> = { x: 0, m: 1, a: 2, s: 3 }
  let sum = 0
  const minVals = [...minVals_]
  const maxVals = [...maxVals_]
  const rule = rules_[str_]
  for (let t = 0; t < rule.tests.length; t++) {
    const match = rule.tests[t].match(/([xmas])([<>])(\d+)/)
    if (match !== null) {
      const varName = match[1]
      const varVal = Number(match[3])
      if (match[2] === '>') {
        const tempMinVals = [...minVals]
        tempMinVals[vI[varName]] = varVal + 1
        sum += solve2Rec(rules_, rule.targets[t], tempMinVals, maxVals)
        maxVals[vI[varName]] = Math.min(varVal, maxVals[vI[varName]])
      } else if (match[2] === '<') {
        const tempMaxVals = [...maxVals]
        tempMaxVals[vI[varName]] = varVal - 1
        sum += solve2Rec(rules_, rule.targets[t], minVals, tempMaxVals)
        minVals[vI[varName]] = Math.max(varVal, minVals[vI[varName]])
      }
    }
  }
  sum += solve2Rec(rules_, rule.default, minVals, maxVals)
  return sum
}
