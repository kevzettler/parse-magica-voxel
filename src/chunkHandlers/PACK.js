module.exports = function PACKHandler(Buffer, contentStartByteIndex){
  return Buffer.readInt32LE(contentStartByteIndex);
};
