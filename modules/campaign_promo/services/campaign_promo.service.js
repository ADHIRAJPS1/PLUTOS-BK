const ClientPromo = require("../models/client_promo.model");
const cam_batch = require("../models/campaign_batch.model");
const cam_org = require("../../assign_campaign/models/client_org_campaigns.model");
const { v4: uuidv4 } = require("uuid");

const {
  getOfferingById,
  getFreeVoucher,
} = require("../../../interactions/vms.interaction");
const ApiError = require("../../../utils/apiError");
const { raw } = require("objection");
const CampaignBin = require("../models/campaign_bin.model");
const { get_current_date } = require("../../../utils/utilities");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const promoCreateServices = async (obj, campaign_id, batch_id) => {
  try {
    const cam = await cam_batch
      .query()
      .insert({ campaign_batch_id: batch_id, campaign_id: campaign_id });
    if (!cam) {
      throw ApiError.internal(null, "Unable to create promo");
    }

    const client = await ClientPromo.query().insertGraph(obj);

    if (!client) {
      throw ApiError.internal(null, "Unable to create promo");
    }

    return { data: cam, msg: "promo  is uploaded" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const assignPromoServices = async (obj) => {
  try {
    const { campaign_id, promo_code } = obj;

    //const cam = await ClientPromo.query().patchAndFetchById(campaign_id,{"consumption_count":"consumption_count+1"})
    //.where("promo_code","=",promo_code);
    let cam = [];
    let promo = [];
    if (campaign_id === "5") {
      cam = await ClientPromo.knex()
        .raw(`update client_promo set consumption_count=consumption_count+1 where
	 promo_code='${promo_code}' and consumption_count < total_count`);
    }
    else {
      cam = await ClientPromo.knex()
        .raw(`update client_promo set consumption_count=consumption_count+1 where
	campaign_id='${campaign_id}' and promo_code='${promo_code}' and consumption_count < total_count`);
    }

    if (cam[0].affectedRows == "0") {
      return { data: [], msg: "No promo code Found" };
    } else {
      // 		const promo = await ClientPromo.knex()
      // 			.raw(`select * from client_promo where campaign_id='${campaign_id}' and promo_code='${promo_code}';
      // `);
      // const promo = await ClientPromo.knex()
      // 			.raw(`select cp.*,coc.campaign_url  from client_promo as cp
      // 			join
      // 			 client_org_campaigns as coc on coc.campaign_id='${campaign_id}'
      // 			  where cp.campaign_id='${campaign_id}' and cp.promo_code='${promo_code}';
      // `);
      if (campaign_id === "5") {
        promo = await ClientPromo.knex()
          .raw(`select cp.*,coc.campaign_url  from client_promo as cp
			join
			 client_org_campaigns as coc on coc.campaign_id=cp.campaign_id
			  where  cp.promo_code='${promo_code}';`);
      } else {
        promo = await ClientPromo.knex()
          .raw(`select cp.*,coc.campaign_url  from client_promo as cp
			join
			 client_org_campaigns as coc on coc.campaign_id='${campaign_id}'
			  where cp.campaign_id='${campaign_id}' and cp.promo_code='${promo_code}';
`);
      }
      return { data: promo[0], msg: "promo  is redeemed" };
    }
  } catch (err) {
    throw ApiError.internal(err);
  }
};


const assignCampaignPromoServices = async (obj) => {
  try {
    const { campaign_id } = obj;

    promo = await ClientPromo.knex()
      .raw(`select promo_code,cp.expires_at,coc.campaign_url from client_promo
      as cp
      join client_org_campaigns as coc on coc.campaign_id=cp.campaign_id
        where
            cp.campaign_id='${campaign_id}' and cp.assigned=0  and cp.expires_at >= now() limit 1;`);

    update = await ClientPromo.knex()
      .raw(` update client_promo set assigned=1 where promo_code='${promo[0][0].promo_code}' and campaign_id='${campaign_id}'`);

    return { data: promo[0], msg: "promo  is Assigned" };

  } catch (err) {
    throw ApiError.internal(err);
  }
};




const getPromo = async (campaign_id) => {
  try {
    // const promo = await ClientPromo.query()
    // 	.where("campaign_id",'=', campaign_id)
    // 	.where("is_deleted",'=', 0)
    // 	.where("status",'=',1)
    // 	.where("total_count",'>', "consumption_count");
    const promo = await ClientPromo.knex()
      .raw(`select * from client_promo where campaign_id='${campaign_id}'
		and status=1 and is_deleted=0 and total_count>consumption_count limit 1
		`);

    return promo[0];
  } catch (err) {
    throw ApiError.internal(err);
  }
};

const getPromoByCampaign = async (id) => {
  try {
    // const promo= await cam_batch.query().select()
    // .withGraphFetched({
    //     'promo_codes': true
    // }).where("campaign_batch_id","=",id)
    // .where("is_deleted",'=',0);
    const promo = await ClientPromo.query()
      .where("campaign_batch_id", "=", id)
      .where("is_deleted", "=", 0);

    if (!promo) {
      throw ApiError.internal(null, "Promo code not found");
    }

    return { data: promo, msg: "all promo code" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const getAllbatchServices = async () => {
  try {
    const batch = await cam_batch.knex()
      .raw(`select  coc.name as campaign_name,co.name as client_name,cb.* from campaign_batch as cb
	 join client_org_campaigns as coc on coc.campaign_id =cb.campaign_id
	 join client_org as co on co.client_id=coc.client_id
	 where cb.status=1 and coc.is_deleted=0 and co.is_deleted=0`);

    if (!batch) {
      throw ApiError.internal(null, "batch not found");
    }
    return { data: batch[0], msg: "all promo batch" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const checkPromoServices = async (promo_code) => {
  try {
    // const batch = await cam_batch.query().select()
    // .where("status",'=',1);
    // const knex = cam_batch.knex();

    const batch = await cam_batch.knex()
      .raw(`select promo_code,campaign_id from client_promo where promo_code='${promo_code}' and total_count>consumption_count
	 and expires_at >= current_date() and status=1;`);
    if (batch[0].length < 1) {
      return { data: batch[0], msg: "promo not found " };
    } else {
      return { data: batch[0], msg: "promo found " };
    }
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const checkBinServices = async (obj) => {
  try {
    const { bin, campaign_id } = obj;
    if (!bin) throw ApiError.internal(null, "Bin number required.");
    if (!campaign_id) throw ApiError.internal(null, "Campaign id required.");

    let campaignId = [];
    if (campaign_id === "5") {
      campaignId = await CampaignBin.query()
        .select("campaign_id")
        .where("bin", "=", bin);
    } else {
      campaignId = await CampaignBin.query()
        .select("campaign_id")
        .where("bin", "=", bin)
        .where("campaign_id", "=", campaign_id);
    }
    if (!campaignId || campaignId.length == 0) {
      return { data: null, msg: "Invalid bin number or campaign id." };
    } else {
      const promo = await getPromo(campaignId[0].campaign_id);
      // console.log("promo", promo);
      if (!promo || Object.keys(promo).length < 1) {
        return {
          data: promo,
          msg: "Unable to fetch promocode. Invalid campaign id.",
        };
      }

      const promo_code = promo[0].promo_code;
      const data = {
        promo_code,
        campaign_id,
      };
      return { data, msg: "Valid bin number" };
    }
  } catch (err) {
    // console.log(err);
    throw ApiError.internal(err);
  }
};
const getAllcampaignServices = async () => {
  try {
    const campaigns = await cam_org
      .query()
      .select("name", "campaign_id", "client_id")
      .where("is_deleted", "=", 0);
    if (!campaigns) {
      throw ApiError.internal(null, "campaigns not found");
    }
    return { data: campaigns, msg: "all campaigns" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};
const removePromoServices = async (ids) => {
  try {
    const client = await ClientPromo.query()
      .patch({ is_deleted: 1 })
      .where("client_promo_id", "in", ids);
    if (!client) {
      throw ApiError.internal(null, "client not found");
    }

    return { data: client, msg: "client removed" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};

const removeBatchServices = async (id) => {
  try {
    const client = await cam_batch
      .query()
      .patch({ status: 0 })
      .where("campaign_batch_id", "=", id);
    if (!client) {
      throw ApiError.internal(null, "client not found");
    }

    return { data: client, msg: "client removed" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};

const checkPromoStatusServices = async (campaign_id, promo_code) => {
  try {
    const promocode = await ClientPromo.query()
      .select("status", "promo_code")
      .where("campaign_id", "=", campaign_id)
      .where("promo_code", "=", promo_code);
    if (promocode.length === 0 || !promocode) {
      throw ApiError.internal(null, "Invalid promocode or campaign_id");
    }

    let msg;
    if (promocode[0].status == 0) {
      msg = "Inactive";
    } else {
      msg = "Active";
    }
    return { data: promocode[0].promo_code, msg };
  } catch (err) {
    throw ApiError.internal(err);
  }
};

const activatePromoServices = async (campaign_id, promo_code) => {
  try {
    const promocode = await ClientPromo.query().findOne({
      campaign_id,
      promo_code,
    });
    if (!promocode) {
      throw ApiError.internal(null, "Invalid promocode or campaign id.");
    }
    if (promocode.status == 1) {
      throw ApiError.internal(
        null,
        "Unable to update. Promocode is already active."
      );
    }

    await ClientPromo.query()
      .patch({ status: 1 })
      .where("campaign_id", "=", campaign_id)
      .where("promo_code", "=", promo_code)
      .where("status", "=", 0);

    return { data: promo_code, msg: "Promocode activated" };
  } catch (err) {
    throw ApiError.internal(err);
  }
};

const updateConsumptionCountService = async (promocodeIds) => {
  try {
    const result = await ClientPromo.knex()
    .raw(`UPDATE client_promo SET consumption_count = consumption_count - 1, modified_at="${get_current_date()}" WHERE client_promo_id IN (${promocodeIds}) AND consumption_count>0 AND is_deleted=false`)
    
    console.log("updateConsumptionCountService:",result);
    return { data: {affectedRows: result.affectedRows}, msg: "Promocode consumption count updated successfully!" };
  } catch (err) {
    throw ApiError.internal(err);
  }
}

// const updateClientByIdServices = async (id,obj) => {
// try {

// 	const client = await ClientOrg.query().patchAndFetchById(id, obj);
//    if (!client) {
// 	   throw ApiError.internal(null, "client not found");
//    }

//    return{data:client,msg:"client updated!"};
// } catch (err) {
// 	throw ApiError.internal(err);
// }
// };

module.exports = {
  getPromoByCampaign,
  promoCreateServices,
  removePromoServices,
  getAllbatchServices,
  getAllcampaignServices,
  removeBatchServices,
  checkPromoServices,
  assignPromoServices,
  checkBinServices,
  checkPromoStatusServices,
  activatePromoServices,
  assignCampaignPromoServices,
  updateConsumptionCountService

  //updateClientByIdServices,
};
