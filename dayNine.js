function dayNineProcessing(inputString){
    const input = inputString.split("").map((value) => parseInt(value));
    let blockData = decodeDiskMap(input);
    console.log(blockData);

    let emptyBlocks = getEmptyContiguousBlocks(getAllEmptyBlockIndices(blockData));
    let fileInfo = getFileSizes(input);

    console.log(emptyBlocks);
    console.log(fileInfo);

    compressBlockDataPartTwo(blockData, emptyBlocks, fileInfo);
    console.log(blockData);
    // compressBlockData(blockData);
    // console.log(blockData);
    let checksum = calculateCheckSum(blockData);
    console.log("Checksum: " + checksum);


}  

function calculateCheckSum(blockData){
    let runningTotal = 0;
    for (let idx in blockData) {
        if (blockData[idx] !== ".") {
            runningTotal = runningTotal + (idx * blockData[idx]);
        }
    }
    return runningTotal;
}

function compressBlockDataPartTwo(blockData, emptySpaces, fileInfo){
    fileInfo.reverse(); //start at the back of the queue
    let insertionPtr = 0;
    let blankPtr = 0;
    for (let i = 0; i < fileInfo.length; i++){

        for (let j = 0; j < emptySpaces.length; j++){
            if (emptySpaces[j].start > fileInfo[i].start){
                break;
            }
            if (fileInfo[i].size <= emptySpaces[j].size){
                for (let k = 0; k < fileInfo[i].size; k++){
                    blockData[emptySpaces[j].start + k] = blockData[fileInfo[i].start + k];
                    blockData[fileInfo[i].start + k] = ".";
                }
                break;
            }
            
        }
        emptySpaces = getEmptyContiguousBlocks(getAllEmptyBlockIndices(blockData));

        // if (fileInfo[i].size <= emptySpaces[insertionPtr].size){
        //     blankPtr = emptySpaces[insertionPtr].start;
        //     for (let j = 0; j < fileInfo[i].size; j++) {
        //         blockData[blankPtr] = blockData[fileInfo[i].start + j];
        //         blockData[fileInfo[i].start + j] = ".";
        //         blankPtr++;
        //     }
        //     insertionPtr++;
        //     emptySpaces = getEmptyContiguousBlocks(getAllEmptyBlockIndices(blockData));
        // }
        // if (emptySpaces[insertionPtr].start > fileInfo[i+1].start) {
        //     break;
        // }
    }
}

function compressBlockData(blockData){
    let emptySpace = getAllEmptyBlockIndices(blockData);
    let ep = blockData.length - 1;

    for (let emptyBlockIdx of emptySpace){

        while (blockData[ep] === "."){
            ep --;
        }

        if (ep <= emptyBlockIdx) {
            break;
        }

        if (blockData[ep] !== "."){
            blockData[emptyBlockIdx] = blockData[ep];
            blockData[ep] = ".";
            ep --;
        } 
    }
}

function decodeDiskMap(diskMap) {
    let currentID = 0;
    let blockData = [];
    for (let index in diskMap) {

        for (let i = 0; i < diskMap[index]; i++) {
            if (index % 2 === 0) {
                blockData.push(currentID);
            }
            else {
                blockData.push(".");
            }
        }
        if (index % 2 === 0) {
            currentID++;
        }
    }
    return blockData;
}

function getAllEmptyBlockIndices(blockData){
    let emptyIndices = [];
    for (let index in blockData) {
        if (blockData[index] === ".") {
            emptyIndices.push(parseInt(index));
        }
    }
    return emptyIndices;
}

function getEmptyContiguousBlocks(emptyIndices){
    let emptyBlocks = [];
    let cptr = 0;
    let nptr = 0;
    for (let i = 0; i < emptyIndices.length; i++){
        let start = emptyIndices[i];
        cptr = i;
        nptr = i+1;
        let size = 1;
        while (emptyIndices[nptr] === emptyIndices[cptr] + 1) {
            size++;
            cptr = nptr;
            nptr++;
        }
        emptyBlocks.push({start: start, size: size});
        i=cptr;
    }
    return emptyBlocks;
}

function getFileSizes(diskMap){
    let fileInfo = [];
    let fileID = 0;
    let index = 0;
    for (let i = 0; i< diskMap.length; i++){
        if (i%2 === 0) {
            fileInfo.push({fileID: fileID, start: index, size: diskMap[i]});
            fileID ++;
        }
        index += diskMap[i];
    }

    return fileInfo;

}