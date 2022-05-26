const Services = require('../models/services')
const { StatusCodes } = require("http-status-codes");

const createService = async (req, res) => {
    try {
        const newService = await new Services(req?.body).save();
        res.status(StatusCodes.OK).json(({
            success: true,
            data: newService
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Service",
            success: false,
            err: error.message,
        });
    }
}

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFeature = await Services.findOneAndUpdate(
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

const getAllServices = async (req, res) => {
    try {
        const featureData = await ServiceFeatures.find({ isDeleted: false });

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

module.exports = { createService, updateService, getAllServices }