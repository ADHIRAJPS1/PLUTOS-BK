require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");

const secret = process.env.ACCESS_TOKEN_SECRET;
class JwtUtils {
	static generateToken(user) {
		try {
			const days = 30;
			const token = jwt.sign(user, secret, {
				algorithm: "HS256",
				expiresIn: 60 * 60 * (2 * days),
			});
			return token;
		} catch (error) {
			throw ApiError.internal(error);
		}
	}

	static verifyToken(token) {
		try {
			let result = null;
			jwt.verify(
				token,
				secret,
				{
					algorithms: ["HS256"],
				},
				function (err, user) {
					if (err) throw ApiError.notAuthorized();

					result = user;
				}
			);
			return result;
		} catch (error) {
			throw ApiError.internal(error);
		}
	}

	static destroyToken(token) {
		jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
			if (err) return false;
		});

		return true;
	}
}

module.exports = JwtUtils;
