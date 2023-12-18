"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 18
*/
const day = '18';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const dir1 = [];
const len1 = [];
const dir2 = [];
const len2 = [];
const dirStr = ['R', 'D', 'L', 'U'];
inputLines.forEach((l) => {
    if (l.length !== 0) {
        const m = l.match(/([RDLU])\s(\d+)\s\(#([0-9a-f]{5})([0-3])\)/);
        if (m !== null) {
            // 1
            dir1.push(m[1]);
            len1.push(Number(m[2]));
            // 2
            dir2.push(dirStr[Number(m[4])]);
            len2.push(parseInt(m[3], 16));
        }
    }
});
// console.log(dir, len)
const result1 = solve(dir1, len1);
console.log('Result Part 1: ', result1);
const result2 = solve(dir2, len2);
console.log('Result Part 2: ', result2);
process.exit();
function solve(dir_, len_) {
    const xOffset = { U: 0, R: 1, D: 0, L: -1 };
    const yOffset = { U: -1, R: 0, D: 1, L: 0 };
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    let x = 0;
    let y = 0;
    dir_.forEach((d, dIdx) => {
        x += len_[dIdx] * xOffset[d];
        y += len_[dIdx] * yOffset[d];
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
    });
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    console.log(width, height);
    let vertCol = [];
    let vertMin = [];
    let vertMax = [];
    x = -minX;
    y = -minY;
    dir_.forEach((d, i) => {
        switch (d) {
            case 'D':
                vertCol.push(x);
                vertMin.push(y);
                y += len_[i];
                vertMax.push(y);
                break;
            case 'U':
                vertCol.push(x);
                vertMax.push(y);
                y -= len_[i];
                vertMin.push(y);
                break;
            case 'L':
                x -= len_[i];
                break;
            case 'R':
                x += len_[i];
                break;
        }
    });
    // sort rows
    const indices = vertCol.map((_, index) => index);
    indices.sort((a, b) => vertCol[a] - vertCol[b]);
    vertCol = indices.map(index => vertCol[index]);
    vertMin = indices.map(index => vertMin[index]);
    vertMax = indices.map(index => vertMax[index]);
    let filled = 0;
    let startIn = 0;
    let yCorner = -1;
    let beforeInOut = false;
    const cache = {};
    let cacheHit = 0;
    for (let y = 0; y < height; y++) {
        let filledRow = 0;
        let noHorzRow = true;
        let hash = '';
        for (let c = 0; c < vertCol.length; c++) {
            if (y > vertMin[c] && y < vertMax[c]) {
                hash += String(c) + '-';
            }
            if (y === vertMin[c] || y === vertMax[c]) {
                noHorzRow = false;
                break;
            }
        }
        if (noHorzRow) {
            if (hash in cache) {
                filled += cache[hash];
                cacheHit += 1;
                continue;
            }
        }
        let isIn = false;
        vertCol.forEach((c, cIdx) => {
            if (y > vertMin[cIdx] && y < vertMax[cIdx]) {
                if (isIn) {
                    isIn = false;
                    filledRow += c - startIn + 1;
                }
                else {
                    isIn = true;
                    startIn = c;
                }
            }
            else if (y === vertMin[cIdx]) {
                if (yCorner === -1) {
                    beforeInOut = isIn;
                    if (!isIn) {
                        startIn = c;
                    }
                    isIn = true;
                    yCorner = 0;
                }
                else if (yCorner === 0) {
                    yCorner = -1;
                    if (!beforeInOut) {
                        isIn = false;
                        filledRow += c - startIn + 1;
                    }
                }
                else if (yCorner === 1) {
                    yCorner = -1;
                    if (beforeInOut) {
                        isIn = false;
                        filledRow += c - startIn + 1;
                    }
                }
            }
            else if (y === vertMax[cIdx]) {
                if (yCorner === -1) {
                    beforeInOut = isIn;
                    if (!isIn) {
                        startIn = c;
                    }
                    isIn = true;
                    yCorner = 1;
                }
                else if (yCorner === 0) {
                    yCorner = -1;
                    if (beforeInOut) {
                        isIn = false;
                        filledRow += c - startIn + 1;
                    }
                }
                else if (yCorner === 1) {
                    yCorner = -1;
                    if (!beforeInOut) {
                        isIn = false;
                        filledRow += c - startIn + 1;
                    }
                }
            }
        });
        filled += filledRow;
        if (noHorzRow) {
            cache[hash] = filledRow;
        }
    }
    console.log('Size cache: ', Object.keys(cache).length);
    console.log(' cache hit ratio: ', cacheHit / height);
    return filled;
}
//# sourceMappingURL=18.js.map