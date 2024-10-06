const DB = require("./db-utils");
const CONFIG = require("../config");
const path = require("path");

let OPERATORS = []
const OPERATORS_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.PUBLIC_DB, CONFIG.OPERATORS_DB)

const FetchOperators = () => OPERATORS = DB.Read(OPERATORS_PATH) || [];

const IsOperatorValid = ({ id, name, rarity }) => Boolean(id && name && rarity);
const IsOperatorExist = (id) => Boolean(OPERATORS.find((op) => op.id === id));

const GetAll = () => {
	FetchOperators();
	return OPERATORS
}

const Add = ({ id, name, rarity }) => {
	OPERATORS.push({ id, name, rarity })
	return DB.Create(OPERATORS_PATH, OPERATORS)
}

const Delete = (id) => {
	OPERATORS = OPERATORS.filter((op) => op.id !== id)
	return DB.Create(OPERATORS_PATH, OPERATORS)
}

const Edit = ({ oldId, id, name, rarity }) => {
	const operator = OPERATORS.find((op) => op.id === oldId);
	if (!operator) return false

	operator.id = id
	operator.name = name
	operator.rarity = rarity
	return DB.Create(OPERATORS_PATH, OPERATORS)
}

const Backup = () => DB.Backup(OPERATORS_PATH)

module.exports = {
	FetchOperators,
	IsOperatorValid,
	IsOperatorExist,
	GetAll,
	Add,
	Delete,
	Edit,
	Backup
};
