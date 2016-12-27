var fs = require('fs');
var parseMagicaVoxel = require('../src/index.js');

fs.readFile("./chr_sword.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(parseMagicaVoxel(Buffer), null, 2));
});
