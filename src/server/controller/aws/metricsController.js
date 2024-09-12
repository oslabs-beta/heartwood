// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
// TO DO: add necessary modules 
const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch"); 


// -----------------------------------------
// AWS getLambdaMetrics Controller
// -----------------------------------------

const getLambdaMetrics = {};

// Middleware to get a selected Lambda function's invocation count 
getLambdaMetrics.getInvocationCount = async (req, res, next) => {
  
  // Test Data for front end configuration 
  const hourlyTimestamps = [
    "2024-09-11T00:00:00Z",
    "2024-09-11T01:00:00Z",
    "2024-09-11T02:00:00Z",
    "2024-09-11T03:00:00Z",
    "2024-09-11T04:00:00Z",
    "2024-09-11T05:00:00Z",
    "2024-09-11T06:00:00Z",
    "2024-09-11T07:00:00Z",
    "2024-09-11T08:00:00Z",
    "2024-09-11T09:00:00Z",
    "2024-09-11T10:00:00Z",
    "2024-09-11T11:00:00Z",
    "2024-09-11T12:00:00Z",
    "2024-09-11T13:00:00Z",
    "2024-09-11T14:00:00Z",
    "2024-09-11T15:00:00Z",
    "2024-09-11T16:00:00Z",
    "2024-09-11T17:00:00Z",
    "2024-09-11T18:00:00Z",
    "2024-09-11T19:00:00Z",
    "2024-09-11T20:00:00Z",
    "2024-09-11T21:00:00Z",
    "2024-09-11T22:00:00Z",
    "2024-09-11T23:00:00Z"
  ];

  const randomData = [
    67, 23, 88, 42, 15, 79, 95, 31, 52, 9, 
    73, 48, 20, 61, 36, 84, 5, 97, 28, 54, 
    70, 13, 39, 82
  ];

  const data = {
    functionName: 'test123',
    label: hourlyTimestamps,
    data: randomData,
  }

  res.locals.invocationData = data;

  next();
}

// Middleware to get a selected Lambda function's invocation count 
getLambdaMetrics.getErrorCount = async (req, res, next) => {
  // 

}

// Middleware to get a selected Lambda function's invocation count 
getLambdaMetrics.getThrottleCount = async (req, res, next) => {
  // 

}


module.exports = getLambdaMetrics;