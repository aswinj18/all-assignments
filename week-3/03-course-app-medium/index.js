const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

app.use(express.json());
let secretKey = 'SecretKeyForAuthentication!';

let ADMINSFilepath = path.join(__dirname, 'data', 'admins.json');
let USERSFilepath = path.join(__dirname, 'data', 'users.json');
let COURSESFilepath = path.join(__dirname, 'data', 'courses.json');
let USERPURCHASEDCOURSESFilepath = path.join(__dirname, 'data', 'userPurchasesCourses.json');

function loadFromFile(filepath, dataIfFileNotFound=[]) {

  if (!fs.existsSync(filepath)) {
    const dataIfFileNotFoundAsString = JSON.stringify( dataIfFileNotFound );
    fs.writeFileSync(filepath, dataIfFileNotFoundAsString);
  }

  const readData = fs.readFileSync(filepath, 'utf8');
  const readDataJson = JSON.parse(readData);
  return readDataJson

}

function updateFile(filepath, jsonData) {
  const jsonDataAsString = JSON.stringify(jsonData);
  fs.writeFile(filepath, jsonDataAsString, (err) => {
    if (err) {
      throw new Error(err);
    }
  })
}

let ADMINS = loadFromFile(ADMINSFilepath, dataIfFileNotFound=[]);
let USERS = loadFromFile(USERSFilepath, dataIfFileNotFound=[]);
let COURSES = loadFromFile(COURSESFilepath, dataIfFileNotFound=[]);
let USERPURCHASEDCOURSES = loadFromFile(USERPURCHASEDCOURSESFilepath, dataIfFileNotFound={});

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

function getAdminId(adminname) {
  const matchingAdminId = ADMINS.findIndex(item => (item.username===adminname));
  return matchingAdminId;
}

function getUserId(username) {
  const matchingUserId = USERS.findIndex(item => (item.username===username));
  return matchingUserId;
}

// Admin Signin and Login
app.post('/admin/signup', (req, res) => {
  const incomingAdminDetails = req.body;
  const matchingAdminId = ADMINS.findIndex(item => item.username === incomingAdminDetails.username);

  if (matchingAdminId === -1) {
    ADMINS.push(incomingAdminDetails);
    message = 'Admin created successfully'
  } else {
    ADMINS[ matchingAdminId ] = incomingAdminDetails;
    message = 'Admin updated successfully'
  }

  updateFile(ADMINSFilepath, ADMINS);

  res.json({ message });
});

app.post('/admin/login', (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = checkAdminCredValidity(incomingAdminCredentials);
  if (isAdminCredValid) {

    const { username } = incomingAdminCredentials;
    const jwtPayload = {
      username,
      type: 'admin'
    }

    const expiresIn = '1h';

    const jwtToken = jwt.sign(jwtPayload, secretKey, { expiresIn });

    const responseBody = {
      message: 'Logged in successfully',
      jwtToken
    }

    res.json(responseBody);

  } else {
    res.status(403).json({ message: 'Wrong Credentials!!' });
  }
});

// User Signin and Login
app.post('/users/signup', (req, res) => {
  const incomingUserDetails = req.body;
  const matchingUserId = USERS.findIndex(item => item.username === incomingUserDetails.username);
  if (matchingUserId === -1) {
    USERS.push(incomingUserDetails);
    message = 'User created successfully'
  } else {
    USERS[ matchingUserId ] = incomingUserDetails;
    message = 'User updated successfully'
  }

  updateFile(USERSFilepath, USERS);

  res.json({ message });
});

app.post('/users/login', (req, res) => {
  const incomingUserCredentials = req.headers;
  const isUserCredValid = checkUserCredValidity(incomingUserCredentials);
  if (isUserCredValid) {
    
    const { username } = incomingUserCredentials;
    const jwtPayload = {
      username,
      type: 'users'
    }

    const expiresIn = '1h';

    const jwtToken = jwt.sign(jwtPayload, secretKey, { expiresIn });

    const responseBody = {
      message: 'Logged in successfully',
      jwtToken
    }

    res.json(responseBody);

  } else {
    res.status(403).json({ message: 'Wrong Credentials!!' });
  }
});

