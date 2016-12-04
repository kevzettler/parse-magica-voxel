var fs = require('fs');
const intByteLength = 4;


function getChunkData(Buffer, chunk){
  return {"stub": 'data'};
}

function readChunkIndexRange(Buffer, chunkStartIndex, chunkEndIndex, accum){
  var readBitIndex = chunkStartIndex;
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
    chunkStartIndex: chunkStartIndex,
    definitionEndIndex:  readBitIndex,
    contentByteLength: chunkContentByteLength,
    childContentByteLength: childContentByteLength,
    totalContentLength: readBitIndex + chunkContentByteLength + childContentByteLength
  };

  accum[id] = chunk;

  if(chunkContentByteLength > 0){
    Object.assign(chunk, getChunkData(Buffer, chunk));
  }

  //children
  if(childContentByteLength > 0) {
    return readChunkIndexRange(Buffer,
                               chunk.definitionEndIndex+chunk.contentByteLength,
                               chunk.definitionEndIndex+chunk.childContentByteLength,
                               chunk);
  }  

  //siblings
  if(chunk.totalContentLength < chunkEndIndex){
    return readChunkIndexRange(Buffer,
                               chunk.totalContentLength,
                               chunkEndIndex,
                               accum);
  }


  return accum;
}

function MagicaVoxelParser(Buffer){
  var ret = {'VOX ': 150};
  return readChunkIndexRange(Buffer, 20, Buffer.length, ret);
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
