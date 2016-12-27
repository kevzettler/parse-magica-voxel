module.exports = function XYZIHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var numVoxels = Math.abs(Buffer.readInt32LE(readByteIndex));
  readByteIndex += 4;

  voxelData = []
  for (var n = 0; n < numVoxels; n++) {
    voxelData[n] = {
      x: Buffer[readByteIndex++] & 0xFF,
      y: Buffer[readByteIndex++] & 0xFF,
      z: Buffer[readByteIndex++] & 0xFF,
      c: Buffer[readByteIndex++] & 0xFF, //color index in RGBA
    };
  }

  return voxelData;
};
