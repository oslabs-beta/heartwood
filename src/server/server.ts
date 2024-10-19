// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

import express, { Request, Response, NextFunction } from 'express';
import { CustomError } from './serverTypes';

const app = express();
const PORT: number = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
// const { readFileSync } = require('fs');

// Import controllers and routers
const awsRouter = require('./routes/awsRouter.js');
const userRouter = require('./routes/userRouter.js');

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
connectDB();


// -----------------------------------------
// Routes
// -----------------------------------------

// Main route - serve the main HTML file
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); 

// User routes
app.use('/user', userRouter);

// AWS routes  
app.use('/aws', awsRouter);

// Catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});


// -----------------------------------------
// Error Handling
// -----------------------------------------

// Global error handler
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
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