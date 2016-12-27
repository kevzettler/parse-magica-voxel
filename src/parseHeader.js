const readId = require('./readId.js');
const intByteLength = 4;

module.exports = function parseHeader(Buffer){
  var ret = {};
  ret[readId(Buffer, 0)] = Buffer.readInt32LE(intByteLength);
  return ret;
};
