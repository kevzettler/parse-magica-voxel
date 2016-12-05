const intByteLength = 4;

function SIZEHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var sizex = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  var sizey = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  
  var sizez = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  return {
    x: sizex,
    y: sizey,
    z: sizez
  };
}

function XYZIHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var numVoxels = Math.abs(Buffer.readInt32LE(readByteIndex));
  readByteIndex += 4;

  voxelData = []
  for (var n = 0; n < numVoxels; n++) {
    voxelData[n] = {
      x: Buffer[readByteIndex++] & 0xFF,
      y: Buffer[readByteIndex++] & 0xFF,
      z: Buffer[readByteIndex++] & 0xFF,
      color: Buffer[readByteIndex++] & 0xFF,
    };
  }

  return {voxelData: voxelData};
}

function RGBAHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  
  var colors = new Array();
  for (var n = 0; n < 256; n++) {
    colors[n] = {
      r: Buffer[readByteIndex++] & 0xFF,
      g: Buffer[readByteIndex++] & 0xFF,
      b: Buffer[readByteIndex++] & 0xFF,
      a: Buffer[readByteIndex++] & 0xFF,
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

function readId(Buffer, idStartIndexPos){
  var id = String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]));

  return id;
}

function recReadChunksInRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
  var readByteIndex = bufferStartIndex;
  var id = readId(Buffer, bufferStartIndex);

  var chunkContentByteLength = Buffer.readInt32LE(readByteIndex+=intByteLength);
  readByteIndex += intByteLength;

  var childContentByteLength = Buffer.readInt32LE(readByteIndex);
  readByteIndex += intByteLength;

  var bufferStartIndex = bufferStartIndex;
  var definitionEndIndex =  readByteIndex;
  var contentByteLength = chunkContentByteLength;
  var childContentByteLength = childContentByteLength;
  var totalEndIndex = readByteIndex + chunkContentByteLength + childContentByteLength;

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

function parseHeader(Buffer){
  var ret = {};
  ret[readId(Buffer, 0)] = Buffer.readInt32LE(intByteLength);
  return ret;
}

function MagicaVoxelParser(Buffer){
  var header = parseHeader(Buffer);
  return Object.assign(header, recReadChunksInRange(
    Buffer,
    8, //start on the 8th byte as the header dosen't follow RIFF pattern.
    Buffer.length,
    header
  ));
}

module.exports = MagicaVoxelParser;
