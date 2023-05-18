exports.down = (knex) => {
	return knex.schema
		.dropTableIfExists("admins")
		.dropTableIfExists("client_org")
		.dropTableIfExists("client_org_campaigns")
		.dropTableIfExists("client_promo");
};

exports.up = async (knex) => {
	await knex.schema.createTable("client_org", (table) => {
		table.uuid("client_id").primary();
		table.string("name");
		table.string("logo");
		table.string("icon");
		table.string("slug");
		table.boolean("status");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
		table.boolean("is_deleted");
	});

	await knex.schema.createTable("client_org_campaigns", (table) => {
		table.uuid("client_org_campaigns_id").primary();
		table.uuid("campaign_id");
		table.string("name");
		table.boolean("status");
		table.boolean("is_deleted");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
	});

	await knex.schema.createTable("campaign_batch", (table) => {
		table.string("campaign_batch_id").primary();
		table.string("campaign_id");
		table.timestamp("expires_at");
		table.boolean("status");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
	});

	await knex.schema.createTable("client_promo", (table) => {
		table.string("client_promo_id").primary();
		table.string("promo_code");
		table.string("campaign_id");
		table.integer("consumption_count");
		table.string("consumption_type");
		table.integer("total_count");
		table.string("campaign_batch_id");
		table.string("status");
		table.timestamp("expires_at");
		table.boolean("is_deleted");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
	});

	await knex.schema.createTable("campaign_bin", (table) => {
		table.string("campaign_bin_id").primary();
		table.string("bin");
		table.string("campaign_id");
		table.string("network");
		table.boolean("status");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
	});

	await knex.schema.createTable("admins", (table) => {
		table.uuid("id").primary();
		table.string("name");
		table.string("email");
		table.string("mobile");
		table.string("password");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("modified_at").defaultTo(knex.fn.now());
		table.boolean("is_deleted");
	});
	await knex.schema.alterTable("client_org_campaigns", (table) => {
		table.uuid("client_id").references("client_id").inTable("client_org");
	});
	// await knex.schema.alterTable("client_promo", (table) => {
	// 	table.uuid("campaign_batch_id").references("campaign_batch").inTable("campaign_batch_id");
	// });
	// await knex.schema.alterTable("client_promo", (table) => {
	// 	table.uuid("campaign_id").references("campaign_id").inTable("client_org_campaigns");
	// });
	return true;
};
