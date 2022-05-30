/** Express router providing user related routes
 * @module routes/user
 * @requires express
 */

/**
 * express module
 * @const
 * @namespace userRoutes
 */
var router = require("express").Router();


const { isSignedIn, setUser } = require("../controllers/auth");
const { getCustomerDashboard, getOwnerDashboard } = require("../controllers/user");

router.param('userId', setUser);

/**
  * Route serving customer dashboard.
  * @name GET /user/customer/dashboard/:id
  * @function
  * @memberof module:routes/user~userRoutes
  * @inner
  * @returns {object} 200 - OK 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */
router.get('/customer/dashboard/:id/:userId', isSignedIn, getCustomerDashboard);

/**
  * Route serving owner dashboard.
  * @name GET /user/owner/dashboard/:id
  * @function
  * @memberof module:routes/user~userRoutes
  * @inner
  * @returns {object} 200 - OK 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */
router.get('/owner/dashboard/:userId', isSignedIn, getOwnerDashboard);

module.exports = router;
