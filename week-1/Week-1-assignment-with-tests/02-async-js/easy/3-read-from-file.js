const fs = require("fs");

fs.readFile("02-async-js\\easy\\3-read-from-file.md", "UTF-8", (err, fileContentsString) => {
    console.log(fileContentsString);
})

for (let i=0; i<10000; ++i) {
    console.log("main tread");
}