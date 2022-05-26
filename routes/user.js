var router = require("express").Router();


const { getCustomerDashboard } = require("../controllers/user");

router.get('/customer/dashboard/:id', getCustomerDashboard);
router.get('/owner/dashboard/:id', getCustomerDashboard);

module.exports = router;
