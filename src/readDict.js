module.exports = function readDict(state){
  const ret = {};

  const attributePairLength = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  // Read all the key value pairs of the DICT
  for(var i=0; i<attributePairLength; i++){
    const keyByteLength = state.Buffer.readInt32LE(state.readByteIndex);
    state.readByteIndex += 4;

    const key = state.Buffer.readInt8(keyByteLength);
    state.readByteIndex += 1 * keyByteLength;

    const valueByteLength = state.Buffer.readInt32LE(state.readByteIndex);
    state.readByteIndex += 4;

    const value = state.Buffer.readInt8(valueByteLength);
    state.readByteIndex += 1 * valueByteLength;

    ret[key] = value;
  }

  return ret;
}
