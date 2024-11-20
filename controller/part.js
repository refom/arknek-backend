import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";
import { CreateGUID } from "#src/utils/helper.js";

// Part - id : object
// name : string
// prefix : string

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.PART
)

let DATA = {};

const GetById = (id) => DATA[id];
const IsValid = (part) => Boolean(part.name);
const IsExist = (part) => Boolean(Object.values(DATA).find((pt) => pt.name === part.name && pt.prefix === part.prefix));
const IsIdExist = (id) => DATA.hasOwnProperty(id)

const Fetch = () => (DATA = Database.Read(PRIVATE_PATH) || {});
const Backup = () => {
	if (!Database.Backup(PRIVATE_PATH)) return Status.Fail("Failed to backup Part");
	return Status.Finish("Backup Part Success");
}

const Add = (part) => {
	if (!IsValid(part)) return Status.Fail("Data invalid");
	if (IsExist(part)) return Status.Fail("Part already exist");

	const id = CreateGUID();
	DATA[id] = part;
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to add Part");
	return Status.Finish("Add Part Success");
}

const Delete = (id) => {
	if (!IsIdExist(id)) return Status.Fail("Part is not exist");

	delete DATA[id];
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to delete Part");
	return Status.Finish("Delete Part Success");
}

const Edit = (part) => {
	if (!IsValid(part)) return Status.Fail("Data invalid");
	if (!IsIdExist(part.id)) return Status.Fail("Part is not exist");
	if (IsExist(part)) return Status.Fail("Part already exist");

	DATA[part.id] = part
	delete DATA[part.id].id
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to edit Part");
	return Status.Finish("Edit Part Success");
}

// const UpdateStructure = () => {
// 	const old = Database.Read(PRIVATE_PATH);
// 	DATA = {}

// 	old.forEach(part => {
// 		DATA[part.id] = {
// 			name: part.name,
// 			prefix: part.prefix
// 		}
// 	});
// 	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to update Part");
// 	return Status.Finish("Update Part Success");
// }

export default {
	GetById,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
	// UpdateStructure
}
