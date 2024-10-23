// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch"); 
const User = require('../../models/user');

// -----------------------------------------
// AWS getLambdaMetrics Controller
// -----------------------------------------

const getLambdaMetrics = {

  // Middleware to get a selected Lambda function's invocation count 
  getInvocationCount: async (req: Request, res: Response, next: NextFunction) => {

    /* For test, use the following lines to get awsCredential from .env file.     
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
        throw new Error('AWS credentials or region are not set in environment variables');
      }
    */ 

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

    // Test
    // let period = 60; // second 
    // let duration = 24 * 60 * 60 * 1000; // millisecond - (hour * minutes * seconds * ms to s)
    // let StartTime = new Date(Date.now() - duration);
    // let EndTime = new Date();

    // Get period (seconds) and duration (millisecond) from request body 
    const { period, duration } = req.body;
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
            // Period: Number("3600"), // 1 hour (3,600 seconds)
            //Period: Number("60"), // Is it second??
            Period: period,
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
      ],
      StartTime: StartTime, // required
      EndTime: EndTime, // required
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
      // console.log(response.MetricDataResults)

      res.locals.invocationData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values
      }
      console.log('res locals inv data:', res.locals.invocationData);
      // next();
    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
    return next();
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

    // TO DO: Configure Input object
    const input = { // GetMetricDataInput
      MetricDataQueries: [ // MetricDataQueries // required
        { // MetricDataQuery
          Id: "errors", // required
          MetricStat: { // MetricStat
            Metric: { // Metric
              Namespace: "AWS/Lambda", 
              MetricName: "Errors",
              Dimensions: [ // Dimensions
                { // Dimension
                  Name: "FunctionName", // required
                  Value: "heartwood-test-lambda-1", // required
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
      res.locals.errorData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values,
      }
    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
    
    return next();
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
  
    // TO DO: Configure Input object
    const input = { // GetMetricDataInput
      MetricDataQueries: [ // MetricDataQueries // required
        { // MetricDataQuery
          Id: "throttles", // required
          MetricStat: { // MetricStat
            Metric: { // Metric
              Namespace: "AWS/Lambda", 
   
              MetricName: "Throttles",
              Dimensions: [ // Dimensions
                { // Dimension
                  Name: "FunctionName", // required
                  Value: "heartwood-test-lambda-1", // required
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
      res.locals.throttleData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values,
      }
    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
  console.log('stored object to res.locals.throttleData: ', res.locals.throttleData)
  return next();
  },
  

  // Middleware to get a selected Lambda function's duration \
  getDuration: async (req: Request, res: Response, next: NextFunction) => {
    console.log('getInvocationCount middleware is hit')
  
    // Check if necessary AWS environment variables are set 
    // if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    //   throw new Error('AWS credentials or region are not set in environment variables');
    // }

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
  
    // TO DO: Configure Input object
    const input = { // GetMetricDataInput
      MetricDataQueries: [ // MetricDataQueries // required
        { // MetricDataQuery
          Id: "duration", // required
          MetricStat: { // MetricStat
            Metric: { // Metric
              Namespace: "AWS/Lambda", 
              MetricName: "Duration",
              Dimensions: [ // Dimensions
                { // Dimension
                  Name: "FunctionName", // required
                  Value: "heartwood-test-lambda-1", // required
                },
              ],
            },
            Period: Number("3600"), // required
            Stat: "Sum", // required
            Unit: "Milliseconds",
            // Unit: "Seconds" || "Microseconds" || "Milliseconds" || "Bytes" || "Kilobytes" || "Megabytes" || "Gigabytes" || "Terabytes" || "Bits" || "Kilobits" || "Megabits" || "Gigabits" || "Terabits" || "Percent" || "Count" || "Bytes/Second" || "Kilobytes/Second" || "Megabytes/Second" || "Gigabytes/Second" || "Terabytes/Second" || "Bits/Second" || "Kilobits/Second" || "Megabits/Second" || "Gigabits/Second" || "Terabits/Second" || "Count/Second" || "None",
          },
          // Expression: "STRING_VALUE", // Don't need Expresssion if we have "MetricStat"
          // Label: "STRING_VALUE",
          ReturnData: true,
          // Period: Number("3600"),
          // AccountId: "STRING_VALUE",
        },
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
      console.log(response.MetricDataResults)
      res.locals.durationData = {
        label: response.MetricDataResults[0].Timestamps,
        data: response.MetricDataResults[0].Values
      }
      console.log('res locals inv data:', res.locals.durationData);
      // next();
    } catch (error) {
      console.error("Error fetching Lambda metrics:", error);
    }
    return next();
  },
  
};


module.exports = getLambdaMetrics;