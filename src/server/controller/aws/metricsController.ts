// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch"); 
const User = require('../../models/user');

// -----------------------------------------
// AWS getLambdaMetrics Controller
// -----------------------------------------

/* 
To test with static AWS credential, use the following lines to get awsCredential from .env file.     
*/

// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
//   throw new Error('AWS credentials or region are not set in environment variables');
// }

/* 
To test with static period/duration variable, use the following lines to get awsCredential from .env file.     
*/

// let period = 3600; // second 
// let duration = 24 * 60 * 60 * 1000 * 30; // millisecond - (hour * minutes * seconds * ms to s)


// TODO: Create a new middleware to create a CloudWatchClient. 


const getLambdaMetrics = {

  // Middleware to get a selected Lambda function's invocation count 
  getInvocationCount: async (req: Request, res: Response, next: NextFunction) => {

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
  
    const client = new CloudWatchClient({ 
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Get period (seconds) and duration (millisecond) from req query
    const { period, duration }: any = req.query; // [TO DO] Refactor type

    let StartTime = new Date(Date.now() - duration);
    let EndTime = new Date();

    // GetMetricDataInput (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch/command/GetMetricDataCommand/)
    const input = { 
      MetricDataQueries: [ 
        { 
          Id: "invocations", 
          MetricStat: { 
            Metric: { 
              Namespace: "AWS/Lambda", 
              MetricName: "Invocations",
              Dimensions: [ 
                { 
                  Name: "FunctionName", 
                  Value: "heartwood-test-lambda-1", 
                },
              ],
            },
            Period: Number(period),
            Stat: "Sum", 
            Unit: "Count",
          },
          ReturnData: true,
        },
      ],
      StartTime: StartTime, 
      EndTime: EndTime,
    }
  
    try {
      // Send the command to AWS CloudWatch and await the response
      const command = new GetMetricDataCommand(input);
      const response = await client.send(command);

      // Pass metric data to next middlewares 
      res.locals.invocationData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values
      }
      return next();

    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
  },
  
  // Middleware to get a selected Lambda function's error count 
  getErrorCount: async (req: Request, res: Response, next: NextFunction) => {
    
    // Get aws credential from res.locals.awsCredential
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
    
    // Initialize a new cloudWatch client with credentials from environment variables
    const client = new CloudWatchClient({ 
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Get period (seconds) and duration (millisecond) from request body 
    const { period, duration }: any = req.query;
    let StartTime = new Date(Date.now() - duration);
    let EndTime = new Date();

    const input = { 
      MetricDataQueries: [ 
        { 
          Id: "errors", 
          MetricStat: { 
            Metric: { 
              Namespace: "AWS/Lambda", 
              MetricName: "Errors",
              Dimensions: [ 
                {
                  Name: "FunctionName", 
                  Value: "heartwood-test-lambda-1", 
                },
              ],
            },
            Period: period, 
            Stat: "Sum",
            Unit: "Count",
          },
          ReturnData: true,
        },
      ],
      StartTime: StartTime,
      EndTime: EndTime,
    }
    
    const command = new GetMetricDataCommand(input);
    
    try {
      // Send the command to AWS CloudWatch and await the response
      const response = await client.send(command);
      res.locals.errorData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values,
      }
      return next();

    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
  },


  // Middleware to get a selected Lambda function's throttle count 
  getThrottleCount: async (req: Request, res: Response, next: NextFunction) => {
  
    // Get aws credential from res.locals.awsCredential
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
  
    // Initialize a new cloudWatch client with credentials from environment variables
    const client = new CloudWatchClient({ 
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Get period (seconds) and duration (millisecond) from request body 
    const { period, duration }: any = req.query;
    let StartTime = new Date(Date.now() - duration);
    let EndTime = new Date();

    const input = {
      MetricDataQueries: [ 
        { 
          Id: "throttles", 
          MetricStat: { 
            Metric: {
              Namespace: "AWS/Lambda", 
              MetricName: "Throttles",
              Dimensions: [ 
                { 
                  Name: "FunctionName",
                  Value: "heartwood-test-lambda-1", 
                },
              ],
            },
            Period: Number(period), 
            Stat: "Sum", 
            Unit: "Count",
          },
          ReturnData: true,
        },
      ],
      StartTime: StartTime,
      EndTime: EndTime,
    }
  
    const command = new GetMetricDataCommand(input);
  
    try {
      // Send the command to AWS CloudWatch and await the response
      const response = await client.send(command);
      res.locals.throttleData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values,
      }
      return next();

    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
  },
  

  // Middleware to get a selected Lambda function's duration \
  getDuration: async (req: Request, res: Response, next: NextFunction) => {

    // Get aws credential from res.locals.awsCredential
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
    
    // Initialize a new cloudWatch client with credentials from environment variables
    const client = new CloudWatchClient({ 
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Get period (seconds) and duration (millisecond) from request body 
    const { period, duration }: any = req.query;
    let StartTime = new Date(Date.now() - duration);
    let EndTime = new Date();

    const input = { 
      MetricDataQueries: [ 
        { 
          Id: "duration", 
          MetricStat: {
            Metric: { 
              Namespace: "AWS/Lambda", 
              MetricName: "Duration",
              Dimensions: [ 
                { 
                  Name: "FunctionName", 
                  Value: "heartwood-test-lambda-1", 
                },
              ],
            },
            Period: period, 
            Stat: "Sum", 
            Unit: "Milliseconds",
          },
          ReturnData: true,

        },
      ],
      StartTime: StartTime,
      EndTime: EndTime,
    }
  
    const command = new GetMetricDataCommand(input);
  
    try {
      // Send the command to AWS CloudWatch and await the response
      const response = await client.send(command);
      res.locals.durationData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values
      }
      return next();

    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
  },  
};

module.exports = getLambdaMetrics;