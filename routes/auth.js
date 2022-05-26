/** Express router providing user related routes
 * @module routes/auth
 * @requires express
 */

/**
 * express module
 * @const
 * @namespace authRoutes
 */
 const router = require("express").Router();


 const { 
     register, 
     login 
 } = require('../controllers/auth');
 
 /**
  * Route serving register form.
  * @name POST /auth/register
  * @function
  * @memberof module:routes/auth~authRoutes
  * @inner
  * @returns {object} 201 - Created
  * @returns {Error} 409 - Conflict Error
  * @returns {Error} 400 - Unexpected Error
  */
 router.post('/register', register);
 
 
 /**
  * Route serving login form.
  * @name POST /auth/login
  * @function
  * @memberof module:routes/auth~authRoutes
  * @inner
  * @returns {object} 202 - Accepted 
  * @returns {Error} 400 - Unexpected Error
  */
 router.post('/login', login);
 
 module.exports = router;
 