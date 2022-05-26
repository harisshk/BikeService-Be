var router = require("express").Router();

const {
    createFeature, updateFeature, getAllFeatures
} = require('../controllers/features')

router.post('/create', createFeature)

router.put('/edit/:id', updateFeature)

router.get('/all', getAllFeatures);

module.exports = router;
