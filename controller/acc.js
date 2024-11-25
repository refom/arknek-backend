import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

import PRIVATE from "./acc_private.js";
import LINK from "./acc_link.js";
import DETAIL from "./acc_detail.js";
import OPERATOR from "./operator.js";

// Account
// id : string
// six_op_length : number
// created_at : string date
// updated_at : string date
// id_part : string
// counter : number
// tag : [string]
// story : string
// orundum : number
// originite_prime : number
// hh_ticket : number
// is_private : boolean
// operator : [ {
//  	id : string,
//  	skin : string,
//  	elite : number,
//  	pot : number
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

const Remove = (id) => {
	delete DATA[id];
	return Database.Write(PUBLIC_PATH, DATA)
}

const Build = (acc) => {
	return {
		tag: acc.tag,
		story: acc.story,
		six_op_length: OPERATOR.CountSixOp(acc.operator),
		operator: acc.operator,
		orundum: acc.orundum,
		originite_prime: acc.originite_prime,
		hh_ticket: acc.hh_ticket,
	}
}

const Fetch = (is_private = false) => {
	const NEW_DATA = {};
	const acc = is_private ? PRIVATE.Fetch() : DATA = Database.Read(PUBLIC_PATH) || {};

	Object.keys(acc).forEach((id) => {
		NEW_DATA[id] = {
			...acc[id],
			...LINK.GetByIdAcc(id),
		}
	})
	return NEW_DATA
}

const Backup = () => {
	// Backup Acc Link
	if (!LINK.Backup()) return Status.Fail("Failed to backup Acc Link");

	// Backup Acc Detail
	if (!DETAIL.Backup()) return Status.Fail("Failed to backup Acc Detail");

	// Backup Account
	if (!PRIVATE.Backup()) return Status.Fail("Failed to backup Private Account");
	if (!Database.Backup(PUBLIC_PATH)) return Status.Fail("Failed to backup Public Account");
	return Status.Finish("Backup Account Success");
}

const Add = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");

	// Check counter exist
	if (LINK.IsCounterExist(acc.id_part, acc.counter)) return Status.Fail("Counter already exist");

	// Create ID
	acc.id = LINK.GenPublicID(acc.id_part);
	if (LINK.IsAccExist(acc.id)) return Status.Fail("Account already exist");

	// Save Acc Link
	if (!LINK.Add(acc)) return Status.Fail("Failed to add Counter");

	// Save Acc Detail
	if (!DETAIL.Add(acc)) return Status.Fail("Failed to add Detail");

	// Create Data
	const NEW_ACC = Build(acc)
	NEW_ACC.created_at = new Date().toLocaleString()
	NEW_ACC.updated_at = new Date().toLocaleString()

	// Save Account Private or Public
	if (acc.is_private) {
		if (!PRIVATE.Add(acc.id, NEW_ACC)) return Status.Fail("Failed to add Account");
	} else {
		DATA[acc.id] = NEW_ACC;
		if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to add Account");
	}
	
	return Status.Finish("Add Account Success");
}

const Delete = (id) => {
	if (!LINK.IsAccExist(id)) return Status.Fail("Account is not exist");
	const acc = LINK.GetByIdAcc(id);

	// Delete Acc Link
	if (!LINK.Delete(id)) return Status.Fail("Failed to delete Counter");

	// Delete Acc Detail
	if (!DETAIL.Delete(id, acc.is_private)) return Status.Fail("Failed to delete Detail");

	// Delete Acc
	if (acc.is_private) {
		if (!PRIVATE.Delete(id)) return Status.Fail("Failed to delete Account");
	} else {
		delete DATA[id];
		if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to delete Account");
	}

	return Status.Finish("Delete Account Success");
}

const Edit = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");
	if (!LINK.IsAccExist(acc.id)) return Status.Fail("Account is not exist");
	
	// Check counter exist
	if (LINK.IsCounterExist(acc.id_part, acc.counter, acc.id)) return Status.Fail("Counter already exist");
	
	// Edit Acc Link
	const old_link = LINK.GetByIdAcc(acc.id)
	if (!LINK.Edit(acc)) return Status.Fail("Failed to edit Counter Account");

	// Edit Acc Detail
	if (!DETAIL.Edit(acc, old_link)) return Status.Fail("Failed to edit Detail Account");

	// Edit Account
	const old_acc = old_link.is_private ? PRIVATE.GetById(acc.id) : DATA[acc.id]

	const EDITED_ACC = Build(acc)
	EDITED_ACC.created_at = old_acc.created_at
	EDITED_ACC.updated_at = new Date().toLocaleString()

	// Edit Account Private or Public
	if (acc.is_private) {
		if (!old_link.is_private) {
			if (!Remove(acc.id)) Status.Fail("Failed to edit > delete Public Account");
		}
		if (!PRIVATE.Add(acc.id, EDITED_ACC)) return Status.Fail("Failed to edit Private Account");
	} else {
		if (old_link.is_private) {
			if (!PRIVATE.Delete(acc.id)) Status.Fail("Failed to edit > delete Private Account");
		}
		DATA[acc.id] = EDITED_ACC;
		if (!Database.Write(PUBLIC_PATH, DATA)) return Status.Fail("Failed to edit Public Account");
	}

	return Status.Finish("Edit Account Success");
}

const Ping = () => {
	// DATA = {}
	// const old = Database.Read(PUBLIC_PATH);

	// Object.keys(old).forEach(acc => {
	// 	console.log(old[acc].operator.map(op => {
	// 		return {
	// 			id: op.id,
	// 			skin: ["0"],
	// 			elite: 0
	// 		}
	// 	}))
	// })
	return Status.Finish("Ping Acc");
}


// const Update = () => {
// 	// DATA = {}
// 	// const old = Database.Read(PUBLIC_PATH);
// 	DATA = Database.Read(PUBLIC_PATH);

// 	Object.keys(DATA).forEach(acc => {
// 		// const operator = acc.operator.map(op => {
// 		// 	return {
// 		// 		id: op,
// 		// 		skin: ["0"],
// 		// 		elite: 0,
// 		// 		pot: 0,
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
// 				elite: 0,
// 				pot: 0,
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
	// Update,
}