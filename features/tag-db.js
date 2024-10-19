const DB = require("./helper/db-utils");
const CONFIG = require("../config");
const path = require("path");

const TAG_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_DB,
	CONFIG.TAG_DB
);
let TAGS = [];

const GetById = (id) => TAGS.find((tag) => tag.id === id);
const IsTagValid = ({ name, rarity }) => Boolean(name && rarity);
const IsTagExist = (id) => Boolean(GetById(id));
const Fetch = () => (TAGS = DB.Read(TAG_PATH) || []);

const Add = ({ id, name, rarity }) => {
	TAGS.push({ id, name, rarity });
	return DB.Create(TAG_PATH, TAGS);
};

const Delete = (id) => {
	TAGS = TAGS.filter((tag) => tag.id !== id);
	return DB.Create(TAG_PATH, TAGS);
};

const Edit = ({ id, name, rarity }) => {
	const tag = TAGS.find((tag) => tag.id === id);
	if (!tag) return false;

	tag.name = name;
	tag.rarity = rarity;
	return DB.Create(TAG_PATH, TAGS);
};

module.exports = {
	IsTagValid,
	IsTagExist,
	GetById,
	Fetch,
	Add,
	Delete,
	Edit,
}
