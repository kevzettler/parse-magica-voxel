const readId = require('./readId.js');
const intByteLength = 4;

module.exports = function parseHeader(Buffer){
  const ret = {};
  const state = {
    Buffer,
    readByteIndex: 0
  }
  ret[readId(state)] = Buffer.readInt32LE(intByteLength);
  return ret;
};
