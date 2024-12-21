

//two lists of integers
//sort in ascending order
//check both are the same size
//if not, we will need to remove the excess elements (more like disregard them)
//create a third list called, value_distances


const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the first selected file

    if (file) {
        const reader = new FileReader();

        // Define what happens when the file is loaded
        reader.onload = function (e) {
            const fileContent = e.target.result; // This will be the content of the file as a string

            // Split the content by newlines to create an array
            //const dataArray = fileContent.split('\n').map(line => line.trim()); // Optional trim to remove extra spaces
            const dataArray = fileContent.split('\n'); // Optional trim to remove extra spaces
            output_arrays = processDataInput(dataArray);
            output_arrays[0].sort(function (a, b) { return a - b });
            output_arrays[1].sort(function (a, b) { return a - b });
            var valueDistances = calculateValueDistances(output_arrays[0], output_arrays[1]);
            var sumOfValueDistances = integerArrayOperation(valueDistances, "+");

            var theImportantMap = getListSimilarityCountMap(output_arrays[0], output_arrays[1]);
            var repeatValueCounts = countRepeatValuesFromMap(theImportantMap);





            console.log("Sum of the absolute differences of each index in the two lists: " + sumOfValueDistances); // Output the array to the console
            console.log("Sum of the products of each value in list one and the number of the value's occurence in list 2: " + repeatValueCounts); // Output the array to the console

        };

        // Read the file as text
        reader.readAsText(file);
    }
});

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
    }
    return [listOne, listTwo];
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



var listOne = [15, 3, 22, 8, 19, 27, 6, 14, 30, 11, 25, 4, 18, 7, 21, 9, 13, 2, 26, 10];
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

//var valueDistances = calculateValueDistances(listOne, listTwo);
//var sumOfValueDistances = integerArrayOperation(valueDistances, "+");
//console.log(sumOfValueDistances);
//getFileFromHTMLInput();