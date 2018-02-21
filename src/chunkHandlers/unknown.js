module.exports = function getHandler(length) {
    const internalLength = length;
    return function unknownHandler(Buffer, contentStartByteIndex) {
        var readByteIndex = contentStartByteIndex;  
        var result = new Array();
        for (var n = 1; n < internalLength; n++) {
            result[n] = Buffer[readByteIndex++];
        }
        return result;
    };
};
  