// Auth Middleware
app.use((req, res, next) => {

  const authHeader = req.headers.authorization;
  const authJwtToken = authHeader.split(' ')[1];
  
  jwt.verify(authJwtToken, secretKey, (err, decoded) => {

    if (err) {
      res.status(401).json({ message: 'Invalid Authorization Token!' });
    }
    
    req.username = decoded.username;
    req.type = decoded.type;

    const urlPath = req.url;
    const urlPathParam1 = urlPath.split('/')[1];
    const isAccountAuthorizedForUrlPath = ( urlPathParam1 === req.type );
    if (!isAccountAuthorizedForUrlPath) {
      res.status(401).json({ message: 'User not authorized to access endpoint!' })
    }

    if (urlPathParam1 === 'admin') {

      const adminId = getAdminId(req.username);
      if (adminId === -1) {
        res.status(401).json({ message: 'Admin Account not found!' })
      }
      req.adminId = adminId;

    } else if (urlPathParam1 === 'users') {

      const userId = getUserId(req.username);
      if (userId === -1) {
        res.status(401).json({ message: 'User Account not found!' })
      }
      req.userId = userId;

    }

    next();

  })

})

// Admin routes
app.post('/admin/courses', (req, res) => {

  const incomingCourse = req.body;
  COURSES.push(incomingCourse);
  updateFile(COURSESFilepath, COURSES);

  const courseId = COURSES.length;

  const responseBody = {
    message: 'Course created successfully', 
    courseId: courseId
  }
  res.json(responseBody);

});

app.put('/admin/courses/:courseId', (req, res) => {

  const courseId = req.params.courseId;
  const courseIndex = courseId - 1;

  const incomingUpdatedCourse = req.body;
  COURSES[ courseIndex ] = incomingUpdatedCourse;

  updateFile(COURSESFilepath, COURSES);

  res.json({ message: 'Course updated successfully' });

});

app.get('/admin/courses', (req, res) => {

  const responseBody = COURSES.map((item,index) => ({
    id: index + 1,
    ...item
  }))
  res.json(responseBody);

});

// User routes
app.get('/users/courses', (req, res) => {

  const responseBody = COURSES.map((item,index) => ({
    id: index + 1,
    ...item
  }))
  res.json(responseBody);

});

app.post('/users/courses/:courseId', (req, res) => {

  const courseId = parseInt(req.params.courseId);
  const courseIndex = courseId - 1;

  const userId = req.userId;

  if (userId in USERPURCHASEDCOURSES) {

    const userPurchasedCourseIndex = USERPURCHASEDCOURSES[ userId ].indexOf(courseIndex);
    if (userPurchasedCourseIndex !== -1) {
      res.json({ message: 'Course already previously purchased!' });
    } else {

      USERPURCHASEDCOURSES[ userId ].push(courseIndex);
      updateFile(USERPURCHASEDCOURSESFilepath, USERPURCHASEDCOURSES);

    }
    
  } else {
    USERPURCHASEDCOURSES[ userId ] = [ courseIndex ];
    updateFile(USERPURCHASEDCOURSESFilepath, USERPURCHASEDCOURSES);
  }

  res.json({ message: 'Course purchased successfully' });

});

app.get('/users/purchasedCourses', (req, res) => {
  const userId = req.userId;

  if (userId in USERPURCHASEDCOURSES) {

    const purchasedCoursesId = USERPURCHASEDCOURSES[ userId ];
    var purchasedCoursesDetails = purchasedCoursesId.map((item) => ({
      id: item + 1,
      ...COURSES[item]
    }));
    
  } else {
    var purchasedCoursesDetails = []
  }

  const responseBody = {
    purchasedCourses: purchasedCoursesDetails
  };
  res.json(responseBody);

});

app.use((req, res) => {
  res.status(404).send();
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
