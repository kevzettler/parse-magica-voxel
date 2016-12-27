module.exports = function readId(Buffer, idStartIndexPos){
  var id = String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]))+
           String.fromCharCode(parseInt(Buffer[idStartIndexPos++]));

  return id;
};
