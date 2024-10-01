const { writeFile, existsSync, mkdirSync } = require("fs");

const checkDB = (DB_PATH) => {
	if (!existsSync(DB_PATH)) {
		mkdirSync(DB_PATH, { recursive: true });
	}
};

const checkFile = (OPERATORS_PATH) => {
	if (!existsSync(OPERATORS_PATH)) {
		writeFile(OPERATORS_PATH, JSON.stringify([]), (err) => {
			if (err) {
				console.log(err);
			}
		});
	}
};

const getOperators = (CONFIG) => {
	checkDB(CONFIG.DB_PATH);
	checkFile(CONFIG.OPERATORS_PATH);

	// ambil data
	let OPERATORS = require(CONFIG.OPERATORS_PATH);
	// console.log(OPERATORS);
	return OPERATORS;
};

module.exports = {
	getOperators,
};
