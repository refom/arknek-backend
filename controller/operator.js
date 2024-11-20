import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

// Operator : object
// id : string
// name : string
// rarity : number
// limited : boolean
// skin : [id_skin : string]

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.OPERATOR
);

let DATA = {};

const IsValid = (operator) => Boolean(
	operator.id &&
	operator.name &&
	operator.rarity &&
	operator.skin?.length
);
const IsExist = (id) => DATA.hasOwnProperty(id);


const Fetch = () => (DATA = Database.Read(PUBLIC_PATH) || {});
const Backup = () => {
	if (!Database.Backup(PUBLIC_PATH)) return Status.Fail("Failed to backup Operator");
	return Status.Finish("Backup Operator Success");
}

const Add = (operator) => {
	if (!IsValid(operator)) return Status.Fail("Data invalid");
	if (IsExist(operator.id)) return Status.Fail("Operator already exist");

	DATA[operator.id] = operator;
	delete DATA[operator.id].id
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Operator");
	return Status.Finish("Add Operator Success");
}

const Delete = (id) => {
	if (!IsExist(id)) return Status.Fail("Operator is not exist");

	delete DATA[id];
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to delete Operator");
	return Status.Finish("Delete Operator Success");
}

const Edit = (operator) => {
	if (!IsValid(operator)) return Status.Fail("Data invalid");
	if (!IsExist(operator.oldId)) return Status.Fail("Current Operator is not exist");
	if (IsExist(operator.id)) return Status.Fail("Operator already exist");

	if (operator.oldId !== operator.id) delete DATA[operator.oldId]
	DATA[operator.id] = operator
	delete DATA[operator.id].id
	delete DATA[operator.id].oldId

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Operator");
	return Status.Finish("Edit Operator Success");
}

// const UpdateOldData = () => {
// 	const old_data = Database.Read(PUBLIC_PATH);
// 	DATA = {}

// 	old_data.forEach(op => {
// 		DATA[op.id] = {
// 			id: op.id,
// 			name: op.name,
// 			rarity: op.rarity,
// 			limited: op.limited,
// 			skin: op.skin || ["0"]
// 		}
// 	});
// 	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Operator");
// 	return Status.Finish("Edit Operator Success");
// }

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
	// UpdateOldData,
}
