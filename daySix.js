var worldMap = new Map();
var turnPointsDirections = new Map();
var turnPoints = [];
var blockagePoints = [];
var completePath = [];


function daySixProcessing(inputString) {
    buildMap(inputString);
    console.log("Map loading done");
    plotMovementThroughMap();
    partTwoBuildPath();
    bruteForcePart2();
}

function buildMap(mapString){
    const tempYAxis = mapString.split('\n');
    for (var y = 0; y < tempYAxis.length; y++) {
        var tempXAxis = tempYAxis[y].split("");
        for (var x =  0; x < tempXAxis.length; x++){
            worldMap.set((x + "_" + y), tempXAxis[x]);
        }
    }
    console.log("Map Loaded Successfully")
}

function plotMovementThroughMap(){
    var infiniteLoopDetected = false;
    var currentPosition = "0_0";
    var directionOfTravel = "up";
    var nextMoveDirection = "up";
    var completePathWithDirectionsJSON = new Set();
    for (var positions of worldMap.keys()) {
        if (worldMap.get(positions) === "^"){
            currentPosition = positions;
            break;
        }
    }
    var moveCounter = 0;
    var visitedPoints = new Set();
    nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
    while (nextMoveDirection !== "end") {
        visitedPoints.add(currentPosition);
        if (completePathWithDirectionsJSON.has(JSON.stringify({pos:currentPosition, dir:directionOfTravel}))){
            console.log("Infinite Loop detected!");
            infiniteLoopDetected = true;
            break;
        } else {
            completePathWithDirectionsJSON.add(JSON.stringify({pos:currentPosition, dir:directionOfTravel}));
        }
        moveCounter +=1;
        currentPosition = getNextPointForDirection(currentPosition, nextMoveDirection);
        directionOfTravel = nextMoveDirection;
        nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
    }
    visitedPoints.add(currentPosition);
    //console.log("Number Of Moves :" + moveCounter);
    //console.log("Number of points visited: "+ visitedPoints.size);
    //console.log(completePathWithDirectionsJSON);
    return infiniteLoopDetected;

}

function partTwoBuildPath(){
    var currentPosition = "0_0";
    var directionOfTravel = "up";
    var nextMoveDirection = "up";
    var turnCounter = 0;
    for (var positions of worldMap.keys()) {
        if (worldMap.get(positions) === "^"){
            currentPosition = positions;
        }
        if (worldMap.get(positions) == "#") {
            blockagePoints.push(positions);
        }
    }
    //turnPoints.push(currentPosition); //don't think we want the starting point, just the first turn
    completePath.push({point:currentPosition, direction:directionOfTravel});
    nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
    while (nextMoveDirection !== "end") {
        if (directionOfTravel !== nextMoveDirection){
            turnPointsDirections.set(currentPosition, directionOfTravel);
            turnPoints.push({point:currentPosition, direction:directionOfTravel});
        }
        currentPosition = getNextPointForDirection(currentPosition, nextMoveDirection);
        directionOfTravel = nextMoveDirection;
        nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
        completePath.push({point:currentPosition, direction:directionOfTravel});
    }
    turnPoints.push({point:currentPosition, direction:directionOfTravel});
    console.log("Done Building Path")
    //console.log(turnPoints);
    //console.log(blockagePoints);
    console.log(completePath);

    var attemptedTurn;
    var newObstacleToAdd = [];
    var alternativeTurnPoints = [];

    for (var i = 3; i < turnPoints.length; i++){
        var startIndex = (i-3) % 4;
        var numSuggestedTurns = Math.floor((i+1) / 4);
        var indicesToRepace = [];
        for (var j = startIndex; j <= i; j += 4){
            indicesToRepace.push(j);
        }
        //console.log("Index " + i + " Point " + turnPoints[i].point + " indexes to replace " + indicesToRepace);

        //alternativeTurnPoints.push({point:turnPoints.point, direction:turnPoints.direction, altPoints:[]});
        var currentAltPoints = [];
        for (var k = 0; k < indicesToRepace.length; k++){
            const newPoint = calculateReplacementPoint(turnPoints[i-1].point, turnPoints[i].direction, turnPoints[indicesToRepace[k]].point);
            currentAltPoints.push(newPoint);
        }
        alternativeTurnPoints.push({point:turnPoints[i].point, direction:turnPoints[i].direction, altPoints:currentAltPoints});
    }

    //console.log(alternativeTurnPoints);
    console.log("We have out alt turn points, checking if they are legal...");
    var viableTurnPoint = [];
    var prevPoint = turnPoints[2].point;

    for (var i = 0; i < alternativeTurnPoints.length; i++){
        //for each alternative turn point
        //is there a blockage on the x or y axis from the prev point
        //take i=1
        //point is 2,4
        /*alt point is 2 1
          prev oint is 2, 6
          direction at turn is up
          so you take prev point 2,6
          moving up so look at the y axis (keep x on 2)
          is there a blockage on y axis between 6 and 1??
          There is a blockage on 2,3 */
        
        for (var altPoint in alternativeTurnPoints[i].altPoints) {
            if (!checkForBlockageBetweenTwoPoints(prevPoint, alternativeTurnPoints[i].altPoints[altPoint], alternativeTurnPoints[i].direction)){
                //console.log("Turn " + (i+4) + " Viable turn point found. Old point " + alternativeTurnPoints[i].point + " new point " + alternativeTurnPoints[i].altPoints[altPoint]);
                viableTurnPoint.push(alternativeTurnPoints[i].altPoints[altPoint]);
            }
        }
        prevPoint = alternativeTurnPoints[i].point;
    }
    console.log("new routes " + viableTurnPoint.length);
}

