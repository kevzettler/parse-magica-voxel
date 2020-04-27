var readDict = require('../readDict');
var assert = require('assert');

module.exports = function nSHPHandler(state, startIndex, endIndex){
  var ret = {};

  // node id
  ret.id = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  // DICT node attributes
  ret.attributes = readDict(state);

  ret.num_of_models = state.Buffer.readInt32LE(state.readByteIndex);
  assert(ret.num_of_models >= 1, "nSHP num of models must be 1")
  state.readByteIndex += 4;

  ret.models = [];
  for(var i=0; i<ret.num_of_models; i++){
    const model = {};
    model.id = state.Buffer.readInt32LE(state.readByteIndex);
    state.readByteIndex += 4;

    // supposed to be a DICT here but marked as reserved in docs
    // https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox-extension.txt#L103
    // might not be valid
    model.attributes = readDict(state);

    ret.models.push(model);
  }

  assert(state.readByteIndex === endIndex, `nSHP chunk length mismatch: ${state.readByteIndex} ${endIndex}`);
  return ret;
}
