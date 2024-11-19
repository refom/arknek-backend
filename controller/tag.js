import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";
import { CreateGUID } from "#src/utils/helper.js";

// Tag
// id : string
// name : string
// rarity : number
// description : string

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.TAG
)

let DATA = [];

const GetById = (id) => DATA.find((tg) => tg.id === id);
const IsValid = (tag) => Boolean(tag.name && tag.rarity);
const IsExist = (tag) => Boolean(DATA.find((tg) => tg.name === tag.name && tg.rarity === tag.rarity));
const IsIdExist = (id) => Boolean(GetById(id));

const Fetch = () => (DATA = Database.Read(PRIVATE_PATH) || []);
const Backup = () => {
	if (!Database.Backup(PRIVATE_PATH)) return Status.Fail("Failed to backup Tag");
	return Status.Finish("Backup Tag Success");
}

const Add = (tag) => {
	if (!IsValid(tag)) return Status.Fail("Data invalid");
	if (IsExist(tag)) return Status.Fail("Tag already exist");

	tag.id = CreateGUID();
	DATA.push(tag);
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to add Tag");
	return Status.Finish("Add Tag Success");
}

const Delete = (id) => {
	if (!IsIdExist(id)) return Status.Fail("Tag is not exist");

	DATA = DATA.filter((tg) => tg.id !== id);
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to delete Tag");
	return Status.Finish("Delete Tag Success");
}

const Edit = (tag) => {
	if (!IsValid(tag)) return Status.Fail("Data invalid");
	if (!IsIdExist(tag.id)) return Status.Fail("Tag is not exist");
	if (IsExist(tag)) return Status.Fail("Tag already exist");

	const pt = GetById(tag.id);
	pt.name = tag.name;
	pt.rarity = tag.rarity;
	pt.description = tag.description;

	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to edit Tag");
	return Status.Finish("Edit Tag Success");
}

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}
