module.exports = function readDict(Buffer, readByteIndex){
  const ret = {};

  const attributePairLength = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // Read all the key value pairs of the DICT
  for(var i=0; i<attributePairLength; i++){
    const keyByteLength = Buffer.readInt32LE(readByteIndex);
    readByteIndex += 4;

    const key = Buffer.readInt8(keyByteLength);
    readByteIndex += 1 * keyByteLength;

    const valueByteLength = Buffer.readInt32LE(readByteIndex);
    readByteIndex += 4;

    const value = Buffer.readInt8(valueByteLength);
    readByteIndex += 1 * valueByteLength;

    ret[key] = value;
  }

  return ret;
}
