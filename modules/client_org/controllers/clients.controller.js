const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const { get_current_date, modifyPath } = require("../../../utils/utilities");
const {

	clientCreateServices,
	getAllClients,
	removeClientServices,
	updateClientByIdServices,
	getAllClientsForwb,
	getById,
	campaignsOfClient,

} = require("../services/clients.service");

const create = async (req, res) => {
	try {
		let logopath = modifyPath(req.files["logo"][0].path);
		let iconpath = modifyPath(req.files["icon"][0].path);
		const obj = {
			name: req.body.name,
			slug: req.body.slug,
			logo: logopath,
			icon: iconpath,
		};


		const response = await clientCreateServices(obj);
		return Response.success(res, response);
	} catch (err) {
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


		const response = await updateClientByIdServices(req.params.id, req.body);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};
const getAllClient = async (req, res) => {


	try {
		const response = await getAllClients();
		// console.log("res is",response);
		return Response.success(res, response);
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
};

const getClientById = async (req, res) => {
	const client_id = req.params.id;
	try {
		const response = await getById(client_id);

		return Response.success(res, response)
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));
	}
}

const getClientCampaigns = async (req, res) => {
	const client_id = req.params.id;
	try {
		const response = await campaignsOfClient(client_id);

		return Response.success(res, response)
	} catch (err) {
		if (err instanceof ApiError) {
			return Response.error(res, err);
		}
		return Response.error(res, ApiError.internal(res, err));		
	}
}
const getAllClientforwb = async (req, res) => {


	try {
		const response = await getAllClientsForwb();
		//console.log("res is",response);
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
	create,
	getAllClient,
	getClientById,
	getClientCampaigns,
	removeClient,
	update,
	getAllClientforwb
};
