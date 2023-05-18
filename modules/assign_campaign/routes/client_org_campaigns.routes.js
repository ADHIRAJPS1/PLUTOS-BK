//const { getRedeemedVoucher } = require("../services/registration.service");

module.exports = (app) => {
	const { body, check } = require("express-validator");
	const campaign = require("../controllers/client_org_campaigns.controller");

	var router = require("express").Router();
	router.post("/", body("campaign_id", "campaign id is requrired").isLength(1),
		body("client_id", "client id is requried").isLength(1),
		body("name", "campaign name is requried").isLength(1),
		campaign.create);
	router.get("/", campaign.getAllcampign);
	// router.delete("/:id", campaign.removeClient);
	// router.patch("/:id", multipleUpload, campaign.update);

	app.use("/api/v1/campaign_assign", router);
};