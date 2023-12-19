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
console.log('Result Part 1: ', solve(1, 3));
console.log('Result Part 2: ', solve(4, 10));
function coloredGrid(p, before) {
    const route = [];
    while (p >= 0) {
        route.push(Math.floor(p / 4));
        p = before[p];
    }
    inputLines.forEach((l, lIdx) => {
        let outLine = '';
        [...l].forEach((c, cIdx) => {
            if (route.includes(lIdx * width + cIdx)) {
                outLine += '\x1b[42m\x1b[37m' + c + '\x1b[0m';
            }
            else {
                outLine += c;
            }
        });
        console.log(outLine);
    });
    console.log(route.reverse());
}
function solve(minStraight, maxStraight) {
    // up,right,down,left
    const nextVal = [-width, 1, width, -1];
    const cost = [];
    for (let i = 0; i < grid.length * 4; i++) {
        cost[i] = i < 4 ? 0 : Infinity;
    }
    const before = [];
    for (let i = 0; i < grid.length * 4; i++) {
        before[i] = i < 4 ? -Infinity : -1;
    }
    const queue = [0];
    console.time('t');
    while (queue.length > 0) {
        const thisP = queue.reduce((res, v, idx) => ((cost[res] !== undefined && cost[res] <= cost[v]) ? res : v), Infinity);
        const gridIndex = Math.floor(thisP / 4);
        const dir = thisP === 0 ? -Infinity : thisP - gridIndex * 4;
        const myCost = cost[thisP];
        for (let d = 0; d < 4; d++) {
            if (dir === d || Math.abs(dir - d) === 2)
                continue;
            for (let step = minStraight; step < maxStraight + 1; step++) {
                const nextGridIndex = gridIndex + nextVal[d] * step;
                if (nextGridIndex < 0 || nextGridIndex > grid.length - 1)
                    break;
                const nextGridX = nextGridIndex % width;
                if (d === 1 && nextGridX < step)
                    break;
                if (d === 3 && width - nextGridX <= step)
                    break;
                const nextP = nextGridIndex * 4 + d;
                let nextCost = myCost;
                for (let i = 1; i <= step; i++) {
                    nextCost += grid[gridIndex + nextVal[d] * i];
                }
                if (nextCost < cost[nextP]) {
                    before[nextP] = thisP;
                    cost[nextP] = nextCost;
                    if (!queue.includes(nextP)) {
                        queue.push(nextP);
                    }
                }
            }
        }
        queue.splice(queue.indexOf(thisP), 1);
    }
    let bestCost = Infinity;
    let exitNode = 0;
    for (let i = 1; i < 5; i++) {
        if (cost[cost.length - i] < bestCost) {
            bestCost = cost[cost.length - i];
            exitNode = cost.length - i;
        }
    }
    console.timeEnd('t');
    //  coloredGrid(exitNode, before)
    return bestCost;
}
//# sourceMappingURL=17.ts.orig.js.map