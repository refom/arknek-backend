import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";
import { CreateGUID } from "#src/utils/helper.js";

import ACC from "./acc.js";
import LINK from "./acc_link.js";

// Sold
// id : string
// sold : number
// sold_at : string date


const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.SOLD
)

let DATA = {};

const IsValid = (acc) => Boolean(
	acc.id &&
	acc.sold
);

const Fetch = () => (DATA = Database.Read(PRIVATE_PATH) || {});
const Backup = () => {
	if (!Database.Backup(PRIVATE_PATH)) return Status.Fail("Failed to backup Sold Acc");
	return Status.Finish("Backup Sold Acc Success");
}

const Add = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");
	if (!LINK.IsAccExist(acc.id)) return Status.Fail("Account is not exist");

	// Add new data
	const id = CreateGUID()
	const acc_data = ACC.GetById(acc.id)
	acc_data.id_acc = acc.id
	acc_data.sold = acc.sold
	acc_data.sold_at = new Date().toLocaleString()
	acc_data.updated_at = new Date().toLocaleString()
	DATA[id] = acc_data

	// Remove acc from DB
	const result = ACC.Delete(acc.id)
	if (!result.status) return Status.Fail(result.message);

	// Save
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to add Sold Account");
	return Status.Finish("Add Sold Account Success");
}

export default {
	Fetch,
	Backup,
	Add,
	// Delete,
	// Edit,
	// Ping,
	// Update,
}