const SIZEHandler = require('./chunkHandlers/SIZE');
const RGBAHandler = require('./chunkHandlers/RGBA');
const XYZIHandler = require('./chunkHandlers/XYZI');
const PACKHandler = require('./chunkHandlers/PACK');
const MATTHandler = require('./chunkHandlers/MATT');
const chunkHandlers = {
  SIZE: SIZEHandler,
  XYZI: XYZIHandler,
  RGBA: RGBAHandler,
  PACK: PACKHandler,
  MATT: MATTHandler
};

module.exports = function getChunkData(Buffer, id, definitionEndIndex, totalEndIndex){
  if(!chunkHandlers[id]){
    throw "Unsupported chunk type " + id;
  }
  return chunkHandlers[id](Buffer, definitionEndIndex, totalEndIndex);
};
