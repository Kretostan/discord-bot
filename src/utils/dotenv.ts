import dotenv from "dotenv";

export default dotenv.config({
	path: process.env.NODE_ENV === "production" ? ".env" : ".env.development",
});
