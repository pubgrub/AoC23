import { dir } from 'console'
import { readFileSync } from 'fs'

/* Advent of Code 2023
Day 24
*/

const day = '24'
const test: boolean = false
// const testPart1: boolean = true
// const testPart2: boolean = true

const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`
let inputLines = readFileSync(fileName).toString().split('\n')
inputLines = inputLines.map(str => (str.trim()))
if (inputLines.slice(-1)[0] === '') { inputLines.pop() }

const x_: number[] = []
const y_: number[] = []
const z_: number[] = []
const vx_: number[] = []
const vy_: number[] = []
const vz_: number[] = []

const minBox = test ? 7 : 200000000000000
const maxBox = test ? 27 : 400000000000000

inputLines.forEach((l) => {
  const m = l.match(/(-*\d+)/g)
  if (m !== null) {
    x_.push(Number(m[0]))
    y_.push(Number(m[1]))
    z_.push(Number(m[2]))
    vx_.push(Number(m[3]))
    vy_.push(Number(m[4]))
    vz_.push(Number(m[5]))
  }
})

const result1 = solve1()
console.log('Result Part 1: ', result1)

const minX: number[] = [-Infinity]
const vxMin: number[] = [-Infinity]
const vxMax: number[] = [Infinity]

const vxList: number [] = [Infinity]

for (let idx = 0; idx < x_.length; idx++) {
  const x = x_[idx]
  if (minX.includes(x)) {
    // new x already in list
    const xPos = minX.indexOf(x)

    if (vxList[xPos] !== Infinity && vx_[idx] !== vxList[xPos]) {
      // existing x is other x and vx do not match
      vxMax[xPos] = -Infinity
      vxMin[xPos] = Infinity
      for (let i0 = 0; i0 < xPos; i0++) {
        vxMin[i0] = Math.max(vxMin[i0], vx_[idx])
      }
      for (let i0 = xPos + 1; i0 < vxMax.length; i0++) {
        vxMax[i0] = Math.min(vxMax[i0], vx_[idx])
      }
      continue
    }
  }
  let found = false
  for (let i = 0; i < minX.length; i++) {
    if (x < minX[i]) {
      // new block left of block at i
      const lastvxMax = vxMax[i - 1]
      if (!minX.includes(x + 1)) {
        // no block right of new block
        minX.splice(i, 0, x + 1)
        vxList.splice(i, 0, Infinity)
        vxMin.splice(i, 0, vxMin[i - 1])
        vxMax.splice(i, 0, Math.min(vx_[idx] - 1, lastvxMax))
      }
      minX.splice(i, 0, x)
      vxList.splice(i, 0, vx_[idx])
      vxMin.splice(i, 0, vx_[idx])
      for (let i0 = 0; i0 < i; i0++) {
        vxMin[i0] = Math.max(vxMin[i0], vx_[idx] + 1)
      }
      vxMax.splice(i, 0, Math.min(vx_[idx], lastvxMax))
      for (let i0 = i + 1; i0 < vxMax.length; i0++) {
        vxMax[i0] = Math.min(vxMax[i0], vx_[idx] - 1)
      }
      found = true
      break
    }

    if (x === minX[i]) {
      // new block at beginning of existing block
      const lastVxMax = vxMax[i - 1]
      minX.splice(i + 1, 0, x + 1)
      vxList.splice(i, 0, vx_[idx])
      vxMin.splice(i, 0, vx_[idx])
      vxMax.splice(i, 0, Math.min(vx_[idx], lastVxMax))
      for (let i0 = i + 1; i0 < vxMax.length; i0++) {
        vxMax[i0] = Math.min(vxMax[i0], vx_[idx] - 1)
      }
      found = true
      break
    }
  }
  if (!found) {
    // new block right of all blocks
    minX.push(x)
    minX.push(x + 1)
    vxList.push(vx_[idx])
    vxList.push(Infinity)
    vxMin.push(vx_[idx], vxMin[vxMin.length - 1])
    for (let i = 0; i < vxMin.length - 2; i++) {
      vxMin[i] = Math.max(vxMin[i], vx_[idx] + 1)
    }
    vxMin[vxMin.length - 2] = vx_[idx]
    const lastVxMax = vxMax[vxMax.length - 1]
    vxMax.push(Math.min(vx_[idx], lastVxMax),
      Math.min(vx_[idx] - 1, lastVxMax))
  }
}

// minX.forEach((minx, idx) => {
//   if (vxMin[idx] <= vxMax[idx]) {
//     console.log(minx, vxMin[idx], vxMax[idx])
//   }
// })

minX.forEach((minx, idx) => {
  if (vxMin[idx] === vxMax[idx]) {
    let matchCount = 0
    for (let i = 0; i < x_.length; i++) {
      const t = (x_[i] - minx) / (vxMin[idx] - vx_[i])
      if (t === Math.floor(t) || minx === x_[i]) {
        matchCount++
      }
    }
    if (matchCount === x_.length) {
      const qx = minx
      const qvx = vxList[idx]
      const ax = x_[0]
      const bx = x_[1]
      const avx = vx_[0]
      const bvx = vx_[1]
      const avy = vy_[0]
      const bvy = vy_[1]
      const avz = vz_[0]
      const bvz = vz_[1]

      const taq = (ax - qx) / (qvx - avx)
      const tbq = (bx - qx) / (qvx - bvx)
      const ayt = y_[0] + avy * taq
      const azt = z_[0] + avz * taq
      const byt = y_[1] + bvy * tbq
      const bzt = z_[1] + bvz * tbq
      const tab = tbq - taq
      const dyabt = byt - ayt
      const qvy = dyabt / tab
      const qy = ayt - taq * qvy
      const dzabt = bzt - azt
      const qvz = dzabt / tab
      const qz = azt - taq * qvz

      // console.log('qx: ', qx)
      // console.log('qvx: ', qvx)
      // console.log('ay,avy: ', y_[0], avy)
      // console.log('az,avz: ', z_[0], avz)
      // console.log('by,bvy: ', y_[1], bvy)
      // console.log('bz,bvz: ', z_[1], bvz)
      // console.log('taq: ', taq)
      // console.log('tbq: ', tbq)
      // console.log('tab ', tab)
      // console.log('qvy ', qvy)
      // console.log('qvz ', qvz)
      // console.log('qy ', qy)
      // console.log('qz ', qz)
      console.log('Result Part 2: ', qx + qy + qz)
    }
  }
})

function solve1 (): number {
  const a: number[] = []
  const c: number[] = []
  const xDir: number[] = []
  const yDir: number[] = []

  let inCorridor = 0
  x_.forEach((x, idx) => {
    const y = y_[idx]
    const vx = vx_[idx]
    const vy = vy_[idx]
    // y = ax + c
    a.push(vy / vx)
    c.push(y - a[idx] * x)
    xDir.push(dirTo(vx))
    yDir.push(dirTo(vy))
  })
  // console.log('a: ', a)
  // console.log('c: ', c)
  // console.log('xDir: ', xDir)
  // console.log('yDir: ', yDir)
  for (let l1 = 0; l1 < x_.length - 1; l1++) {
    for (let l2 = l1 + 1; l2 < x_.length; l2++) {
      const xCross = (c[l2] - c[l1]) / (a[l1] - a[l2])
      const yCross = a[l1] * xCross + c[l1]
      const x1DirToCross = dirTo(xCross - x_[l1])
      const x2DirToCross = dirTo(xCross - x_[l2])
      const y1DirToCross = dirTo(yCross - y_[l1])
      const y2DirToCross = dirTo(yCross - y_[l2])
      if (x1DirToCross === xDir[l1] &&
        x2DirToCross === xDir[l2] &&
        y1DirToCross === yDir[l1] &&
        y2DirToCross === yDir[l2] &&
        xCross >= minBox && xCross <= maxBox &&
        yCross >= minBox && yCross <= maxBox) {
        //        console.log(l1, l2, xCross, yCross, xDir[l1], yDir[l1])
        inCorridor++
      }
    }
  }

  return inCorridor
}

function dirTo (a: number): number {
  return a !== 0 ? a / Math.abs(a) : 0
}
