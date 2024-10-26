import { Request, Response, NextFunction } from "express";
const User = require('../../models/user');

const sessionController = {
  // Middleware to create session and store to user collection 
  createSession: async (req: Request, res: Response, next: NextFunction) => {
  
    const userId = res.locals.userId;
    
    try {
      const session = { 
        name: 'ssid', 
        value: userId,
        url: 'http://localhost/', // Set cookie to localhost
        expirationDate: Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60), // Set expiration date in one month 
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { session: session } },
        { new: true, runValidators: true }
      );
      
      res.locals.session = updatedUser.session;
    
      return next();
  
    } catch (err) {
      // TO DO

    }
  },

  // Middleware to delete session from database
  deleteSession: async (req: Request, res: Response, next: NextFunction) => {
  
    const { ssid } = req.query;

    try {  
      const session = { 
        name: 'ssid', 
        value: '', //clear value
        url: 'http://localhost/', 
        expirationDate: '', // clear exp date
      }

      await User.findByIdAndUpdate(
        ssid,
        { $set: { session: session } },
        { new: true, runValidators: true }
      );

      return next();
    }
    catch (err){
      console.log('err in delete session middleware:', err)
    }
  }
};
  

module.exports = sessionController;
