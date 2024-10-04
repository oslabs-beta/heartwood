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
    console.log('getInvocationCount middleware is hit')

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
          Id: "invocations", // required
          MetricStat: { // MetricStat
            Metric: { // Metric
              Namespace: "AWS/Lambda", 
              MetricName: "Invocations",
              Dimensions: [ // Dimensions
                { // Dimension
                  Name: "FunctionName", // required
                  Value: "myNewFunction", // required
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
      console.log(response.MetricDataResults)
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
  }

// Middleware to get a selected Lambda function's invocation count 
getLambdaMetrics.getErrorCount = async (req, res, next) => {
  
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
      Id: "errors", // required
      MetricStat: { // MetricStat
        Metric: { // Metric
          Namespace: "AWS/Lambda", 
          MetricName: "Errors",
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
}
// Middleware to get a selected Lambda function's invocation count 
getLambdaMetrics.getThrottleCount = async (req, res, next) => {

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
        Id: "throttles", // required
        MetricStat: { // MetricStat
          Metric: { // Metric
            Namespace: "AWS/Lambda", 
            MetricName: "Throttles",
            Dimensions: [ // Dimensions
              { // Dimension
                Name: "FunctionName", // required
                Value: "heartwood-lambda-test-1", // required
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
}

getLambdaMetrics.getDuration = async (req, res, next) => {
  console.log('getInvocationCount middleware is hit')

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
        Id: "duration", // required
        MetricStat: { // MetricStat
          Metric: { // Metric
            Namespace: "AWS/Lambda", 
            MetricName: "Duration",
            Dimensions: [ // Dimensions
              { // Dimension
                Name: "FunctionName", // required
                Value: "heartwood-lambda-test-1", // required
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
}

getLambdaMetrics.dynamicMetrics = async (req, res, next) => {

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
        Id: "invocations", // required
        MetricStat: { // MetricStat
          Metric: { // Metric
            Namespace: "AWS/Lambda", 
            MetricName: "Invocations",
            Dimensions: [ // Dimensions
              { // Dimension
                Name: "FunctionName", // required
                Value: "req.body.funcName", // required
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
}

module.exports = getLambdaMetrics;