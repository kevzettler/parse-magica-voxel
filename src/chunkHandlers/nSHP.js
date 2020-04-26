var readDict = require('../readDict');

module.exports = function nSHPHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  // node id
  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  // DICT node attributes
  ret.attributes = readDict(Buffer, readByteIndex);

  ret.num_of_models = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.models = [];
  for(var i=0; i<ret.num_of_models; i++){
    const model = {};
    model.id = Buffer.readInt32LE(readByteIndex);
    readByteIndex += 4;

    // supposed to be a DICT here but marked as reserved in docs
    // https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox-extension.txt#L103
    // might not be valid
    model.attributes = readDict(Buffer, readByteIndex);

    ret.models.push(models);
  }

  return ret;
}
