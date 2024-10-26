// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { CloudWatchLogsClient, GetLogEventsCommand, DescribeLogStreamsCommand } = require("@aws-sdk/client-cloudwatch-logs");

// -----------------------------------------
// AWS LambdaLog Controller
// -----------------------------------------

const getLogs = {

  // Middleware function to get logstreams 
  getLogStreamNames: async (req: Request, res: Response, next: NextFunction) => {
    console.log('getLogStream controller is being hit')

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
    const { functionName } = req.query;
    const logGroupName = `/aws/lambda/${functionName}`;

    console.log('req.query ', req.query);
    console.log('req.query.functionName', req.query.functionName);
    console.log('functionName variable is ', functionName);
    console.log('logGroupName variable is ', logGroupName);
    

    const client = new CloudWatchLogsClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      }
    });

    const input = {
      logGroupName: logGroupName,
    }

    const command = new DescribeLogStreamsCommand(input);

    try {
      const response = await client.send(command);

      let logStreamNames: any[] = []; // storing values 

      for (let i = 0; i < response.logStreams.length; i++) {
        logStreamNames.push(response.logStreams[i].logStreamName);
      };

      res.locals.logStreamName = logStreamNames;

      return next();

    } catch (error) {
      console.log("Error getting logstream name", error)
    }
  },

  // Middleware function to get logevents  
  getLambdaLogEvents: async (req: Request, res: Response, next: NextFunction) => {
    console.log("LogEvent Controller is being hit")
  
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;
    const { functionName, logStreamName } = req.query;
    const logGroupName = `/aws/lambda/${functionName}`;

    const client = new CloudWatchLogsClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      }
    });

    let nextToken = null;

    const input = {
      logGroupName: logGroupName, 
      //logGroupIdentifier:"arn:aws:iam::941377123042:user/heartwood2",
      logStreamName: logStreamName, // required
      startTime: Number("long"),
      endTime: Number("long"),
      nextToken: nextToken,
      limit: 100, // max is 10,000 events
      startFromHead: true || false,
    };

    const command = new GetLogEventsCommand(input);

    try {
      const response = await client.send(command);
      if (response.events && response.events.length > 0) {
        let storedLambdaLogs: any[] = [];
        response.events.forEach((event: { timestamp: any; message: any; ingestionTime: any; }) => {
          storedLambdaLogs.push({
            timestamp: event.timestamp,
            message: event.message,
            ingestionTime: event.ingestionTime
          })
        })
        res.locals.lambdaLogEvents = storedLambdaLogs;
        console.log('res.locals.lambdaLogEvents', res.locals.lambdaLogEvents); 
        nextToken = response.nextForwardToken || null;
      }

      // if(response.nextForwardToken){
      //   console.log("nextForward Response Token", response.nextForwardToken)
      // }
      // if(response.nextBackwardToken){
      //   console.log("nextBackward Response Token", response.nextBackwardToken)
      // }

      return next()

    } catch (error) {
      console.log("Controller Lambda Logging Error", error)
    }

    // { // GetLogEventsResponse
    //   events: [ // OutputLogEvents
    //     { // OutputLogEvent
    //       timestamp: Number("long"),
    //       message: "STRING_VALUE",
    //       ingestionTime: Number("long"),
    //     },
    //   ],
    //   nextForwardToken: "STRING_VALUE",
    //   nextBackwardToken: "STRING_VALUE",
    // };        

  }

}


module.exports = getLogs;

