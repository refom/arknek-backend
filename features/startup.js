const OPERATOR_DB = require("./operator-db");
const ACC_DB = require("./acc-db");
const LOCATION_DB = require("./location-db");
const COUNTER_DB = require("./counter-db");
const PARTS_DB = require("./part-db");
const TAG_DB = require("./tag-db");

const Startup = () => {
	console.log("Startup Fetch");
	console.log("- Operators");
	OPERATOR_DB.Fetch();

	console.log("- Acc");
	ACC_DB.Fetch();

	console.log("- Locations");
	LOCATION_DB.Fetch();

	console.log("- Parts");
	PARTS_DB.Fetch();

	console.log("- Counter");
	COUNTER_DB.Fetch();

	console.log("- Tag");
	TAG_DB.Fetch();
};

module.exports = Startup;
