// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

import express, { Request, Response, NextFunction } from 'express';
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const awsCredential = require('../controller/aws/credentialsController.js');
const getLambdaMetrics = require('../controller/aws/metricsController.js');
const getLambdaFunctions = require('../controller/aws/functionListController');
const getLogEvents = require('../controller/aws/LogsController.js');

// -----------------------------------------
// AWS Credential Routes
// -----------------------------------------

// Route to add AWS credential information
router.post('/credential/add',awsCredential.addAWSCredential, (req: Request, res: Response) => {
  return res.status(200).send('message');
});

// Route to get AWS lambda's invocation count 
router.get('/metric/invocation', getLambdaMetrics.getInvocationCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.invocationData);
});

// Route to get AWS lambda's error count 
router.get('/metric/error', getLambdaMetrics.getErrorCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.errorData);
});

// Route to get AWS lambda's throttle count 
router.get('/metric/throttle', getLambdaMetrics.getThrottleCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.throttleData);
});

router.get('/metric/duration', getLambdaMetrics.getDuration, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.durationData);
});

//Route to get the list of Lambda Functions 
router.get('/metric/functionlist', getLambdaFunctions.getListFunctions, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.nameData);
});

//Route to get Log Events 
router.get('/metric/logevents', getLogEvents.getLambdaLogEvents, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.lambdalogEvents)
})

module.exports = router;