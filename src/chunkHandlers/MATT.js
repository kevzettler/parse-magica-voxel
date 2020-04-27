module.exports = function MATTHandler(state, startIndex, endIndex){
  var ret = {};

  ret.id = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.materialType = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.materialWeight = state.Buffer.readFloatLE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.propertyBits = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.normalizedPropertyValues = [];
  while(state.readByteIndex < totalEndIndex){
    ret.normalizedPropertyValues.push(state.Buffer.readFloatLE(state.readByteIndex));
    state.readByteIndex += 4;
  }

  return ret;
};
