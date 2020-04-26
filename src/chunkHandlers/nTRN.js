var readDict = require('../readDict');

module.exports = function nTRNHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // node id
  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // DICT node attributes
  ret.attributes = readDict(Buffer, readByteIndex);

  // child node id
  ret.child_id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // reserved id
  ret.reserved_id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // layer id
  ret.layer_id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // num of frames
  ret.num_of_frames = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.frame_transforms = [];
  for(var i=0; i<ret.num_of_frames; i++){
    const transform = {};

    transform.rotation = Buffer.readInt8(readByteIndex);
    readByteIndex += 1;

    transform.translation = []
    for(var i=0; i<3; i++){
      transform.translation.push(Buffer.readInt32LE(readByteIndex));
      readByteIndex += 4;
    }
  }

  return ret;
};
