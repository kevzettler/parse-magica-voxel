var readDict = require('../readDict');
var assert = require('assert');

module.exports = function nGRPHandler(state, startIndex, endIndex){
  var ret = {};

  // node id
  ret.id = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  // DICT node attributes
  ret.attributes = readDict(state);

  ret.num_of_children = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  ret.child_ids = [];
  for(var i=0; i<ret.num_of_children; i++){
    ret.child_ids.push(state.Buffer.readInt32LE(state.readByteIndex));
    state.readByteIndex += 4;
  }


  assert(state.readByteIndex === endIndex, `nGRP chunk length mismatch: ${state.readByteIndex} ${endIndex}`);
  return ret;
}
