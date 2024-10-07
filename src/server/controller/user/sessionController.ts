import { Request, Response, NextFunction } from "express";
const User = require('../../models/user');

const sessionController = {
  // Middleware to create session and store to user collection 
  createSession: async (req: Request, res: Response, next: NextFunction) => {
  
    console.log('createSession hit')
    // Get userId from previous middleware
    const userId = res.locals.userId;
  
    console.log('userId in createSession middleware', userId);
  
    try {
      // Create a new session
      // set 'ssid' cookie with value of user id 
      const session = { 
        name: 'ssid', 
        value: userId,
        url: 'http://localhost/', // Set cookie to localhost
        expirationDate: Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60), // Set expiration date in one month 
      }
      
      // Find a User object with userId, and update session property in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { session: session } },
        { new: true, runValidators: true }
      );
      
      // Pass the session object to next middleware
      res.locals.session = updatedUser.session;
  
      console.log('session saved in res.local ', res.locals.session)
  
      return next();
  
    } catch (err) {
      // TO DO

    }
  }
  
};
  

module.exports = sessionController;
