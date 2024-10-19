// -----------------------------------------
// Imports and Configuration
// // -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { LambdaClient, ListFunctionsCommand} = require("@aws-sdk/client-lambda");
const { CloudWatchLogsClient, DescribeLogStreamsCommand } = require("@aws-sdk/client-cloudwatch-logs"); 


// // -----------------------------------------
// // AWS functionList Controller
// // -----------------------------------------
const getLambdaFunctions = {
    getListFunctions : async(req: Request, res: Response, next: NextFunction) => {

        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION} = res.locals.awsCredential;
        let nextMarker = null;
        console.log("ListFunction is working")
        const client = new LambdaClient({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          }
        });
        const input = {
            // MasterRegion: "us-east-2",
            // FunctionVersion: "ALL",
            // Marker: nextMarker,
            MaxItems: Number(50)
        };
          const command = new ListFunctionsCommand(input);

        try{
          const response  = await client.send(command)
        //   console.log(response.NextMarker)
        //   nextMarker = response.NextMarker || null
          console.log(response.Functions);
          res.locals.nameData = response.Functions[0].Logg; 
        //   res.locals.names = nameData;
        }catch(error){
          console.log("error getting Function data", error)
        }
        return next();
    
      },

      getLogStreamNames: async(req: Request, res: Response, next: NextFunction) => {
        console.log('getLogStream controller is being hit')

        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION} = res.locals.awsCredential;
        //let nextMarker = null;
        // const inputLogGroupName = req.body.logGroupName
        const client = new CloudWatchLogsClient({
            region: AWS_REGION,
            credentials: {
              accessKeyId: AWS_ACCESS_KEY_ID,
              secretAccessKey: AWS_SECRET_ACCESS_KEY ,
            }
        });
        const input = {
            logGroupName: '/aws/lambda/heartwood-test-lambda-1'
        }
        const command = new DescribeLogStreamsCommand(input)
        try{
            const response = await client.send(command)
            console.log("function response", response)
            res.locals.logStreamName = response.logStreams[0].logSteamName;
        }catch(error){
            console.log("Error getting logstream name", error)
        }
        return next();
    }



}

module.exports = getLambdaFunctions; 