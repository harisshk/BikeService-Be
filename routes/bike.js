/** Express router providing user related routes
 * @module routes/bike
 * @requires express
 */

/**
 * express module
 * @const
 * @namespace bikeRoutes
 */
var router = require("express").Router();

const {
    createBikeData,
    editBikeData,
    getBikeData,
    getAllBikeDataByOwner,
    getAllBikeData
} = require('../controllers/bike')

/**
  * Route serving creating bike.
  * @name POST /bike/create
  * @function
  * @memberof module:routes/bike~bikeRoutes
  * @inner
  * @returns {object} 201 - Created
  * @returns {Error} 409 - Conflict Error
  * @returns {Error} 400 - Unexpected Error
  */
router.post('/create', createBikeData)

/**
  * Route serving edit bike.
  * @name PUT /bike/edit/:id
  * @function
  * @memberof module:routes/bike~bikeRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */

router.put('/edit/:id', editBikeData);

/**
  * Route serving get bike by id.
  * @name GET /bike/:id
  * @function
  * @memberof module:routes/bike~bikeRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */

router.get('/:id', getBikeData);

/**
  * Route serving get bike by owner id.
  * @name GET /bike/owner/:owner
  * @function
  * @memberof module:routes/bike~bikeRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */


router.get('/owner/:owner', getAllBikeDataByOwner);

/**
  * Route serving get all bikes.
  * @name GET /bike
  * @function
  * @memberof module:routes/bike~bikeRoutes
  * @inner
  * @returns {object} 200 - OK
  * @returns {Error} 400 - Unexpected Error
  */


router.get('/', getAllBikeData);

module.exports = router;