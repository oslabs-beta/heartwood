// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

const express = require('express');
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const userController = require('../controller/user/userController.js');
const sessionController = require('../controller/user/sessionController.js');

// -----------------------------------------
// User Routes
// -----------------------------------------

// Route to sign up
router.post('/signUp', userController.createUser, sessionController.createSession, (req, res) => {
  console.log('sign up success');
  res.status(200).json(res.locals.session);
});

// Route to log in 
router.post('/login', userController.login, sessionController.createSession, (req, res) => {
  console.log('login success, server.js')
  res.status(200).json(res.locals.session);
}); 

// Route to Github login (save Token)
// router.post('/saveToken', userController.saveToken, sessionController.createSession, (req, res) => {
//   console.log('save token success')
//   res.status(200).json(res.locals.session);
// }); 

// Route to gitHub Oauth
router.post('/github', userController.github, sessionController.createSession, (req, res) => {
  console.log('github Oauth success')
  res.status(200).json(res.locals.session);
})


// Test: Route to test Github Oauth
router.get('/home', (req, res) => {
  console.log('github oauth success')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

module.exports = router;