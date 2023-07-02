const fs = require("fs");

filePath = '02-async-js\\medium\\1-file-cleaner.md';

fs.readFile(filePath, 'UTF-8', (err, extractedDataAsString) => {
    console.log('Data Successfully Extracted from File! Data:\n' + extractedDataAsString);
    var extractedDataAsStringWithoutExtraSpaces = removeExtraSpacesFromString(extractedDataAsString);
    fs.writeFile(filePath, extractedDataAsStringWithoutExtraSpaces, (err) => {
        console.log('File Successfully update!! Data:\n' + extractedDataAsStringWithoutExtraSpaces);
    } )
})

function removeExtraSpacesFromString(dataString) {
    replacePattern = /( ){2,}/g;
    replaceWith = ' ';
    var dataStringWithoutExtraSpaces = dataString.replace(replacePattern, replaceWith);
    return dataStringWithoutExtraSpaces;
}
