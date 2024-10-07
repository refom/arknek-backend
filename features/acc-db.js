const DB = require("./db-utils");
const CONFIG = require("../config");
const path = require("path");

let ACCS = []
const ACC_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.PUBLIC_DB, CONFIG.ACC_DB)

/**
 * Check if the acc data is valid
 * @param {{ operator: string, part_id: string, counter: number, story: string }} acc - acc data to be checked
 * @returns {Boolean} - true if valid, false if invalid
 */
const IsAccValid = ({ operator, part_id, counter, story }) => Boolean(operator && part_id && counter && story);

/**
 * Check if the acc exists in database
 * @param {string} id - acc id to be checked
 * @returns {Boolean} - true if exists, false if not exist
 */
const IsAccExist = (id) => Boolean(ACCS.find((acc) => acc.id === id));

/**
 * Fetch all accs from database
 * @returns {Array.<{ id: string, operator: string, tag: string, story: string }>} - array of all accs
 */
const Fetch = () => ACCS = DB.Read(ACC_PATH) || [];

/**
 * Backup all accs to database
 * @returns {Boolean} - true if success, false if failed
 */
const Backup = () => DB.Backup(ACC_PATH);

/**
 * Add a new acc to database
 * @param {{ id: string, operator: string, tag: string, story: string }} acc - acc data to be added
 * @returns {Boolean} - true if success, false if failed
 */
const Add = ({ id, operator, tag, story }) => {
	ACCS.push({ id, operator, tag, story })
	return DB.Create(ACC_PATH, ACCS)
};

/**
 * Delete acc from database
 * @param {string} id - acc id to be deleted
 * @returns {Boolean} - true if success, false if failed
 */
const Delete = (id) => {
	ACCS = ACCS.filter((acc) => acc.id !== id)
	return DB.Create(ACC_PATH, ACCS)
};

/**
 * Edit an existing acc in database
 * @param {{ id: string, operator: string, tag: string, story: string }} acc - acc data to be edited
 * @returns {Boolean} - true if success, false if failed
 */
const Edit = ({ id, operator, tag, story }) => {
	const acc = ACCS.find((acc) => acc.id === id)
	if (!acc) return false

	acc.operator = operator
	acc.tag = tag
	acc.story = story
	return DB.Create(ACC_PATH, ACCS)
};

module.exports = {
	IsAccValid,
	IsAccExist,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}