const path = require("path")

const CONFIG = {
	PORT: 3000,
	DB_NAME: "db",
	DB_PATH: "",
	OPERATORS_NAME: "operators.json",
	OPERATORS_PATH: "",
}

CONFIG.DB_PATH = path.join(__dirname, CONFIG.DB_NAME)
CONFIG.OPERATORS_PATH = path.join(__dirname, CONFIG.DB_NAME, CONFIG.OPERATORS_NAME),


module.exports = CONFIG