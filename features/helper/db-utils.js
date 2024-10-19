const { readFileSync, writeFileSync, copyFileSync } = require("fs");

/**
 * Reads a JSON file from the given path and returns its content as a JSON object
 * @param {string} path - path to the JSON file
 * @returns {Object|null} - JSON object if read success, null if failed
 */
const Read = (path) => {
	try {
		const data = readFileSync(path, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Creates a new JSON file at the given path with the given data
 * @param {string} path - path to the JSON file
 * @param {Object} data - JSON data to be written to the file
 * @returns {Boolean} - true if success, false if failed
 */
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

/**
 * Creates a backup of the given JSON file by copying it to the same path
 * but with ".backup" appended to the filename
 * @param {string} path - path to the JSON file
 * @returns {Boolean} - true if success, false if failed
 */
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