function checkForBlockageBetweenTwoPoints(pointA, pointB, direction){
    /*Need a check to filter out a point thats "beind" the direction of travel */
    /* e.g. traveling "down" x axis is static and y is increasing. If my pointB y co-ordinate
    is less than the PointA then filter it out.*/

    const pointAValues = pointA.split("_").map(value=> parseInt(value));
    const pointBValues = pointB.split("_").map(value=> parseInt(value));
    var stringMatch = "2_";
    var indexToCheck = 0;
    switch (direction) {
        case "up": //keep x
            if (pointBValues[1] > pointAValues[1]) { //If new point is behind/lower down the y axis that the prev point
                return true;
            }
            stringMatch = pointAValues[0] + "_";
            indexToCheck = 1;
            break;
        case "down": //keep x
            if (pointBValues[1] < pointAValues[1]) { //If new point is ahead/above the y axis that the prev point
                return true;
            }
            stringMatch = pointAValues[0] + "_";
            indexToCheck = 1;
            break;
        case "left": //keep y
            if (pointBValues[0] > pointAValues[0]) { //If new point is ahead/above the y axis that the prev point
                return true;
            }
            stringMatch = "_" + pointAValues[1];
            indexToCheck = 0;
            break;
        case "right":
            if (pointBValues[0] < pointAValues[0]) { //If new point is ahead/above the y axis that the prev point
                return true;
            }
            stringMatch = "_" + pointAValues[1];
            indexToCheck = 0;
            break;
    }

    const blockagesOnAxisPoints = blockagePoints.filter((value) => {
        const indexFound = value.search(stringMatch);
        return indexFound >= 0;
    });

    const blockageOnAxis = blockagesOnAxisPoints.map((value) => {
        const points = value.split("_").map(vl => parseInt(vl));
        return points[indexToCheck];
    });

    const pointsToCheck = [pointAValues[indexToCheck], pointBValues[indexToCheck]];
    pointsToCheck.sort((a, b) => a-b);

    for (var point in blockageOnAxis) {
        if (blockageOnAxis[point] >= pointsToCheck[0] && blockageOnAxis[point] <= pointsToCheck[1]) {
            return true;
        }
    }
    return false;

}

function calculateReplacementPoint(previousPoint, intendedDirectionOfTravel, referencePoint){
    const previousPointValues = previousPoint.split("_").map(value => parseInt(value));
    const referecncePointValues = referencePoint.split("_").map(value => parseInt(value));

    switch(intendedDirectionOfTravel){
        case "right":
            return referecncePointValues[0] + "_" + previousPointValues[1]; //Keep y, move x
        case "left":
            return referecncePointValues[0] + "_" + previousPointValues[1]; //Keep y, move x
        case "up":
            return previousPointValues[0] + "_" + referecncePointValues[1]; //keep x move y
        case "down":
            return previousPointValues[0] + "_" + referecncePointValues[1]; //keep x move y    
    }
    
}

