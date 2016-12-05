var fs = require('fs');
var MagicaVoxelParser = require('./index.js');

fs.readFile("chr_fatkid.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(MagicaVoxelParser(Buffer), null, 2));
});
