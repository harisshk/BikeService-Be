var router = require("express").Router();


const { getCustomerDashboard } = require("../controllers/user");

router.get('/home/:id', getCustomerDashboard);

module.exports = router;
