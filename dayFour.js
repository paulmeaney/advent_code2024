var crossword;

function dayFourPartOne(inputcrossword, word) {
    crossword = inputcrossword;
    console.log("Crossword dimensions are: " + crossword[0].length + "X" + crossword.length);
    beginWordSearch(word);
}

function dayFourPartTwo(inputcrossword, word) {
    crossword = inputcrossword;
    console.log("Crossword dimensions are: " + crossword[0].length + "X" + crossword.length);
    beginPatternSearch(word);
}
//crossword
//crossword[y][x]

//ABCDEFG
//HIJKLMN

//crossword[1][3] = K


function beginWordSearch(word) {
    var totalWordsFound = 0;
    for (var y = 0; y < crossword.length; y++) {
        for (var x = 0; x < crossword[y].length; x++) {
            totalWordsFound += findWordFromPosition(word, x, y);
        }
    }

    console.log("Total occurences of " + word + " found is : " + totalWordsFound);

}

function beginPatternSearch(word) {
    var totalPatternsFound = 0;
    for (var y = 0; y < crossword.length; y++) {
        for (var x = 0; x < crossword[y].length; x++) {
            if (searchforWordPatternXFromPosition(word, x, y)) {
                totalPatternsFound += 1;
            }
        }
    }

    console.log("Total X patterns found of " + word + " is : " + totalPatternsFound);
}

function findWordFromPosition(word, x, y) {
    //assume we have the first letter found
    //for each letter in the word
    //go right, left, up and down, then go diagonal
    var wordsFound = 0;

    if (crossword[y][x] === word.charAt(0)) {
        var remainingWord = word.slice(1, word.length);

        if (findWordFromPosInDirection(remainingWord, x, y, searchRight, moveRight) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Right");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchLeft, moveLeft) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Left");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchUp, moveUp) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Up");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchDown, moveDown) === true) {
            wordsFound += 1;
        //    console.log("XMAS found at x:" + x + " y:" + y + " Direction: Down");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchDiagUpRight, moveUpRight) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Up Right");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchDiagUpLeft, moveUpLeft) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Up Left");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchDiagDownRight, moveDownRight) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Down Right");
        }
        if (findWordFromPosInDirection(remainingWord, x, y, searchDiagDownLeft, moveDownLeft) === true) {
            wordsFound += 1;
            //console.log("XMAS found at x:" + x + " y:" + y + " Direction: Down Left");
        }
    }

    return wordsFound;
}

function searchforWordPatternXFromPosition(word, x, y) {
    var wordsFound = 0;
    var patternFound = false;
    var remainingWord = word.slice(1, word.length);
    if (word.length % 2 === 0) {
        console.log("Not possible to find word X pattern from word of this length:" + word);
        return patternFound;
    }
    if ((crossword[y][x] == word.charAt(Math.floor(word.length / 2))) && ((x > 0 && x < crossword[0].length - 1) && y > 0 && (y < crossword.length - 1))) {
        var startingPos = [x - 1, y - 1]; //diag up left
        if (crossword[startingPos[1]][startingPos[0]] === word.charAt(0)) {
            if (findWordFromPosInDirection(remainingWord, startingPos[0], startingPos[1], searchDiagDownRight, moveDownRight)) {
                wordsFound += 1;
                console.log("MAS found at x:" + startingPos[1] + " y:" + startingPos[0] + " Direction: Down Right");
            }
        }
        var startingPos = [x + 1, y - 1]; //diag up Right
        if (crossword[startingPos[1]][startingPos[0]] === word.charAt(0)) {
            if (findWordFromPosInDirection(remainingWord, startingPos[0], startingPos[1], searchDiagDownLeft, moveDownLeft)) {
                wordsFound += 1;
                console.log("MAS found at x:" + startingPos[1] + " y:" + startingPos[0] + " Direction: Down Left");
            }
        }
        var startingPos = [x - 1, y + 1]; //diag down left
        if (crossword[startingPos[1]][startingPos[0]] === word.charAt(0)) {
            if (findWordFromPosInDirection(remainingWord, startingPos[0], startingPos[1], searchDiagUpRight, moveUpRight)) {
                wordsFound += 1;
                console.log("MAS found at x:" + startingPos[1] + " y:" + startingPos[0] + " Direction: Up Right");
            }
        }
        var startingPos = [x + 1, y + 1]; //diag down right
        if (crossword[startingPos[1]][startingPos[0]] === word.charAt(0)) {
            if (findWordFromPosInDirection(remainingWord, startingPos[0], startingPos[1], searchDiagUpLeft, moveUpLeft)) {
                wordsFound += 1;
                console.log("MAS found at x:" + startingPos[1] + " y:" + startingPos[0] + " Direction: Up Left");
            }
        }

        if (wordsFound === 2) {
            patternFound = true;
        }
    }
    return patternFound;
}



function findWordFromPosInDirection(word, x, y, dirctionalSearchFunction, moveFunction) {
    var wordFound = false;
    var letterFound = false;
    var searchCoOrdinates = [x, y]
    for (var letter of word) {
        letterFound = dirctionalSearchFunction(letter, searchCoOrdinates[0], searchCoOrdinates[1]);
        if (letterFound === false) {
            break;
        }
        searchCoOrdinates = moveFunction(searchCoOrdinates[0], searchCoOrdinates[1]);
    }
    if (letterFound === true) {
        wordFound = true;
    }
    return wordFound;
}

function searchRight(nextLetter, x, y) {
    if (x === crossword[y].length - 1) {
        return false;
    }
    if (crossword[y][x + 1] === nextLetter) {
        return true;
    }
    return false;
}

function searchLeft(nextLetter, x, y) {
    if (x === 0) {
        return false;
    }
    if (crossword[y][x - 1] === nextLetter) {
        return true;
    }
    return false;

}

function searchUp(nextLetter, x, y) {
    if (y === 0) {
        return false;
    }
    if (crossword[y - 1][x] === nextLetter) {
        return true;
    }
    return false;

}

function searchDown(nextLetter, x, y) {
    if (y === crossword.length - 1) {
        return false;
    }
    if (crossword[y + 1][x] === nextLetter) {
        return true;
    }
    return false;
}

function searchDiagUpRight(nextLetter, x, y) {
    if (x === crossword[y].length - 1 || y === 0) {
        return false;
    }
    if (crossword[y - 1][x + 1] === nextLetter) {
        return true;
    }
    return false;
}
function searchDiagDownRight(nextLetter, x, y) {
    if (x === crossword[y].length - 1 || y === crossword.length - 1) {
        return false;
    }
    if (crossword[y + 1][x + 1] === nextLetter) {
        return true;
    }
    return false;
}
function searchDiagUpLeft(nextLetter, x, y) {
    if (x === 0 || y === 0) {
        return false;
    }
    if (crossword[y - 1][x - 1] === nextLetter) {
        return true;
    }
    return false;
}
function searchDiagDownLeft(nextLetter, x, y) {
    if (x === 0 || y === crossword.length - 1) {
        return false;
    }
    if (crossword[y + 1][x - 1] === nextLetter) {
        return true;
    }
    return false;
}

function moveRight(x, y) {
    return [x+1, y];
}
function moveLeft(x, y) {
    return [x-1, y]
}
function moveUp(x, y) {
    return [x, y-1]
}
function moveDown(x, y) {
    return [x, y+1]
}
function moveUpRight(x, y) {
    return [x+1, y-1]
}
function moveUpLeft(x, y) {
    return [x-1, y-1]
}
function moveDownRight(x, y) {
    return [x+1, y+1]
}
function moveDownLeft(x, y) {
    return [x-1, y+1]
}
