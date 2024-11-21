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

	Object.keys(acc_public).forEach((id) => {
		const acc_link = LINK.GetByIdAcc(id)
		DATA[id] = {
			...acc_public[id],
			id_part: acc_link?.id_part,
			counter: acc_link?.counter,
			last_login: acc_link?.last_login,
		}
	})
	return DATA
}

const Backup = () => {
	// Backup Acc Link
	if (!LINK.Backup()) return Status.Fail("Failed to backup Acc Link");

	// Backup Acc Detail

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

	// Save Acc Detail

	// Save Account
	DATA[id] = {
		tag: acc.tag,
		story: acc.story,
		six_op_length: acc.six_op_length,
		operator: acc.operator,
		orundum: acc.orundum,
		originite_prime: acc.originite_prime,
		hh_ticket: acc.hh_ticket,
		created_at: new Date().toLocaleString(),
		updated_at: new Date().toLocaleString(),
	}

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Account");
	return Status.Finish("Add Account Success");
}

const Delete = (id) => {
	if (!IsExist(id)) return Status.Fail("Account is not exist");

	// Delete Acc Link
	if (!LINK.Delete(id)) return Status.Fail("Failed to delete Counter");

	// Delete Acc Detail

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

	// Edit Acc Detail

	// Edit Account
	DATA[acc.id] = {
		tag: acc.tag,
		story: acc.story,
		six_op_length: acc.six_op_length,
		operator: acc.operator,
		orundum: acc.orundum,
		originite_prime: acc.originite_prime,
		hh_ticket: acc.hh_ticket,
		updated_at: new Date().toLocaleString(),
	}

	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Account");
	return Status.Finish("Edit Account Success");
}

const Ping = () => {
	DATA = {}
	const old = Database.Read(PUBLIC_PATH);

	Object.keys(old).forEach(acc => {
		console.log(old[acc].operator.map(op => {
			return {
				id: op.id,
				skin: ["0"],
				elite: 0
			}
		}))
	})
	return Status.Finish("Ping Acc");
}


// const UpdateStructure = () => {
// 	// DATA = {}
// 	// const old = Database.Read(PUBLIC_PATH);
// 	DATA = Database.Read(PUBLIC_PATH);

// 	Object.keys(DATA).forEach(acc => {
// 		// const operator = acc.operator.map(op => {
// 		// 	return {
// 		// 		id: op,
// 		// 		skin: ["0"],
// 		// 		elite: 0
// 		// 	}
// 		// })
// 		// DATA[acc.id] = {
// 		// 	tag: acc.tag,
// 		// 	story: acc.story,
// 		// 	six_op_length: acc.six_op_length,
// 		// 	operator: operator,
// 		// 	orundum: acc.orundum,
// 		// 	originite_prime: acc.originite_prime,
// 		// 	hh_ticket: acc.hh_ticket,
// 		// 	created_at: acc.created_at,
// 		// 	updated_at: acc.updated_at,
// 		// }
// 		DATA[acc].operator = DATA[acc].operator.map(op => {
// 			return {
// 				id: op.id,
// 				skin: ["0"],
// 				elite: 0
// 			}
// 		})
// 	});
// 	if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to update Acc");
// 	return Status.Finish("Update Acc Success");
// }

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
	Ping,
	// UpdateStructure,
}