function getObstablePositionFromTurnPoint(attemptedTurn, direction){
    var intattemptedTurn = attemptedTurn.split("_").map(value => parseInt(value));
    switch (direction) {
        case "up":
            return intattemptedTurn[0] + "_" + (intattemptedTurn[1] + 1);

        case "down":
            //keep x
            return intattemptedTurn[0] + "_" + (intattemptedTurn[1] - 1);
        case "left":
            //keep y
            return (intPerpindicular[0] - 1) + "_" + intCurrentTurn[1];
        case "right":
            //keep y
            return (intPerpindicular[0] + 1) + "_" + intCurrentTurn[1];

    }

}

function getAttemptedTurnPoint(currentTurn, perpindicularTurnPointOnPath, direction) {
    var intCurrentTurn = currentTurn.split("_").map(value => parseInt(value));
    var intPerpindicular = perpindicularTurnPointOnPath.split("_").map(value => parseInt(value));
    switch (direction) {
        case "up":
            //keep x
            return intCurrentTurn[0] + "_" + intPerpindicular[1];

        case "down":
            //keep x
            return intCurrentTurn[0] + "_" + intPerpindicular[1];
        case "left":
            //keep y
            return intPerpindicular[0] + "_" + intCurrentTurn[1];
        case "right":
            //keep y
            return intPerpindicular[0] + "_" + intCurrentTurn[1];

    }

}

function checkLanesAreClear(currentPoint, turnPoint, lineOfTravelPoint, directionOfTravel) {
    var xAxisRange; //the points on the x axis to search between
    var yAxisRange; // the points on the y axis to search between
    const intCurrentPoint = currentPoint.split("_").map(value => parseInt(value));
    const intturnPoint = turnPoint.split("_").map(value => parseInt(value));
    const intLineOfTravelPoint = lineOfTravelPoint.split("_").map(value => parseInt(value));
    var lanesClear = true;

    switch (directionOfTravel) {
        case "up":
            //We are moving up
            //we want to turn right - because we can hook into the travel path
            //We want to see if
            // a. we can get to the turning point
            // b. we can get to the travel path
            //Turn point will be calculated as perpindicular to the travel path on the line of travel
            //Will this check that the turn point is valid, i.e I calculated a turn point that was perpendicular but required a left turn??
            //Yea i'll make sure that is done before passing it to this one.

            //check a.
            if (intLineOfTravelPoint[0] < intCurrentPoint[0]) {
                lanesClear = false;
                return lanesClear;
            }

            xAxisRange = [intturnPoint[0], intLineOfTravelPoint[0]];
            yAxisRange = [intCurrentPoint[1], intturnPoint[1]];
            break;

            
        case "down":
            if (intLineOfTravelPoint[0] > intCurrentPoint[0]) {
                lanesClear = false;
                return lanesClear;
            }
            xAxisRange = [intLineOfTravelPoint[0], intturnPoint[0]];
            yAxisRange = [intCurrentPoint[1], intturnPoint[1]];
            break;
            
        case "left":
            if (intLineOfTravelPoint[1] > intCurrentPoint[1]) {
                lanesClear = false;
                return lanesClear;
            }
            xAxisRange = [intturnPoint[0], intCurrentPoint[0]];
            yAxisRange = [intturnPoint[1], intLineOfTravelPoint[1]];
            break;
            
        case "right":
            if (intLineOfTravelPoint[1] < intCurrentPoint[1]) {
                lanesClear = false;
                return lanesClear;
            }
            xAxisRange = [intCurrentPoint[0], intturnPoint[0]];
            yAxisRange = [intturnPoint[1], intLineOfTravelPoint[1]];
            break;
            
        default:
            console.log("Error, unkown direction " + direction + " given");
            return lanesClear;
    }

    for (var blockage of blockagePoints) {
        const intBlockage = blockage.split("_").map(value => parseInt(value));
        if ((intBlockage[1] === intturnPoint[1]) && (intBlockage[0] > xAxisRange[0] && intBlockage[0] < xAxisRange)) {
            lanesClear = false;
        }
        if ((intBlockage[0] === intturnPoint[0]) && (intBlockage[1] > yAxisRange[0] && intBlockage[1] < yAxisRange)) {
            lanesClear = false;
        }
    }

}

function findguardStuckPaths(){
    var numOfSolutions = 0;
    for (var positions of worldMap.keys()) {
        if (worldMap.get(positions) === "."){
            if (simulateGuardStuckPath(positions)){
                numOfSolutions ++;
            }
        }
    }
    console.log("The number of places that you can add an obstacle\nand cause the guard to get stuck is: " + numOfSolutions);
}

