//const mysql = require("mysql2");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
	development: {
		client: "mysql2",
		connection: {
		host: DB_HOST,
		user: DB_USER, // replace with your mysql username
		password: DB_PASSWORD, // replace with your mysql password
		database: DB_DATABASE
	  },
	  debug: true
	}
  };

// Initialize knex.
// const knexConfig = {
// 	client: "mysql2",
// 	useNullAsDefault: true,
// 	connection: {
// 		host: DB_HOST,
// 		user: DB_USER,
// 		password: DB_PASSWORD,
// 		database: DB_DATABASE,
// 	},
// };

//module.exports = knexConfig;