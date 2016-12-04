var fs = require('fs');
var byteReadPosition = 8;

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
  readBitIndex += 4;

  var childContentByteLength = Buffer.readInt32LE(readBitIndex);
  readBitIndex += 4;

  var chunk = {
    chunkStartIndex: chunkStartIndex,
    definitionEndIndex:  readBitIndex,
    contentByteLength: chunkContentByteLength,
    childContentByteLength: childContentByteLength,
    totalContentLength: readBitIndex + chunkContentByteLength + childContentByteLength
  };

  if(chunkContentByteLength > 0){
    Object.assign(chunk, getChunkData(Buffer, chunk));
  }

  accum[id] = chunk;

  if(chunk.totalContentLength < chunkEndIndex){
    return readChunkIndexRange(Buffer,
                               chunk.totalContentLength,
                               chunkEndIndex,
                               accum);
  }

  if(childContentByteLength > 0) {
    return readChunkIndexRange(Buffer,
                               chunk.definitionEndIndex+chunk.contentByteLength,
                               chunk.definitionEndIndex+chunk.childContentByteLength,
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


