# Parse MagicaVoxel .vox file format

## Usage
see [examples](/examples)

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
  "XYZI": [...],
  "RGBA": [...],
}       
```

