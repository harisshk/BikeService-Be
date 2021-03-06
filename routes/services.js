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

const { isSignedIn, setUser } = require("../controllers/auth");
const { createService, getAllServiceDataByOwner, getAllServices, updateService } = require("../controllers/services");

router.param('userId', setUser);

/**
  * Route serving creating services.
  * @name POST /services/create
  * @function
  * @memberof module:routes/service~serviceRoutes
  * @inner
  * @returns {object} 201 - Created 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */
router.post('/create/:userId', isSignedIn, createService)

/**
  * Route serving to get all services by customer id.
  * @name GET /services/owner/:owner
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */


router.get('/owner/:owner/:userId', isSignedIn, getAllServiceDataByOwner)

/**
  * Route serving to get all services by owner.
  * @name GET /services/all
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */


router.get('/all/:userId', isSignedIn, getAllServices)

/**
  * Route serving to edit services by id.
  * @name PUT /services/all
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */


router.put('/edit/:id/:userId', isSignedIn, updateService)

module.exports = router;