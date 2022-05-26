var router = require("express").Router();

const { createService } = require("../controllers/services");

router.post('/create', createService)

module.exports = router;