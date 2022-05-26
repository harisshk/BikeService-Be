const Bike = require('../models/Bike')
const { StatusCodes } = require("http-status-codes");
const User = require('../models/user');

const createBikeData = async (req, res) => {
    try {
        let preData = await Bike.findOne({ registrationNumber: req.body.registrationNumber })
        if (preData) {
            return res.status(StatusCodes.OK).json({
                success: true,
                duplicate: true,
                message: "DUPLICATE_DATA",
            });
        }
        const newBikeData = await new Bike(req?.body).save();
        await User.findByIdAndUpdate({ _id: req?.body?.owner }, { $push: { bikes: newBikeData?._id } })
        res.status(StatusCodes.OK).json(({
            success: true,
            data: newBikeData
        }))

    } catch (error) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Feature",
            success: false,
            err: error.message,
        });
    }
}

const editBikeData = async (req, res) => {
    try {

        const { id } = req.params;
        const updatedBikeData = await Bike.findOneAndUpdate(
            { _id: id },
            { $set: req.body }
        );

        res.status(StatusCodes.OK).json(({
            success: true,
            data: updatedBikeData
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in updating the Bike",
            success: false,
            err: error.message,
        });
    }
}


const getBikeData = async (req, res) => {
    try {

        const { id } = req.params;
        const bikeData = await Bike.findOne({ _id: id });

        res.status(StatusCodes.OK).json(({
            success: true,
            data: bikeData
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Bike Data",
            success: false,
            err: error.message,
        });
    }
}

const getAllBikeDataByOwner = async (req, res) => {
    try {
        const { owner } = req.params;
        const bikeData = await Bike.find({ owner }).populate('owner');

        res.status(StatusCodes.OK).json(({
            success: true,
            data: bikeData
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Bike Data",
            success: false,
            err: error.message,
        });
    }
}


const getAllBikeData = async (req, res) => {
    try {
        const bikeData = await Bike.find({ isDeleted: false }).populate('owner');

        res.status(StatusCodes.OK).json(({
            success: true,
            data: bikeData
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Bike Data",
            success: false,
            err: error.message,
        });
    }
}

module.exports = { createBikeData, editBikeData, getBikeData, getAllBikeDataByOwner, getAllBikeData }