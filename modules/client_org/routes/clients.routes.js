//const { getRedeemedVoucher } = require("../services/registration.service");

module.exports = (app) => {
	const client = require("../controllers/clients.controller");
	const upload = require("../clients.multer_upload");
	var router = require("express").Router();
	const multipleUpload = upload.fields([
		{
		  name: "logo",
		  maxCount: 1,
		},
		{
		  name: "icon",
		  maxCount: 1,
		},
	  ]);
	router.get("/wb", client.getAllClientforwb);
	router.get("/:id/campaigns", client.getClientCampaigns);
	router.get("/:id", client.getClientById);
	router.delete("/:id",client.removeClient);
	router.patch("/:id",multipleUpload,client.update);
	router.post("/",[multipleUpload], client.create);
	router.get("/", client.getAllClient);


	app.use("/api/v1/clients", router);
};
