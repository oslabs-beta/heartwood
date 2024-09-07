// Middleware to test AWS CloudWatch SDK

// Import required AWS SDK clients and commands - https://www.npmjs.com/package/@aws-sdk/client-cloudwatch
const { CloudWatchClient, GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");

// Load environment variables from .env file 
require('dotenv').config();

// Create an obejct to hold our controller functions 
const awsTestController = {};

// Define the awsTest function as an async middleware 
awsTestController.awsTest = async (req, res, next) => {
  // Check if necessary AWS environment variables are set 
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    throw new Error('AWS credentials or region are not set in environment variables');
  }

  // Initialize a new cloudWatch client with credentials from environment variables
  const client = new CloudWatchClient({ 
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  // Create a new instance of GetMetricStatisticsCommand class with specific parameters
  // The object passed to GetMetricStatisticsCommand configures the specific metrics query.  
  const command = new GetMetricStatisticsCommand({
    Namespace: "AWS/Lambda", // Specify the AWS service namespace 
    MetricName: "Invocations", // The metrics we want to retrieve 
    Dimensions: [
      {
        Name: "FunctionName", // Dimention name for Lambda function 
        Value: "http-function-url-tutorial", // The specific Lambda function name 
      }
    ],
    StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Start time: 24 hours ago
    EndTime: new Date(), // End time: now
    Period: 3600, // Time granuality - 1 hour
    Statistics: ["Sum"] // We want the sum of invocations 
  });

  try {
    // Send the command to AWS CloudWatch and await the response
    const response = await client.send(command);
    // Print out the response's datapoints to console 
    console.log("Lambda Invocations:", response.Datapoints);
    console.log('response is', response);
  } catch (error) {
    console.error("Error fetching Lambda metrics:", error);
  }
}

module.exports = awsTestController;


/** What is AWS SDK clients 

AWS SDK clients are objects that provide an interface to interact with specific AWS services. 
Each client is tailored to a particular AWS service and encapsulates the logic needed to make API calls to that service.

- Each AWS service typically has its own client in the SDK.
- Clients handle the details of making HTTP requests to AWS APIs.
- They manage authentication, request signing, and error handling.
- Clients are usually initialized with configuration like region and credentials.

*/

/** What is AWS SDK commands

In the AWS SDK v3, commands represent specific operations that can be performed on an AWS service. 
They are objects that encapsulate the parameters for a single API call.

- Each command corresponds to a specific API action in an AWS service.
- Commands are used in conjunction with clients to make API requests.
- They contain the parameters necessary for the specific API call.
- Commands are usually passed to the send method of a client.

*/

/** What is AWS service namespace

An AWS service namespace is a string that uniquely identifies an AWS service in the context of metrics and logs. 
It's used to organize and differentiate metrics from different AWS services.

*/