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

function RGBAHandler(Buffer, chunk){
  var readBitIndex = chunk.definitionEndIndex;
  
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

function getChunkData(Buffer, chunk){
  return chunkHandlers[chunk.id] ? chunkHandlers[chunk.id](Buffer, chunk) : null;
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
  var header = {'VOX ': 150};
  return Object.assign(header, readChunkIndexRange(Buffer, 8, Buffer.length, header));
}


fs.readFile("chr_fatkid.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(MagicaVoxelParser(Buffer), null, 2));
});
