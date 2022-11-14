const path = require("path")

// base directory
console.log(path.basename(__dirname));
// base file name
console.log(path.basename(__filename));
// file extension 
console.log(path.extname(__filename));
// concatenatin
console.log(path.join(path.basename(__dirname), "test", "hello.js"));