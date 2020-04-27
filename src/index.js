const Buffer = require('buffer').Buffer;
const isBuffer = require('is-buffer');
const parseHeader = require('./parseHeader');
const useDefaultPalette = require('./useDefaultPalette');
const recReadChunksInRange = require('./recReadChunksInRange');
const debug = require('debug');
const intByteLength = 4;


module.exports = function parseMagicaVoxel(BufferLikeData){
  var buffer = BufferLikeData;
  if(!isBuffer(buffer)){
    try {
      buffer = new Buffer( new Uint8Array(BufferLikeData) );
    }catch (ex){
      throw ex
    }
  }

  var header = parseHeader(buffer);
  var body = recReadChunksInRange(
    buffer,
    8, //start on the 8th byte as the header dosen't follow RIFF pattern.
    buffer.length,
    header
  );

  if(!body.RGBA){
    body.RGBA = useDefaultPalette();
  }


  const result = Object.assign(header, body);
  //  console.log(JSON.stringify(result.nTRN, null, 2));
  console.log(result);

  return result;
};
