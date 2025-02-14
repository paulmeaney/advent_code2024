var inputData = [];
var valuesWithMatches = [];

function daySevenProcessing(inputString) {
    console.log(inputString);
    var inputArray = inputString.split('\n');
    for (var i = 0; i < inputArray.length; i++){
        var dataLine = inputArray[i].split(":");
        var tempInputs = dataLine[1].trimStart().split(" ");
        inputData.push({target:parseInt(dataLine[0]), inputs:tempInputs.map(value => parseInt(value))});
    }

    console.log(inputData);
    determineTargetFromInputs(3);
}

function determineTargetFromInputs(numberOperators){ //operators increased in part 2 as expected lol
    for (var targetIdx in inputData){
        var targetValue = inputData[targetIdx].target;
        var n = inputData[targetIdx].inputs.length;
        var numPermutations = numberOperators**(n-1);
        for (var i = 0; i < numPermutations; i++){
            var code = i.toString(numberOperators);
            code = code.padStart(n-1, "0");
            if (evaluateResult(inputData[targetIdx].inputs, code) === targetValue) {
                //console.log("Found a match!!: " + inputData[targetIdx].inputs + " target value: " + inputData[targetIdx].target + " code: " + code);
                valuesWithMatches.push(inputData[targetIdx].target);
                break;
            }
        }
    }
    let result = valuesWithMatches.reduce((acc, currentValue) => acc + currentValue, 0);
    console.log("result: " + result);
}

function evaluateResult(inputValues, operatorCode) {
    if (inputValues.length != operatorCode.length + 1) {
        console.log("Arseways Error");
        return -1;
    }
    var runningTotal = inputValues[0];
    var j = 0;
    for (var i = 1 ; i < inputValues.length ; i++){
        runningTotal = decodeOperatorAndEvaluate(runningTotal, inputValues[i], operatorCode[j]);
        j++;
    }

    return runningTotal;
}

function decodeOperatorAndEvaluate(a, b, code){
    switch (code) {
        case "0":
            return a+b;
        case "1":
            return a*b;
        case "2":
            return parseInt(a.toString() + b.toString());
        default:
            console.log("Error unkown code: " + code);
            break
    }
}