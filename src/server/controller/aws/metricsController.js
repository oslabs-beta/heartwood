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
      console.log(response.MetricDataResults)
      res.locals.invocationData = {
        TimeStamps: response.MetricDataResults[0].Timestamps,
        Values: response.MetricDataResults[0].Values,
      }
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
    TimeStamps: response.MetricDataResults[0].Timestamps,
    Values: response.MetricDataResults[0].Values,
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
    res.locals.throttleData = {
      TimeStamps: response.MetricDataResults[0].Timestamps,
      Values: response.MetricDataResults[0].Values,
    }
  } catch (error) {
    console.error("Error fetching Lambda metrics:", error);
  }
console.log('stored object to res.locals.throttleData: ', res.locals.throttleData)
return next();
}


module.exports = getLambdaMetrics;