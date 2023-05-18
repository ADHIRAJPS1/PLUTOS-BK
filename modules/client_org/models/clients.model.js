const { Model } = require("objection");

class ClientOrg extends Model {
	static get tableName() {
		return "client_org";
	}

	$beforeInsert() {
		this.created_at = new Date();
		this.modified_at = new Date();
		this.is_deleted=0;
		this.status=1;
	}

	$beforeUpdate() {
		this.modified_at = 
		new Date();
	}

	static get idColumn() {
		return "client_id";
	}
	static get nameColumn() {
		return "name";
	}
	static get logoColumn() {
		return "logo";
	}
	static get slugColumn() {
		return "slug";
	}
	static get statusColumn() {
		return "status";
	}
	static get is_deletedColumn() {
		return "is_deleted";
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

	
	// static relationMappings = {
	//   order: {
	//     relation: Model.HasOneRelation,
	//     modelClass: ClientCampaign,
	//     join: {
	//       from: 'client_org.client_id',
	//       to: 'client_org_campaigns.customer_id'
	//     }
	//   }
	// };

	static get relationMappings() {
		const {ClientCampaign}=require("../../assign_campaign/models/client_org_campaigns.model")

		// One way to prevent circular references
		// is to require the model classes here.
		//const Person = require('./Person')
	
		return {
		  owner: {
			relation: Model.HasOneRelation,
	
			// The related model. This can be either a Model subclass constructor or an
			// absolute file path to a module that exports one.
			modelClass: ClientCampaign,
	
			join: {
				       from: 'client_org.client_id',
				       to: 'client_org_campaigns.client_id'
				     },
		  },
		}
	  }

}

module.exports = ClientOrg;
