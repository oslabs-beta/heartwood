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
          region: AWS_REGION, // will need to change this
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID, // need change when commiting 
            secretAccessKey: AWS_SECRET_ACCESS_KEY, // need change when committing
          }
        });
        const input = {
            // MasterRegion: "us-east-2",
            // FunctionVersion: "ALL",
            // Marker: nextMarker,
            MaxItems: Number(50) // max amount of functions that can be uploaded 
        };
          const command = new ListFunctionsCommand(input);

        try{
          const response  = await client.send(command)
        //   console.log(response.NextMarker)
        //   nextMarker = response.NextMarker || null
        console.log(response.Functions)
        let storedFunctionNames: any [] = [];
          //console.log(response.Functions[0]);
          for(let i = 0; i<response.Functions.length; i++){
            storedFunctionNames.push(response.Functions[i].FunctionName)
          }
          res.locals.functiongroupData = storedFunctionNames; // storing the list of functions as an array to send to the front end. 
        //   res.locals.names = nameData;
        }catch(error){
          console.log("error getting Function data", error)
        }
        return next();
    
      },

      getLogStreamNames: async(req: Request, res: Response, next: NextFunction) => {
        console.log('getLogStream controller is being hit')

        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION} = res.locals.awsCredential;
        // const {lambdagroupname} = res.locals.lambdaloggroupname
    
        //let nextMarker = null;
        // const inputLogGroupName = req.body.logGroupName
        const client = new CloudWatchLogsClient({
            region: AWS_REGION, // need to change when committing
            credentials: {
              accessKeyId: AWS_ACCESS_KEY_ID, // change when committing 
              secretAccessKey: AWS_SECRET_ACCESS_KEY,
            }
        });
        const input = {
            logGroupName: '/aws/lambda/heartwood-test-lambda-1' // this will be queried back from the front end
        }
        const command = new DescribeLogStreamsCommand(input)
        try{
            const response = await client.send(command); 
            let storedlambdastreams: any [] = []; // storing values
            for(let i = 0; i < response.logStreams.length; i++){
              storedlambdastreams.push(response.logStreams[i].logStreamName)
            }
            console.log("function response", response.logStreams)
            res.locals.logStreamName = storedlambdastreams
        }catch(error){
            console.log("Error getting logstream name", error)
        }
        return next();
    }



}

module.exports = getLambdaFunctions; 