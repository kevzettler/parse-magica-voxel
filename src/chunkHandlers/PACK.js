module.exports = function PACKHandler(state){
  const PACK_count = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;
  return PACK_count;
};
