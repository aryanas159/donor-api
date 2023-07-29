const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new Error("Authentication Invalid");
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		throw new Error("Token not provided");
	}
	const data = jwt.verify(token, process.env.JWT_KEY);
    req.donor = data;
    next();
};

module.exports = authMiddleware;