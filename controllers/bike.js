const Bike = require('../models/Bike')
const { StatusCodes } = require("http-status-codes");
const User = require('../models/user');

const createBikeData = async (req, res) => {
    try {
        let preData = await Bike.findOne({ registrationNumber: req.body.registrationNumber })
        if (preData) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
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
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Feature",
            success: false,
            err: error.message,
        });
    }
}

module.exports = { createBikeData }