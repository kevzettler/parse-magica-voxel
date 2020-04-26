var readDict = require('../readDict');

module.exports = function rOBJHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // DICT node attributes
  ret = readDict(Buffer, readByteIndex);
  return ret;
}
