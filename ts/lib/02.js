"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 01
*/
const day = '02';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean  = true
const testDataFile = '../testdata/' + day + '.txt';
const dataFile = '../data/' + day + '.txt';
let inputLines = (0, fs_1.readFileSync)(test ? testDataFile : dataFile).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const maxAllowed = { red: 12, green: 13, blue: 14 };
const gameRegex = /Game (\d+):\s(.*)/;
const takeRegex = /([a-z0-9 ,]+;)/g;
const colorsRegex = /(\d+.*?[a-z]+)/g;
const colorNumRegex = /(\d+)\s([a-z]+)/;
let resultPart1 = 0;
let resultPart2 = 0;
for (let line of inputLines) {
    if (line.length === 0)
        continue;
    const maxNum = {};
    line = line + ';';
    const gameMatch = line.match(gameRegex);
    if (gameMatch === null) {
        console.log('No match: ', line);
        process.exit();
    }
    const game = Number(gameMatch[1]);
    const takes = gameMatch[2].match(takeRegex);
    if (takes === null) {
        console.log('No match: ', gameMatch[2]);
        process.exit();
    }
    for (const take of takes) {
        const colors = take.trim().match(colorsRegex);
        if (colors === null) {
            console.log('No match: ', take);
            process.exit();
        }
        for (const color of colors) {
            const colorNum = color.match(colorNumRegex);
            if (colorNum === null) {
                console.log('No match: ', color);
                process.exit();
            }
            const num = Number(colorNum[1]);
            const colorStr = colorNum[2];
            if (!(colorStr in maxNum)) {
                maxNum[colorStr] = num;
            }
            else {
                if (maxNum[colorStr] < num) {
                    maxNum[colorStr] = num;
                }
            }
        }
    }
    // calc part 1
    let valid = true;
    for (const [key, value] of Object.entries(maxAllowed)) {
        if ((key in maxNum) && (maxNum[key] > value)) {
            valid = false;
            break;
        }
    }
    if (valid) {
        resultPart1 += game;
    }
    // calc part 2
    let power = 1;
    for (const value of Object.values(maxNum)) {
        power *= value;
    }
    resultPart2 += power;
}
console.log('Result Part 1: ', resultPart1);
console.log('Result Part 2: ', resultPart2);
//# sourceMappingURL=02.js.map