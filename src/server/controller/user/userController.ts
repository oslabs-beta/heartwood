import { Request, Response, NextFunction } from "express";
const User = require('../../models/user');

const userController = {
  // Middleware to create a new user 
  createUser: async (req: Request, res: Response, next: NextFunction) => {
  
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(500).send('Error: missing information');
    };
  
    try {
      // Save user to database 
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Store user's id in res.locals
      // console.log('newUser id is: ', newUser._id.toString());
      res.locals.userId = newUser._id.toString();
      
      return next();
  
    } catch (err) {
      return res.status(500).send(`Error in create user controller: ${err}`);
    }
  },

  // Middleware to login 
  login: async (req: Request, res: Response, next: NextFunction) => {
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).send('Error: missing username or password');
    }
  
    try {
      const user = await User.findOne({ username, password });
  
      const userId = user._id;
      res.locals.userId = userId.toString();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      return next();
  
    } catch (err) {
      return res.status(500).send(`Error in login controller: ${err}`);
    }
  },
  
  saveToken: async (req: Request, res: Response, next: NextFunction) => {
      // console.log("req.body", req.body)
      const { access_token } = req.body;
  
      if (!access_token) {
        return res.status(500).send('Error: missing information in save toke');
      }
  
      try {
        const newUser = new User({ access_token });
        await newUser.save();
  
        return next();
  
      } catch (err) {
        return res.status(500).send(`Error in create user controller: ${err}`);
      }
  },
}; 

module.exports = userController;
