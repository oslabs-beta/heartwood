const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/aws/credential', (req, res) => {
  return res.send('TBD - message from aws credential route');
})

module.exports = router;