const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DonorSchema = new Schema({
	fullName: {
		type: String,
		required: [true, "Full name is required"],
		max: "50",
	},
	age: {
		type: Number,
		required: [true, "Age is required"],
		min: [18, "Age must be greater than 18"],
	},
	phoneNo: {
		type: String,
		required: [true, "Phone number is required"],
        unique: true,
	},
	email: {
		type: String,
		required: true,
		max: 50,
		min: 2,
		unique: true,
	},
    password: {
        type: String,
        required: true,
    },
    bloodGroup: {
        type: String,
        enum: ['A', 'A-', 'B', 'B-', 'AB', 'AB-', 'O', 'O-'],
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    location: {
        type: Schema.Types.Mixed,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isDonating: {
        type: Boolean,
        default: true
    }
},
    {timestamps: true}
);

DonorSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};
DonorSchema.methods.createJwt = async function () {
	const payload = {
		donorId: this._id
	};
	return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });
};

module.exports = mongoose.model("User", DonorSchema);