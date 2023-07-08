const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let USERPURCHASEDCOURSES = {};

function checkAdminCredValidity(adminCred) {
  const matchingAdminId = ADMINS.findIndex(item => (item.username===adminCred.username) && (item.password===adminCred.password));
  if (matchingAdminId !== -1) {
    res = true;
  } else {
    res = false;
  }
  return res;
}

function checkUserCredValidity(userCred) {
  const matchingUserId = USERS.findIndex(item => (item.username===userCred.username) && (item.password===userCred.password));
  if (matchingUserId !== -1) {
    res = true;
  } else {
    res = false;
  }
  return res;
}

function getUserId(userCred) {
  const matchingUserId = USERS.findIndex(item => (item.username===userCred.username) && (item.password===userCred.password));
  return matchingUserId;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const incomingAdminDetails = req.body;
  const matchingAdminId = ADMINS.findIndex(item => item.username === incomingAdminDetails.username);
  if (matchingAdminId === -1) {
    ADMINS.push(incomingAdminDetails);
    res.json({message: 'Admin created successfully'});
  } else {
    ADMINS[ matchingAdminId ] = incomingAdminDetails;
    res.json({message: 'Admin updated successfully'});
  }
});

app.post('/admin/login', (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = checkAdminCredValidity(incomingAdminCredentials);
  if (isAdminCredValid) {
    res.json({ message: 'Logged in successfully' });
  } else {
    res.status(403).json({ message: 'Wrong Credentials!!' });
  }
});

app.post('/admin/courses', (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = checkAdminCredValidity(incomingAdminCredentials);

  if (isAdminCredValid) {

    const incomingCourse = req.body;
    COURSES.push(incomingCourse);
    const courseId = COURSES.length;

    const responseBody = {
      message: 'Course created successfully', 
      courseId: courseId
    }
    res.json(responseBody);

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  } 
});

app.put('/admin/courses/:courseId', (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = checkAdminCredValidity(incomingAdminCredentials);

  if (isAdminCredValid) {

    const courseId = req.params.courseId;
    const courseIndex = courseId - 1;

    const incomingUpdatedCourse = req.body;
    COURSES[ courseIndex ] = incomingUpdatedCourse;

    res.json({ message: 'Course updated successfully' });

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  } 
});

app.get('/admin/courses', (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = checkAdminCredValidity(incomingAdminCredentials);

  if (isAdminCredValid) {

    const responseBody = COURSES.map((item,index) => ({
      id: index + 1,
      ...item
    }))
    res.json(responseBody);

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  } 
});

// User routes
app.post('/users/signup', (req, res) => {
  const incomingUserDetails = req.body;
  const matchingUserId = USERS.findIndex(item => item.username === incomingUserDetails.username);
  if (matchingUserId === -1) {
    USERS.push(incomingUserDetails);
    res.json({message: 'User created successfully'});
  } else {
    USERS[ matchingUserId ] = incomingUserDetails;
    res.json({message: 'User updated successfully'});
  }
});

app.post('/users/login', (req, res) => {
  const incomingUserCredentials = req.headers;
  const isUserCredValid = checkUserCredValidity(incomingUserCredentials);
  if (isUserCredValid) {
    res.json({ message: 'Logged in successfully' });
  } else {
    res.status(403).json({ message: 'Wrong Credentials!!' });
  }
});

app.get('/users/courses', (req, res) => {
  const incomingUserCredentials = req.headers;
  const isUserCredValid = checkUserCredValidity(incomingUserCredentials);

  if (isUserCredValid) {

    const responseBody = COURSES.map((item,index) => ({
      id: index + 1,
      ...item
    }))
    res.json(responseBody);

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  } 
});

app.post('/users/courses/:courseId', (req, res) => {
  const incomingUserCredentials = req.headers;
  const userIndex = getUserId(incomingUserCredentials);

  if (userIndex !== -1) {

    const courseId = parseInt(req.params.courseId);
    const courseIndex = courseId - 1;

    if (userIndex in USERPURCHASEDCOURSES) {
      USERPURCHASEDCOURSES[ userIndex ].push(courseIndex);
    } else {
      USERPURCHASEDCOURSES[ userIndex ] = [ courseIndex ];
    }

    res.json({ message: 'Course purchased successfully' });

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  const incomingUserCredentials = req.headers;
  const userIndex = getUserId(incomingUserCredentials);

  if (userIndex !== -1) {

    const purchasedCoursesId = USERPURCHASEDCOURSES[ userIndex ];
    const purchasedCoursesDetails = purchasedCoursesId.map((item) => ({
      id: item + 1,
      ...COURSES[item]
    }));

    const responseBody = {
      purchasedCourses: purchasedCoursesDetails
    };
    res.json(responseBody);

  } else {
    res.status(401).json({'message': 'Wrong Credentials'});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
