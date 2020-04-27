module.exports = function readId(state){
  var id = String.fromCharCode(parseInt(state.Buffer[state.readByteIndex++]))+
           String.fromCharCode(parseInt(state.Buffer[state.readByteIndex++]))+
           String.fromCharCode(parseInt(state.Buffer[state.readByteIndex++]))+
           String.fromCharCode(parseInt(state.Buffer[state.readByteIndex++]));

  return id;
};
