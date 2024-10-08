// Middleware to test AWS CloudWatch SDK

// Import required AWS SDK clients and commands - https://www.npmjs.com/package/@aws-sdk/client-cloudwatch
const { CloudWatchClient, GetMetricStatisticsCommand, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch");

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
    MetricName: "Invocations", // The metrics we want to retrieve like 'Invocations' or 'Throttles' 
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
    console.log("Lambda Invocations of awsTest:", response.Datapoints);
    console.log('response is', response);

    // Move to the next middleware function 
    next();

  } catch (error) {
    console.error("Error fetching Lambda metrics:", error);
  }
}

// create another middleware function to test other metrics 
awsTestController.testGetMetricsData = async(req, res, next) => {
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

  // TO DO: Configure Input object
  const input = { // GetMetricDataInput
    MetricDataQueries: [ // MetricDataQueries // required
      { // MetricDataQuery
        Id: "inTheoryAnything", // required
        MetricStat: { // MetricStat
          Metric: { // Metric
            Namespace: "AWS/Lambda", 
            MetricName: "Invocations",
            Dimensions: [ // Dimensions
              { // Dimension
                Name: "FunctionName", // required
                Value: "http-function-url-tutorial", // required
              },
            ],
          },
          Period: Number("3600"), // required
          Stat: "Sum", // required
          Unit: "Count",
          // Unit: "Seconds" || "Microseconds" || "Milliseconds" || "Bytes" || "Kilobytes" || "Megabytes" || "Gigabytes" || "Terabytes" || "Bits" || "Kilobits" || "Megabits" || "Gigabits" || "Terabits" || "Percent" || "Count" || "Bytes/Second" || "Kilobytes/Second" || "Megabytes/Second" || "Gigabytes/Second" || "Terabytes/Second" || "Bits/Second" || "Kilobits/Second" || "Megabits/Second" || "Gigabits/Second" || "Terabits/Second" || "Count/Second" || "None",
        },
        // Expression: "STRING_VALUE", // Don't need Expresssion if we have "MetricStat"
        // Label: "STRING_VALUE",
        ReturnData: true,
        // Period: Number("3600"),
        // AccountId: "STRING_VALUE",
      },
      { // MetricDataQuery
        Id: "inTheoryAnythingElse", // required
        MetricStat: { // MetricStat
          Metric: { // Metric
            Namespace: "AWS/Lambda", 
            MetricName: "Throttles",
            Dimensions: [ // Dimensions
              { // Dimension
                Name: "FunctionName", // required
                Value: "http-function-url-tutorial", // required
              },
            ],
          },
          Period: Number("1200"), // required
          Stat: "Sum", // required
          Unit: "Count",
          // Unit: "Seconds" || "Microseconds" || "Milliseconds" || "Bytes" || "Kilobytes" || "Megabytes" || "Gigabytes" || "Terabytes" || "Bits" || "Kilobits" || "Megabits" || "Gigabits" || "Terabits" || "Percent" || "Count" || "Bytes/Second" || "Kilobytes/Second" || "Megabytes/Second" || "Gigabytes/Second" || "Terabytes/Second" || "Bits/Second" || "Kilobits/Second" || "Megabits/Second" || "Gigabits/Second" || "Terabits/Second" || "Count/Second" || "None",
        },
        // Expression: "STRING_VALUE", // Don't need Expresssion if we have "MetricStat"
        // Label: "STRING_VALUE",
        ReturnData: true,
        // Period: Number("3600"),
        // AccountId: "STRING_VALUE",
      },
      // We can have up to 500 queries in this MetricDataQueries array
    ],
    StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // required
    EndTime: new Date(), // required
    // NextToken: "STRING_VALUE",
    // ScanBy: "TimestampDescending" || "TimestampAscending",
    // MaxDatapoints: Number("int"), // If you omit this, the default of 100,800 is used.
    // LabelOptions: { // LabelOptions
    //   Timezone: "STRING_VALUE",
    // },
  }

  const command = new GetMetricDataCommand(input);

  try {
    // Send the command to AWS CloudWatch and await the response
    const response = await client.send(command);
    // Print out the response's datapoints to console 
    console.log("Lambda metrics:", response.MetricDataResults[0]);
    console.log("Lambda metrics -throttle:", response.MetricDataResults[1]);
    console.log('response is', response);
    next();
  } catch (error) {
    console.error("Error fetching Lambda metrics:", error);
  }

}

// 



awsTestController.testGetMetricsData2 = async(req, res, next) => {
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

  // TO DO: Configure Input object
  const loopingInput = { MetricDataQueries: []}
  //MetricDataQuery Creator
  console.log(req.body)
  console.log(typeof req.body);
  for(const query in req.body){
    console.log(query)
    loopingInput.MetricDataQueries.push(
        { // MetricDataQuery
          Id: query.id, // required => "anything"
          MetricStat: { // MetricStat
            Metric: { // Metric
              Namespace: "AWS/Lambda", 
              MetricName: query.metric,
              Dimensions: [ // Dimensions
                { // Dimension
                  Name: "FunctionName", // required
                  Value: "http-function-url-tutorial", // required
                },
              ],
            },
            Period: query.period, // required
            Stat: query.operation, // required
            Unit: query.unit,
            // Unit: "Seconds" || "Microseconds" || "Milliseconds" || "Bytes" || "Kilobytes" || "Megabytes" || "Gigabytes" || "Terabytes" || "Bits" || "Kilobits" || "Megabits" || "Gigabits" || "Terabits" || "Percent" || "Count" || "Bytes/Second" || "Kilobytes/Second" || "Megabytes/Second" || "Gigabytes/Second" || "Terabytes/Second" || "Bits/Second" || "Kilobits/Second" || "Megabits/Second" || "Gigabits/Second" || "Terabits/Second" || "Count/Second" || "None",
          },
          // Expression: "STRING_VALUE", // Don't need Expresssion if we have "MetricStat"
          // Label: "STRING_VALUE",
          ReturnData: true,
          // Period: Number("3600"),
          // AccountId: "STRING_VALUE",
        },
      )
    }
  loopingInput.StartTime = new Date(Date.now() - 24 * 60 * 60 * 1000), // required
  loopingInput.EndTime = new Date()
  const command = new GetMetricDataCommand(loopingInput);

  try {
    // Send the command to AWS CloudWatch and await the response
    const response = await client.send(command);
    // Print out the response's datapoints to console 
    console.log("Lambda metrics:", response.MetricDataResults[0].Values);
    console.log("Lambda metrics -throttle:", response.MetricDataResults[1].Values);
    console.log('response is', response);
    next();
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