// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
const User = require('../../models/user');


// -----------------------------------------
// AWS Credential Controller
// -----------------------------------------
const awsCredential = {};

// Middleware to store AWS credentials for a specified user in database 
awsCredential.addAWSCredential = async (req, res, next) => {
  // TO DO: Get User's ssid from cookie or JWT 
  const userId = '66d38dd4300649b12a4ca215'; // Currently hardcode a user id 

  // Get Access Key, Secret Access Key, and Region from request body 
  const { accessKey, secretAccessKey, region } = req.body; 

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
      userId,
      { $set: { awsCredential: newCredentials } },
      { new: true, runValidators: true }
    );

    // Throw an error if user is not found 
    if (!updatedUser) {
      throw new Error('User not found');
    };

    // Next middleware
    return next();

  } catch (error) {
    // Pass error object to global error handler
    const errObj = {
      log: `failed to add AWS credential: ${err}`,
      message: { err: 'failed to add AWS credential' },
    };
    return next(errObj);
  };
};

module.exports = awsCredential;