const express = require("express");
var morgan = require("morgan");
const fs = require("fs");
const app = express();
var cors = require("cors");
const Knex = require("knex");
const knexConfig = require("./knexfile");
const {
	Model,
	ForeignKeyViolationError,
	ValidationError,
} = require("objection");

// Initialize knex.
const knex = Knex(knexConfig.development);

//Connecting to DataBase:
const connect = () => {
	Model.knex(knex);
	console.log("DB connected");
};

app.use(express.static("public"));
app.use(express.json({ extended: false }));
app.use(cors());
app.use(morgan(":method :status :url"));


const routes = "./modules";
fs.readdirSync(routes).forEach((file) => {
	fs.readdirSync(`${routes}/${file}/routes`).forEach((routesfile) => {
		if (routesfile !== "undefined" && routesfile.match(/routes.js/))
			require(`./modules/${file}/routes/${routesfile}`)(app);
	});
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
	connect();
	app.listen(PORT, () => console.log(`CBM Server is running on port ${PORT}`));
}

module.exports = app;
