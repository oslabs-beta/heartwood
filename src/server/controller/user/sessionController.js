const User = require('../../models/user');

const sessionController = {};
  
// Middleware to create session and store to user collection 
sessionController.createSession = async (req, res, next) => {

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
},

// Middleware to check if a user is logged in 
sessionController.isLoggedIn = async (req, res, next) => {

  // This function redirect to signup/login or returns an error if a user is not logged in

};

module.exports = sessionController;
