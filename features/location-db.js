const DB = require("./db-utils");
const CONFIG = require("../config");
const path = require("path");

const COUNTER_DB = require("./counter-db");
const PARTS_DB = require("./part-db");

const LOCATIONS_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.LOCAL_DB, CONFIG.LOCATIONS_DB)
let LOCATIONS = []

/**
 * Check if a part exists in the database
 * @param {string} id - part id to be checked
 * @returns {Boolean} - true if part exists, false if not
 */
const IsPartExist = (id) => Boolean(PARTS_DB.GetById(id))

/**
 * Fetch all locations from the database
 * @returns {Array<{ id: string, part_id: string, part_name: string, counter: number }>} - all locations
 */
const Fetch = () => LOCATIONS = DB.Read(LOCATIONS_PATH) || [];

/**
 * Generate the next acc id based on the part name and counter
 * @param {string} part_id - part id
 * @returns {string} - next acc id
 */
const GetNextAccId = (part_id) => {
	const part_name = PARTS_DB.GetById(part_id).name
	const counter = COUNTER_DB.Add()
	return "ARK" + part_name.substring(0, 3).toUpperCase() + counter.toString().padStart(4, '0')
}

/**
 * Save a new location to the database
 * @param {string} id - location id
 * @param {string} part_id - part id
 * @param {number} counter - counter value
 * @returns {Boolean} - true if success, false if failed
 */
const Save = (id, part_id, counter) => {
	const part_name = PARTS_DB.GetById(part_id).name
	LOCATIONS.push({ id, part_id, part_name, counter })
	return DB.Create(LOCATIONS_PATH, LOCATIONS)
}

/**
 * Delete a location from the database
 * @param {string} id - location id to be deleted
 * @returns {Boolean} - true if success, false if failed
 */
const Delete = (id) => {
	LOCATIONS = LOCATIONS.filter((loc) => loc.id !== id)
	return DB.Create(LOCATIONS_PATH, LOCATIONS)
}

/**
 * Edit an existing location in the database
 * @param {{ id: string, part_id: string, counter: number }} - location data to be edited
 * @returns {Boolean} - true if success, false if failed
 */
const Edit = ({ id, part_id, counter }) => {
	const loc = LOCATIONS.find((loc) => loc.id === id)
	if (!loc) return false

	const part_name = PARTS_DB.GetById(part_id).name
	loc.part_id = part_id
	loc.part_name = part_name
	loc.counter = counter
	return DB.Create(LOCATIONS_PATH, LOCATIONS)
}

module.exports = {
	IsPartExist,
	GetNextAccId,
	Fetch,
	Save,
	Delete,
	Edit,
}