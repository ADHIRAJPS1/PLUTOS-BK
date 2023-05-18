const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const { get_current_date, modifyPath } = require("../../../utils/utilities");
const {
	assignServices,
	getAllcampignServices,
	removeClientServices,
	updateClientByIdServices,

} = require("../services/client_org_campaigns.service");
const { body, validationResult } = require("express-validator");

const create = async (req, res) => {
	try {
		
		const error = validationResult(req).formatWith(({ msg }) => msg);

		const hasError = !error.isEmpty();
		//console.log("hasError", error.array());
		if (hasError) 
		{
		throw ApiError.internal(res, hasError);
		}
else{
	
	const obj = {
		name: req.body.name,
		campaign_id: req.body.campaign_id,
		status:1,
		client_id:req.body.client_id,
		is_deleted:0,
		campaign_url:req.body.campaign_url
	};

		const response = await assignServices(obj);
		return Response.success(res, response);
	}} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const update = async (req, res) => {
	try {

		if (req.files) {
			if (req.files["icon"] !== undefined) {
			  const iconpath = modifyPath(req.files["icon"][0].path);
			  req.body.icon = iconpath;
			} else {
			  delete req.body["icon"];
			}
		
			if (req.files["logo"] !== undefined) {
			  const logopath = modifyPath(req.files["logo"][0].path);
			  req.body.logo = logopath;
			} else {
			  delete req.body["logo"];
			}
		  }
		  

		const response = await updateClientByIdServices(req.params.id,req.body);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const getAllcampign = async (req, res) => {


	try {
		const response = await getAllcampignServices();
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const removeClient = async (req, res) => {
	try {
		
		const response = await removeClientServices(req.params.id);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};




module.exports = {
	
	// register,
	// verifyEmail,
	// verifyMobile,
	// assignVoucher,
	// payment,
	// checkPaymentStatus,
	// checkPromocode,
	// waGupshup,


	// getAllClient,
	create,
	getAllcampign,
	removeClient,
	update
};
