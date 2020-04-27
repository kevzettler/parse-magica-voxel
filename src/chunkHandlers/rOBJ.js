var readDict = require('../readDict');

module.exports = function rOBJHandler(state, startIndex, endIndex){
  var ret = {};

  // DICT node attributes
  ret = readDict(state);
  return ret;
}
