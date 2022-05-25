//Import Module's
const mongoose = require("mongoose");
const bike = new mongoose.Schema(
	{
        owner: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User',
        },
		bikeMake: {
			type: String,
			trim: true,
			required: true
		},
		bikeModel: {
            type: String,
			trim: true,
            required: true
        },
        engineNumber: {
            type: String,
			trim: true,
			required: true
        },
        registrationNumber: {
            type: String,
			trim: true,
			required: true,
            max: 10
        }
	},
	{timestamps: true},
);

// Export the Schema with the name Bike.
module.exports = mongoose.model("Bike", bike);
