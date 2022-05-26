const ServiceFeatures = require('../models/serviceFeatures')
const { StatusCodes } = require("http-status-codes");

const createFeature = async (req, res) => {
    try {
        let preFeature = await ServiceFeatures.findOne({ name: req.body.name })
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

const updateFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFeature = await ServiceFeatures.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );

        res.status(StatusCodes.OK).json(({
            success: true,
            data: updatedFeature
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in updating the feature",
            success: false,
            err: error.message,
        });
    }
}

const getAllFeatures = async (req, res) => {
    try {
        const featureData = await ServiceFeatures.find({});

        res.status(StatusCodes.OK).json(({
            success: true,
            data: featureData
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Bike Data",
            success: false,
            err: error.message,
        });
    }
}

module.exports = { createFeature, updateFeature, getAllFeatures }