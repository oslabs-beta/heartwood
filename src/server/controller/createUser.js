const jwt = require('jsonwebtoken');
const secretKey = 'cats';
const User = require('../models/user');

const userController = {
  async createUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(500).send('Error: missing information');
    }

    try {
      const newUser = new User({ username, email, password });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, username: newUser.username }, secretKey, { expiresIn: '1h' });
      res.cookie('token', username, { httpOnly: true, secure: true });

      return res.status(200).send(newUser);
    } catch (err) {
      return res.status(500).send(`Error in create user controller: ${err}`);
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Error: missing username or password');
    }

    try {
      const user = await User.findOne({ username, password });

      if (!user) {
        return res.status(404).send('User not found');
      }

      const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.cookie('token', username, { httpOnly: true, secure: true });

      return res.status(200).send(token);
    } catch (err) {
      return res.status(500).send(`Error in login controller: ${err}`);
    }
  }
};

module.exports = userController;
