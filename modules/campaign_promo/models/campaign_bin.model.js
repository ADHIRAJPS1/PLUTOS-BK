const { Model } = require("objection");
class CampaignBin extends Model {
	static get tableName() {
		return "campaign_bin";
	}

	$beforeInsert() {
		this.created_at = new Date();
		this.modified_at = new Date();
		this.status = 1;
	}

	$beforeUpdate() {
		this.modified_at = new Date();
	}

	static get idColumn() {
		return "campaign_bin_id";
	}
	static get campaignIdColumn() {
		return "campaign_id";
	}
	static get binColumn() {
		return "bin";
	}
	static get networkColumn() {
		return "network";
	}
	static get statusColumn() {
		return "status";
	}

	// static get jsonSchema() {
	// 	return {
	// 		type: "object",
	// 		required: ["user_id", "promo_code"],
	// 		properties: {
	// 			user_promo_id: { type: "string" },
	// 			user_id: { type: "string" },
	// 			promo_code_id: { type: "string", minLength: 1, maxLength: 60 },
	// 			promo_code: { type: "string", minLength: 1, maxLength: 50 },
	// 			campaign_id: { type: "string", minLength: 5, maxLength: 50 },
	// 		},
	// 	};
	// }
	// static get relationMappings() {
	// 	const ClientOrg = require("../../client_org/models/clients.model");
	// 	return {
	// 		promo_codes: {
	// 			relation: Model.HasManyRelation,

	// 			modelClass: client_promo,

	// 			join: {
	// 				from: "campaign_batch.campaign_batch_id",
	// 				to: "client_promo.campaign_batch_id",
	// 			},
	// 		},
	// 		client: {
	// 			relation: Model.BelongsToOneRelation,

	// 			// The related model. This can be either a Model subclass constructor or an
	// 			// absolute file path to a module that exports one.
	// 			modelClass: ClientOrg,

	// 			join: {
	// 				from: "client_org.client_id",
	// 				to: "client_org_campaigns.client_id",
	// 			},

	// 			// join: {
	// 			// 	       from: ClientOrg.idColumn,
	// 			// 	       to: ClientCampaign.clientIdColumn,
	// 			// 	     },
	// 		},
	// 		promo_codes: {
	// 			relation: Model.HasManyRelation,

	// 			// The related model. This can be either a Model subclass constructor or an
	// 			// absolute file path to a module that exports one.
	// 			modelClass: client_promo,

	// 			join: {
	// 				from: "campaign_batch.campaign_batch_id",
	// 				to: "client_promo.campaign_batch_id",
	// 			},

	// 			// join: {
	// 			// 	       from: ClientOrg.idColumn,
	// 			// 	       to: ClientCampaign.clientIdColumn,
	// 			// 	     },
	// 		},
	// 	};
	// }
}

module.exports = CampaignBin;
