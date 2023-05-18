const ApiError = require("../utils/apiError");
const JwtUtils = require("../utils/JwtUtils");
const Response = require("../utils/response");

module.exports = async (req, res, next) => {
	const keys = {
		UMS: process.env.UMS_KEY,
		VMS: process.env.VMS_KEY,
		EMS: process.env.EMS_KEY,
		WB: process.env.WB_KEY,
		CBMS: process.env.CBMS_KEY,
		MICROTEK: process.env.MICROTEK_KEY,
	};
	const token = req.headers.api_token;
	if (!token || token === "")
		return Response.error(res, ApiError.badRequest("Token is required"));

	try {
		const verifyToken = JwtUtils.verifyToken(token);
		if (!verifyToken) return Response.error(res, ApiError.notAuthorized());

		const { module: tokenModule, key: tokenKey } = verifyToken;

		if (!tokenModule) return Response.error(res, ApiError.notAuthorized());
		if (!tokenKey) return Response.error(res, ApiError.notAuthorized());

		if (tokenModule in keys && keys[tokenModule] === tokenKey) {
			next();
		} else {
			return Response.error(res, ApiError.notAuthorized());
		}
	} catch (err) {
		return Response.error(res, ApiError.notAuthorized());
	}
};

