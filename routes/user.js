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


const { getCustomerDashboard, getOwnerDashboard } = require("../controllers/user");

/**
  * Route serving customer dashboard.
  * @name GET /user/customer/dashboard/:id
  * @function
  * @memberof module:routes/user~userRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */
router.get('/customer/dashboard/:id', getCustomerDashboard);

/**
  * Route serving owner dashboard.
  * @name GET /user/owner/dashboard/:id
  * @function
  * @memberof module:routes/user~userRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */
router.get('/owner/dashboard', getOwnerDashboard);

module.exports = router;
