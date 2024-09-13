// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const { readFileSync } = require('fs');

// Import controllers and routers
const userController = require('./controller/createUser');
const awsTestController = require('./controller/awsTest.js');
const awsRouter = require('./routes/awsRouter.js');

// Import database connection function
const connectDB = require('./config/db'); // Import the database connection function


// -----------------------------------------
// Middleware Setup
// -----------------------------------------

// Serve static files from the dist directory
app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')));
// Parse JSON bodies
app.use(express.json());
// Parse cookies 
app.use(cookieParser());




// -----------------------------------------
// Database Connection
// -----------------------------------------
// connectDB();


// -----------------------------------------
// Routes
// -----------------------------------------

// Main route - serve the main HTML file
app.get('/', (req, res) => {
  console.log('line 19')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

// Test route for MongoDB connection
/* send body in this format in Postman
{"name":"connect",
"email":"connect.gmail"}
*/
app.post('/signUp', userController.createUser,(req, res) => {
  console.log('sign up success')
  res.sendStatus(200)
}); 

// this is test route to test Github Oauth
app.get('/home', (req, res) => {
  console.log('github oauth success')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

app.post('/login', userController.login,(req, res) => {
  console.log('login success, server.js')
  res.sendStatus(200)
}); 

// Test routes for AWS Cloud Watch SDK
// app.get('/awstest', awsTestController.awsTest, (req, res) => {
//   res.send('sent from awstest route');
// });

// app.get('/awstest2', awsTestController.testGetMetricsData, (req, res) => {
//   res.send('sent from awstest2 route')
// })

// app.get('/awstest3', awsTestController.testGetMetricsData2, (req, res) => {
//   console.log('awstest3');
//   res.send('sent from awstest3');
// });

// AWS Routes  
app.use('/aws', awsRouter);

// Catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});


// -----------------------------------------
// Error Handling
// -----------------------------------------

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


// -----------------------------------------
// Server Initialization
// -----------------------------------------

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

module.exports = app;