import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

// Operator
// id : string
// name : string
// rarity : number
// limited : boolean

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.OPERATOR
);

let DATA = [];

const IsValid = ({ id, name, rarity }) => Boolean(id && name && rarity);
const IsExist = (id) => Boolean(DATA.find((op) => op.id === id));


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
	if (!IsExist(operator.id)) return Status.Fail("Operator is not exist");

	DATA = DATA.map((op) => op.id === operator.id ? operator : op);
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
