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
    arrangment = stringInput.split(" ").map(value => parseInt(value));
    console.log(arrangment);
}