function simulateGuardStuckPath(pointToAddObstacle){
    var guardStuck = false;
    var originalPointObject = worldMap.get(pointToAddObstacle);
    worldMap.set(pointToAddObstacle, "#");
    var currentPosition = "0_0";
    var directionOfTravel = "up";
    var nextMoveDirection = "up";
    var moveCounter = 0;
    for (var positions of worldMap.keys()) {
        if (worldMap.get(positions) === "^"){
            currentPosition = positions;
            break;
        }
    }
    var loopStartPoint = currentPosition;
    nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
    while (!guardStuck && (nextMoveDirection !== "end")){
        currentPosition = getNextPointForDirection(currentPosition, nextMoveDirection);
        directionOfTravel = nextMoveDirection;
        nextMoveDirection = determineNextMove(currentPosition, directionOfTravel);
        moveCounter ++;
        if (moveCounter%4 === 0) {
            if (loopStartPoint === currentPosition){
                guardStuck = true;
            }
        }
    }
    worldMap.set(pointToAddObstacle, originalPointObject);
    return guardStuck;
}




function determineNextMove(currentPoint, directionOfTravel) {
    var nextPoint = getNextPointForDirection(currentPoint, directionOfTravel);
    if (!worldMap.has(nextPoint)) {
        return "end";
    }
    else {
        if (worldMap.get(nextPoint) === "." || worldMap.get(nextPoint) === "^") {
            return directionOfTravel;
        }
        if (worldMap.get(nextPoint) === "#") {
            var directionChange = directionOfTravel;
            var directionChangePoint = "";
            do {
                directionChange = rotateClockwise(directionChange);
                directionChangePoint = getNextPointForDirection(currentPoint, directionChange);
                if (directionChange === directionOfTravel) {
                    console.log("Help I'm stuck");
                    return "end";
                }
            } while (worldMap.get(directionChangePoint) === "#");
            return directionChange;
        }
    }
    console.log("Next move couldn't be determined ans we encountered something unexpected on the map!");
    return "end"
}

function rotateClockwise(directionOfTravel) {
    switch (directionOfTravel) {
        case "up":
            return "right";
        case "down":
            return "left";
        case "right":
            return "down";
        case "left":
            return "up";
        default:
            console.log("Error, unkown direction " + directionOfTravel + " given");
            return "XXX"
    }
}


function getNextPointForDirection(currentPoint, direction){
    var coordinates = currentPoint.split("_").map(value => parseInt(value));
    switch (direction) {
        case "up":
            return (coordinates[0] + "_" + (coordinates[1] - 1));
        case "down":
            return (coordinates[0] + "_" + (coordinates[1] + 1));
        case "left":
            return ((coordinates[0] - 1) + "_" + coordinates[1]);
        case "right":
            return ((coordinates[0] + 1) + "_" + coordinates[1]);
        default:
            console.log("Error, unkown direction " + direction + " given");
            return "XXX"
    }
}

function bruteForcePart2(){
    plotMovementThroughMap();
    var loopsCreated = 0;
    var newBlockages = new Set();
    for (var i = 0; i<completePath.length-1; i++){
        var placeHolder = worldMap.get(completePath[i+1].point);
        //if ((completePath[i+1].point !== completePath[0].point) && completePath[i+1].direction === completePath[i].direction) { //corner case. Here I am ommiting the situation where I turn. But you want to place an obstacle here anyway and make the gurad do a 180 deg
        if (completePath[i+1].point !== completePath[0].point){
            worldMap.set(completePath[i+1].point, "#");
        }
        if (plotMovementThroughMap()){
            loopsCreated++;
            //console.log("New Turn point: " + completePath[i].point);
            //console.log("New Blockage: " + completePath[i+1].point);
            newBlockages.add(completePath[i+1].point);
        }
        worldMap.set(completePath[i+1].point, placeHolder);
    }

    console.log("Loops created: " + loopsCreated );
    console.log("new blockages is : " + newBlockages.size);
}


//Part 2
//Create list of all the coordinates where the path turns
//start at point 4
//for all the remaining points.
//(take x or y based on direction from prev point then fill in the other x or y from the -3, -7, -12, -15 etc to generate new turning points)
//for each new turnin point, determin whether there are any other (Blockages in the map for either the x or y based on turn direction)