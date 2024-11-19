const DB = require("./helper/db-utils");
const CONFIG = require("../config").default;
const path = require("path");

let COUNTER = 0
const COUNTER_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.LOCAL_PATH, CONFIG.COUNTER_DB)

/**
 * Fetch current counter value from database
 * @returns {number} - current counter value
 */
const Fetch = () => COUNTER = DB.Read(COUNTER_PATH) || 0;

/**
 * Increase counter value by 1 and save it to database
 * @returns {number} - new counter value
 */
const Add = () => {
	COUNTER = Fetch() + 1
	DB.Create(COUNTER_PATH, COUNTER)
	return COUNTER
}

/**
 * Reset counter value to 1 and save it to database
 * @returns {number} - current counter value (1)
 */
const Reset = () => {
	COUNTER = 1;
	return DB.Create(COUNTER_PATH, COUNTER);
}

module.exports = {
	Fetch,
	Add,
	Reset,
}
