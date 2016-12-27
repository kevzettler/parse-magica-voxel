module.exports = function MATTHandler(Buffer, contentStartByteIndex, totalEndIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.materialType = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.materialWeight = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.propertyBits = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.normalizedPropertyValues = [];
  while(readByteIndex < totalEndIndex){
    ret.normalizedPropertyValues.push(Buffer.readFloatLE(readByteIndex));
    readByteIndex += 4;
  }

  return ret;
};
