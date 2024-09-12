// -----------------------------------------
// Imports and Configuration
// -----------------------------------------

const express = require('express');
const path = require('path');
const router = express.Router();

// Import AWS credential controller
const awsCredential = require('../controller/aws/credentialsController.js')


// -----------------------------------------
// AWS Credential Routes
// -----------------------------------------

// Route to add AWS credential information
router.post('/credential/add',awsCredential.addAWSCredential, (req, res) => {
  return res.status(200).send('TBD - message from aws credential route');
});

// TO DO: Add more routes to handle AWS operations


module.exports = router;