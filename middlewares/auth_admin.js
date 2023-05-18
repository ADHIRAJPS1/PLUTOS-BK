const AdminService = require("../modules/admin/services/admin.service");
const ApiError = require("../utils/apiError");
const JwtUtils = require("../utils/JwtUtils");
const Response = require("../utils/response");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || token === "")
      return Response.error(res, ApiError.badRequest("Token is required!"));
    const verifiedAdmin = await JwtUtils.verifyToken(token);
    if (!verifiedAdmin) return Response.error(res, ApiError.notAuthorized());

    // console.log("object", verifiedAdmin);
    const authorizedAdmin = await AdminService.getById(verifiedAdmin.data.id);
    if (!authorizedAdmin) return Response.error(res, ApiError.notAuthorized());

    if (authorizedAdmin.is_deleted)
      return Response.error(
        res,
        ApiError.notActive("Admin is not active now!")
      );

    req.user = authorizedAdmin;
    return next();
  } catch (err) {
    if (err instanceof ApiError)
      return Response.error(res, ApiError.notAuthorized());

    return Response.error(res, ApiError.internal(err));
  }
};
