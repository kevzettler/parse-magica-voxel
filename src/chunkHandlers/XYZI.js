var assert = require('assert');

module.exports = function XYZIHandler(state, startIndex, endIndex){
  var numVoxels = Math.abs(state.Buffer.readInt32LE(state.readByteIndex));
  state.readByteIndex += 4;

  var voxelData = []
  for (var n = 0; n < numVoxels; n++) {
    voxelData[n] = {
      x: state.Buffer[state.readByteIndex++] & 0xFF,
      y: state.Buffer[state.readByteIndex++] & 0xFF,
      z: state.Buffer[state.readByteIndex++] & 0xFF,
      c: state.Buffer[state.readByteIndex++] & 0xFF, //color index in RGBA
    };
  }

  assert(state.readByteIndex === endIndex, "XYZI chunk did not fully read");
  return voxelData;
};
