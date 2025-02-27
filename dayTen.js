function dayTenProcessing(inputString){
    buildMap(inputString);
    console.log(worldMap);

    let trailhead = "0_6";
    let starting = {pathComplete: false, nextPoints: getNextPoints(trailhead), trailsFound: 0, peaksReached: new Set()};
    let result = getHikingPath(starting);
    console.log(result);
    starting.peaksReached.clear();

    let mapScore = 0;
    let trailScore = 0;

    for (const point of worldMap.keys()){
        if (worldMap.get(point) === "0") {
            console.log("Starting trailhead at " + point);
            starting.nextPoints = getNextPoints(point);
            result = getHikingPath(starting);
            //console.log("Trailhead score " + result.peaksReached.size);
            //console.log("Trails Found: " + result.trailsFound);
            mapScore += result.peaksReached.size;
            trailScore += result.trailsFound;
            starting.peaksReached.clear();
        }
    }

    console.log("Total Score: " + mapScore);
    console.log("Trail Score: " + trailScore);
}

function getNextPoints(currentPoint){
    let cp = pointToInt(currentPoint);
    const nextDirections = ["0_-1", "0_1", "-1_0", "1_0"];
    let nextPoints = [];

    for (direction of nextDirections){
        let dv = pointToInt(direction);
        let np = addVector(cp, dv);
        if (worldMap.has(pointToStringCode(np)) && (parseInt(worldMap.get(pointToStringCode(np))) === parseInt(worldMap.get(currentPoint)) + 1)) {
            nextPoints.push(pointToStringCode(np));
        }
    }
    return nextPoints;
}

function addVector(point, vector){
    return {x: (point.x + vector.x), y: (point.y + vector.y)};
}

function getHikingPath(pathInfo){
   let currentPoints = pathInfo.nextPoints;
   let newPathsFound = 0;
   let peaksReached = pathInfo.peaksReached;
   for (pos of currentPoints) {
       if (parseInt(worldMap.get(pos)) === 9 ) {
           newPathsFound ++;
           peaksReached.add(pos);
           //return {pathComplete: true, nextPoints: [], trailsFound: newPathsFound};
       } else {
           let nextPoints = getNextPoints(pos);
           if (nextPoints.length === 0) {
               //return {pathComplete: false, nextPoints: [], trailsFound: newPathsFound, peaksReached: peaksReached};
           } else {
               newPathsFound += getHikingPath({pathComplete: false, nextPoints: nextPoints, trailsFound: 0, peaksReached: peaksReached}).trailsFound;
           }
       }
   }
   return {pathComplete: true, nextPoints: [], trailsFound: newPathsFound, peaksReached: peaksReached};
}



function dayElevenProcessing(stringInput){
    let stoneArrangement = stringInput.split(" ").map(value => parseInt(value));
    console.log(stoneArrangement);
    let totalLength = 0;
    
    //let result = partTwoOptimisation(false, 0, 0, 25, tempStone);
    let compareArray = stoneArrangement;
     for (let i = 0 ; i < 25; i ++) {
         compareArray = processStoneArrangement(compareArray);
    }

    totalLength = compareArray.length;
    console.log(totalLength);

    console.log("Part 2");
    console.log(stoneArrangement);
    let result = arraySizeLimiter(stoneArrangement, 25, 100000);
    console.log(result);

    console.log("Part 3");
    console.log(stoneArrangement);
    result = partTwoOptimisation(stoneArrangement, 75);
    console.log(result);
    // for( let blink = 0; blink < 75; blink++){
    //     stoneArrangement = processStoneArrangement(stoneArrangement);
    //     // console.log("blink " + blink+1 + " " + stoneArrangement);
    // }

  

}

