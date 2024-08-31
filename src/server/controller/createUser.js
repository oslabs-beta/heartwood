const User = require('../models/user');

const userController = {
    async createUser(req, res) {
  
      const {name, email} = req.body;
  
      if (!name || !email) return res.status(500).send('Error: missing information');
    
  
      try{
        // Example of creating a new user
        const newUser = new User({name, email});
        console.log(newUser)
        await newUser.save()
        // const newUser = await User.create({name, email});
        // console.log(newUser);
        return res.status(200).send(newUser);
      }
    
      catch (err) {
    
        return res.status(500).send(`Error in create user controller: ${err}`);
    
      }
    }}

module.exports = userController;