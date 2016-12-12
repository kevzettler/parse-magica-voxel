const Buffer = require('buffer').Buffer;
const isBuffer = require('is-buffer');
const intByteLength = 4;
const defaultPalette = [
  0x000000, 0xffffff, 0xccffff, 0x99ffff, 0x66ffff, 0x33ffff, 0x00ffff, 0xffccff, 0xccccff, 0x99ccff, 0x66ccff, 0x33ccff, 0x00ccff, 0xff99ff, 0xcc99ff, 0x9999ff,
  0x6699ff, 0x3399ff, 0x0099ff, 0xff66ff, 0xcc66ff, 0x9966ff, 0x6666ff, 0x3366ff, 0x0066ff, 0xff33ff, 0xcc33ff, 0x9933ff, 0x6633ff, 0x3333ff, 0x0033ff, 0xff00ff,
  0xcc00ff, 0x9900ff, 0x6600ff, 0x3300ff, 0x0000ff, 0xffffcc, 0xccffcc, 0x99ffcc, 0x66ffcc, 0x33ffcc, 0x00ffcc, 0xffcccc, 0xcccccc, 0x99cccc, 0x66cccc, 0x33cccc,
  0x00cccc, 0xff99cc, 0xcc99cc, 0x9999cc, 0x6699cc, 0x3399cc, 0x0099cc, 0xff66cc, 0xcc66cc, 0x9966cc, 0x6666cc, 0x3366cc, 0x0066cc, 0xff33cc, 0xcc33cc, 0x9933cc,
  0x6633cc, 0x3333cc, 0x0033cc, 0xff00cc, 0xcc00cc, 0x9900cc, 0x6600cc, 0x3300cc, 0x0000cc, 0xffff99, 0xccff99, 0x99ff99, 0x66ff99, 0x33ff99, 0x00ff99, 0xffcc99,
  0xcccc99, 0x99cc99, 0x66cc99, 0x33cc99, 0x00cc99, 0xff9999, 0xcc9999, 0x999999, 0x669999, 0x339999, 0x009999, 0xff6699, 0xcc6699, 0x996699, 0x666699, 0x336699,
  0x006699, 0xff3399, 0xcc3399, 0x993399, 0x663399, 0x333399, 0x003399, 0xff0099, 0xcc0099, 0x990099, 0x660099, 0x330099, 0x000099, 0xffff66, 0xccff66, 0x99ff66,
  0x66ff66, 0x33ff66, 0x00ff66, 0xffcc66, 0xcccc66, 0x99cc66, 0x66cc66, 0x33cc66, 0x00cc66, 0xff9966, 0xcc9966, 0x999966, 0x669966, 0x339966, 0x009966, 0xff6666,
  0xcc6666, 0x996666, 0x666666, 0x336666, 0x006666, 0xff3366, 0xcc3366, 0x993366, 0x663366, 0x333366, 0x003366, 0xff0066, 0xcc0066, 0x990066, 0x660066, 0x330066,
  0x000066, 0xffff33, 0xccff33, 0x99ff33, 0x66ff33, 0x33ff33, 0x00ff33, 0xffcc33, 0xcccc33, 0x99cc33, 0x66cc33, 0x33cc33, 0x00cc33, 0xff9933, 0xcc9933, 0x999933,
  0x669933, 0x339933, 0x009933, 0xff6633, 0xcc6633, 0x996633, 0x666633, 0x336633, 0x006633, 0xff3333, 0xcc3333, 0x993333, 0x663333, 0x333333, 0x003333, 0xff0033,
  0xcc0033, 0x990033, 0x660033, 0x330033, 0x000033, 0xffff00, 0xccff00, 0x99ff00, 0x66ff00, 0x33ff00, 0x00ff00, 0xffcc00, 0xcccc00, 0x99cc00, 0x66cc00, 0x33cc00,
  0x00cc00, 0xff9900, 0xcc9900, 0x999900, 0x669900, 0x339900, 0x009900, 0xff6600, 0xcc6600, 0x996600, 0x666600, 0x336600, 0x006600, 0xff3300, 0xcc3300, 0x993300,
  0x663300, 0x333300, 0x003300, 0xff0000, 0xcc0000, 0x990000, 0x660000, 0x330000, 0x0000ee, 0x0000dd, 0x0000bb, 0x0000aa, 0x000088, 0x000077, 0x000055, 0x000044,
  0x000022, 0x000011, 0x00ee00, 0x00dd00, 0x00bb00, 0x00aa00, 0x008800, 0x007700, 0x005500, 0x004400, 0x002200, 0x001100, 0xee0000, 0xdd0000, 0xbb0000, 0xaa0000,
  0x880000, 0x770000, 0x550000, 0x440000, 0x220000, 0x110000, 0xeeeeee, 0xdddddd, 0xbbbbbb, 0xaaaaaa, 0x888888, 0x777777, 0x555555, 0x444444, 0x222222, 0x111111
];

