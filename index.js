const intByteLength = 4;

function SIZEHandler(Buffer, contentStartBitIndex){
  var readBitIndex = contentStartBitIndex;
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

function XYZIHandler(Buffer, contentStartBitIndex){
  var readBitIndex = contentStartBitIndex;
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

function RGBAHandler(Buffer, contentStartBitIndex){
  var readBitIndex = contentStartBitIndex;
  
  var colors = new Array();
  for (var n = 0; n < 256; n++) {
    colors[n] = {
      r: Buffer[readBitIndex++] & 0xFF,
      g: Buffer[readBitIndex++] & 0xFF,
      b: Buffer[readBitIndex++] & 0xFF,
      a: Buffer[readBitIndex++] & 0xFF,
    }
  }
  return {colors: colors};
}

const chunkHandlers = {
  SIZE: SIZEHandler,
  XYZI: XYZIHandler,
  RGBA: RGBAHandler
};

function getChunkData(Buffer, id, definitionEndIndex){
  if(!chunkHandlers[id]){
    throw "Unsupported chunk type " + id;
  }
  return chunkHandlers[id](Buffer, definitionEndIndex);
}

function recReadChunksInRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
  var readBitIndex = bufferStartIndex;
  var id = String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]))+
           String.fromCharCode(parseInt(Buffer[readBitIndex++]));

  var chunkContentByteLength = Buffer.readInt32LE(readBitIndex);
  readBitIndex += intByteLength;

  var childContentByteLength = Buffer.readInt32LE(readBitIndex);
  readBitIndex += intByteLength;

  var bufferStartIndex = bufferStartIndex;
  var definitionEndIndex =  readBitIndex;
  var contentByteLength = chunkContentByteLength;
  var childContentByteLength = childContentByteLength;
  var totalEndIndex = readBitIndex + chunkContentByteLength + childContentByteLength;

  var chunk = {};

  accum[id] = chunk;
  
  if(contentByteLength == 0 && childContentByteLength == 0){
    console.log("no content or children");
    return accum;
  }

  if(contentByteLength && id){
    Object.assign(chunk, getChunkData(Buffer, id, definitionEndIndex));
  }

  //read children
  if(childContentByteLength > 0){
    return recReadChunksInRange(Buffer,
                               definitionEndIndex+contentByteLength,
                               bufferEndIndex,
                               chunk);
  }

  //accumulate siblings
  if(totalEndIndex != bufferEndIndex){
    return recReadChunksInRange(Buffer,
                               totalEndIndex,
                               bufferEndIndex,
                               accum);
  }

  return accum;
}

function MagicaVoxelParser(Buffer){
  var header = {'VOX ': 150};
  return Object.assign(header, recReadChunksInRange(Buffer, 8, Buffer.length, header));
}

module.exports = MagicaVoxelParser;
