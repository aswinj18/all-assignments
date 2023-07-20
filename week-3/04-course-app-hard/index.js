const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Defining Schemas
const adminsSchema = new mongoose.Schema({
  username: String,
  password: String
});

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref:'Courses' }]
});

const coursesSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

// Defining Models
const admins = mongoose.model('Admins', adminsSchema);
const users = mongoose.model('Users', usersSchema);
const courses = mongoose.model('Courses', coursesSchema);

mongoose.connect('mongodb+srv://aswinjshaji:zKvvyCQx2Kc6wTG4@cluster0.so3sojo.mongodb.net/course-app-data');

let secretKey = 'SecretKeyForAuthentication!';

async function checkAdminCredValidity(adminCred) {

  const matchingAdminId = await admins.findOne({
    username: adminCred.username,
    password: adminCred.password
  });

  if (matchingAdminId) {
    res = true;
  } else {
    res = false;
  }

  return res;
}

async function checkUserCredValidity(userCred) {

  const matchingUserId = await users.findOne({
    username: userCred.username,
    password: userCred.password
  });

  if (matchingUserId) {
    res = true;
  } else {
    res = false;
  }

  return res;
}

async function getAdmin(adminname) {
  const matchingAdmin = await admins.findOne({ username: adminname });
  return matchingAdmin;
}

async function getUser(username) {
  const matchingUser = await users.findOne({ username: username });
  return matchingUser;
}

// Admin Signin and Login
app.post('/admin/signup', async (req, res) => {

  const incomingAdminDetails = req.body;
  const matchingAdminId = await admins.findOne({ username: incomingAdminDetails.username });

  if (matchingAdminId === null) {

    const newAdmin = new admins(incomingAdminDetails);
    newAdmin.save();
    res.json({message: 'Admin created successfully'});

  } else {

    res.status(403).json({message: 'Admin already exists'});

  }
});

app.post('/admin/login', async (req, res) => {
  const incomingAdminCredentials = req.headers;
  const isAdminCredValid = await checkAdminCredValidity(incomingAdminCredentials);
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
    res.status(403).json({message: 'Wrong Admin Credentials'});
  }
});

// User Signin and Login
app.post('/users/signup', async (req, res) => {

  const incomingUserDetails = req.body;
  const matchingUserId = await users.findOne({ username: incomingUserDetails.username });

  if (matchingUserId === null) {

    const newUser = new users(incomingUserDetails);
    newUser.save()
    res.json({message: 'User created successfully'});

  } else {
    res.status(403).json({message: 'User already exists'});
  }
});

app.post('/users/login', async (req, res) => {
  const incomingUserCredentials = req.headers;
  const isUserCredValid = await checkUserCredValidity(incomingUserCredentials);
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

// Auth
app.use((req, res, next) => {

  const authHeader = req.headers.authorization;
  const authJwtToken = authHeader.split(' ')[1];
  
  jwt.verify(authJwtToken, secretKey, async (err, decoded) => {

    if (err) {
      res.status(401).json({ message: 'Invalid Authorization Token!' });
      return;
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

      const matchingAdmin = await getAdmin(req.username);
      if (!matchingAdmin) {
        res.status(401).json({ message: 'Admin Account not found!' })
      };
      req.admin = matchingAdmin;

    } else if (urlPathParam1 === 'users') {

      const matchingUser = await getUser(req.username);
      if (!matchingUser) {
        res.status(401).json({ message: 'User Account not found!' })
      };
      req.user = matchingUser;

    }

    next();

  })

})

// Admin routes
app.post('/admin/courses', async (req, res) => {

  const incomingCourse = req.body;
  
  const newCourse = new courses(incomingCourse);
  await newCourse.save()
  const courseId = newCourse.id;

  const responseBody = {
    message: 'Course created successfully', 
    courseId: courseId
  }
  res.json(responseBody);

});

app.put('/admin/courses/:courseId', async (req, res) => {

  const courseId = req.params.courseId;
  const incomingUpdatedCourse = req.body;

  await courses.findByIdAndUpdate(courseId, incomingUpdatedCourse, { new: true });

  res.json({ message: 'Course updated successfully' });
});

app.get('/admin/courses', async (req, res) => {

  const responseBody = await courses.find({});
  res.json(responseBody);

});

app.get('/admin/courses/:id', async (req, res) => {

  const incomingId = req.params.id;
  const responseBody = await courses.findOne({_id: incomingId});
  if (responseBody) {
    res.json(responseBody);
  } else {
    res.status(404).send();
  }
  

});

// User routes
app.get('/users/courses', async (req, res) => {

  const responseBody = await courses.find({});
  res.json(responseBody);

});

app.post('/users/courses/:courseId', async (req, res) => {

  const courseId = req.params.courseId;
  const referringCourse = await courses.findById(courseId);

  if (referringCourse) {

    const requestingUser = req.user;
    requestingUser.purchasedCourses.push(referringCourse);
    await requestingUser.save({ message: 'Course purchased successfully' });
    
    res.json({ message: 'Course purchased successfully' })

  } else {
    res.status(403).json({ message: 'Invalid Course Id' })
  }

});

app.get('/users/purchasedCourses', async (req, res) => {
  const requestingUser = req.user;
  await requestingUser.populate('purchasedCourses');

  responseBody = requestingUser.purchasedCourses;

  res.json(responseBody);

});

app.use((req, res) => {
  res.status(404).send();
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
