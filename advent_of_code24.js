

//two lists of integers
//sort in ascending order
//check both are the same size
//if not, we will need to remove the excess elements (more like disregard them)
//create a third list called, value_distances


const fileInput = document.getElementById('fileInput');
const adventDay = 2;
const startComputationEvent = new CustomEvent('startComputation', { detail: { day: adventDay } });
var dataArray = [];

document.addEventListener('startComputation', (event) => {
    if (adventDay === 1) {
        solvePuzzleDayOne(dataArray);
    }
    if (adventDay === 2) {
        solvePuzzleDayTwo(dataArray);
    }  
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the first selected file

    if (file) {
        const reader = new FileReader();

        // Define what happens when the file is loaded
        reader.onload = function (e) {
            const fileContent = e.target.result; // This will be the content of the file as a string

            // Split the content by newlines to create an array
            //const dataArray = fileContent.split('\n').map(line => line.trim()); // Optional trim to remove extra spaces
            dataArray = fileContent.split('\n'); // Optional trim to remove extra spaces
            document.dispatchEvent(startComputationEvent);                  
        };

        // Read the file as text
        reader.readAsText(file);
    }
});

function solvePuzzleDayOne(inputData) {
    output_arrays = processDataInput(inputData);
    output_arrays[0].sort(function (a, b) { return a - b });
    output_arrays[1].sort(function (a, b) { return a - b });
    var valueDistances = calculateValueDistances(output_arrays[0], output_arrays[1]);
    var sumOfValueDistances = integerArrayOperation(valueDistances, "+");

    var theImportantMap = getListSimilarityCountMap(output_arrays[0], output_arrays[1]);
    var repeatValueCounts = countRepeatValuesFromMap(theImportantMap);
    console.log("Sum of the absolute differences of each index in the two lists: " + sumOfValueDistances); // Output the array to the console
    console.log("Sum of the products of each value in list one and the number of the value's occurence in list 2: " + repeatValueCounts); // Output the array to the consol
}

function solvePuzzleDayTwo(inputData) {

    outputArrays = processDataInputDayTwo(inputData);
    console.log("Data Processed");
    var numberOfSafeReports = 0;
    var numberOfSafeReportsDampener = 0
    var numberOfSafeReportsOldDampner = 0;
    var newSafe = false;
    var oldSafe = false;
    for (var i = 0; i < outputArrays.length; i++) {
        if (checkIsReportSafe(outputArrays[i])) {
            numberOfSafeReports++;
        }
        else {
            newSafe = false;
            oldSafe = false;
            if (countIssuesInReport(outputArrays[i])) {
                numberOfSafeReportsDampener++;
                newSafe = true;
            }
            if (checkIsReportSafeWithDampener(outputArrays[i])) {
                numberOfSafeReportsOldDampner++;
                oldSafe = true;
            }
            if (oldSafe !== newSafe) {         
                console.log("The algorithm FAILED: " + outputArrays[i]);
            } else {
                console.log("The algorithm PASSED: " + outputArrays[i]);
            }
        }
        
    }
    console.log("Number of safe reports: " + numberOfSafeReports);
    console.log("Number of safe reports with dampener: " + numberOfSafeReportsDampener);
    console.log("Number of safe reports with old dampener: " + numberOfSafeReportsOldDampner);
    console.log("Total number of reports: " + (numberOfSafeReports + numberOfSafeReportsDampener));

}

function getListSimilarityCountMap(sortedListOne, sortedListTwo) { 
    var lastFoundIndex = 0;
    var currentSearchValue = -1;
    var repeatValueCountsMap = new Map();

    for (var i = 0; i < sortedListOne.length; i++) {
        currentSearchValue = sortedListOne[i];
        if (sortedListOne[i+1] === currentSearchValue) {
            continue;
        }
        var valueFound = 0;
        repeatValueCountsMap.set(currentSearchValue, 0);
        for (var j = lastFoundIndex; j < sortedListTwo.length; j++) {
            
            if (sortedListTwo[j] < currentSearchValue) {
                continue;
            }
            if (sortedListTwo[j] > currentSearchValue) {
                lastFoundIndex = j;
                break;
            } 
            if (valueFound === 1) {
                if (sortedListTwo[j] !== currentSearchValue) {
                    lastFoundIndex = j;
                    break;
                }
            }           
            if (sortedListTwo[j] === currentSearchValue) {
                valueFound = 1;
                repeatValueCountsMap.set(currentSearchValue, repeatValueCountsMap.get(currentSearchValue) + 1);
            }
        }
    }
    return repeatValueCountsMap;
}

