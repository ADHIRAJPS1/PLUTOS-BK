const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const { get_current_date, modifyPath } = require("../../../utils/utilities");
const {
	promoCreateServices,
	getPromoByCampaign,
	removePromoServices,
	getAllbatchServices,
	getAllcampaignServices,
	removeBatchServices,
	checkPromoServices,
	assignPromoServices,
	checkBinServices,
	activatePromoServices,
	checkPromoStatusServices,
	assignCampaignPromoServices,
	updateConsumptionCountService,
	//updateClientByIdServices,
} = require("../services/campaign_promo.service");
const readXlsxFile = require("read-excel-file/node");
const { v4: uuidv4 } = require("uuid");
const parseExcel = async (file) => {
	const rows = await readXlsxFile(file);
	rows.shift();
	return rows;
};

const create = async (req, res) => {
	try {
		const fileData = await parseExcel(req.file.path);
		let promoArr = [];
		let batch_id = uuidv4();
		let campaign_id = req.body.campaign_id;
		for (let i = 0; i < fileData.length; i++) {
			let promo = {
				client_promo_id: uuidv4(),
				campaign_batch_id: batch_id,
				campaign_id: req.body.campaign_id,
				promo_code: fileData[i][0],
				consumption_type: fileData[i][1],
				total_count: fileData[i][2],
				expires_at: fileData[i][3],
				consumption_count: 0,
				is_deleted: 0,
			};
			promoArr.push(promo);
		}

		const response = await promoCreateServices(promoArr, campaign_id, batch_id);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const assignPromo = async (req, res) => {
	try {
		const obj = {
			campaign_id: req.body.campaign_id,
			promo_code: req.body.promo_code,
		};

		const response = await assignPromoServices(obj);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const assignCampaignPromo = async (req, res) => {
	try {
		const obj = {
			campaign_id: req.body.campaign_id,
		};

		const response = await assignCampaignPromoServices(obj);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const getByCampaignId = async (req, res) => {
	try {
		const response = await getPromoByCampaign(req.params.id);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const getAllBatch = async (req, res) => {
	try {
		const response = await getAllbatchServices();
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const checkPromo = async (req, res) => {
	try {
		const response = await checkPromoServices(req.params.promo);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const checkBin = async (req, res) => {
	try {
		const obj = {
			bin: req.body.bin,
			campaign_id: req.params.campaign_id,
		};
		const response = await checkBinServices(obj);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const getAllCampaign = async (req, res) => {
	try {
		const response = await getAllcampaignServices();
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const removePromo = async (req, res) => {
	try {
		if (req.body["client_promo_id"] != undefined) {
			const response = await removePromoServices(req.body.client_promo_id);
			return Response.success(res, response);
		}
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const removeBatch = async (req, res) => {
	try {
		if (req.params["batch_id"] != undefined) {
			const response = await removeBatchServices(req.params.batch_id);
			return Response.success(res, response);
		}
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const checkPromoStatus = async (req, res) => {
	try {
		const { campaign, promocode } = req.query;
		if (!campaign)
			return Response.error(res, ApiError.badRequest("Campaign id required!"));
		if (!promocode)
			return Response.error(res, ApiError.badRequest("Promocode required!"));

		const response = await checkPromoStatusServices(campaign, promocode);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const activatePromo = async (req, res) => {
	try {
		const { campaign, promocode } = req.query;
		if (!campaign)
			return Response.error(res, ApiError.badRequest("Campaign id required!"));
		if (!promocode)
			return Response.error(res, ApiError.badRequest("Promocode required!"));

		const response = await activatePromoServices(campaign, promocode);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const updateConsumptionCount = async (req, res)=>{
	try {
		const promocodeIds = req.body.promocodeIds;
		const response = await updateConsumptionCountService(promocodeIds.join(", "));
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
}

module.exports = {
	create,
	removePromo,
	getByCampaignId,
	getAllBatch,
	getAllCampaign,
	removeBatch,
	checkPromo,
	assignPromo,
	checkBin,
	checkPromoStatus,
	activatePromo,
	assignCampaignPromo,
	updateConsumptionCount
};
