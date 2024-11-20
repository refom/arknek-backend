import { readFileSync, writeFileSync, copyFileSync, renameSync } from "fs";

class Database {
	/**
	 * Reads a JSON file from the given path and returns its content as a JSON object
	 * @param {string} path - path to the JSON file
	 * @returns {Object|null} - JSON object if read success, null if failed
	 */
	static Read(path) {
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
	static Write(path, data) {
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
	static Backup(path) {
		try {
			copyFileSync(path, path + ".backup");
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	static Rename(path, newPath) {
		try {
			renameSync(path, newPath);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}


export default Database;
