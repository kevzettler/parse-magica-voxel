module.exports = function RGBAHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;

  var colors = new Array();
  for (var n = 1; n < 256; n++) {
    colors[n] = {
      r: Buffer[readByteIndex++],
      g: Buffer[readByteIndex++],
      b: Buffer[readByteIndex++],
      a: Buffer[readByteIndex++],
    }
  }
  return colors;
};
