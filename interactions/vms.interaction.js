const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
const ApiError = require("../utils/apiError");

const baseURL = process.env.BASE_URL_VMS;
const api_token = process.env.CBMS_API_TOKEN;
// const baseURL = "http://192.168.1.4:5000";
const assignCampaign = async (campaign_id, client_business_id) => {
	//voucher_id, voucher_code, offering_type

	try {
		data = {
			campaign_id: campaign_id,
			client_business_id: client_business_id,
		};

		const response = await fetch(
			`${baseURL}/api/v1/campaigns/client_business_id`,
			{
				method: "POST", // *GET, POST, PUT, DELETE, etc.
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}
		);
		const resp = await response.text();
	//	console.log(resp[0]);
		if (resp[0] != "t") throw ApiError.internal(null, "Unable to update client_business_id in vms.");

		return true;
	} catch (err) {
		throw ApiError.internal(err);
	}
};

const getOfferingById = async (offering_id) => {
	//all offering details
	try {
		const URL = `${baseURL}/api/v1/offerings/${offering_id}`;
		const res = await fetch(URL);
		const result = await res.json();

		if (result.msg === "Entity not found.")
			throw ApiError.badRequest("Unable to find offering.");

		return result[0];
	} catch (err) {
		throw ApiError.badRequest("Unable to find offering.");
	}
};

module.exports = {
	assignCampaign,
	getOfferingById,
};
