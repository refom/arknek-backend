const DB = require("./helper/db-utils");
const CONFIG = require("../config");
const path = require("path");

let OPERATORS = [];
const OPERATORS_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_DB,
	CONFIG.OPERATORS_DB
);

/**
 * Check if the operator data is valid
 * @param {{ id: string, name: string, rarity: number }} operator - operator data to be checked
 * @returns {Boolean} - true if valid, false if invalid
 */
const IsOperatorValid = ({ id, name, rarity, limited }) => Boolean(id && name && rarity && limited);

/**
 * Check if the operator id exists in the database
 * @param {string} id - operator id to be checked
 * @returns {Boolean} - true if exist, false if not exist
 */
const IsOperatorExist = (id) => Boolean(OPERATORS.find((op) => op.id === id));

/**
 * Fetch all operators from database
 * @returns {Array.<{ id: string, name: string, rarity: number }>} - list of operators
 */
const Fetch = () => (OPERATORS = DB.Read(OPERATORS_PATH) || []);

/**
 * Backup operators to a file
 * @returns {Boolean} - true if success, false if failed
 */
const Backup = () => DB.Backup(OPERATORS_PATH);

/**
 * Add new operator to database
 * @param {{ id: string, name: string, rarity: number }} operator - operator data: { id, name, rarity }
 * @returns {Boolean} - true if success, false if failed
 */
const Add = ({ id, name, rarity }) => {
	OPERATORS.push({ id, name, rarity, limited });
	return DB.Create(OPERATORS_PATH, OPERATORS);
};

/**
 * Delete an operator from database
 * @param {string} id - operator id to be deleted
 * @returns {Boolean} - true if success, false if failed
 */
const Delete = (id) => {
	OPERATORS = OPERATORS.filter((op) => op.id !== id);
	return DB.Create(OPERATORS_PATH, OPERATORS);
};

/**
 * Edit an existing operator in database
 * @param {{ oldId: string, id: string, name: string, rarity: number }} operator - operator data to be edited: { oldId, id, name, rarity }
 * @returns {Boolean} - true if success, false if failed
 */
const Edit = ({ oldId, id, name, rarity, limited }) => {
	const operator = OPERATORS.find((op) => op.id === oldId);
	if (!operator) return false;

	operator.id = id;
	operator.name = name;
	operator.rarity = rarity;
	operator.limited = limited;
	return DB.Create(OPERATORS_PATH, OPERATORS);
};

module.exports = {
	IsOperatorValid,
	IsOperatorExist,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
};
