const express = require("express");
require("dotenv").config();
require("express-async-errors");
const app = express();
const connectDB = require("./db/connectDB");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;
const cors = require('cors')

app.use(express.json());
app.use(
	cors({
		origin: process.env.ORIGIN_URL,
	})
);

const authRoute = require("./routes/authRoute");
app.use("/donor", authRoute);
app.use(errorHandler)
const start = async () => {
	try {
		await connectDB(process.env.DB_URL);
		console.log("Connected to DB");
		await app.listen(PORT, () => {
			console.log(`Listening to port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
start();
