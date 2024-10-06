const { readFileSync, writeFileSync, copyFileSync } = require("fs");

const Read = (path) => {
	try {
		const data = readFileSync(path, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.log(error);
		return null;
	}
};

const Create = (path, data) => {
	if (!data) return console.log("No Data Found");

	try {
		writeFileSync(path, JSON.stringify(data));
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

const Backup = (path) => {
	try {
		copyFileSync(path, path + ".backup");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

module.exports = {
	Read,
	Create,
	Backup
};
