var fs = require('fs');
var MagicaVoxelParser = require('./index.js');

fs.readFile("deer.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(MagicaVoxelParser(Buffer)));
});
