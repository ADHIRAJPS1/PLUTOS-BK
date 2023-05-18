const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const user1 = uuidv4();
const user2 = uuidv4();
const batch_id = uuidv4();
exports.seed = function (knex) {
	// Deletes ALL existing entries
	const client_id = uuidv4();
	//password-admin
	return knex("admins")
		.then(async () => {
			const salt = await bcrypt.genSalt();
			const password = async (pass) => {
				const hashedPassword = await bcrypt.hash(String(pass), salt);
				return hashedPassword;
			}

			return knex("admins").insert([
				{
					id: uuidv4(),
					name: "Rahul",
					email: "rahul@gmail.com",
					mobile: "9318462049",
					password: `${await password("admin")}`,
					created_at: "2022-12-16",
					modified_at: "2022-12-16",
					is_deleted: 0,
				},
				{
					id: uuidv4(),
					name: "Yadav",
					email: "yadav@gmail.com",
					mobile: "9717841330",
					password: `${await password("admin")}`,
					created_at: "2022-12-16",
					modified_at: "2022-12-16",
					is_deleted: 0,
				},
			]);
		})

		.then(() => {
			return knex("client_org")
				.del()
				.then(function () {
					// Inserts seed entries
					return knex("client_org").insert([
						{
							client_id: client_id,
							name: "NBT",
							logo: "/images",
							icon: "/images",
							slug: "/nbt",
							status: true,
							is_deleted: false,
						},
					]);
				});
		})
		.then(() => {
			return knex("client_org_campaigns")
				.del()
				.then(function () {
					// Inserts seed entries
					return knex("client_org_campaigns").insert([
						{
							client_org_campaigns_id: uuidv4(),
							client_id: client_id,
							campaign_id: "02de3116-fd71-493f-9b34-692b57018b5a",
							name: "NBT 2000",
							status: true,
							is_deleted: false,
						},
					]);
				});
		})
		.then(() => {
			return knex("campaign_batch")
				.del()
				.then(function () {
					// Inserts seed entries
					return knex("campaign_batch").insert([
						{
							campaign_batch_id: batch_id,
							campaign_id: "02de3116-fd71-493f-9b34-692b57018b5a",
							status: true,
							expires_at: "2026-02-16 00:00:00",
						},
					]);
				});
		})
		.then(() => {
			return knex("client_promo")
				.del()
				.then(function () {
					// Inserts seed entries
					return knex("client_promo").insert([
						{
							client_promo_id: uuidv4(),
							campaign_batch_id: batch_id,
							campaign_id: "02de3116-fd71-493f-9b34-692b57018b5a",
							promo_code: "nbt2000A",
							consumption_type: "multiple",
							consumption_count: 0,
							status: 0,
							total_count: 1000,
							expires_at: "2026-02-16 00:00:00",
							is_deleted: 0,
						},
					]);
				});
		})
		.then(() => {
			return knex("campaign_bin")
				.del()
				.then(function () {
					// Inserts seed entries
					return knex("campaign_bin").insert([
						{
							campaign_bin_id: uuidv4(),
							campaign_id: "02de3116-fd71-493f-9b34-692b57018b5a",
							bin: "123456",
							network: "rupay",
							status: true,
						},
					]);
				});
		});
};
