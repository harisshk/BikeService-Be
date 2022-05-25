const express = require('express');

const authRoute = require('./auth');
const featureRoute = require('./feature');
const bikeRoute = require('./bike');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/feature', featureRoute)
router.use('/bike', bikeRoute)

module.exports = router;