const DB = require("./helper/db-utils");
const CONFIG = require("../config");
const path = require("path");

const PARTS_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.LOCAL_DB,
	CONFIG.PARTS_DB
);
let PARTS = [];

/**
 * Check if a part is valid
 * @param {string} name - part name
 * @returns {Boolean} - true if valid, false if not
 */
const IsPartValid = (name) => Boolean(name);

/**
 * Check if a part exists in the database
 * @param {string} id - part id
 * @returns {Boolean} - true if exists, false if not
 */
const IsPartExist = (inputPart) => Boolean(PARTS.find(part => part.name === inputPart.name && part.prefix === inputPart.prefix));

const IsPartIdExist = (id) => Boolean(GetById(id));

/**
 * Get a part by its id
 * @param {string} id - part id
 * @returns {{ id: string, name: string, prefix: string }} - part data
 */
const GetById = (id) => PARTS.find((part) => part.id === id);

/**
 * Fetch all parts from the database
 * @returns {Array<{ id: string, name: string, prefix: string }>} - all parts
 */
const Fetch = () => PARTS = DB.Read(PARTS_PATH) || []

/**
 * Add a new part to database
 * @param {{ id: string, name: string, prefix: string }} part - part data: { id, name, prefix }
 * @returns {Boolean} - true if success, false if failed
 */
const Add = ({ id, name, prefix }) => {
	PARTS.push({ id, name, prefix });
	return DB.Create(PARTS_PATH, PARTS);
};

/**
 * Delete a part from database
 * @param {string} id - part id to be deleted
 * @returns {Boolean} - true if success, false if failed
 */
const Delete = (id) => {
	PARTS = PARTS.filter((part) => part.id !== id);
	return DB.Create(PARTS_PATH, PARTS);
};

/**
 * Edit an existing part in database
 * @param {{ id: string, name: string, prefix: string }} part - part data to be edited: { id, name, prefix }
 * @returns {Boolean} - true if success, false if failed
 */
const Edit = ({ id, name, prefix }) => {
	const part = PARTS.find((part) => part.id === id);
	if (!part) return false;

	part.name = name;
	part.prefix = prefix;
	return DB.Create(PARTS_PATH, PARTS);
};

const Backup = () => DB.Backup(PARTS_PATH);

module.exports = {
	IsPartValid,
	IsPartExist,
	IsPartIdExist,
	GetById,
	Fetch,
	Add,
	Delete,
	Edit,
	Backup
};
