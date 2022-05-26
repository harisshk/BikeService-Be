const mongoose = require("mongoose");
const services = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User'
		},
		features: [{
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'ServiceFeatures'
        }],
        bike: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'Bike'
        },
        status: {
            type: String,
            default: "REQUESTED",
            enum: ["REQUESTED", "PENDING", "READYFORDELIVERY", "COMPLETED"]
        },
        serviceAmount: {
            type: Number,
        },
        bookingDate: {
            type: Date,
            required: true
        }
	},
	{timestamps: true},
);

// Export the Schema with the name Services.
module.exports = mongoose.model("Services", services);