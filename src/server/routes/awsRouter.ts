// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

import express, { Request, Response, NextFunction } from 'express';
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const awsCredential = require('../controller/aws/credentialsController.js');
const getLambdaMetrics = require('../controller/aws/metricsController.js');

// -----------------------------------------
// AWS Credential Routes
// -----------------------------------------

// Route to add AWS credential information
router.post('/credential/add',awsCredential.addAWSCredential, (req: Request, res: Response) => {
  return res.status(200).send('credential added'); 
});

// Route to get AWS lambda's invocation count 
router.get('/metric/invocation', awsCredential.getAWSCredential, getLambdaMetrics.getInvocationCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.invocationData);
});

// Route to get AWS lambda's error count 
router.get('/metric/error', awsCredential.getAWSCredential, getLambdaMetrics.getErrorCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.errorData);
});

// Route to get AWS lambda's throttle count 
router.get('/metric/throttle', awsCredential.getAWSCredential, getLambdaMetrics.getThrottleCount, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.throttleData);
});

router.get('/metric/duration', awsCredential.getAWSCredential, getLambdaMetrics.getDuration, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.durationData);
});


module.exports = router;