function useDefaultPalette(){
  var colors = defaultPalette.map(function(hex){
    return {
      b: (hex & 0xff0000) >> 16, 
      g: (hex & 0x00ff00) >> 8, 
      r: (hex & 0x0000ff),      
      a: 1
    }
  });

  return colors;
}

function RGBAHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  
  var colors = new Array();
  for (var n = 0; n < 256; n++) {
    colors[n] = {
      r: Buffer[readByteIndex++] & 0xFF,
      g: Buffer[readByteIndex++] & 0xFF,
      b: Buffer[readByteIndex++] & 0xFF,
      a: Buffer[readByteIndex++] & 0xFF,
    }
  }
  return colors;
}

function SIZEHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var sizex = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  var sizey = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  
  var sizez = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;
  return {
    x: sizex,
    y: sizey,
    z: sizez
  };
}

function XYZIHandler(Buffer, contentStartByteIndex){
  var readByteIndex = contentStartByteIndex;
  var numVoxels = Math.abs(Buffer.readInt32LE(readByteIndex));
  readByteIndex += 4;

  voxelData = []
  for (var n = 0; n < numVoxels; n++) {
    voxelData[n] = {
      x: Buffer[readByteIndex++] & 0xFF,
      y: Buffer[readByteIndex++] & 0xFF,
      z: Buffer[readByteIndex++] & 0xFF,
      c: Buffer[readByteIndex++] & 0xFF, //color index in RGBA
    };
  }

  return voxelData;
}

function PACKHandler(Buffer, contentStartByteIndex){
  return Buffer.readInt32LE(contentStartByteIndex);
}

function MATTHandler(Buffer, contentStartByteIndex, totalEndIndex){
  var readByteIndex = contentStartByteIndex;
  var ret = {};

  ret.id = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.materialType = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.materialWeight = Buffer.readFloatLE(readByteIndex);
  readByteIndex += 4;

  ret.propertyBits = Buffer.readInt32LE(readByteIndex);
  readByteIndex += 4;

  ret.normalizedPropertyValues = [];
  while(readByteIndex < totalEndIndex){
    ret.normalizedPropertyValues.push(Buffer.readFloatLE(readByteIndex));
    readByteIndex += 4;
  }

  return ret;
}

const chunkHandlers = {
  SIZE: SIZEHandler,
  XYZI: XYZIHandler,
  RGBA: RGBAHandler,
  PACK: PACKHandler,
  MATT: MATTHandler
};

function getChunkData(Buffer, id, definitionEndIndex, totalEndIndex){
  if(!chunkHandlers[id]){
    throw "Unsupported chunk type " + id;
  }
  return chunkHandlers[id](Buffer, definitionEndIndex, totalEndIndex);
}

function readId(Buffer, idStartIndexPos){
  var id = String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]));

  return id;
}

function recReadChunksInRange(Buffer, bufferStartIndex, bufferEndIndex, accum){
  var readByteIndex = bufferStartIndex;
  var id = readId(Buffer, bufferStartIndex);

  var chunkContentByteLength = Buffer.readInt32LE(readByteIndex+=intByteLength);
  readByteIndex += intByteLength;

  var childContentByteLength = Buffer.readInt32LE(readByteIndex);
  readByteIndex += intByteLength;

  var bufferStartIndex = bufferStartIndex;
  var definitionEndIndex =  readByteIndex;
  var contentByteLength = chunkContentByteLength;
  var childContentByteLength = childContentByteLength;
  var totalEndIndex = readByteIndex + chunkContentByteLength + childContentByteLength;

  if(contentByteLength == 0 && childContentByteLength == 0){
    console.log("no content or children");
    return accum;
  }

  if(contentByteLength && id){
    var chunkContent = getChunkData(Buffer, id, definitionEndIndex, totalEndIndex);
    if(!accum[id]){
      accum[id] = chunkContent;      
    }else if(accum[id] && !accum[id].length){
      accum[id] = [accum[id], chunkContent];
    }else if(accum[id] && accum[id].length){
      accum[id].push(chunkContent);
    }
  }

  //read children
  if(childContentByteLength > 0){
    return recReadChunksInRange(Buffer,
                               definitionEndIndex+contentByteLength,
                               bufferEndIndex,
                               {});
  }

  //accumulate siblings
  if(totalEndIndex != bufferEndIndex){
    return recReadChunksInRange(Buffer,
                               totalEndIndex,
                               bufferEndIndex,
                               accum);
  }

  return accum;
}

function parseHeader(Buffer){
  var ret = {};
  ret[readId(Buffer, 0)] = Buffer.readInt32LE(intByteLength);
  return ret;
}

function MagicaVoxelParser(BufferLikeData){
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

  return Object.assign(header, body);  
}

module.exports = MagicaVoxelParser;
