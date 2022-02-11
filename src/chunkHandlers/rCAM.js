var readDict = require('../readDict');

module.exports = function rCAMHandler(state, startIndex, endIndex){
  var ret = {};

  // camera id
  ret.id = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  // DICT node attributes
  ret.attribute = readDict(state);
  return ret;
}
