const fs = require('fs');

content = "\nAssignment Done! This is the appended text!"

fs.appendFile('02-async-js\\easy\\4-write-to-file.md', content)
