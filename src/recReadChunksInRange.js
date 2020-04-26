const getChunkData = require('./getChunkData');
const readId = require('./readId.js');
const intByteLength = 4;  
const debug = require('debug')('parse-magica-voxel')

module.exports = function recReadChunksInRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
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

  if(contentByteLength == 0 && childContentByteLength == 0){
    console.log("no content or children");
    debug("no content or children for", id);
    return accum;
  }

  if(contentByteLength && id){
    var chunkContent = getChunkData(Buffer, id, definitionEndIndex, totalEndIndex);
    if(!accum[id]){
      accum[id] = chunkContent;      
    }else if(accum[id] && !accum[id].length){
      accum[id] = [accum[id], chunkContent];
    }else if(accum[id] && accum[id].length){
      accum[id].push(chunkContent);
    }
  }

  //read children
  if(childContentByteLength > 0){
    return recReadChunksInRange(Buffer,
                                definitionEndIndex+contentByteLength,
                                bufferEndIndex,
                                {});
  }

  //accumulate siblings
  if(totalEndIndex != bufferEndIndex){
    return recReadChunksInRange(Buffer,
                                totalEndIndex,
                                bufferEndIndex,
                                accum);
  }

  return accum;
};
