const getChunkData = require('./getChunkData');
const readId = require('./readId.js');
const debug = require('debug')('parse-magica-voxel')
const assert = require('assert');
const intByteLength = 4;

module.exports = function recReadChunksInRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
  const state = {
    Buffer,
    readByteIndex: bufferStartIndex,
  };

  var id = readId(state, bufferStartIndex);

  var chunkContentByteLength = Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += intByteLength;

  var childContentByteLength = Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += intByteLength;

  var bufferStartIndex = bufferStartIndex;
  var definitionEndIndex =  state.readByteIndex;
  var contentByteLength = chunkContentByteLength;
  var childContentByteLength = childContentByteLength;
  var totalChunkEndIndex = state.readByteIndex + chunkContentByteLength + childContentByteLength;

  if(contentByteLength == 0 && childContentByteLength == 0){
    debug("no content or children for", id);
    return accum;
  }

  if(contentByteLength && id){
    var chunkContent = getChunkData(state, id, definitionEndIndex, totalChunkEndIndex);
    assert(state.readByteIndex === totalChunkEndIndex, `${id} length mismatch ${state.readByteIndex}:${totalChunkEndIndex}`)
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
  if(totalChunkEndIndex != bufferEndIndex){
    return recReadChunksInRange(Buffer,
                                totalChunkEndIndex,
                                bufferEndIndex,
                                accum);
  }

  return accum;
};
