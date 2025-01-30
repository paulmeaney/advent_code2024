var ruleBook = new Map();
var pageLists = [];
function dayFiveProcessing(inputString){
    const inputs = inputString.split("\n\n");
    console.log("Hi");

    const ruleList = inputs[0].split("\n");
    for (var rule of ruleList) {
        var values = rule.split("|").map(value => parseInt(value));
        if (!ruleBook.has(values[1])) {
            ruleBook.set(values[1], [values[0]]);
        } else {
            ruleBook.get(values[1]).push(values[0]);
        }
    }
    const pageLines = inputs[1].split("\n");
    for (var page of pageLines) {
        pageLists.push(page.split(",").map(value => parseInt(value)));
    }
    console.log("Total pages is " + pageLines.length);

    calculateSumOfMiddleValuesOfValidPages();
    correctInValidPages();
    
}

function correctInValidPages(){
    var correctedPages = [];
    var middleValueCount = 0;
    for (var page of pageLists){
        if (!isPageValid(page)) {
            correctedPages.push(correctInvalidPage(page));
        }
    }
    console.log("num of corrected pages: " + correctedPages.length);

    for (var page of correctedPages) {
        if (!isPageValid(page)) {
            console.log("turns out we were wrong!");
        } else {
            middleValueCount += getMiddleValueOfPage(page);
        }
    }
    console.log("Count of the middle values of corrected pages is : " + middleValueCount);
}

function calculateSumOfMiddleValuesOfValidPages(){
    var runningCount = 0;
    var validPageCount = 0;
    for (var page of pageLists){
        if (isPageValid(page)) {
            runningCount += getMiddleValueOfPage(page);
            validPageCount += 1;
        }
    }
    console.log("Count of the middle values of valid pages is :" + runningCount);
    console.log("Number of valid pages is: " + validPageCount);
}

function getMiddleValueOfPage(page) {
    return page.at(Math.floor(page.length / 2));
}

function correctInvalidPage(page){
    var newPage = [];
    for (var i = 0; i < page.length; i++) {
        if (i === page.length - 1) {
            break;
        }
        var valueToMove = page[i];
        var forbiddenValues = ruleBook.get(page[i]);
        var posToRemove = i;
        var reset_i = false;
        for (var j = i+1; j < page.length; j++) {
            if (forbiddenValues.indexOf(page[j]) !== -1) {
                page.splice(j+1,0, valueToMove);
                page.splice(posToRemove, 1);
                posToRemove = j;
                j--;
                reset_i = true;
            }
        }
        if (reset_i) {i--;}
    }
    return page;
}

function isPageValid(page) {
    var isValid = true;
    for (var i = 0; i < page.length; i++) {
        if (i === page.length - 1) {
            break;
        }
        var forbiddenValues = ruleBook.get(page[i]);
        for (var j = i+1; j < page.length; j++) {
            if (forbiddenValues.indexOf(page[j]) !== -1) {
                isValid = false;
                return isValid;
            }
        }
    }
    return isValid;
}