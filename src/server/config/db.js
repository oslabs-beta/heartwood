// This file contains the setup for connecting to MongoDB using Mongoose.
const mongoose = require('mongoose');
require('dotenv').config();

// save this to .env later 
const uri = process.env.MONGO_URI;

const connectDB = async () => {

  mongoose.connect(uri);

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
  }).on('error', (error) => {
    console.error('Connection error:', error);
  });

}

module.exports = connectDB;