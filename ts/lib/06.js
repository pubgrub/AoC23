"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 06
*/
const day = '06';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const inputRegex = /(\d+)/g;
const timesStrings = inputLines[0].match(inputRegex);
const distStrings = inputLines[1].match(inputRegex);
if (distStrings === null || timesStrings === null) {
    console.log('Problems parsing');
    process.exit(1);
}
timesStrings.push(timesStrings.join(''));
distStrings.push(distStrings.join(''));
const dist = distStrings.map(a => Number(a));
const times = timesStrings.map(a => Number(a));
let totalWinnings = 1;
let part2Winnings = 0;
times.forEach((playTime, idx) => {
    let winnings = 0;
    const distToBeat = dist[idx];
    for (let acc = 1; acc < playTime; acc++) {
        const distance = acc * (playTime - acc);
        if (distance > distToBeat) {
            winnings += 1;
        }
    }
    if (idx < times.length - 1) {
        totalWinnings *= winnings;
    }
    else {
        part2Winnings = winnings;
    }
});
console.log('Result Part 1: ', totalWinnings);
console.log('Result Part 2: ', part2Winnings);
//# sourceMappingURL=06.js.map