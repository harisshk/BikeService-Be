const ServiceFeatures = require('../models/serviceFeatures')

const createFeature = (req, res) => {
    try {
        let preFeature = await ServiceFeatures.findOne({ name: req.body.name });
        if (preFeature) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "DUPLICATE_DATA",
            });
        }
        const newFeature = await new ServiceFeatures(req?.body).save();
        res.status(StatusCodes.OK).json(({
            success: true,
            data: newFeature
        }))
        
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Feature",
            success: false,
            err: error.message,
        });
    }
}