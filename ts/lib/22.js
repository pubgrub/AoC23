"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 22
*/
const day = '22';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
if (inputLines.slice(-1)[0] === '') {
    inputLines.pop();
}
const bricks = [];
inputLines.forEach((l) => {
    let x1, x2, y1, y2, z1, z2;
    const m = l.match(/(\d)+/g);
    if (m !== null) {
        const coordNumbers = m.map((d) => Number(d));
        [x1, y1, z1, x2, y2, z2] = [...coordNumbers];
        const b = {
            xMin: Math.min(x1, x2),
            xMax: Math.max(x1, x2),
            yMin: Math.min(y1, y2),
            yMax: Math.max(y1, y2),
            zMin: Math.min(z1, z2),
            zMax: Math.max(z1, z2)
        };
        bricks.push(b);
    }
});
sortBricks(bricks);
const moves = fallAll(bricks, 0, 0);
console.log('falls: ', moves);
if (test)
    console.log(brickListString(bricks));
sortBricks(bricks);
const result1 = solve1(bricks);
console.log('Result Part 1: ', result1);
const result2 = solve2(bricks);
console.log('Result Part 2: ', result2);
function sortBricks(bricks_) {
    bricks_ = bricks_.sort((a, b) => a.zMin - b.zMin);
}
// returns number of moved bricks
// mode: 0: run normal, 1: stop after one fall
function fallAll(bricks_, missing, mode_) {
    let nMoves = 0;
    let hasMoved = true;
    while (hasMoved) {
        hasMoved = false;
        for (let b1Idx = missing; b1Idx < bricks_.length; b1Idx++) {
            let minFreeZ = 1;
            for (let b2Idx = 0; b2Idx < b1Idx; b2Idx++) {
                if (bricks_[b1Idx].zMin <= bricks_[b2Idx].zMin)
                    continue;
                minFreeZ = xyCollision(bricks_[b1Idx], bricks_[b2Idx]) ? Math.max(minFreeZ, bricks_[b2Idx].zMax + 1) : minFreeZ;
            }
            const zMove = bricks_[b1Idx].zMin - minFreeZ;
            if (zMove > 0) {
                bricks_[b1Idx].zMin -= zMove;
                bricks_[b1Idx].zMax -= zMove;
                hasMoved = true;
                nMoves++;
                if (mode_ === 1)
                    return 1;
            }
        }
    }
    return nMoves;
}
function xyCollision(b1, b2) {
    if (b1.xMax < b2.xMin || b2.xMax < b1.xMin)
        return false;
    if (b1.yMax < b2.yMin || b2.yMax < b1.yMin)
        return false;
    return true;
}
function brickListString(bricks_) {
    let str = '';
    bricks_.forEach((b) => {
        str += b.xMin + ' ' + b.yMin + ' ' + b.zMin + ' ' + b.xMax + ' ' + b.yMax + ' ' + b.zMax + '\n';
    });
    return str;
}
function solve1(bricks_) {
    let count = 0;
    for (let i = 0; i < bricks_.length; i++) {
        const bricks = JSON.parse(JSON.stringify(bricks_));
        bricks.splice(i, 1);
        count += fallAll(bricks, i, 1) === 0 ? 1 : 0;
    }
    return count;
}
function solve2(bricks_) {
    let count = 0;
    for (let i = 0; i < bricks_.length; i++) {
        const bricks = JSON.parse(JSON.stringify(bricks_));
        bricks.splice(i, 1);
        count += fallAll(bricks, i, 0);
    }
    return count;
}
//# sourceMappingURL=22.js.map