"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/comma-spacing */
const fs_1 = require("fs");
/* Advent of Code 2023
Day 10
*/
const day = '10';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const gridWidth = inputLines[0].length;
const gridLength = inputLines.length;
let gl = gridLength;
let yFactor = 1;
while (gl > 1) {
    gl = gl / 10 | 0;
    yFactor += 1;
}
const grid = [];
const chars = ['-', '|', 'F', '7', 'L', 'J', '.', 'S'];
const vectors = [[-10, 10], [-1, 1], [1, 10], [-10, 1], [-1, 10], [-10, -1]];
const turnDir = {
    0: { '-10': 0, 10: 0 },
    1: { '-1': 0, 1: 0 },
    2: { 10: 1, 1: -1 },
    3: { '-10': -1, 1: 1 },
    4: { 10: -1, '-1': 1 },
    5: { '-10': 1, '-1': -1 }
};
const symbolVal = chars.reduce((obj, c, index) => {
    obj[c] = index;
    return obj;
}, {});
let start = [0, 0];
inputLines.forEach((l, lIdx) => {
    [...l].forEach((c, cIdx) => {
        if (c === 'S') {
            start = [cIdx, lIdx];
        }
        grid[keyFromPos([cIdx, lIdx])] = symbolVal[c];
    });
});
grid[keyFromPos(start)] = getCharVal(start);
// *********************
// Part 1
let done = false;
let aktPos = start;
let previousDir = -vectors[grid[keyFromPos(start)]][0];
let steps = 0;
let turnCount = 0;
// where am I
const pointsOnLoop = [start];
// how did I come here
const dirOnLoop = [[previousDir, vectors[grid[keyFromPos(start)]][1]]];
while (!done) {
    const thisDir = vectors[grid[keyFromPos(aktPos)]].filter(item => item !== -previousDir)[0];
    turnCount += turnDir[grid[keyFromPos(aktPos)]][thisDir];
    previousDir = thisDir;
    aktPos = nextPos(aktPos, thisDir);
    pointsOnLoop.push(aktPos);
    const dirFromHere = vectors[grid[keyFromPos(aktPos)]].filter(item => item !== -thisDir)[0];
    dirOnLoop.push([thisDir, dirFromHere]);
    steps += 1;
    if (aktPos[0] === start[0] && aktPos[1] === start[1]) {
        done = true;
    }
}
console.log('Result Part 1: ', steps / 2);
// *********************
// Part 2
const filledPoints = [];
if (Math.abs(turnCount) !== 4) {
    console.error('could not establish turn direction, got: ' + turnCount);
    process.exit(1);
}
// for rightTurns, otherwise * -1
const fillDir = { 10: 1, '-10': -1, 1: -10, '-1': 10 };
const fillDirFactor = turnCount === 4 ? 1 : -1;
pointsOnLoop.forEach((point, pIdx) => {
    for (const dirs of [dirOnLoop[pIdx][0], dirOnLoop[pIdx][1]]) {
        const fillCheck = nextPos(point, fillDir[dirs] * fillDirFactor);
        if (!isInList(filledPoints, fillCheck)) {
            fillArea(fillCheck, filledPoints);
        }
    }
});
console.log('Result Part 2: ', filledPoints.length);
// exportColored(inputLines, pointsOnLoop, filledPoints)
function fillArea(pos, filledList) {
    if (isInList(pointsOnLoop, pos))
        return;
    addIfNotInList(filledList, pos);
    for (const p of [10, -10, 1, -1]) {
        if (!isInList(filledPoints, nextPos(pos, p))) {
            fillArea(nextPos(pos, p), filledList);
        }
    }
}
function addIfNotInList(list, item) {
    if (!isInList(list, item)) {
        list.push(item);
    }
}
function isInList(list, item) {
    return list.some((listItem) => item[0] === listItem[0] && item[1] === listItem[1]);
}
function getNextX(pos, dir) {
    const nextX = { 10: 1, '-10': -1, 1: 0, '-1': 0 };
    return pos[0] + nextX[dir];
}
function getNextY(pos, dir) {
    const nextY = { 10: 0, '-10': 0, 1: 1, '-1': -1 };
    return pos[1] + nextY[dir];
}
function nextPos(pos, dir) {
    return [getNextX(pos, dir), getNextY(pos, dir)];
}
function keyFromPos(pos) {
    return pos[0] * 10 ** yFactor + pos[1];
}
// get actual type of "S" position
function getCharVal(pos) {
    const neighbours = [-10, -1, 1, 10];
    const neighbourDirections = [];
    for (const n of neighbours) {
        const neighbourX = pos[0] + ((n / 10) | 0);
        const neighbourY = pos[1] + (n % 10);
        if (neighbourX < 0 || neighbourX > gridWidth - 1 || neighbourY < 0 || neighbourY > gridLength - 1) {
            continue;
        }
        //    console.log(n, -n, neighbourPos, grid[neighbourPos[0]][neighbourPos[1]])
        const neighbourVal = grid[keyFromPos([neighbourX, neighbourY])];
        if (neighbourVal < 6 && vectors[neighbourVal].includes(-n)) {
            neighbourDirections.push(n);
        }
    }
    let valid = false;
    for (let i = 0; i < vectors.length; i++) {
        const vArr = vectors[i];
        valid = true;
        vArr.forEach((dir, dIdx) => {
            if (neighbourDirections[dIdx] !== dir)
                valid = false;
        });
        if (valid)
            return i;
    }
    return -1;
}
function exportColored(lines, data1, data2) {
    const colorFileName = test ? `../testdata/${day}.txt.ans` : `../data/${day}.txt.ans`;
    const bgRed = '\x1b[41m';
    const bgGreen = '\x1b[42m';
    const bgNorm = '\x1b[0m';
    let text = '';
    inputLines.forEach((l, lIdx) => {
        [...l].forEach((c, cIdx) => {
            if (isInList(data1, [cIdx, lIdx])) {
                text += bgRed + c + bgNorm;
            }
            else if (isInList(data2, [cIdx, lIdx])) {
                text += bgGreen + c + bgNorm;
            }
            else {
                text += c;
            }
        });
        text += '\n';
    });
    (0, fs_1.writeFileSync)(colorFileName, text);
}
//# sourceMappingURL=10.js.map