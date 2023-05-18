const { Model } = require("objection");
const ClientOrg = require("../../client_org/models/clients.model")

class ClientCampaign extends Model {
	static get tableName() {
		return "client_org_campaigns";
	}

	$beforeInsert() {
		this.created_at = new Date();
		this.modified_at = new Date();
	}

	$beforeUpdate() {
		this.modified_at = new Date();
	}

	static get idColumn() {
		return "client_org_campaigns_id";
	}
	static get nameColumn() {
		return "name";
	}
	static get campaignIdColumn() {
		return "campaign_id";
	}
	static get statusColumn() {
		return "status";
	}
	static get isDeletedColumn() {
		return "is_deleted";
	}
	static get clientIdColumn() {
		return "client_id";
	}

	// static get jsonSchema() {
	// 	return {
	// 		type: "object",
	// 		required: ["mob_name"],
	// 		properties: {
	// 			mob_num: { type: "string", minLength: 10, maxLength: 12 },
	// 			timestamp: { type: "timestamp" },
	// 		},
	// 	};
	// }

	static get relationMappings() {

		// One way to prevent circular references
		// is to require the model classes here.
		//const Person = require('./Person')

		return {
			client: {
				relation: Model.BelongsToOneRelation,

				// The related model. This can be either a Model subclass constructor or an
				// absolute file path to a module that exports one.
				modelClass: ClientOrg,

				join: {
					from: 'client_org.client_id',
					to: 'client_org_campaigns.client_id'
				},

				// join: {
				// 	       from: ClientOrg.idColumn,
				// 	       to: ClientCampaign.clientIdColumn,
				// 	     },
			},
		}
	}



}

module.exports = ClientCampaign;
