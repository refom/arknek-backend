import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

import LINK from "./acc_link.js";

// Dummy
// id : string
// created_at : string

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.DUMMY
)

let DATA = {};

const IsValid = (acc) => Boolean(
	acc.id_part &&
	acc.counter
);

const Fetch = () => {
	const NEW_DATA = {};
	DATA = Database.Read(PRIVATE_PATH) || {};

	Object.keys(DATA).forEach((id) => {
		NEW_DATA[id] = {
			...DATA[id],
			...LINK.GetByIdAcc(id),
		}
	})
	return NEW_DATA;
}

const Backup = () => {
	if (!Database.Backup(PRIVATE_PATH)) return Status.Fail("Failed to backup Dummy");
	return Status.Finish("Backup Dummy Success");
}

const Add = (acc) => {
	if (!IsValid(acc)) return Status.Fail("Data invalid");

	// Check counter exist
	if (LINK.IsCounterExist(acc.id_part, acc.counter)) return Status.Fail("Counter already exist");

	// Create ID
	acc.id = LINK.GenDummyID(acc.id_part);
	if (LINK.IsAccExist(acc.id)) return Status.Fail("Dummy already exist");

	// Save Acc Link
	acc.is_private = true;
	if (!LINK.Add(acc)) return Status.Fail("Failed to add Counter");

	// Create Data
	DATA[acc.id] = {
		created_at: new Date().toLocaleString()
	}

	// Save Dummy
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to add Dummy");
	return Status.Finish("Add Dummy Success");
}

const Delete = (id) => {
	// Check dummy exist
	if (!LINK.IsAccExist(id)) return Status.Fail("Dummy is not exist");

	// Delete Acc Link
	if (!LINK.Delete(id)) return Status.Fail("Failed to delete Counter");

	// Delete Dummy
	delete DATA[id];
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to delete Dummy");
	return Status.Finish("Delete Dummy Success");
}

const Reuse = (id) => {
	// Check dummy exist
	if (!LINK.IsAccExist(id)) return Status.Fail("Dummy is not exist");

	// Reuse Acc Link
	if (!LINK.Login(id)) return Status.Fail("Failed to reuse Counter");
	return Status.Finish("Reuse Dummy Success");
}

const Update = () => {
	const old_path = path.join(
		CONFIG.PRIVATE_PATH,
		"dummy.json"
	)

	DATA = {}
	const dummy = Database.Read(old_path)
	dummy.forEach(dum => {
		dum.counter.forEach(counter => {
			const id = LINK.GenDummyID(dum.part_id)
			const acc = {
				id: id,
				id_part: dum.part_id,
				counter: counter.value,
				last_login: counter.added_at,
				is_private: true,
			}

			if (!LINK.Add(acc)) return Status.Fail("Failed to add Counter");

			DATA[id] = {
				created_at: counter.added_at
			}
		})
	});

	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to update Dummy");
	return Status.Finish("Update Dummy Success");
}

export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Reuse,
	Update,
}