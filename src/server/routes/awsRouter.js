// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

const express = require('express');
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const awsCredential = require('../controller/aws/credentialsController.js');
const getLambdaMetrics = require('../controller/aws/metricsController.js');

// -----------------------------------------
// AWS Credential Routes
// -----------------------------------------

// Route to add AWS credential information
router.post('/credential/add',awsCredential.addAWSCredential, (req, res) => {
  return res.status(200).send('message');
});

// Route to get AWS lambda's invocation count 
router.get('/metric/invocation', getLambdaMetrics.getInvocationCount, (req, res) => {
  return res.status(200).json(res.locals.invocationData);
});

// Route to get AWS lambda's error count 
router.get('/metric/error', getLambdaMetrics.getErrorCount, (req, res) => {
  return res.status(200).json(res.locals.errorData);
});

// Route to get AWS lambda's throttle count 
router.get('/metric/throttle', getLambdaMetrics.getThrottleCount, (req, res) => {
  return res.status(200).send('TBD - message from metric/throttle route');
});




module.exports = router;