/* Advent of Code 2023
Day 01
*/
let day = "02"
let test: boolean  = false
let testPart1: boolean = true
let testPart2: boolean  = true

let testDataFile = '../testdata/' + day + ".txt";
let dataFile = '../data/' + day + ".txt";

import { readFileSync } from 'fs';

var inputLines = readFileSync( test ? testDataFile : dataFile).toString().split( "\n")
inputLines = inputLines.map( str => ( str.trim()))

var maxAllowed: { [key: string]: number} = 
  { 'red': 12, 'green': 13, 'blue': 14}

const gameRegex = /Game (\d+):\s(.*)/
const takeRegex = /([a-z0-9 \,]+\;)/g
const colorsRegex = /(\d+.*?[a-z]+)/g
const colorNumRegex = /(\d+)\s([a-z]+)/

var resultPart1 = 0
var resultPart2 = 0

for( var line of inputLines) {
  if( line.length == 0)
    continue
  var maxNum: { [key: string]: number} = {}
  line = line + ";"
  var gameMatch = line.match( gameRegex) 
  if( gameMatch === null) {
    console.log( "No match: ", line)
    process.exit()
  }
  var game = Number(gameMatch[1])
  var takes = gameMatch[2].match( takeRegex)
  if( takes === null) {
    console.log( "No match: ", gameMatch[2])
    process.exit()
  }
  for( var take of takes) {
    var colors = take.trim().match( colorsRegex)
    if( colors === null) {
      console.log( "No match: ", take)
      process.exit()
    }
    for( var color of colors) {
      var colorNum = color.match( colorNumRegex)
      if( colorNum === null) {
        console.log( "No match: ", color)
        process.exit()
      }
      var num = Number(colorNum[ 1])
      var colorStr = colorNum[2]
      if( ! (colorStr in maxNum)) {
        maxNum[ colorStr] = num
      } else {
        if( maxNum[ colorStr] < num) {
          maxNum[ colorStr] = num
        }
      
      }

    }
  }

  // calc part 1
  var valid = true
  for( let [key, value] of Object.entries( maxAllowed)){
    if( (key in maxNum) && (maxNum[key] > value)) {
      valid = false
      break
    }
  }
  if( valid) {
    resultPart1 += game
  }

  // calc part 2
  var power = 1
  for( let [ key, value] of Object.entries( maxNum)) {
    power *= value
  }
  resultPart2 += power  
}

console.log( "Result Part 1: ", resultPart1)
console.log( "Result Part 2: ", resultPart2)
