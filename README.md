# Parse MagicaVoxel .vox file format
Javascript parser for MagicaVoxel .vox file format:

https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox.txt

Works in Browser and Node.js server environments

## Usage
see [examples](/example)

```javascript
var fs = require('fs');
var parseMagicaVoxel = require('../index.js');

fs.readFile("./chr_old.vox", function (err, Buffer) {
  if (err) throw err;
  console.log(JSON.stringify(parseMagicaVoxel(Buffer)));
});
```

### Result
```
{
  "VOX ": 150,
  "PACK": 1,
  "SIZE": {
    "x": 20,
    "y": 21,
    "z": 20
  },
  "XYZI": [
   {x, y, z, c},
   //... more verts
  ],
  "RGBA": [
   {r,g,b,a},
   //... more rgba values
  ],
}       
```

