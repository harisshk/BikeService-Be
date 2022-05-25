const express = require('express');

 const authRoute = require('./auth');
// const applicationRoute = require('./application');

const router = express.Router();

router.use('/auth', authRoute);
// router.use('/application', applicationRoute)

module.exports = router;