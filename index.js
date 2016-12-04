var fs = require('fs');

parseId = function(Buffer, offset){
  var pos = offset;
  var range_end = pos + 4;
  var ret = [];
  while(pos < range_end){
    ret.push(String.fromCharCode(Buffer.readUInt8(pos)));
    pos++;
  }
  return ret.join('');
}

parseHeader = function(Buffer){
  return parseId(Buffer, 0);
};

var intByteSize = 4;

recParseChunk = function(Buffer, accum, byteReadPosition){
  if(byteReadPosition > Buffer.length){ return }

  var chunkId = String.fromCharCode(parseInt(Buffer[byteReadPosition++]))+
                String.fromCharCode(parseInt(Buffer[byteReadPosition++]))+
                String.fromCharCode(parseInt(Buffer[byteReadPosition++]))+
                String.fromCharCode(parseInt(Buffer[byteReadPosition++]));

  if(chunkId == "SIZE"){
    sizex = Buffer.readInt32LE(byteReadPosition);
    byteReadPosition+=4;
    sizey = Buffer.readInt32LE(byteReadPosition);
    byteReadPosition+=4;
    sizez = Buffer.readInt32LE(byteReadPosition);
    byteReadPosition+=4;
    if (sizex > 32 || sizey > 32) {
      subSample = true;
    }

    byteReadPosition += chunkSize - 4 * 3;
  }

  var chunkSize = Buffer.readInt32LE(byteReadPosition);
  byteReadPosition+=4;
  var childChunks = Buffer.readInt32LE(byteReadPosition);
  byteReadPosition+=4;

  accum[chunkId] = {
    chunkSize: chunkSize,
    childChunks: childChunks
  };

  return accum;
//  return recParseChunk(Buffer, accum, pos);
}

function MagicaVoxelParser(Buffer){
  ret = {};
  var header = parseHeader(Buffer);

  ret[header] = {
    version: Buffer.readIntLE(4, 4)
  };

  return recParseChunk(Buffer, ret, 8);
}

fs.readFile("chr_fatkid.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(MagicaVoxelParser(Buffer), null, 2));
});