function partTwoOptimisation(initialStones, iterations){ //got help with this one. If we keep track of it as a map and not an array we don't have to duplicate the calculations
//For example if we end up with 1 X 10 ^ 9 , these are not all unique numbers. We can keep track of the unique numbers and the number of times they appear instead.


/*[0] [1]*/ 
    let stoneMapping = new Map();
   
    for (initialStone of initialStones){
        if (stoneMapping.has(initialStone)){
            stoneMapping.set(initialStone, stoneMapping.get(initialStone) + 1);
        } else {
            stoneMapping.set(initialStone, 1);
        }
    }

    for (let i = 0; i < iterations; i++){
        let newStoneMapping = new Map();
        for (var stones of stoneMapping.keys()){
            let stoneCount = stoneMapping.get(stones);
            let newStones = processStoneArrangement([stones]);
            
            for (let newStone of newStones){
                if (newStoneMapping.has(newStone)){
                    newStoneMapping.set(newStone, newStoneMapping.get(newStone) + stoneCount);
                } else {
                    newStoneMapping.set(newStone, stoneCount);
                }
            }
        }
        stoneMapping = newStoneMapping;        
        
    }
    let stoneCounter = 0;
    for (let stones of stoneMapping.keys()){
        stoneCounter += stoneMapping.get(stones);
    }

    return stoneCounter;
}



function arraySizeLimiter(stones, iterations, arraySizeLimit){
    let stoneCounter = stones.length;
    for (let i = 0; i < iterations; i++) {
        
        if (stoneCounter > arraySizeLimit) {
            let numberOfNewArrays = Math.ceil(stones.length/arraySizeLimit);
            const newArraySize = Math.floor(stones.length/numberOfNewArrays);
            let divergedStoneCount = 0;
            iterations = iterations - i;
            for (let k = 0; k < numberOfNewArrays; k++) {
                let newArrayStones = [];
                if (k === numberOfNewArrays - 1) {
                    newArrayStones = stones.slice(k * newArraySize);
                } else {
                    newArrayStones = stones.slice(k * newArraySize, (k + 1) * newArraySize);
                }
                divergedStoneCount += arraySizeLimiter(newArrayStones, iterations, arraySizeLimit);
            }
            stoneCounter = divergedStoneCount;
            break;
        }    
        
        let newStones = processStoneArrangement(stones);  
        stoneCounter = newStones.length; 
        stones = newStones;
    }
    return stoneCounter;
}


function ruleOne(stone){
    if (stone === 0) {
        return 1;
    }
}

function ruleTwo(stone){
    let stoneS = stone.toString();
    let stoneArr = stoneS.split("");
    if (stoneArr.length % 2 === 0) {
        let half = stoneArr.length / 2;
        let a = "";
        let b = "";
        for (let i = 0; i < half; i++){
            a += stoneArr[i];
            b += stoneArr[half + i];
        }
        return [parseInt(a), parseInt(b)];
    
    }

    return [stone];
}

function ruleThree(stone) {
    return stone * 2024;
}

function determineRuleToExecute(stone){
    if (stone === 0) {
        return 1;
    }
    let stoneS = stone.toString();
    let stoneArr = stoneS.split("");
    if (stoneArr.length % 2 === 0) {
        return 2;
    }

    return 3;
    
}

function processStoneRules(stone) {
    let stoneOutput = [];
    let rule = determineRuleToExecute(stone);
    switch (rule) {
        case 1:
            stoneOutput.push(ruleOne(stone));
            break;
        case 2:
            stoneOutput = ruleTwo(stone);
            break;
        case 3:
            stoneOutput.push(ruleThree(stone));
            break;
        default:
            console.log("Error: Unknown Rule");
    }
    return stoneOutput;
}

function processStoneArrangement(arr){
    let newStoneArrangement = [];

    if (arr.length > 100000) {
//        console.log("Too many stones");
    }
    for (let stone of arr){
        newStones = processStoneRules(stone);
        for (let newStone of newStones){
            newStoneArrangement.push(newStone);            
        }
    }

    if (newStoneArrangement.length > 100000) {
//        console.log("We've blown up");
    }

    return newStoneArrangement;
}