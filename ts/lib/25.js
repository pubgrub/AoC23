"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 25
*/
const day = '25';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
if (inputLines.slice(-1)[0] === '') {
    inputLines.pop();
}
const grid = {};
inputLines.forEach((l) => {
    const m = l.match(/(\w\w\w)/g);
    if (m !== null) {
        const src = m[0];
        const dest = [...m.slice(1)];
        //    console.log(src, dest)
        if (!(src in grid)) {
            grid[src] = [];
        }
        dest.forEach((d) => {
            if (!grid[src].includes(d)) {
                grid[src].push(d);
            }
            if (!(d in grid)) {
                grid[d] = [];
            }
            if (!grid[d].includes(src)) {
                grid[d].push(src);
            }
        });
    }
});
// console.log(JSON.stringify(grid))
const done = [];
let maxLength = 0;
const pathLength = {};
Object.keys(grid).forEach((src) => {
    grid[src].forEach((dest) => {
        const n1 = src < dest ? src : dest;
        const n2 = src < dest ? dest : src;
        const pair = n1 + n2;
        if (!done.includes(pair)) {
            done.push(pair);
            const testGrid = structuredClone(grid);
            testGrid[n1].splice(testGrid[n1].indexOf(n2), 1);
            testGrid[n2].splice(testGrid[n2].indexOf(n1), 1);
            const r = dijkstra(testGrid, n1, n2);
            pathLength[pair] = r;
            maxLength = Math.max(maxLength, r);
        }
    });
});
let startNode = '';
let endNode = '';
Object.keys(pathLength).forEach((k) => {
    if (pathLength[k] === maxLength) {
        startNode = k.slice(0, 3);
        endNode = k.slice(3);
        grid[startNode].splice(grid[startNode].indexOf(endNode), 1);
        grid[endNode].splice(grid[endNode].indexOf(startNode), 1);
    }
});
const len1 = countMembers(grid, startNode);
const len2 = countMembers(grid, endNode);
console.log('Result Part 1: ', len1 * len2);
function dijkstra(grid, start, end) {
    const myGrid = structuredClone(grid);
    const toCalc = [start];
    const cost = {};
    Object.keys(myGrid).forEach((k) => {
        cost[k] = Infinity;
    });
    cost[start] = 0;
    while (toCalc.length > 0) {
        const startNode = toCalc.reduce((res, v) => ((cost[res] <= cost[v]) ? res : v), '');
        const nextCost = cost[startNode] + 1;
        myGrid[startNode].forEach((n) => {
            if (nextCost < cost[n]) {
                cost[n] = nextCost;
                toCalc.push(n);
            }
        });
        toCalc.splice(toCalc.indexOf(startNode), 1);
    }
    return (cost[end]);
}
function countMembers(grid_, start) {
    const grid = structuredClone(grid_);
    const seen = [];
    const toDo = [start];
    while (toDo.length > 0) {
        const node = grid[toDo[0]];
        node.forEach((n) => {
            if (!seen.includes(n)) {
                seen.push(n);
                toDo.push(n);
            }
        });
        toDo.shift();
    }
    return (seen.length);
}
//# sourceMappingURL=25.js.map