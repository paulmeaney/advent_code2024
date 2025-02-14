//let worldMap = new Map();
let frequencies = new Map();


function dayEightProcessing(inputString){
    let antiNodesFound = new Set();
    const tempYAxis = inputString.split('\n');
    for (let y = 0; y < tempYAxis.length; y++) {
        let tempXAxis = tempYAxis[y].split("");
        for (let x =  0; x < tempXAxis.length; x++){
            worldMap.set((x + "_" + y), tempXAxis[x]);
            if (tempXAxis[x] !== "."){
                if (frequencies.has(tempXAxis[x])) {
                    frequencies.get(tempXAxis[x]).push((x + "_" + y));
                }
                else {
                    frequencies.set(tempXAxis[x], [(x + "_"+ y )])
                }
            }
        }
    }
    console.log("Map loading done");

    for (let freq of frequencies.keys()){
        let antennaPairs = findAllAntennaPairs(frequencies.get(freq));
        for (let i in antennaPairs){
            let v = calculateVector(antennaPairs[i]);
            let antiNodes = calculateAntiNode(antennaPairs[i], v);
            for (let n in antiNodes) {
                if (worldMap.has(antiNodes[n])){
                    antiNodesFound.add(antiNodes[n]);
                }
            }
        }
    }

    console.log("Found Antinodes!");
    console.log("antinodes:\n " + antiNodesFound.size);

    //part 2
    antiNodesFound.clear();

    for (let freq of frequencies.keys()){
        let antennaPairs = findAllAntennaPairs(frequencies.get(freq));
        for (let i in antennaPairs){
            let v = calculateVector(antennaPairs[i]);

            let antiNodes = findHarmonicAntiNodes(antennaPairs[i], v);
            for (let n in antiNodes) {
                if (worldMap.has(antiNodes[n])){
                    antiNodesFound.add(antiNodes[n]);
                }
            }
        }
    }

    console.log("Found Antinodes part 2!");
    console.log("antinodes:\n " + antiNodesFound.size);
}

function findHarmonicAntiNodes(pair, vector){
    let a = pointToInt(pair[0]);
    let b = pointToInt(pair[1]);
    let v = pointToInt(vector);
    let antinodes = [];

    let antinodeA = {x: (a.x - v.x), y: (a.y - v.y)};
    let antinodeB = {x: (b.x + v.x), y: (b.y + v.y)};

    antinodes.push(pointToStringCode(a));
    antinodes.push(pointToStringCode(b));
    antinodes.push(pointToStringCode(antinodeA));
    antinodes.push(pointToStringCode(antinodeB));

    while (worldMap.has(pointToStringCode(antinodeA))){
        antinodeA = {x: (antinodeA.x - v.x), y: (antinodeA.y - v.y)};
        if (worldMap.has(pointToStringCode(antinodeA))){
            antinodes.push(pointToStringCode(antinodeA));
        }
    }

    while (worldMap.has(pointToStringCode(antinodeB))){
        antinodeB = {x: (antinodeB.x + v.x), y: (antinodeB.y + v.y)};
        if (worldMap.has(pointToStringCode(antinodeB))){
            antinodes.push(pointToStringCode(antinodeB));
        }
    }
    return antinodes;

}

function findAllAntennaPairs(antennas) {
    let numAntennas = antennas.length;
    let pairs = [];

    for (let i = 0; i < numAntennas - 1; i++){
        for (let j = i + 1; j < numAntennas; j++) {
            pairs.push([antennas[i], antennas[j]]);
        }
    }
    return pairs;
}

function calculateAntiNode(pair, vector){
    let a = pointToInt(pair[0]);
    let b = pointToInt(pair[1]);
    let v = pointToInt(vector);

    let antinodeA = {x: (a.x - v.x), y: (a.y - v.y)};
    let antinodeB = {x: (b.x + v.x), y: (b.y + v.y)};

    return [pointToStringCode(antinodeA), pointToStringCode(antinodeB)];
}

function calculateVector(antennaPair){
    let a = pointToInt(antennaPair[0]);
    let b = pointToInt(antennaPair[1]);

    let v = {x: (b.x - a.x), y: (b.y - a.y)};

    return pointToStringCode(v);

}

function pointToInt(point) {
    const pointVals = point.split("_").map(value=>parseInt(value));
    return {x: pointVals[0], y: pointVals[1]};
}

function pointToStringCode(point){
    return (point.x + "_" + point.y);
}