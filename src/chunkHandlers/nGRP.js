var readDict = require('../readDict');

module.exports = function nGRPHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // node id
  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // DICT node attributes
  ret.attributes = readDict(Buffer, readByteIndex);

  ret.num_of_children = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.child_ids = [];
  for(var i=0; i<ret.num_of_children; i++){
    ret.child_ids.push(Buffer.readInt32LE(readByteIndex));
    readByteIndex += 4;
  }

  return ret;
}
