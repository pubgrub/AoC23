"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/* Advent of Code 2023
Day 20
*/
const day = '20';
const test = false;
// const testPart1: boolean = true
// const testPart2: boolean = true
const fileName = test ? `../testdata/${day}.txt` : `../data/${day}.txt`;
let inputLines = (0, fs_1.readFileSync)(fileName).toString().split('\n');
inputLines = inputLines.map(str => (str.trim()));
const BUTTON = 0;
const BROADCASTER = 1;
const FLIPFLOP = 2;
const CONJUNCTION = 3;
const OUTPUT = 4;
const RX = 5;
const HI = 1;
const LO = 0;
const NOSIG = -1;
const OFF = false;
const ON = true;
const button = { type: BUTTON, state: false, inputDev: [], inputSignals: [], outputDev: [] };
const output = { type: OUTPUT, state: false, inputDev: [], inputSignals: [], outputDev: [] };
const rx = { type: RX, state: false, inputDev: [], inputSignals: [], outputDev: [] };
const devices = { button, output, rx };
const types = { b: BROADCASTER, '%': FLIPFLOP, '&': CONJUNCTION };
const sourceDestConnections = [];
inputLines.forEach((l) => {
    if (l.length > 0) {
        const dev = { type: -1, state: OFF, inputDev: [], inputSignals: [], outputDev: [] };
        let devName = '';
        l.split(' ').forEach((item, i) => {
            item = item.replace(',', '');
            switch (i) {
                case 0:
                    dev.type = types[item[0]];
                    if (dev.type === BROADCASTER) {
                        sourceDestConnections.push(['button', item]);
                        devName = item;
                    }
                    else {
                        devName = item.slice(1);
                    }
                    break;
                case 1:
                    break;
                default:
                    sourceDestConnections.push([devName, item]);
            }
            devices[devName] = dev;
            //      console.log(item)
        });
    }
});
sourceDestConnections.forEach((tpl) => {
    let src, dest;
    // eslint-disable-next-line prefer-const
    [src, dest] = [...tpl];
    devices[src].outputDev.push(devices[dest]);
    devices[dest].inputDev.push(devices[src]);
    devices[dest].inputSignals.push(devices[dest].type === CONJUNCTION ? LO : NOSIG);
});
// console.log(util.inspect(devices, { depth: 4 }))
const signalCount = [0, 0];
let result = solve(1);
console.log('Result Part 1: ', signalCount[0] * signalCount[1]);
// reset
Object.values(devices).forEach((dev) => {
    if (dev.type === FLIPFLOP) {
        dev.state = OFF;
        dev.inputSignals.forEach((_, i) => {
            dev.inputSignals[i] = NOSIG;
        });
    }
    else if (dev.type === CONJUNCTION) {
        dev.inputSignals.forEach((_, i) => {
            dev.inputSignals[i] = LO;
        });
    }
});
result = solve(2);
console.log('Result Part 2: ', result);
function solve(part) {
    const signals = [];
    let src, dest;
    let sig;
    const maxI = part === 1 ? 1000 : Infinity;
    for (let i = 0; i < maxI; i++) {
        let rxCount = 0;
        signals.push([button, devices.broadcaster, LO]);
        while (signals.length > 0) {
            [src, dest, sig] = [...signals[0]];
            signalCount[sig]++;
            switch (dest.type) {
                case BROADCASTER:
                    dest.outputDev.forEach((out) => {
                        signals.push([dest, out, sig]);
                    });
                    break;
                case FLIPFLOP:
                    if (sig === LO) {
                        dest.state = dest.state === OFF ? ON : OFF;
                        dest.outputDev.forEach((out) => {
                            signals.push([dest, out, dest.state === ON ? HI : LO]);
                        });
                    }
                    break;
                case CONJUNCTION: {
                    dest.inputSignals[dest.inputDev.findIndex(obj => obj === src)] = sig;
                    let allHI = true;
                    if (sig === LO) {
                        allHI = false;
                    }
                    else {
                        dest.inputSignals.forEach((cSig) => {
                            if (cSig !== HI)
                                allHI = false;
                        });
                    }
                    dest.outputDev.forEach((out) => {
                        signals.push([dest, out, allHI ? LO : HI]);
                    });
                    break;
                }
                case RX:
                    if (sig === LO)
                        rxCount++;
                    break;
            }
            signals.shift();
        }
        if (rxCount === 1 && part === 2)
            return i;
        if (i % 100000 === 0)
            console.log(i, rxCount);
    }
    return 0;
}
//# sourceMappingURL=20.js.map