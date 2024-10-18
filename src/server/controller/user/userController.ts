import { Request, Response, NextFunction } from "express";
const User = require('../../models/user');

const userController = {
  // Middleware to create a new user 
  createUser: async (req: Request, res: Response, next: NextFunction) => {
  
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(500).send('Error: missing information');
    };
  
    try {
      // Save user to database 
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Store user's id in res.locals
      // console.log('newUser id is: ', newUser._id.toString());
      res.locals.userId = newUser._id.toString();
      
      return next();
  
    } catch (err) {
      return res.status(500).send(`Error in create user controller: ${err}`);
    }
  },

  // Middleware to login 
  login: async (req: Request, res: Response, next: NextFunction) => {
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).send('Error: missing username or password');
    }
  
    try {
      const user = await User.findOne({ username, password });
  
      const userId = user._id;
      res.locals.userId = userId.toString();
  
      if (!user) {
        return res.status(404).send('User not found');
      }

      console.log('user exists from login backend')
  
      return next();
  
    } catch (err) {
      return res.status(500).send(`Error in login controller: ${err}`);
    }
  },
  
  saveToken: async (req: Request, res: Response, next: NextFunction) => {
      // console.log("req.body", req.body)
      const { access_token } = req.body;
  
      if (!access_token) {
        return res.status(500).send('Error: missing information in save toke');
      }
  
      try {
        const newUser = new User({ access_token });
        await newUser.save();
  
        return next();
  
      } catch (err) {
        return res.status(500).send(`Error in create user controller: ${err}`);
      }
  },

  github: async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('GitHub middleware hit');
        const client_id = process.env.GITHUB_CLIENTID;  // Snake case
        const client_secret = process.env.GITHUB_CLIENT_SECRET;  // Snake case

        const { code } = req.body;
        console.log('Code in controller:', code);

        try {

            const response = await axios.post('https://github.com/login/oauth/access_token', 
                new URLSearchParams({
                    client_id,
                    client_secret,
                    code
                }), 
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        accept: 'application/json'
                    }
                }
            );

            const access_token = response.data.access_token;
            console.log('Access Token:', access_token);
            const user = new User({ access_token });
            await user.save();
            const userId = user._id;
            console.log('userId is ', userId.toString());
            res.locals.userId = userId.toString();
            next()
            //res.json({ access_token: accessToken });  
            //return next()
        } catch (err) {
            console.error('Error exchanging code for token:', err);
            next()
            //res.status(500).json({ error: 'Error exchanging code for token' });
        }
    } catch (err) {
        next(err);
    }
}
}; 

module.exports = userController;
