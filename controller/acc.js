import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

// Account
// id : string
// created_at : string date
// updated_at : string date
// tag : [string]
// six_op_length : number
// story : string
// orundum : number
// originite_prime : number
// hh_ticket : number
// operator : [ {
// id : string,
// skin : string,
// elite : number,
// } ]

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.ACC.PUBLIC
);

let DATA = [];

const GetById = (id) => DATA.find((op) => op.id === id);
const IsValid = (operator) => Boolean(operator.id && operator.name && operator.rarity);
const IsExist = (id) => Boolean(GetById(id));


const Fetch = () => (DATA = Database.Read(PUBLIC_PATH) || []);
const Backup = () => {
	if (!Database.Backup(PUBLIC_PATH)) return Status.Fail("Failed to backup Operator");
	return Status.Finish("Backup Operator Success");
}

const Add = (operator) => {
	if (!IsValid(operator)) return Status.Fail("Data invalid");
	if (IsExist(operator.id)) return Status.Fail("Operator already exist");

	DATA.push(operator);
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Operator");
	return Status.Finish("Add Operator Success");
}

const Delete = (id) => {
	if (!IsExist(id)) return Status.Fail("Operator is not exist");

	DATA = DATA.filter((op) => op.id !== id);
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to delete Operator");
	return Status.Finish("Delete Operator Success");
}

const Edit = (operator) => {
	if (!IsValid(operator)) return Status.Fail("Data invalid");
	if (!IsExist(operator.oldId)) return Status.Fail("Current Operator is not exist");
	if (IsExist(operator.id)) return Status.Fail("Operator already exist");

	const op = GetById(operator.oldId);
	op.id = operator.id;
	op.name = operator.name;
	op.rarity = operator.rarity;
	op.limited = operator.limited;

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Operator");
	return Status.Finish("Edit Operator Success");
}

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}