function countRepeatValuesFromMap(repeatValueCountsMap) {
    var repeatValueCounts = 0;
    for (var [key, value] of repeatValueCountsMap) {
        if (value > 0){
            //console.log(key + ": " + value);
        }
        repeatValueCounts += (key * value);
    }
    return repeatValueCounts;
}


function processDataInput(data) {
    var listOne = [];
    var listTwo = [];
    for (var i = 0; i < data.length; i++) {
        var dataLine = data[i].split("   ").map(line => line.trim());
        listOne.push(dataLine[0]);
        listTwo.push(dataLine[1]);
        listOne.map(value => parseInt(value));
        listTwo.map(value => parseInt(value));
    }
    return [listOne, listTwo];
}

function processDataInputDayTwo(data) {

    var outputArray = [];
    for (var i = 0; i < data.length; i++) {
        var dataLine = data[i].split(" ").map(line => line.trim());
        datalineIntegers = dataLine.map(value => parseInt(value));
        outputArray.push(datalineIntegers);
    }

    return outputArray;
}


function calculateValueDistances(listOne, listTwo) {

    var valueDistances = [];
    for (var i = 0; i < listOne.length; i++) {
        valueDistances[i] = Math.abs(listOne[i] - listTwo[i]);
    }
    return valueDistances;
}

function integerArrayOperation(list, operation) {
    var result = 0;
    for (var i = 0; i < list.length; i++) {
        if (operation === "+" || operation === "add") {
            result += list[i];
        }
    }
    return result;
}

function checkIsReportSafe(reportArray) {
    var isSafe = true;
    var ascending = false;

    if (reportArray.length < 2) { 
        isSafe = false; 
        return isSafe;
    }
    var value = reportArray[0];
    var data = reportArray[1];
    if (reportArray[0] < reportArray[1]) {      
        ascending = true;
    } else {
        ascending = false;
    }

    for (var i = 0; i < reportArray.length - 1; i++) {
        if (ascending) {
            if (reportArray[i] > reportArray[i + 1]) {
                isSafe = false;
                break;
            }
        } else {
            if (reportArray[i] < reportArray[i + 1]) {
                isSafe = false;
                break;
            }
        }
        var spacing = Math.abs(reportArray[i] - reportArray[i + 1]);
        if (spacing < 1 || spacing > 3){
            isSafe = false;
            break;
        }
    }

    if (isSafe === true) {
        //console.log("Safe Report: " + reportArray);
    }
   
    return isSafe;
}

