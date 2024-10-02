const jwt = require('jsonwebtoken');
const secretKey = 'cats';
const User = require('../../models/user');
// const { Next } = require('react-bootstrap/esm/PageItem');

const userController = {
  // Middleware to create a new user 
  async createUser(req, res, next) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(500).send('Error: missing information');
    };

    try {
      // Save user to database 
      const newUser = new User({ username, email, password });
      await newUser.save();
     
      return next();

    } catch (err) {
      return res.status(500).send(`Error in create user controller: ${err}`);
    }
  },

  // Middleware to login 
  async login(req, res, next) {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Error: missing username or password');
    }

    try {
      const user = await User.findOne({ username, password });

      if (!user) {
        return res.status(404).send('User not found');
      }

      // DELETE THESE 2 LINES? 
      // const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
      // res.cookie('token', username, { httpOnly: true, secure: true });

      // return res.status(200).send(token);
      return next();

    } catch (err) {
      return res.status(500).send(`Error in login controller: ${err}`);
    }
  },

  async saveToken(req, res, next) {
    // console.log("req.body", req.body)
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(500).send('Error: missing information in save toke');
    }

    try {
      const newUser = new User({ access_token });
      await newUser.save();

      // const token = jwt.sign({ id: newUser._id, username: newUser.username }, secretKey, { expiresIn: '1h' });
      // res.cookie('token', username, { httpOnly: true, secure: true });

      // return res.status(200).send(newUser);

      return next();

    } catch (err) {
      return res.status(500).send(`Error in create user controller: ${err}`);
    }
  }
};

module.exports = userController;
