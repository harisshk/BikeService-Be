/** Express router providing user related routes
 * @module routes/features
 * @requires express
 */

/**
 * express module
 * @const
 * @namespace featureRoutes
 */
var router = require("express").Router();

const { isSignedIn } = require("../controllers/auth");
const {
  createFeature, updateFeature, getAllFeatures, getFeatureById
} = require('../controllers/features')


/**
  * Route serving creating feature.
  * @name POST /feature/create
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 201 - Created
  * @returns {Error} 409 - Conflict Error  
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */
router.post('/create', isSignedIn, createFeature)

/**
  * Route serving editing feature.
  * @name PUT /feature/edit/:id
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */

router.put('/edit/:id', isSignedIn, updateFeature)

/**
  * Route serving get all features.
  * @name GET /feature/all
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */

router.get('/all', isSignedIn, getAllFeatures);
/**
  * Route serving get features by Id.
  * @name GET /feature/:id
  * @function
  * @memberof module:routes/feature~featureRoutes
  * @inner
  * @returns {object} 200 - Ok 
  * @returns {Error} 401 - UnAuthorized Error
  * @returns {Error} 400 - Unexpected Error
  */

router.get('/:id', isSignedIn, getFeatureById);

module.exports = router;