function checkIsReportSafeWithDampener(reportArray) {
    var isSafe = true;
    var ascending = false;
    var indexToFilter = 0;

    if (reportArray.length < 2) { 
        isSafe = false; 
        return isSafe;
    }

    if (reportArray.length < 2) {
        isSafe = checkIsReportSafe(reportArray);
        console.log("Small array warning: " + reportArray);
        return isSafe;
    }

//2 1 3 4 5 6  
//-1 2 1 1 1

//1 5 2 3 4
//4 -3 1 1

//3 3 4 5   
//16 17 14 12 10
//1 -3 -2 -2
//15 16 18 17 18 22
    var ascendingIndices = [];
    var descendingIndices = [];
    var flatIndices = [];
    var illegalSpacingIndices = [];
    for (var i = 0; i < reportArray.length - 1; i++) {
      

        if (reportArray[i] < reportArray[i+1]) {      
            ascendingIndices.push(i);    
        } else if (reportArray[i] > reportArray[i+1]) {            
            descendingIndices.push(i);
        } else {    
            flatIndices.push(i);
        }

        var spacing = Math.abs(reportArray[i] - reportArray[i + 1]);
        if (spacing < 1 || spacing > 3){
            illegalSpacingIndices.push(i);
        }
    }

    if (ascendingIndices.length >= 2 ) {
        ascending = true;        
    }
    if (descendingIndices.length >= 2) {
        ascending = false;
    } 
    



    if (illegalSpacingIndices.length > 0) {
        isSafe = false;
        if (illegalSpacingIndices.length === 2) {
            // 1 10 2 3
            if (illegalSpacingIndices[0] === illegalSpacingIndices[1] - 1) {
                indexToFilter = illegalSpacingIndices[1];

            }
            else {
                return false;
            }
        } else if (illegalSpacingIndices.length === 1) {
            //1 5 6 7 8
            //1 5 2 3 4
            //3 1 5 2 3 4


            //1 5 6 3 4
            //1 7 4 6 8

            //1 2 3 4 8
            // 1 2 3 4 8 5
            // 1 2 3 4 5 1
            // 1 2 3 4 5 10

            if ((ascending && descendingIndices.length > 0) || (!ascending && ascendingIndices.length > 0)) {
                if (ascending) {
                    indexToFilter = descendingIndices[0];
                }
                else {
                    indexToFilter = ascendingIndices[0];
                }

                //49 45 46 47
                //45 49 46 47

            }
            else {
                indexToFilter = illegalSpacingIndices[0];
                if (indexToFilter === reportArray.length - 2) {
                    indexToFilter++;
                }
            }

        } else {
            return false;
        }
    } else {
        if ((ascending && descendingIndices.length > 1) || !ascending && ascendingIndices.length > 1) {
            isSafe = false;
            return isSafe;
            //6 5 4 7 8
        }
        else {
            //1 3 2 4 5
            //Remove descending + 1
            //3 1 2 4 5
            //2 3 1 4 5
            //45 46 44 47
            //4 1 4 5 6

            //1 2 3 1 4
            isSafe = false;
            if (ascending) {
                if (descendingIndices[0] === 0) {
                    indexToFilter = descendingIndices[0];
                } else {
                    indexToFilter = descendingIndices[0] + 1;
                }
            }
            else {
                if (ascendingIndices[0] === 0) {            
                indexToFilter = ascendingIndices[0];
                }
                else {
                    indexToFilter = ascendingIndices[0] + 1;
                }
            }

        }
    }

    if (isSafe === true) {
        console.log("Safe Report: " + reportArray);
    }
    if (isSafe === false) {
        console.log("Unsafe Report: " + reportArray + " Value to remove: " + reportArray[indexToFilter] + "at index " + indexToFilter +" Will retry");
        var retryReportArray = reportArray.slice();    
        retryReportArray.splice(indexToFilter, 1);      
        isSafe = checkIsReportSafe(retryReportArray);
        if (isSafe ===  true) {
            //console.log("Safe Report after retry: " + reportArray);
        }
    }
   
    return isSafe;
}
function countIssuesInReport(reportArray) {
    var spacingIndices = [];
    var ascendingCount = 0;
    var descendingCount = 0;
    var ascending = true;
    var indexToFilter = 0;
    var dampen = false;
    var isSafe = true;
    var illegalSpacingCount = 0;
    var illegalSpacingIndices = [];


    for (var i = 0; i < reportArray.length - 1; i++) {
        var spacing = reportArray[i + 1] - reportArray[i];
        spacingIndices.push(spacing);
        if (spacing > 0) {
            ascendingCount++;
        }
        else if (spacing < 0) {
            descendingCount++;
        }
    }

    ascending = (ascendingCount > descendingCount) ? true : false;

    for (var i = 0; i < spacingIndices.length; i++) {
        if (ascending === true) {
            if (spacingIndices[i] < 1 || spacingIndices[i] > 3) {
                illegalSpacingCount++;
                illegalSpacingIndices.push(i);
                isSafe = false;
            }
        }
        else {
            if (spacingIndices[i] > -1 || spacingIndices[i] < -3) {
                illegalSpacingCount++;
                illegalSpacingIndices.push(i);
                isSafe = false;
            }
        }
    }

    /*Formula
              if number of illegal spaces is 1
                  if spacing index is 1st or last 
                      then remove the 1st or last element from reportArray
              if number of illegal spaces is 1 or 2
                  if number of illegal spaces is 2
                      then if they are not adjacent
                          the reportArray cannot be fixed by removing one element
                      
                  if illegal spacing index is not 1st or last
                      then if spacing[n] + spacing [n-1] ==  legal
                          then remove reportArray[n]
                      else if spacing[n] + spacing[n+1] == legal
                          then remove reportArray[n+1]
              if spacing index length is 3
                  then the reportArray cannot be fixed by removing one elemet
              */

    if (illegalSpacingCount > 2) {
        isSafe = false;
    }
    else if (illegalSpacingCount === 0) {
        isSafe = true;
    }
    else {
        if (illegalSpacingCount === 2) {
            if (illegalSpacingIndices[1] - illegalSpacingIndices[0] !== 1) {
                isSafe = false;
            }
        }
        //if the illegal spacing is the first space or the last space remove the first or last element in reportArray
        if ((illegalSpacingIndices[0] === 0 || illegalSpacingIndices[illegalSpacingIndices.length - 1] === spacingIndices.length - 1) && (illegalSpacingIndices.length === 1)) {
            if (illegalSpacingIndices.length === 1) {
                indexToFilter = (illegalSpacingIndices[0] === 0) ? illegalSpacingIndices[0] : illegalSpacingIndices[0] + 1;
                dampen = true;
            }
        }
        else {
            const nextSpace = spacingIndices[illegalSpacingIndices[0]] + spacingIndices[illegalSpacingIndices[0] + 1];
            if ((ascending && (nextSpace >= 1 && nextSpace <= 3)) || (!ascending && (nextSpace <= -1 && nextSpace >= -3))) {
                indexToFilter = illegalSpacingIndices[0] + 1;
                dampen = true;
            } else {
                const prevSpace = spacingIndices[illegalSpacingIndices[0]] + spacingIndices[illegalSpacingIndices[0] - 1];
                if ((ascending && (prevSpace >= 1 && prevSpace <= 3)) || (!ascending && (prevSpace <= -1 && prevSpace >= -3))) {
                    indexToFilter = illegalSpacingIndices[0];
                    dampen = true;
                }
            }
        }
    }

    

    if (isSafe === true && dampen === false) {
         console.log("Report is safe no need for dampening: " + reportArray);
    }

    if (isSafe === false && dampen === false) {
         console.log("Unsafe Report which cannot be fixed: " + reportArray);
    }

    if (isSafe === false && dampen === true) {
        console.log("Unsafe Report which can be fixed: " + reportArray + " Value to remove: " + reportArray[indexToFilter] + "at index " + indexToFilter + " Will retry");
        var retryReportArray = reportArray.slice();
        retryReportArray.splice(indexToFilter, 1);
        isSafe = checkIsReportSafe(retryReportArray);
        if (isSafe === true) {
            console.log("Safe Report after retry: " + retryReportArray);            
        } else {
            console.log("Unsafe Report after retry: " + retryReportArray);
        }
    }

    return isSafe;

}

