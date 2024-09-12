const User = require('../models/user');

const userController = {

    async createUser(req, res) {
  
      const {username, email, password} = req.body;
  
      if (!username || !email || !password) return res.status(500).send('Error: missing information');
    
  
      try{
        // Example of creating a new user
        const newUser = new User({username, email, password});
        console.log(newUser)
        await newUser.save()
        // const newUser = await User.create({name, email});
        // console.log(newUser);
        return res.status(200).send(newUser);
      }
    
      catch (err) {
    
        return res.status(500).send(`Error in create user controller: ${err}`);
    
      }
    },
  
    async login(req, res){

      const { username, password } = req.body;
      console.log(username, password)

      if (!username || !password) {
        return res.status(400).send('Error: missing username or password');
      }
  
      try {

        const user = await User.findOne({ username, password });

        if (!user) {
          return res.status(404).send('User not found');
        }

        // if (user.password !== password) {
        //   console.log(user)
        //   console.log(password)
        //   return res.status(400).send('Invalid password');
        // }
  
  
        return res.status(200).send('Login successful');
      } catch (err) {
        return res.status(500).send(`Error in login controller: ${err}`);
      }
    }


    
  
  }


module.exports = userController;