// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

import express, { Request, Response, NextFunction } from 'express';
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const userController = require('../controller/user/userController.js');
const sessionController = require('../controller/user/sessionController.js');

// -----------------------------------------
// User Routes
// -----------------------------------------

// Route to sign up
router.post('/signUp', userController.createUser, sessionController.createSession, (req: Request, res: Response) => {
  console.log('sign up success');
  res.status(200).json(res.locals.session);
});

// Route to log in 
router.post('/login', userController.login, sessionController.createSession, (req: Request, res: Response) => {
  console.log('login success, server.js')
  res.status(200).json(res.locals.session);
}); 

// Route to Github login (save Token)
router.post('/saveToken', userController.saveToken, sessionController.createSession, (req: Request, res: Response) => {
  console.log('save token success')
  res.status(200).json(res.locals.session);
}); 

// Route to delete session
router.delete('/logout', sessionController.deleteSession, (req: Request, res: Response) => {
  console.log('updated session from Mongo ')
  res.status(200).send('delete success');
});

// Route to get user name
router.get('/username', userController.getUserName, (req: Request, res: Response) => {
  res.status(200).json(res.locals.userName);
})

// Route to gitHub Oauth
// router.post('/github', userController.github, sessionController.createSession, (req: Request, res: Response) => {
//   console.log('github Oauth success')
//   res.status(200).json(res.locals.session);
// })

// Test: Route to test Github Oauth
router.get('/home', (req, res) => {
  console.log('github oauth success')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

module.exports = router;