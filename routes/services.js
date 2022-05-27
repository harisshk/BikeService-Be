/** Express router providing user related routes
 * @module routes/services
 * @requires express
 */

/**
 * express module
 * @const
 * @namespace serviceRoutes
 */
var router = require("express").Router();

const { createService, getAllServiceDataByOwner } = require("../controllers/services");

/**
  * Route serving creating services.
  * @name POST /services/create
  * @function
  * @memberof module:routes/service~serviceRoutes
  * @inner
  * @returns {object} 201 - Created
  * @returns {Error} 400 - Unexpected Error
  */
router.post('/create', createService)

/**
  * Route serving to get all services by owner.
  * @name GET /services/owner/:owner
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok
  * @returns {Error} 400 - Unexpected Error
  */


router.get('/owner/:owner', getAllServiceDataByOwner)

module.exports = router;