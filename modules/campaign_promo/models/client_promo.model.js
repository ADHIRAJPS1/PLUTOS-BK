const { Model } = require("objection");

class ClientPromo extends Model {
	static get tableName() {
		return "client_promo";
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
		return "client_promo_id";
	}
	static get campaignIdColumn() {
		return "campaign_id";
	}
	static get promoCodeColumn() {
		return "promo_code";
	}
	static get consumptionTypeColumn() {
		return "consumption_type";
	}
	static get consumptionCountColumn() {
		return "consumption_count";
	}
	static get batchIdColumn() {
		return "campaign_batch_id";
	}
	static get totalCountColumn() {
		return "total_count";
	}
	static get statusColumn() {
		return "status";
	}
	static get expiresAtColumn() {
		return "expires_at";
	}
	static get isDeletedColumn() {
		return "is_deleted";
	}
	static get modifiedAtColumn() {
		return "modified_at";
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

	//   static relationMappings = {
	//     order: {
	//       relation: Model.HasOneRelation,
	//       modelClass: Order,
	//       join: {
	//         from: 'customers.id',
	//         to: 'orders.customer_id'
	//       }
	//     }
	//   };
}

module.exports = ClientPromo;
