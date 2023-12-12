"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 12
*/
const day = '12';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const groups = [];
const springs = [];
const springs2 = [];
const groups2 = [];
inputLines.forEach((line) => {
    var _a;
    if (line.length === 0)
        return;
    const m = line.match(/([?.#]+) (.+)/);
    if (m === null) {
        console.error('could not fetch lines');
        process.exit(1);
    }
    springs.push(m[1]);
    let s2 = m[1];
    for (let i = 0; i < 4; i++) {
        s2 = s2 + '?' + m[1];
    }
    springs2.push(s2);
    const g = [];
    (_a = m[2].match(/(\d+)/g)) === null || _a === void 0 ? void 0 : _a.forEach((n) => {
        g.push(Number(n));
    });
    groups.push(g);
    let g2 = g;
    for (let i = 0; i < 4; i++) {
        g2 = [...g2, ...g];
    }
    groups2.push(g2);
});
console.log('Result Part 1: ', Number(solve(springs, groups)));
console.log('Result Part 2: ', Number(solve(springs2, groups2)));
function solve(spr, grp) {
    let sum = BigInt(0);
    spr.forEach((l, lIdx) => {
        sum += solve2(l, grp[lIdx]);
    });
    return sum;
}
function solve2(str, grp) {
    const factor = str.length;
    let completeGroups = [0];
    let startedGroupLength = [0];
    let val = [BigInt(2 ** factor)];
    let newStarted = [];
    let newComplete = [];
    let newVal = [];
    let newVal_;
    let newComplete_;
    let newStarted_;
    [...str].forEach((c, cIdx) => {
        if (c === '.') {
            for (let i = 0; i < val.length; i++) {
                val[i] /= BigInt(2);
                if (startedGroupLength[i] > 0) {
                    completeGroups[i] += 1;
                    if (startedGroupLength[i] !== grp[completeGroups[i] - 1]) {
                        val[i] = BigInt(-1);
                    }
                    else {
                        startedGroupLength[i] = 0;
                    }
                }
            }
        }
        else if (c === '#') {
            for (let i = 0; i < val.length; i++) {
                val[i] /= BigInt(2);
                startedGroupLength[i] += 1;
                if (startedGroupLength[i] > grp[completeGroups[i]]) {
                    val[i] = BigInt(-1);
                }
            }
        }
        else if (c === '?') {
            for (let i = 0; i < val.length; i++) {
                val[i] /= BigInt(2);
                newVal_ = val[i];
                newComplete_ = completeGroups[i];
                newStarted_ = startedGroupLength[i];
                // .
                if (startedGroupLength[i] > 0) {
                    completeGroups[i] += 1;
                    if (startedGroupLength[i] !== grp[completeGroups[i] - 1]) {
                        val[i] = BigInt(-1);
                    }
                    else {
                        startedGroupLength[i] = 0;
                    }
                }
                // #
                newStarted_ = newStarted_ + 1;
                if (newStarted_ <= grp[newComplete_]) {
                    newVal.push(newVal_);
                    newComplete.push(newComplete_);
                    newStarted.push(newStarted_);
                }
            }
        }
        val = [...val, ...newVal];
        completeGroups = [...completeGroups, ...newComplete];
        startedGroupLength = [...startedGroupLength, ...newStarted];
        newVal = [];
        newComplete = [];
        newStarted = [];
        if (cIdx === str.length - 1) {
            val.forEach((v, vIdx) => {
                let valid = true;
                if (startedGroupLength[vIdx] > 0) {
                    completeGroups[vIdx] += 1;
                    if (startedGroupLength[vIdx] !== grp.at(-1)) {
                        valid = false;
                    }
                }
                if (!valid || completeGroups[vIdx] !== grp.length) {
                    val[vIdx] = BigInt(-1);
                }
            });
        }
        for (let i = val.length - 1; i >= 0; i--) {
            if (val[i] === BigInt(-1)) {
                val.splice(i, 1);
                completeGroups.splice(i, 1);
                startedGroupLength.splice(i, 1);
            }
        }
        const todelete = [];
        for (let i = 0; i < val.length - 1; i++) {
            if (todelete.includes(i))
                continue;
            for (let j = i + 1; j < val.length; j++) {
                if (todelete.includes(j))
                    continue;
                if (completeGroups[i] === completeGroups[j] && startedGroupLength[i] === startedGroupLength[j]) {
                    val[i] += val[j];
                    todelete.push(j);
                }
            }
        }
        todelete.sort((a, b) => b - a).forEach((i) => {
            val.splice(i, 1);
            completeGroups.splice(i, 1);
            startedGroupLength.splice(i, 1);
        });
    });
    return val.reduce((acc, v) => acc + v, BigInt(0));
}
//# sourceMappingURL=12.js.map