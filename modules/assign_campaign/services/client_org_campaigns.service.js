const ClientCampaign = require("../models/client_org_campaigns.model");
const ClientOrg = require("../../client_org/models/clients.model");
const { v4: uuidv4 } = require("uuid");

const {
  getOfferingById,
  assignCampaign,
} = require("../../../interactions/vms.interaction");
const ApiError = require("../../../utils/apiError");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { raw } = require("objection");

const assignServices = async (obj) => {
  try {
    const { campaign_id, client_id } = obj;

    const client_org_campaigns_id = uuidv4();
    obj["client_org_campaigns_id"] = client_org_campaigns_id;
    const vmsAssign = await assignCampaign(campaign_id, client_id);
    if (!vmsAssign) {
      throw ApiError.internal(null, "Unable to assign campaign in vms");
    }

    const campaign = await ClientCampaign.query().insert(obj);
    if (!campaign) {
      throw ApiError.internal(null, "Unable to assign campaign");
    }
    return { data: campaign, msg: "campaign is assigned" };
  } catch (err) {
    throw ApiError.internal(err, "client not found");
  }
};
const getAllcampignServices = async () => {
  try {
    // const client= await ClientCampaign.query().select()
    // .withGraphFetched({
    //     'client': true
    // }).where("is_deleted",'=',0);
    const client = await ClientCampaign.knex()
      .raw(`select co.name as client_name,coc.* from client_org_campaigns as coc 
	join client_org as co on co.client_id=coc.client_id
	where coc.is_deleted=0 and coc.status=1 and co.is_deleted=0`);
    if (!client) {
      throw ApiError.internal(null, "client not found");
    }

    return { data: client[0], msg: "all client data" };
  } catch (err) {
    throw ApiError.internal(err, "client not found");
  }
};
const removeClientServices = async (id) => {
  try {
    const client = await ClientOrg.query().patchAndFetchById(id, {
      is_deleted: 1,
    });
    if (!client) {
      throw ApiError.internal(null, "client not found");
    }

    return { data: client, msg: "client removed" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const updateClientByIdServices = async (id, obj) => {
  try {
    console.log("id,and obj", id, obj);
    const client = await ClientOrg.query().patchAndFetchById(id, obj);
    if (!client) {
      throw ApiError.internal(null, "client not found");
    }

    return { data: client, msg: "client updated!" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};

module.exports = {
  getAllcampignServices,
  assignServices,
  removeClientServices,
  updateClientByIdServices,
};
