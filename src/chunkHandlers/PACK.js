module.exports = function PACKHandler(state){
  return state.Buffer.readInt32LE(state.readByteIndex);
};
