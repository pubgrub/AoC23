"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 07
*/
const day = '07';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const inChar = [['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
    ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']];
const inRegex = /^([0-9TJQKA]+).*?(\d+)/;
for (const part of [1, 2]) {
    const gameCodes = {};
    inputLines.forEach((l, idx) => {
        if (l.length === 0)
            return;
        const game = l.match(inRegex);
        if (game === null) {
            console.error('game match did not match');
            process.exit(1);
        }
        const origCardsStr = game[1];
        const gameBid = Number(game[2]);
        let cards = ((str) => {
            return [...str].map(c => {
                const index = inChar[part - 1].indexOf(c);
                return index >= 0 ? String.fromCharCode(index + 65) : c;
            }).join('');
        })(origCardsStr);
        let nJokers = 0;
        const origcards = cards;
        if (part === 2) {
            const noJokerStr = cards.replace(/A/g, '');
            nJokers = cards.length - noJokerStr.length;
            cards = noJokerStr;
        }
        let gameType = ((str) => {
            const counts = Object.values([...str].reduce((acc, value) => {
                var _a;
                acc[value] = ((_a = acc[value]) !== null && _a !== void 0 ? _a : 0) + 1;
                return acc;
            }, {}));
            const typeStr = counts.sort((a, b) => a - b).reverse().join('');
            return (typeStr + '00000').substring(0, 5);
        })(cards);
        if (part === 2) {
            gameType = String(Number(gameType) + nJokers * 10000);
        }
        gameCodes[gameType + origcards] = gameBid;
    });
    let winnings = 0;
    Object.keys(gameCodes).sort().forEach((key, idx) => {
        winnings += (idx + 1) * gameCodes[key];
    });
    console.log(winnings);
}
//# sourceMappingURL=07.js.map