module.exports = function SIZEHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var sizex = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  var sizey = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  
  var sizez = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  return {
    x: sizex,
    y: sizey,
    z: sizez
  };
};
