const { response } = require("express");
const ApiError = require("../../../utils/apiError");
const JwtUtils = require("../../../utils/JwtUtils");
const Response = require("../../../utils/response");
const AdminService = require("../services/admin.service");

const getAdmins = async (req, res) => {
  try {
    const result = await AdminService.getAll();
    return Response.success(res, {
      msg: "All users",
      data: result,
    });
    //  return Response.success(res, "Admins found successfully!", result);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Id is required!");
    if (id !== req.user.id)
      return Response.error(res, ApiError.notAuthorized("Unauthorized user!"));
    const result = await AdminService.getById(id);

    return Response.success(res, "Admin found successfully!", result);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};
const getAdminByToken = async (req, res) => {
  try {
    const token = req.header("token") || req.header("Token");
    if (!token || token === "")
      return Response.error(res, ApiError.badRequest("Token is required!"));
    const obj = {
      auth_token: token,
    };
    const result = await AdminService.getByToken(obj);
    return Response.success(res, {
      msg: "user logged in successfully!",
      data: result,
    });
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

const createAdmin = async (req, res) => {
  try {
    const data = req.body;
    if (!data) return Response.error(res, ApiError.badRequest("Enter inputs!"));
    const admin = await AdminService.newAdmin(data);

    return Response.success(res, {
      msg: "user created successfully!",
      data: admin,
    });
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter inputs!");
    const result = await AdminService.updateAdmin(id, data);
    return Response.success(res, {
      msg: "Admin updated successfully!",
      data: result,
    });
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteAdmin = await AdminService.deleteAdmin(id);

    return Response.success(res, "Admin deleted successfully!", null);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

const adminLogin = async (req, res) => {
  const data = req.body;
  if (!data) throw ApiError.badRequest("Enter email & password!");
  try {
    const admin = await AdminService.adminLogin(data);
    const token = await JwtUtils.generateToken(admin);

    const result = {
      token: token,
      user: admin,
    };
    return Response.success(res, {
      msg: "Admin logged in successfully!",
      data: result,
    });
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);

    return Response.error(res, ApiError.internal(err));
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  getAdminByToken,
};
