const User = require('../../models/user');

const awsCredential = {};

// middleware to store AWS credentials for a specified user in database 
awsCredential.addAWSCredential = async (req, res, next) => {
  // Get User's ssid from cookie (To be confirmed) 
  const userId = '66d38dd4300649b12a4ca215'; // use temporary id 

  // Get Access Key, Secret Access Key, and Region from request body 
  const [accessKey, secretAccessKey, region] = req.body; 

  // Error handling - if data is not enough, return error 


  // Save AWS credentials to user schema's awsCredential
  try {
    // Find a User object 
    
    // Update awsCredential property's value

  } catch (error) {

  }

  

}

Module.exports = awsCredential;