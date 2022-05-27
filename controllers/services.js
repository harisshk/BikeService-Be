const Services = require('../models/services')
const { StatusCodes } = require("http-status-codes");
const { sendMailToOne } = require('../utils/mail');

const createService = async (req, res) => {
    try {
        const newService = await new Services(req?.body).save()
        const data = await Services.findById({ _id: newService?._id })
            .populate("owner")
            .populate("bike")
        const to = "hari850800@gmail.com";
        const subject = "TEST";
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const htmlCode =
            `
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Open Sans, Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">&nbsp;</div>
<table border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="background-color: #eeeeee;" align="center" bgcolor="#eeeeee">
<table style="max-width: 600px; height: 615px; width: 100%;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
<tbody>
<tr style="height: 56px;">
<td style="font-size: 0px; padding: 35px; height: 56px; text-align: center;" align="center" valign="top" bgcolor="#74B975">
<table style="border-collapse: collapse; width: 100%;" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="width: 100%; font-size: 40px; color: #ffffff;">BIKE SERVICE</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height: 539px;">
<td style="padding: 35px 35px 20px; background-color: #ffffff; height: 539px;" align="center" bgcolor="#ffffff">
<table style="max-width: 600px; height: 454px; width: 100%;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
<tbody>
<tr style="height: 180px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 25px; height: 180px;" align="center"><img style="display: block; border: 0px;" src="https://img.icons8.com/carbon-copy/100/000000/checked-checkbox.png" width="125" height="120" /><br />
<h2 style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;">New Booking</h2>
</td>
</tr>
<tr style="height: 166px;">
<td style="padding-top: 20px; height: 166px;" align="left">
<table style="width: 100%; height: 144px;" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; width: 85.7528%; height: 24px;" align="left" bgcolor="#eeeeee" width="75%">Details</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; width: 14.2472%; height: 24px;" align="left" bgcolor="#eeeeee" width="25%">&nbsp;</td>
</tr>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px; width: 85.7528%; height: 24px;" align="left" width="75%">Customer Name</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px; width: 14.2472%; height: 24px;" align="left" width="25%">${data?.owner?.name}</td>
</tr>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 85.7528%; height: 24px;" align="left" width="75%">Bike</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 14.2472%; height: 24px;" align="left" width="25%">${data?.bike?.bikeMake}</td>
</tr>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 85.7528%; height: 24px;">&nbsp;</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 14.2472%; height: 24px;">${data?.bike?.bikeModel}</td>
</tr>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 85.7528%; height: 24px;">&nbsp;</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 14.2472%; height: 24px;">${data?.bike?.registrationNumber}</td>
</tr>
<tr style="height: 24px;">
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 85.7528%; height: 24px;" align="left" width="75%">Date and Time</td>
<td style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px; width: 14.2472%; height: 24px;" align="left" width="25%">${month[new Date(data?.bookingDate).getUTCMonth()]} ${new Date(data?.bookingDate).getUTCDate()},${new Date(data?.bookingDate).getFullYear()}</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height: 18px;">
<td style="padding: 0px 35px 35px; background-color: #ffffff; height: 10px;" align="center" valign="top" bgcolor="#ffffff" width="100%" height="100%">&nbsp;</td>
</tr>
<tr style="height: 18px;">
<td style="padding: 0px 35px 35px; background-color: #ffffff; height: 10px;" align="center" valign="top" bgcolor="#ffffff" width="100%" height="100%">&nbsp;</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
`;

        sendMailToOne(to, subject, htmlCode);
        console.log(data)
        res.status(StatusCodes.CREATED).json(({
            success: true,
            data: data
        }))

    } catch (error) {
        console.log(error)
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

const getAllServiceDataByOwner = async (req, res) => {
    try {
        const { owner } = req.params;
        const serviceData = await Services.find({ owner })
            .populate('owner')
            .populate('bike')

        res.status(StatusCodes.OK).json(({
            success: true,
            data: serviceData
        }))

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in getting the Service Data",
            success: false,
            err: error.message,
        });
    }
}


module.exports = { createService, updateService, getAllServices, getAllServiceDataByOwner }