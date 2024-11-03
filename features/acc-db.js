const DB = require("./helper/db-utils");
const CONFIG = require("../config");
const path = require("path");

const LOCATION_DB = require("./location-db");

let ACCS = []
const ACC_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.PUBLIC_DB, CONFIG.ACC_DB)

const GetById = (id) => ACCS.find((acc) => acc.id === id)

const GetAllWithLocation = () => {
	const acc_data = Fetch();
	const location_data = LOCATION_DB.Fetch();
	const result = []

	acc_data.forEach(acc => {
		const loc = location_data.find(loc => loc.id === acc.id)
		result.push({
			id: acc.id,
			part_id: loc.part_id,
			counter: loc.counter,
			story: acc.story,
			tag: acc.tag,
			six_op_length: acc.six_op_length,
			operator: acc.operator,
			created_at: acc.created_at,
			updated_at: acc.updated_at,
		});
	})
	return result
}

/**
 * Check if the acc data is valid
 * @param {{ operator: string, part_id: string, counter: number, story: string }} acc - acc data to be checked
 * @returns {Boolean} - true if valid, false if invalid
 */
const IsAccValid = ({ operator, part_id, counter, story, six_op_length }) => Boolean(operator && part_id && counter && story && six_op_length);

/**
 * Check if the acc exists in database
 * @param {string} id - acc id to be checked
 * @returns {Boolean} - true if exists, false if not exist
 */
const IsAccExist = (id) => Boolean(GetById(id));


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
const Add = ({ id, operator, six_op_length, tag, story }) => {
	ACCS.push({
		id,
		operator,
		six_op_length,
		tag,
		story,
		created_at: new Date().toLocaleString(),
		updated_at: new Date().toLocaleString()
	})
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
const Edit = ({ id, operator, six_op_length, tag, story }) => {
	const acc = GetById(id)
	if (!acc) return false

	acc.operator = operator
	acc.six_op_length = six_op_length
	acc.tag = tag
	acc.story = story
	acc.updated_at = new Date().toLocaleString()
	return DB.Create(ACC_PATH, ACCS)
};


module.exports = {
	GetAllWithLocation,
	GetById,
	IsAccValid,
	IsAccExist,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}