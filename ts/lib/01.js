"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Advent of Code 2023
Day 01
*/
let day = "01";
let test = false;
let testPart1 = false;
let testPart2 = true;
let testDataFile = '../testdata/' + day + ".txt";
let dataFile = '../data/' + day + ".txt";
const fs_1 = require("fs");
var inputLines = (0, fs_1.readFileSync)(test ? testDataFile : dataFile).toString().split("\n");
inputLines = inputLines.map(str => (str.trim()));
// Part 1
const reFirstNumber = /(\d)/;
const reLastNumber = /(\d)(?!.*\d)/;
var firstMatch, lastMatch;
var sum = 0;
// @ts-ignore
if (test === false || testPart1 === true) {
    for (var i = 0; i < inputLines.length; i++) {
        var s = inputLines[i];
        if (s.length == 0)
            continue;
        firstMatch = s.match(reFirstNumber);
        lastMatch = s.match(reLastNumber);
        if (firstMatch != null && lastMatch != null) {
            sum += Number(firstMatch[1] + lastMatch[1]);
        }
        else {
            console.log('oops');
            process.exit(1);
        }
    }
}
console.log("Result part 1: ", sum);
// Part 2
const replacements = {
    'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
};
const wordRegex = new RegExp("^(" + Object.keys(replacements).join('|') + ")");
const digitRegex = new RegExp("^(\\d)");
// @ts-ignore
if (test === false || testPart2 === true) {
    sum = 0;
    for (var line = 0; line < inputLines.length; line++) {
        var firstNum = '0';
        var lastNum = '0';
        var s = inputLines[line];
        if (s.length == 0)
            continue;
        for (var start = 0; start < s.length; start++) {
            var substr = s.substring(start);
            var match = digitRegex.exec(substr);
            if (match != null) {
                if (firstNum == '0') {
                    firstNum = match[0];
                }
                lastNum = match[0];
                continue;
            }
            match = wordRegex.exec(substr);
            if (match != null) {
                if (firstNum == '0') {
                    firstNum = replacements[match[0]];
                }
                lastNum = replacements[match[0]];
                continue;
            }
        }
        if (firstNum != '0' && lastNum != '0') {
            sum += Number(firstNum + lastNum);
        }
        else {
            console.log('oops');
            process.exit(1);
        }
    }
    console.log("Result part 2: ", sum);
}
//# sourceMappingURL=01.js.map