var router = require("express").Router();

const {
    createBikeData
} = require('../controllers/bike')
router.post('/create', createBikeData)

module.exports = router;
