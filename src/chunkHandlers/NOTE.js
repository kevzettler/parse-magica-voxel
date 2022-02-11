var readString = require('../readString');

module.exports = function NOTEHandler(state, startIndex, endIndex){
  var ret = {color_names: []};

  // num of color names
  num_of_color_names = state.Buffer.readInt32LE(state.readByteIndex);
  state.readByteIndex += 4;

  for(var i=0; i<num_of_color_names; i++){
    ret.color_names.push(readString(state));
  }

  return ret;
};
