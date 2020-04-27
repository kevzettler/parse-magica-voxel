var readDict = require('../readDict');

module.exports = function MATL(state, startIndex, endIndex){
  var ret = {};

  // node id
  ret.id = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.properties = readDict(state);

  return ret;
};
