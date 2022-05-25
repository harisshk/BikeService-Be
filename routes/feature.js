var router = require("express").Router();

const {
    createFeature
} = require('../controllers/features')
router.post('/create', createFeature)

module.exports = router;
