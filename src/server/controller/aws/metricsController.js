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
  // 

}


module.exports = getLambdaMetrics;