/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const authData = [];

function checkCredentialsExist(credentials) {
  const { email, password } = credentials;
  indexOfCredentialsInExistingCredentials = authData.findIndex(item => { return (item.email==email) && (item.password==password) });
  if (indexOfCredentialsInExistingCredentials !== -1) {
    return true;
  } else {
    return false;
  }
}

// POST /signup - User Signup
// Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
// Request Body: JSON object with email, password, firstName and lastName fields.
// Response: 201 Created if successful, or 400 Bad Request if the email already exists.
// Example: POST http://localhost:3000/signup
app.post('/signup', (req, res) => {
  const incomingUsername = req.body.email;
  const indexOfUsernameMatchWthExistingCredentials = authData.findIndex(item => item.email === incomingUsername);
  if (indexOfUsernameMatchWthExistingCredentials === -1) {
    authData.push(req.body);
    res.status(201).send('Signup successful');
  }
})

// 2. POST /login - User Login
// Description: Gets user back their details like firstname, lastname and id
// Request Body: JSON object with email and password fields.
// Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
// Example: POST http://localhost:3000/login
app.post('/login', (req, res) => {
  try {
    const incomingCredentials = req.body;
    const indexOfCredentialsMatching = authData.findIndex(item => checkCredentialsExist(item) );
    if (indexOfCredentialsMatching !== -1) {
      const matchingCredential = authData[indexOfCredentialsMatching];
      const responseBody = {
        ...matchingCredential,
        id: indexOfCredentialsMatching,
      }
      res.status(200).send(responseBody);
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(500).send();
  }
})

// 3. GET /data - Fetch all user's names and ids from the server (Protected route)
// Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
// The users email and password should be fetched from the headers and checked before the array is returned
// Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
// Example: GET http://localhost:3000/data
app.get('/data', (req, res) => {
  try {
    const isAuthorized = checkCredentialsExist(req.headers);
    if (isAuthorized) {
      responseBody = {
        users: authData.map((val, idx) => {
          const { firstname, lastname } = val;
          return {
            firstname,
            lastname,
            id: idx
          }
        })
      };
      res.status(200).send(responseBody);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch {
    res.status(500);
  }  
})

// For any other route not defined in the server return 404
app.use((req, res) => {
  res.status(404);
})

module.exports = app;
