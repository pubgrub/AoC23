"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 24
*/
const day = '24';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
if (inputLines.slice(-1)[0] === '') {
    inputLines.pop();
}
const x_ = [];
const y_ = [];
const z_ = [];
const vx_ = [];
const vy_ = [];
const vz_ = [];
const minBox = test ? 7 : 200000000000000;
const maxBox = test ? 27 : 400000000000000;
inputLines.forEach((l) => {
    const m = l.match(/(-*\d+)/g);
    if (m !== null) {
        console.log(m);
        x_.push(Number(m[0]));
        y_.push(Number(m[1]));
        z_.push(Number(m[2]));
        vx_.push(Number(m[3]));
        vy_.push(Number(m[4]));
        vz_.push(Number(m[5]));
    }
});
const result1 = solve1();
console.log('Result Part 1: ', result1);
function solve1() {
    const a = [];
    const c = [];
    const xDir = [];
    const yDir = [];
    let inCorridor = 0;
    x_.forEach((x, idx) => {
        const y = y_[idx];
        const vx = vx_[idx];
        const vy = vy_[idx];
        // y = ax + c
        a.push(vy / vx);
        c.push(y - a[idx] * x);
        xDir.push(dirTo(vx));
        yDir.push(dirTo(vy));
    });
    console.log('a: ', a);
    console.log('c: ', c);
    console.log('xDir: ', xDir);
    console.log('yDir: ', yDir);
    for (let l1 = 0; l1 < x_.length - 1; l1++) {
        for (let l2 = l1 + 1; l2 < x_.length; l2++) {
            const xCross = (c[l2] - c[l1]) / (a[l1] - a[l2]);
            const yCross = a[l1] * xCross + c[l1];
            const x1DirToCross = dirTo(xCross - x_[l1]);
            const x2DirToCross = dirTo(xCross - x_[l2]);
            const y1DirToCross = dirTo(yCross - y_[l1]);
            const y2DirToCross = dirTo(yCross - y_[l2]);
            if (x1DirToCross === xDir[l1] &&
                x2DirToCross === xDir[l2] &&
                y1DirToCross === yDir[l1] &&
                y2DirToCross === yDir[l2] &&
                xCross >= minBox && xCross <= maxBox &&
                yCross >= minBox && yCross <= maxBox) {
                //        console.log(l1, l2, xCross, yCross, xDir[l1], yDir[l1])
                inCorridor++;
            }
        }
    }
    return inCorridor;
}
function dirTo(a) {
    return a !== 0 ? a / Math.abs(a) : 0;
}
//# sourceMappingURL=24.js.map