function testingDayTwo() {
    var arrayOne = [25,22,19,20,19];
    var arrayTwo = [76,73,77,79,80,82];
    var arrayThree = [9, 7, 6, 2, 1];
    var arrayFour = [1, 3, 2, 4, 5];
    var arrayFive = [8, 6, 4, 4, 1];
    var arraySix = [1, 3, 6, 7, 9];

    //2 1 3 4 5 6  
    //3 3 4 5   
    //16 17 16 8 7 6
    //15 16 18 17 18 22
    var listOne = [60,57,59,62,60];
    var listFive = [1, 1, 2, 3, 4];
    var listTwo = [45,48,51,52,55,58,62];
    var listThree = [12,15,18,20,23,26,28,31];
    var listFour = [81,77,76,75,74,73,71,70];

    var safe = false;
    safe = checkIsReportSafeWithDampener(arrayTwo);
    if (safe === true) {
        console.log("Safe Report: " + listOne);
    }
}




/*var listOne = [15, 3, 22, 8, 19, 27, 6, 14, 30, 11, 25, 4, 18, 7, 21, 9, 13, 2, 26, 10];
var listTwo = [12, 23, 34, 5, 16, 27, 38, 9, 20, 31, 2, 13, 24, 35, 6, 17, 28, 39, 10, 21];

listOne.sort(function (a, b) { return a - b });
listTwo.sort(function (a, b) { return a - b });

var listLengthsMatch = listOne.length === listTwo.length;

try {
    if (listLengthsMatch === 0) throw "List sizes are not equal!";
}
catch (err) {
    console.log(err);
}
*/
//var valueDistances = calculateValueDistances(listOne, listTwo);
//var sumOfValueDistances = integerArrayOperation(valueDistances, "+");
//console.log(sumOfValueDistances);
//getFileFromHTMLInput();