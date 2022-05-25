var router = require("express").Router();

const {
    createBikeData,
    editBikeData,
    getBikeData,
    getAllBikeDataByOwner,
    getAllBikeData
} = require('../controllers/bike')
router.post('/create', createBikeData)

router.put('/edit/:id', editBikeData);

router.get('/:id', getBikeData);

router.get('/owner/:owner', getAllBikeDataByOwner);

router.get('/', getAllBikeData);

module.exports = router;