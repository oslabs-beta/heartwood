// -----------------------------------------
// Imports and Configuration
// -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { CloudWatchLogsClient, GetLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");




// // -----------------------------------------
// // AWS LambdaLog Controller
// // -----------------------------------------
const getLogEvents = {
    getLambdaLogEvents : async(req: Request, res: Response, next: NextFunction) =>{ 
        //console.log("LogEvent Controller is being hit")
       const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = res.locals.awsCredential;


        const client = new CloudWatchLogsClient({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID ,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            }
        });
        let nextToken = null;//initialize nextToken to null for invocation 

        const input = { // GetLogEventsRequest
            logGroupName: "/aws/lambda/heartwood-test-lambda-1", // source account 
            //logGroupIdentifier:"arn:aws:iam::941377123042:user/heartwood2",
            logStreamName: "2024/10/19/[$LATEST]b3a2dc805bb947c38ce3ff3894883a7d", // required
            startTime: Number("long"),
            endTime: Number("long"),
            nextToken: nextToken,
            limit: 50,
            startFromHead: true || false,
            unmask: true || false,
          };
          const command = new GetLogEventsCommand(input);
          
          try{
            const response = await client.send(command);
            if(response.events && response.events.length > 0){
              let storedLambdaLogs: any[] = []; //intialize a new array to store object keys
              response.events.forEach((event: { timestamp: any; message: any; ingestionTime: any; }) => {
                storedLambdaLogs.push({
                    timestamp: event.timestamp,
                    message: event.message,
                    ingestionTime: event.ingestionTime
                })
              })
              //console.log('lambdalogarray', storedLambdaLogs)
              res.locals.lambdaLogEvents = storedLambdaLogs;
              nextToken = response.nextForwardToken || null;
            } else {
              "No Events have been located"
            }
            // if(response.nextForwardToken){
            //   console.log("nextForward Response Token", response.nextForwardToken)
            // }
            // if(response.nextBackwardToken){
            //   console.log("nextBackward Response Token", response.nextBackwardToken)
            // }
          
          } catch(error){
            console.log("Lambda Logging Error", error)
          }
          return next()
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


module.exports = getLogEvents;