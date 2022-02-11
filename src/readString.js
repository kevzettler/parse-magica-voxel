module.exports = function readString(state){
  const ret = "";
  const stringLength = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  for(var i=0; i<stringLength; i++){
    ret += String.fromCharCode(parseInt(state.Buffer[state.readByteIndex++]))
  }

  return ret;
}
