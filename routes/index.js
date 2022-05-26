const express = require('express');

const authRoute = require('./auth');
const featureRoute = require('./feature');
const bikeRoute = require('./bike');
const serviceRoute = require('./services');
const userRoute = require('./user');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/feature', featureRoute)
router.use('/services', serviceRoute)
router.use('/bike', bikeRoute)
router.use('/user', userRoute)

module.exports = router;