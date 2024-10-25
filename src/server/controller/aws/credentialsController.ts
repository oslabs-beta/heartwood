// -----------------------------------------
// Import
// -----------------------------------------
import { Request, Response, NextFunction } from "express";
const User = require('../../models/user');


// -----------------------------------------
// AWS Credential Controller
// -----------------------------------------
const awsCredential = {
  
  // Middleware to store AWS credentials for a specified user in database 
  addAWSCredential: async (req: Request, res: Response, next: NextFunction) => {
    
    // Get user's AWS credential input and ssid from request body 
    const { accessKey, secretAccessKey, region, ssid } = req.body; 
  
    // Error handling - if data is not enough, return error 
    if (!accessKey || !secretAccessKey || !region) {
      throw new Error('Missing required properties in request body');
    }
  
    // Create a newCredentials object to store in database 
    const newCredentials = {
      AWS_ACCESS_KEY_ID: accessKey,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
      AWS_REGION: region,
    }
  
    try {
      // Find a User object and update awsCredential property 
      const updatedUser = await User.findByIdAndUpdate(
        ssid,
        { $set: { awsCredential: newCredentials } },
        { new: true, runValidators: true }
      );
  
      // Throw an error if user is not found 
      if (!updatedUser) {
        throw new Error('User not found');
      };
  
      // Go to the next middleware
      return next();
  
    } catch (error) {
      // Pass error object to global error handler
      const errObj = {
        log: `failed to add AWS credential: ${error}`,
        message: { err: 'failed to add AWS credential' },
      };
      return next(errObj);
    };
  },

  // Middleware to get AWS credentials for a user 
  getAWSCredential: async (req: Request, res: Response, next: NextFunction) => {
    const { ssid } = req.query;

    try {      
      const user = await User.findOne({ _id: ssid});
      res.locals.awsCredential = user.awsCredential;

      next();
    }
        
    catch (error) {
      // Pass error object to global error handler
      const errObj = {
        log: `failed to get AWS credential: ${error}`,
        message: { err: 'failed to get AWS credential' },
      };
      return next(errObj);
    }
  }
};

module.exports = awsCredential;