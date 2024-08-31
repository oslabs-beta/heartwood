// This file defines a Mongoose model for a User. 
// Define the 'User' schema and create a model from the schema
// Export the model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
  });
  
// const User = mongoose.model('User', userSchema);
// module.exports = mongoose.model('student', studentSchema);
module.exports =  mongoose.model('User', userSchema);


