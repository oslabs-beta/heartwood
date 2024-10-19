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
        let nextToken = null //initialize nextToken to null for invocation 
        console.log("LogEvent Controller is being hit")

        const client = new CloudWatchLogsClient({
            region:process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const input = { // GetLogEventsRequest
            logGroupName: "/aws/lambda/Oct17TesterFunction",
            logStreamName: "2024/10/19/[$LATEST]8df7b3b987264a39a1c055500a214e13", // required
            startTime: Number("long"),
            endTime: Number("long"),
            nextToken: nextToken,
            limit: Number("int"),
            startFromHead: true || false,
            unmask: true || false,
          };
          const command = new GetLogEventsCommand(input);
          
          try{
            const response = await client.send(command);
            if(response.events && response.events.length > 0){
              response.events.forEach((event: { timestamp: any; message: any; ingestionTime: any; }) => {
                res.locals.lambdalogEvents = {
                    timestamp: event.timestamp,
                    message: event.message,
                    ingestionTime: event.ingestionTime
                }
                // console.log({
                //   timestamp:event.timestamp,
                //   message: event.message,
                //   ingestionTime: event.ingestionTime,
                // })
              })
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