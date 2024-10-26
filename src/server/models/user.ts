// Imports 
import mongoose, { Document, Model, Schema } from 'mongoose';

// Schema definition 
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  access_token: String,
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
  session: {
    name: String,
    value: String,
    url: String,
    expirationDate: {
      type: Number,
    }
  }
});

// Model creation and export 
module.exports =  mongoose.model('User', userSchema);