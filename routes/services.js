var router = require("express").Router();

const { createService, getAllServiceDataByOwner } = require("../controllers/services");

router.post('/create', createService)

router.get('/owner/:owner', getAllServiceDataByOwner)

module.exports = router;