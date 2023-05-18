const ClientOrg = require("../models/clients.model");
const { v4: uuidv4 } = require("uuid");

const {
  getOfferingById,
  getFreeVoucher,
} = require("../../../interactions/vms.interaction");
const ApiError = require("../../../utils/apiError");
const { raw } = require("objection");
const ClientCampaign = require("../../assign_campaign/models/client_org_campaigns.model");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


const clientCreateServices = async (obj) => {
  const { name, slug, status, logo, icon } = obj;
  // const updatedUser = await ClientOrg.query().patchAndFetchById(user_id, {
  // 	mobile,
  // });
  const client_id = uuidv4();
  const client = await ClientOrg.query().insert({
    client_id,
    name,
    slug,
    status,
    logo,
    icon,
  });
  if (!client) {
    throw ApiError.internal(null, "Unable to create client");
  }
  return { data: client, msg: "client is created" };
};
const getAllClients = async () => {
  const client = await ClientOrg.query().select().where("is_deleted", "=", "0");
  //const client = await ClientOrg.knex().raw("select name from client_org");

  if (!client) {
    throw ApiError.internal(null, "client not found");
  }

  return { data: client, msg: "all client data" };
};

const getById = async (client_id) => {
  const client = await ClientOrg.query().findOne({ client_id: client_id, is_deleted: 0 });

  if (!client)
    throw ApiError.notFound("Client not found");

  return { data: client, msg: "Client found successfully" };
}

const campaignsOfClient = async (client_id) => {
  const campaigns = await ClientCampaign.query()
    .select("campaign_id", "name")
    .where("client_id", "=", client_id)
    .where("is_deleted", "=", 0);
  // (await ClientOrg.query()).find

  return { data: campaigns, msg: "Campaigns found successfully" };
}

const getAllClientsForwb = async () => {
  const client = await ClientOrg.knex().raw(`select  coc.campaign_id,coc.name as campagin_name,co.* from client_org as co
  join client_org_campaigns as coc on coc.client_id=co.client_id
  where co.is_deleted=0 and coc.status=1`
  );

  if (!client) {
    throw ApiError.internal(null, "client not found");
  }

  return { data: client[0], msg: "all client data" };
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
  getById,
  campaignsOfClient,
  getAllClients,
  clientCreateServices,
  removeClientServices,
  updateClientByIdServices,
  getAllClientsForwb
};
