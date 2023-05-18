module.exports = (app) => {

const auth = require("../../../middlewares/auth_admin");
const { getAdmins, getAdminById, createAdmin, adminLogin, updateAdmin, deleteAdmin,getAdminByToken } = require("../controller/admin.controller");

let router = require("express").Router();

router.get("/", getAdmins);
router.get("/auth", getAdminByToken);
router.get("/:id", auth, getAdminById);

router.post("/", createAdmin);
router.patch("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.post("/login", adminLogin);
app.use("/api/v1/admins", router);
};
