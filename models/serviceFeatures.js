//Import Module's
const mongoose = require("mongoose");
const serviceFeatures = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true
		},
		estimatedAmount: {
            type: Number,
            required: true
        }
	},
	{timestamps: true},
);

// Export the Schema with the name ServiceFeatures.
module.exports = mongoose.model("ServiceFeatures", serviceFeatures);
