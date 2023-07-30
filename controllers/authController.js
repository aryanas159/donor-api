const Donor = require("../models/Donor");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const registerDonor = async (req, res) => {
	const { password } = req.body;
	const salt = await bcrypt.genSalt(10);
	req.body.password = await bcrypt.hash(password, salt);
	const donor = await Donor.create(req.body);
	res.status(StatusCodes.OK).json({ donor });
};

const loginDonor = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new Error("Email and Password must be provided");
	}
	const donor = await Donor.findOne({ email });
	if (!donor) {
		throw new Error("User with the provided email doesn't exist");
	}
	const isPasswordCorrect = await donor.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new Error("Provided password is incorrect");
	}
	const token = await donor.createJwt();
	res.status(StatusCodes.OK).json({ token, donor });
};
const changeStatus = async (req, res) => {
	const { donorId } = req.donor;
	const donor = await Donor.findById(donorId);
	donor.isDonating = !donor.isDonating;
	donor.save();
	res.status(StatusCodes.OK).json(donor);
};

const getClosestDonors = async (req, res) => {
	const { lat, long, bloodType } = req.query;
	let donors = await Donor.find({});

	function deg2rad(deg) {
		return deg * (Math.PI / 180);
	}
	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1); // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) *
				Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
	}
	const compareFunction = (a, b) => {
		return a.distance - b.distance;
	}

	if (donors.length) {
		const listOfDonors = donors.filter(donor => donor.bloodGroup == bloodType).map((donor) => {
				const distance = getDistanceFromLatLonInKm(
					Number(lat),
					Number(long),
					donor.location.latitude,
					donor.location.longitude
				);
				return { ...donor.toObject(), distance };
		});
		const sortedListOfDonors = listOfDonors.sort(compareFunction)
		return res.status(StatusCodes.OK).json({ sortedListOfDonors });
	}
	return res
		.status(StatusCodes.BAD_REQUEST)
		.json({ message: "No donors available" });
};
module.exports = { registerDonor, loginDonor, changeStatus, getClosestDonors };
