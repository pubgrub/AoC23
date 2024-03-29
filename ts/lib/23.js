"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 23
*/
const day = '23';
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
const width = inputLines[0].length;
const height = inputLines.length;
const tVal = { '#': -1, '.': 4, '^': 0, '>': 1, v: 2, '<': 3 };
const dOffset = [-width, 1, width, -1];
let start = -1;
let end = -1;
inputLines.forEach((l, lIdx) => {
    ;
    [...l].forEach((c, cIdx) => {
        grid.push(tVal[c]);
        if (lIdx === 0 && c === '.')
            start = grid.length - 1;
        if (lIdx === height - 1 && c === '.')
            end = grid.length - 1;
    });
});
const crossings = { start: { pos: start, neighbours: [], distances: [] } };
//
const result2 = solve2(start, end);
console.log('Result Part 2: ', result2);
function solve(start_, end_) {
    return s1rec(start_, end_, []);
}
function s1rec(pos_, end_, seen_) {
    const seen = [...seen_];
    let maxSeen = 0;
    seen.push(pos_);
    let oneWayOnly = true;
    let possibleNextMoves = [];
    while (oneWayOnly) {
        oneWayOnly = false;
        if (pos_ === end_) {
            return seen.length;
        }
        possibleNextMoves = [];
        for (let dir = 0; dir < 4; dir++) {
            const nextP = pos_ + dOffset[dir];
            if (nextP < 0 || nextP > grid.length - 1)
                continue;
            if (grid[nextP] === -1)
                continue;
            if (seen.includes(nextP))
                continue;
            if (grid[pos_] < 4 && dir !== grid[pos_])
                continue;
            possibleNextMoves.push(nextP);
        }
        if (possibleNextMoves.length === 1) {
            oneWayOnly = true;
            pos_ = possibleNextMoves[0];
            seen.push(pos_);
        }
    }
    possibleNextMoves.forEach((p) => {
        maxSeen = Math.max(s1rec(p, end_, seen), maxSeen);
    });
    return maxSeen;
}
function solve2(start, end) {
    // get all crossings
    let crossing;
    let pathLength;
    [crossing, pathLength] = followPathToCrossing(start + dOffset[2], 2, [start, end]);
    return (pathLength);
    const crossingsToCheck = [start, end];
    while (crossingsToCheck.length > 0) {
        const pos = crossingsToCheck[0];
        for (let dir = 0; dir < 4; dir++) {
            const foundCrossing = false;
            while (!foundCrossing) {
                for (let dir = 0; dir < 4; dir++) {
                    const nextP = pos_ + dOffset[dir];
                    if (nextP < 0 || nextP > grid.length - 1)
                        continue;
                    if (grid[nextP] === -1)
                        continue;
                    possibleNextMoves.push(nextP);
                    if (possibleNextMoves.length > 1) {
                    }
                }
            }
        }
        const firstCrossing = getPathToNextCrossing(start, start, end);
    }
}
function followPathToCrossing(pos_, dir_, startExit_) {
    let lastDir = dir_;
    let testDir = dir_;
    let pathLength = 1;
    while (true) {
        const possibleNextMoves = [];
        const possibleNextDirs = [];
        if (startExit_.includes(pos_))
            return null;
        for (let dir = 0; dir < 4; dir++) {
            if (Math.abs(dir - lastDir) === 2)
                continue;
            const testP = pos_ + dOffset[dir];
            if (testP < 0 || testP > grid.length - 1)
                continue;
            if (grid[testP] === -1)
                continue;
            possibleNextMoves.push(testP);
            possibleNextDirs.push(dir);
            testDir = dir;
            if (possibleNextMoves.length > 1) {
                return [pos_, pathLength, possibleNextDirs];
            }
        }
        pos_ = possibleNextMoves[0];
        pathLength += 1;
        lastDir = testDir;
    }
}
//# sourceMappingURL=23.js.map