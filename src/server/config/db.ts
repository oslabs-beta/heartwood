// This file contains the setup for connecting to MongoDB using Mongoose.
const mongoose = require('mongoose');
require('dotenv').config();

// save this to .env later 
const URI = process.env.MONGO_URI; // TODO: Get Mongo_URI in the packaged app

const connectDB = async () => {

  mongoose.connect(URI);

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
  });
  
  mongoose.connection.on('error', (error: Error) => {
    console.error('Connection error:', error);
  });

}

module.exports = connectDB;