const User = require('../../models/user');

const sessionController = {
  
  // Middleware to create session and store to user collection 
  async createSession (req, res, next) {
    console.log('createSession hit')
    const { username, email, password } = req.body;

    try {
      // Create a new session
      const session = { 
        name: 'dummy_name5', 
        value: 'dummy5', 
        expirationDate: Date.now() / 1000 + 3600 
      }
      
      // TODO: Save or update session in database  
      
      
      // Pass the session object to next middleware 
      res.locals.session = session;
  
      return next();

    } catch (err) {
      // TO DO
    }
  },

  // Middleware to check if a user is logged in 
  async isLoggedIn (req, res, next) {

    // This function redirect to signup/login or returns an error if a user is not logged in

  }
}

module.exports = sessionController;
