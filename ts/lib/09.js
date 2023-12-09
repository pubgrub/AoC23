"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 09
*/
const day = '09';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
let result1 = 0;
let result2 = 0;
inputLines.forEach((l) => {
    if (l.length === 0)
        return;
    const numberStrings = l.match(/(-*\d+)/g);
    if (numberStrings === null) {
        console.error('line match did not match');
        process.exit(1);
    }
    const numbers = numberStrings.map((a) => Number(a));
    const ret = solve(numbers);
    result1 += ret[1] + numbers.slice(-1)[0];
    result2 += (numbers[0] - ret[0]);
});
console.log('Result Task 1: ', result1);
console.log('Result Task 2: ', result2);
function solve(numbers) {
    const zeros = numbers.reduce((count, a) => { return (a === 0 ? count + 1 : count); }, 0);
    if (zeros === numbers.length)
        return [0, 0];
    const summands = [];
    for (let n = 0; n < numbers.length - 1; n++) {
        summands.push(numbers[n + 1] - numbers[n]);
    }
    const returnValues = solve(summands);
    return [summands[0] - returnValues[0], returnValues[1] + summands.slice(-1)[0]];
}
//# sourceMappingURL=09.js.map