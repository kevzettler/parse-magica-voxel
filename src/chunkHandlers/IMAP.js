var readString = require('../readString');

module.exports = function IMAPHandler(state, startIndex, endIndex){
  var ret = {color_palette_index: []};

  for(var i=0; i<256; i++){
    ret.color_palette_index.push(state.Buffer.readInt32LE(state.readByteIndex));
    state.readByteIndex += 4;
  }

  return ret;
};
