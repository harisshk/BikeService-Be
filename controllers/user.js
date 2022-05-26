const Services = require('../models/services')
const { StatusCodes } = require("http-status-codes");
const Bike = require('../models/Bike');
const { groupByAndCount } = require('../utils/groupByAndCount')
const getCustomerDashboard = async (req, res) => {
    try {
        const { id } = req.params
        const serviceData = await Services.find({ owner: id })
        const bikeData = await Bike.find({ owner: id }).countDocuments()
        res.status(StatusCodes.OK).json(({
            success: true,
            data: {
                serviceData: groupByAndCount(serviceData, 'status'),
                bikeData
            }
        }))
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Home Data",
            success: false,
            err: error.message,
        });
    }
}

const getOwnerDashboard = async (req, res) => {
    try {
        const serviceData = await Services.find({})
        res.status(StatusCodes.OK).json(({
            success: true,
            data: {
                serviceData: groupByAndCount(serviceData, 'status'),
            }
        }))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Bike Data",
            success: false,
            err: error.message,
        });
    }
}


module.exports = {
    getCustomerDashboard,
    getOwnerDashboard
}