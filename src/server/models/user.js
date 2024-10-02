// This file defines a Mongoose model for a User. 
// Define the 'User' schema and create a model from the schema
// Export the model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  access_token: String,
  // AWS Credential
  awsCredential: {
    AWS_ACCESS_KEY_ID: {
      type: String,
      trim: true
    },
    AWS_SECRET_ACCESS_KEY: {
      type: String,
      trim: true
    },
    AWS_REGION: {
      type: String,
      trim: true
    },
  },

  // TODO: Add session object 

  });
  
module.exports =  mongoose.model('User', userSchema);


