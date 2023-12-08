import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 08
*/

const day = '08'
const test: boolean = false
const testPart1: boolean = false
const testPart2: boolean = true

const fileName = test ? `../testdata/${day}_2.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))

const commandLine = inputLines.shift() ?? ''
const commands = [...commandLine].map((x) => {
  const n = (x.replace(/L/, '0').replace(/R/, '1'))
  return Number(n)
})

const next: Record<string, string[]> = {}

inputLines.forEach((line) => {
  if (line.length === 0) return
  const m = line.match(/([A-Z0-9]{3})/g)
  if (m === null) {console.error('next fetch did not match'); process.exit(1)}
  next[m[0]] = [m[1], m[2]]
})

let actCommand = -1
let steps = 0

// Part 1
if (!test || testPart1) {
  let actToken = 'AAA'
  while (actToken !== 'ZZZ') {
    actCommand = (actCommand === commands.length - 1) ? 0 : actCommand + 1
    actToken = next[actToken][commands[actCommand]]
    steps += 1
  }
  console.log('Result Part 1: ' + steps)
}

// Part 2:
const actTokens: string[] = []
const endTokens: string[] = []
Object.keys(next).forEach((k) => {
  if (k.slice(-1) === 'A') actTokens.push(k)
  if (k.slice(-1) === 'Z') endTokens.push(k)
})

const stepsList: number[] = []
actTokens.forEach((t) => {
  actCommand = -1
  steps = 0
  let done = false
  while (!done) {
    actCommand = (actCommand === commands.length - 1) ? 0 : actCommand + 1
    t = next[t][commands[actCommand]]
    steps += 1
    if (endTokens.includes(t)) {
      stepsList.push(steps)
      done = true
    }
  }
})

const primes: number[][] = [[], [], [], [], [], []]
stepsList.forEach((n, idx) => {
  while (n % 2 === 0) {
    primes[idx].push(2)
    n /= 2
  }
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      primes[idx].push(i)
      n /= i
    }
  }
  if (n > 2) {
    primes[idx].push(n)
  }
})

let result = 1
primes.forEach((list, idx) => {
  list.forEach((p) => {
    result *= p
    for (let i = idx + 1; i < primes.length; i++) {
      const index = primes[i].indexOf(p)
      if (index !== -1) primes[i].splice(index, 1)
    }
  })
})
console.log('Result Part 2: ' + result)
