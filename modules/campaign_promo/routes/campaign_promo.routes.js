//const { getRedeemedVoucher } = require("../services/registration.service");

module.exports = (app) => {
	const campaign_promo = require("../controllers/campaign_promo.controller");
	const upload = require("../campaign_promo.multer_upload");
	var router = require("express").Router();
	const api_auth = require("../../../middlewares/auth");

	router.post("/", upload.single("batch_file"), campaign_promo.create);
	router.post("/assignpromo", api_auth, campaign_promo.assignPromo);
	router.get("/:id", campaign_promo.getByCampaignId);
	router.get("/", campaign_promo.getAllBatch);
	router.post("/checkbin/:campaign_id", api_auth, campaign_promo.checkBin);
	router.get("/checkpromo/:promo", api_auth, campaign_promo.checkPromo);
	router.get("/campaigns/all", campaign_promo.getAllCampaign);
	router.delete("/", campaign_promo.removePromo);
	router.delete("/:batch_id", campaign_promo.removeBatch);
	router.patch("/consumptionCount", campaign_promo.updateConsumptionCount);

	//Microtek
	router.get("/promocode/status", api_auth, campaign_promo.checkPromoStatus);
	router.post("/promocode/status", api_auth, campaign_promo.activatePromo);


	//campaign payment
	router.post("/campaign/assignpromo", api_auth, campaign_promo.assignCampaignPromo);
	app.use("/api/v1/campaign_promo", router);
};
