module.exports = function RGBAHandler(state, startIndex, endIndex){
  var colors = new Array();
  for (var n = 0; n < 256; n++) {
    colors[n] = {
      r: state.Buffer[state.readByteIndex++],
      g: state.Buffer[state.readByteIndex++],
      b: state.Buffer[state.readByteIndex++],
      a: state.Buffer[state.readByteIndex++],
    }
  }
  return colors;
};
