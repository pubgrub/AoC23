"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 17
*/
const day = '17';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
if (inputLines.slice(-1)[0] === '') {
    inputLines.pop();
}
const grid = [];
inputLines.forEach((l, lIdx) => {
    ;
    [...l].forEach((c) => {
        grid.push(Number(c));
    });
});
const width = inputLines[0].length;
// up,right,down,left
const nextVal = [-width * 12, 12, width * 12, -12];
const complete = [];
for (let i = 0; i < grid.length * 12; i++) {
    complete.push(false);
}
const cost = [];
for (let i = 0; i < grid.length * 12; i++) {
    cost[i] = i < 12 ? 0 : Infinity;
}
const before = [];
for (let i = 0; i < grid.length * 12; i++) {
    before[i] = i < 12 ? -Infinity : -1;
}
const queue = [0];
console.time('0');
while (queue.length > 0) {
    const q = queue.reduce((res, v, idx) => complete[v] ? res : ((cost[res] !== undefined && cost[res] <= cost[v]) ? res : v), Infinity);
    const gridIndex = Math.floor(q / 12);
    const baseQ = gridIndex * 12;
    const dir = q === 0 ? -Infinity : Math.floor((q % 12) / 3);
    const nStraight = q === 0 ? 0 : q - baseQ - dir * 3 + 1;
    const myCost = cost[q];
    let nextStraight;
    for (let d = 0; d < 4; d++) {
        if (Math.abs(dir - d) === 2 && q !== 0)
            continue;
        if (dir === d) {
            if (nStraight === 3) {
                continue;
            }
            else {
                nextStraight = nStraight + 1;
            }
        }
        else {
            nextStraight = 1;
        }
        const nextBaseQ = baseQ + nextVal[d];
        const nextGridIndex = nextBaseQ / 12;
        const nextP = nextBaseQ + d * 3 + nextStraight - 1;
        if (nextBaseQ < 0 || nextGridIndex > grid.length - 1)
            continue;
        if (gridIndex % width === 0 && nextGridIndex % width === width - 1)
            continue;
        if (gridIndex % width === width - 1 && nextGridIndex % width === 0)
            continue;
        const nextCost = myCost + grid[nextGridIndex];
        if ((nextCost < cost[nextP])) {
            before[nextP] = q;
            cost[nextP] = nextCost;
            if (!queue.includes(nextP)) {
                queue.push(nextP);
            }
        }
    }
    queue.splice(queue.indexOf(q), 1);
}
let bestCost = Infinity;
const exitNode = 0;
for (let i = 1; i < 13; i++) {
    if (cost[cost.length - i] < bestCost) {
        bestCost = cost[cost.length - i];
    }
}
console.log('Result Part 1: ', bestCost);
// coloredGrid(exitNode)
console.timeEnd('0');
function coloredGrid(p) {
    const route = [];
    while (p >= 0) {
        route.push(Math.floor(p / 12));
        p = before[p];
    }
    inputLines.forEach((l, lIdx) => {
        let outLine = '';
        [...l].forEach((c, cIdx) => {
            if (route.includes(lIdx * width + cIdx)) {
                outLine += '\x1b[42m' + c + '\x1b[0m';
            }
            else {
                outLine += c;
            }
        });
        console.log(outLine);
    });
    console.log(route.reverse());
}
//# sourceMappingURL=17.js.map