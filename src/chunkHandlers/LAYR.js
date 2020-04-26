module.exports = function LAYRHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // node id
  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // DICT node attributes
  ret.attributes = {};

  const nameByteLength = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  const name = Buffer.readInt8(nameByteLength);
  readByteIndex += 1 * nameByteLength;

  ret.attributes._name = name;

  ret.attributes._hidden = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.reserved_id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  return ret;
}
