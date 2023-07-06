/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const folderWthFiles = path.join('.', 'files');

// 1. GET /files - Returns a list of files present in `./files/` directory
//     Response: 200 OK with an array of file names in JSON format.
//     Example: GET http://localhost:3000/files
app.get('/files', (req, res) => {
  fs.readdir(folderWthFiles, (err, files) => {
    if (err === null) {
      const responseBody = files;
      res.status(200).send(files);
    } else {
      console.log(err.stack);
      res.status(500).send(err.message);
    }
  });
});

// 2. GET /file/:filename - Returns content of given file by name
// Description: Use the filename from the request path parameter to read the file from `./files/` directory
// Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
// Example: GET http://localhost:3000/file/example.txt
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(folderWthFiles, filename);
  if (fs.existsSync(filepath)) {
    fs.readFile(filepath, 'UTF-8', (err, fileData) => {
      if (err === null) {
        res.status(200).send(fileData);
      } else {
        console.log(err.stack);
        res.status(500).send(err.message);
      }
    })
  } else {
    const responseBody = 'File not found';
    res.status(404).send(responseBody);
  }
});

// For any other route not defined in the server return 404
app.use((req, res) => {
  res.status(404).send('Route not found');
})

module.exports = app;
