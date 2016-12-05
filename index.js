var fs = require('fs');
const intByteLength = 4;

function SIZEHandler(Buffer, chunk){
  var readBitIndex = chunk.definitionEndIndex;
  var sizex = Buffer.readInt32LE(readBitIndex);
  readBitIndex += 4;

  var sizey = Buffer.readInt32LE(readBitIndex);
  readBitIndex += 4;
  
  var sizez = Buffer.readInt32LE(readBitIndex);
  readBitIndex += 4;
  return {
    sizex: sizex,
    sizey: sizey,
    sizez: sizez
  };
}

function XYZIHandler(Buffer, chunk){
  var readBitIndex = chunk.definitionEndIndex;
  var numVoxels = Math.abs(Buffer.readInt32LE(readBitIndex));
  readBitIndex += 4;

  voxelData = []
  for (var n = 0; n < numVoxels; n++) {
    voxelData[n] = {
      x: Buffer[readBitIndex++] & 0xFF,
      y: Buffer[readBitIndex++] & 0xFF,
      z: Buffer[readBitIndex++] & 0xFF,
      color: Buffer[readBitIndex++] & 0xFF,
    };
  }

  return {voxelData: voxelData};
}

const chunkHandlers = {
  SIZE: SIZEHandler,
  XYZI: XYZIHandler,
  RGBA: function(){return {};}
};

function getChunkData(Buffer, chunk){
  return chunkHandlers[chunk.id](Buffer, chunk);
}

function readChunkIndexRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
  var readBitIndex = bufferStartIndex;
  var id = String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]));

  var chunkContentByteLength = Buffer.readInt32LE(readBitIndex);
  readBitIndex += intByteLength;

  var childContentByteLength = Buffer.readInt32LE(readBitIndex);
  readBitIndex += intByteLength;

  var chunk = {
    id: id,
    bufferStartIndex: bufferStartIndex,
    definitionEndIndex:  readBitIndex,
    contentByteLength: chunkContentByteLength,
    childContentByteLength: childContentByteLength,
    totalEndIndex: readBitIndex + chunkContentByteLength + childContentByteLength
  };

  accum[id] = chunk;
  
  if(chunk.contentByteLength == 0 && childContentByteLength == 0){
    console.log("no content or children");
    return accum;
  }

  if(chunk.contentByteLength && chunk.id){
    Object.assign(chunk, getChunkData(Buffer, chunk));
  }

  //read children
  if(chunk.childContentByteLength > 0){
    return readChunkIndexRange(Buffer,
                               chunk.definitionEndIndex+chunk.contentByteLength,
                               bufferEndIndex,
                               chunk);
  }

  //accumulate siblings
  if(chunk.totalEndIndex != bufferEndIndex){
    return readChunkIndexRange(Buffer,
                               chunk.totalEndIndex,
                               bufferEndIndex,
                               accum);
  }

  return accum;
}

function MagicaVoxelParser(Buffer){
  var ret = {'VOX ': 150};
  return readChunkIndexRange(Buffer, 8, Buffer.length, ret);
}


fs.readFile("chr_fatkid.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(MagicaVoxelParser(Buffer), null, 2));
});


/* {
 *   "VOX ": 150,
 *   "MAIN": {
 *     "id": "MAIN",
 *     "chunkStartIndex": 8,
 *     "definitionEndIndex": 20,
 *     "contentByteLength": 0,
 *     "childContentByteLength": 2284,
 *     "totalContentLength": 2304
 *   },
 *   "SIZE": {
 *     "id": "SIZE",
 *     "chunkStartIndex": 20,
 *     "definitionEndIndex": 32,
 *     "contentByteLength": 12,
 *     "childContentByteLength": 0,
 *     "totalContentLength": 44,
 *     "stub": "data"
 *   },
 *   "XYZI": {
 *     "id": "XYZI",
 *     "chunkStartIndex": 44,
 *     "definitionEndIndex": 56,
 *     "contentByteLength": 1212,
 *     "childContentByteLength": 0,
 *     "totalContentLength": 1268,
 *     "stub": "data"
 *   },
 *   "RGBA": {
 *     "id": "RGBA",
 *     "chunkStartIndex": 1268,
 *     "definitionEndIndex": 1280,
 *     "contentByteLength": 1024,
 *     "childContentByteLength": 0,
 *     "totalContentLength": 2304,
 *     "stub": "data"
 *   }
 * }*/
