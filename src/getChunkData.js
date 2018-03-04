const SIZEHandler = require('./chunkHandlers/SIZE');
const RGBAHandler = require('./chunkHandlers/RGBA');
const XYZIHandler = require('./chunkHandlers/XYZI');
const PACKHandler = require('./chunkHandlers/PACK');
const MATTHandler = require('./chunkHandlers/MATT');
const getHandler = require('./chunkHandlers/unknown');

const chunkHandlers = {
  SIZE: SIZEHandler,
  XYZI: XYZIHandler,
  RGBA: RGBAHandler,
  PACK: PACKHandler,
  MATT: MATTHandler,
  nTRN: getHandler(40),
  nGRP: getHandler(28),
  nSHP: getHandler(32),
  LAYR: getHandler(38),
  MATL: getHandler(104),
  rLIT: getHandler(70),
  rAIR: getHandler(98),
  rLEN: getHandler(98),
  POST: getHandler(89),
  rDIS: getHandler(89),
};

module.exports = function getChunkData(Buffer, id, definitionEndIndex, totalEndIndex){
  if(!chunkHandlers[id]){
    throw "Unsupported chunk type " + id;
  }
  return chunkHandlers[id](Buffer, definitionEndIndex, totalEndIndex);
};
