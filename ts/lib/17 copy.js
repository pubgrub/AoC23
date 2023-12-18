"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 17
*/
const day = '17';
const test = true;
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
const height = inputLines.length;
const width = inputLines[0].length;
// up,right,down,left
const nextVal = [-width * 4, 4, width * 4, -4];
const complete = [];
for (let i = 0; i < grid.length * 4; i++) {
    complete.push(false);
}
const cost = [];
for (let i = 0; i < grid.length * 4; i++) {
    cost[i] = Infinity;
}
cost[0] = 0;
cost[1] = 0;
cost[2] = 0;
cost[3] = 0;
const nStraight = [];
for (let i = 0; i < grid.length * 4; i++) {
    nStraight[i] = 0;
}
const before = [];
for (let i = 0; i < grid.length * 4; i++) {
    before[i] = -1;
}
before[0] = -Infinity;
before[1] = -Infinity;
before[2] = -Infinity;
before[3] = -Infinity;
const queue = [0];
while (queue.length > 0) {
    const q = queue.reduce((res, v, idx) => complete[v] ? res : ((cost[res] !== undefined && cost[res] <= cost[v]) ? res : v), Infinity);
    const gridIndex = Math.floor(q / 4);
    const baseQ = gridIndex * 4;
    // queue.forEach((temp) => { console.log(Math.floor(temp / 4), temp % 4, cost[temp]) })
    // console.log('**************')
    const dir = q % 4;
    const myCost = cost[q];
    for (let d = 0; d < 4; d++) {
        if (Math.abs(dir - d) === 2)
            continue;
        let nextStraight;
        if (dir === d) {
            if (nStraight[q] === 3) {
                continue;
            }
            else {
                nextStraight = nStraight[q] + 1;
            }
        }
        else {
            nextStraight = 1;
        }
        const nextBaseQ = baseQ + nextVal[d];
        const nextGridIndex = nextBaseQ / 4;
        const nextP = nextBaseQ + d;
        if (complete[nextP])
            continue;
        if (nextBaseQ < 0 || nextGridIndex > grid.length - 1)
            continue;
        if (gridIndex % width === 0 && nextGridIndex % width === width - 1)
            continue;
        if (gridIndex % width === width - 1 && nextGridIndex % width === 0)
            continue;
        if ((myCost + grid[nextGridIndex] < cost[nextP]) ||
            //        (myCost + grid[nextGridIndex] === cost[nextP] && nextStraight < nStraight[nextP])) {
            (nextStraight < nStraight[nextP])) {
            before[nextP] = q;
            cost[nextP] = myCost + grid[nextGridIndex];
            nStraight[nextP] = nextStraight;
            if (!queue.includes(nextP)) {
                queue.push(nextP);
            }
        }
    }
    // complete[q] = true
    queue.splice(queue.indexOf(q), 1);
}
let bestCost = Infinity;
let exitNode = 0;
for (let i = 1; i < 5; i++) {
    if (cost[cost.length - i] < bestCost) {
        bestCost = cost[cost.length - i];
        exitNode = cost.length - i;
    }
}
console.log('Cost: ', bestCost);
coloredGrid(exitNode);
const completed = complete.reduce((acc, c) => acc + (c ? 1 : 0), 0);
const notCompleted = complete.reduce((acc, c, idx) => (c ? acc : [...acc, idx]), []);
console.log('completed: ', completed, ' of ', complete.length);
console.log('not completed: ', notCompleted);
process.exit();
function coloredGrid(p) {
    const route = [];
    while (p >= 0) {
        route.push(Math.floor(p / 4));
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
//# sourceMappingURL=17%20copy.js.map