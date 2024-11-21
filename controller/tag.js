import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";
import { CreateGUID } from "#src/utils/helper.js";

// Tag - id : object
// name : string
// alias : string
// rarity : number
// description : string

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.TAG
)

let DATA = {};

const IsValid = (tag) => Boolean(tag.name && tag.rarity);
const IsExist = (tag) => Boolean(Object.values(DATA).find((tg) => tg.name === tag.name && tg.rarity === tag.rarity));
const IsIdExist = (id) => DATA.hasOwnProperty(id)

const Fetch = () => (DATA = Database.Read(PUBLIC_PATH) || {});
const Backup = () => {
	if (!Database.Backup(PUBLIC_PATH)) return Status.Fail("Failed to backup Tag");
	return Status.Finish("Backup Tag Success");
}

const Add = (tag) => {
	if (!IsValid(tag)) return Status.Fail("Data invalid");
	if (IsExist(tag)) return Status.Fail("Tag already exist");

	const id = CreateGUID();
	DATA[id] = tag;
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Tag");
	return Status.Finish("Add Tag Success");
}

const Delete = (id) => {
	if (!IsIdExist(id)) return Status.Fail("Tag is not exist");

	delete DATA[id];
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to delete Tag");
	return Status.Finish("Delete Tag Success");
}

const Edit = (tag) => {
	if (!IsValid(tag)) return Status.Fail("Data invalid");
	if (!IsIdExist(tag.id)) return Status.Fail("Tag is not exist");
	if (IsExist(tag)) return Status.Fail("Tag already exist");

	DATA[tag.id] = tag
	delete DATA[tag.id].id
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Tag");
	return Status.Finish("Edit Tag Success");
}

// const UpdateStructure = () => {
// 	const old = Database.Read(PUBLIC_PATH);
// 	DATA = {}

// 	old.forEach(tag => {
// 		DATA[tag.id] = {
// 			name: tag.name,
// 			rarity: tag.rarity,
// 			description: tag.description
// 		}
// 	});
// 	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to update Tag");
// 	return Status.Finish("Update Tag Success");
// }

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
	// UpdateStructure
}
