const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const cookieParser = require('cookie-parser');
const userController = require('./controller/createUser');

// Middlewares (To be updated)
app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')));
app.use(express.json());
app.use(cookieParser());

const connectDB = require('./config/db'); // Import the database connection function

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  console.log('line 19')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

// this is test route to test mongoDB connection 
app.post('/test', userController.createUser,(req, res) => {
  console.log('test success')
  res.sendStatus(200)
}); 


// Catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

// Start server 
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

module.exports = app;