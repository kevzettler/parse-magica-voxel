module.exports = function MATL(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // node id
  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.properties = {};
  const typeByteLength = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  const type = Buffer.readInt8(typeByteLength);
  ret.properties._type = type;
  readByteIndex += 1 * typeByteLength;

  ret.properties._weight = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._rough = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._spec = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._ior = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._att = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._flux = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.properties._plastic = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;
};
