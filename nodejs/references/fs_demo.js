const path = require('path')
const fs = require("fs")

// make a dir
// fs.mkdir(path.join(__dirname, "test"), {}, err => {
//     if(err) throw err;
//     console.log("Folder created...")
// })

// write to a file
// fs.writeFile(
//     path.join(__dirname, "test", "hello.txt"),
//     "Hello world",
//     err => {
//         if (err) throw err;
//         console.log("File written to ...")

//         // append file
//         fs.appendFile(
//             path.join(__dirname, "test", "hello.txt"),
//             " I love node js!",
//             err => {
//                 if(err) throw err;
//                 console.log("file content appended!...")
//             }
//         )
//     }
// )

// read file
fs.readFile(path.join(__dirname, "test", "hello.txt"), 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data);
})
