// -----------------------------------------
// Imports and Configuration
// // -----------------------------------------
import { Request, Response, NextFunction } from "express";
const { LambdaClient, ListFunctionsCommand} = require("@aws-sdk/client-lambda");



// // -----------------------------------------
// // AWS functionList Controller
// // -----------------------------------------
const getLambdaFunctions = {
    getListFunctions : async(req: Request, res: Response, next: NextFunction) => {
        let nextMarker = null;
        console.log("ListFunction is working")
        const client = new LambdaClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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

}

module.exports = getLambdaFunctions; 