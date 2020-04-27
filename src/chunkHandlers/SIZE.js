var assert = require('assert');

module.exports = function SIZEHandler(state, startIndex, endIndex){
  var sizex = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  var sizey = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  var sizez = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  assert(state.readByteIndex === endIndex, "Chunk handler didn't reach end");

  return {
    x: sizex,
    y: sizey,
    z: sizez
  };
};
