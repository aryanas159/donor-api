const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "ssaryans597@gmail.com",
		pass: process.env.GMAIL_PASS,
	},
});

const generateOtp = async (req, res) => {
	const { email } = req.body;
	const otp = Math.floor(Math.random() * 900000) + 100000;

	if (email) {
		let mailDetails = {	
			from: "ssaryans597@gmail.com",
			to: email,
			subject: "OTP for email verification",
			text: otp.toString(),
		};
		transporter.sendMail(mailDetails, function (err, data) {
			if (err) {
				console.log(err);
				return res.status(StatusCodes.BAD_REQUEST).json({ err });
			} else {
				bcrypt.hash(otp.toString(), 10, function (err, hash) {
					if (err) {
						console.log(err);
						return res.status(StatusCodes.BAD_REQUEST).json({ err });
					} else {
						console.log("Email sent successfully");
						return res.status(StatusCodes.OK).json({ otpHash: hash });
					}
				});
			}
		});
	}
	return res.status(StatusCodes.BAD_REQUEST);
};

const verifyOtp = async (req, res) => {
	const { otpHash, otp } = req.body;
	if (!otpHash || !otp) {
		throw new Error("Provide necessary info");
	}
	bcrypt.compare(otp, otpHash, function (err, result) {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).json({ err });
		}
		return res.status(StatusCodes.OK).json({ verified: result });
	});
};
module.exports = { generateOtp, verifyOtp };
