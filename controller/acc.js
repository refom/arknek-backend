import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

import LINK from "./acc_link.js";

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
//  	id : string,
//  	skin : string,
//  	elite : number,
// } ]

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.ACC.PUBLIC
);

let DATA = {};

const IsValid = (acc) => Boolean(
	acc.id_part &&
	acc.counter
);
const IsExist = (id) => DATA.hasOwnProperty(id);


const Fetch = () => {
	DATA = {};
	const acc_public = Database.Read(PUBLIC_PATH) || {}
	const link = LINK.Fetch();

	Object.keys(acc_public).forEach((id) => {
		DATA[id] = {
			...acc_public[id],
			...link.find((lk) => lk.id_acc === id)
		}
	})
	return DATA
}

const Backup = () => {
	// Backup Acc Link
	if (!LINK.Backup()) return Status.Fail("Failed to backup Acc Link");
	// Backup Account
	if (!Database.Backup(PUBLIC_PATH)) return Status.Fail("Failed to backup Account");
	return Status.Finish("Backup Account Success");
}

const Add = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");

	// Check counter exist
	if (LINK.IsCounterExist(acc.id_part, acc.counter)) return Status.Fail("Counter already exist");

	// Create ID
	const id = LINK.GenPublicID(acc.id_part);
	if (IsExist(id)) return Status.Fail("Account already exist");

	// Save Acc Link
	const acc_link = {
		id_acc: id,
		id_part: acc.id_part,
		counter: acc.counter
	}
	if (!LINK.Add(acc_link)) return Status.Fail("Failed to add Counter");

	// Save Account
	DATA[id] = acc
	delete DATA[id].id_part
	delete DATA[id].counter
	DATA[id].created_at = new Date().toLocaleString()
	DATA[id].updated_at = new Date().toLocaleString()

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Account");
	return Status.Finish("Add Account Success");
}

const Delete = (id) => {
	if (!IsExist(id)) return Status.Fail("Account is not exist");

	// Delete Acc Link
	if (!LINK.Delete(id)) return Status.Fail("Failed to delete Counter");

	// Delete Account
	delete DATA[id];
	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to delete Account");
	return Status.Finish("Delete Account Success");
}

const Edit = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");
	if (!IsExist(acc.id)) return Status.Fail("Account is not exist");

	// Check counter exist
	if (LINK.IsCounterExist(acc.id_part, acc.counter)) return Status.Fail("Counter already exist");

	// Edit Acc Link
	const acc_link = {
		id_acc: acc.id,
		id_part: acc.id_part,
		counter: acc.counter
	}
	if (!LINK.Edit(acc_link)) return Status.Fail("Failed to edit Counter Account");

	// Edit Account
	DATA[acc.id] = acc
	delete DATA[acc.id].id
	delete DATA[acc.id].id_part
	delete DATA[acc.id].counter
	DATA[acc.id].updated_at = new Date().toLocaleString()

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Account");
	return Status.Finish("Edit Account Success");
}

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}