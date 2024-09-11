const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const userController = require('./controller/createUser');
const awsTestController = require('./controller/awsTest.js');

// Middlewares (To be updated)
app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')));
app.use(express.json());
app.use(cookieParser());

const connectDB = require('./config/db'); // Import the database connection function
const { readFileSync } = require('fs');

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

// this is a test route to test AWS Cloud Watch SDK 
// app.get('/awstest', awsTestController.awsTest, (req, res) => {
//   res.send('sent from awstest route');
// });

// // this is a test route to test 
app.get('/awstest2', awsTestController.testGetMetricsData, (req, res) => {
  res.send('sent from awstest2 route')
})

app.get('/awstest3', awsTestController.testGetMetricsData2, (req, res) => {
  console.log('awstest3');
  res.send('sent from awstest3');
});

// route to 

// Catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

// Start server 
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

module.exports = app;