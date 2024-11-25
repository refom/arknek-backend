import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

import PART from "./part.js";
import COUNTER from "./counter.js";

// Acc Link : array
// id_acc : string
// id_part : string
// counter : number
// last_login : string date
// is_private : boolean

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.LINK
)

let DATA = []

const IsCounterExist = (id_part, counter, id_acc) => {
	const part_counter = DATA.filter((link) => link.id_part === id_part)
	// Check if counter exists without matching id_acc
	return part_counter.some((link) => link.counter === counter && link.id_acc !== id_acc)
}

const IsAccExist = (id_acc) => DATA.some((link) => link.id_acc === id_acc)

const GenID = (id_code, id_part, counter_type) => {
	const part_name = PART.GetById(id_part).name
	const counter = COUNTER.Add(counter_type)
	return id_code + part_name.substring(0, 3).toUpperCase() + counter.toString().padStart(6, '0')
}

const GenPublicID = (id_part) => GenID(CONFIG.ID_CODE.PUBLIC, id_part, CONFIG.COUNTER_TYPE.PUBLIC)
const GenDummyID = (id_part) => GenID(CONFIG.ID_CODE.DUMMY, id_part, CONFIG.COUNTER_TYPE.DUMMY)

const GetByIdAcc = (id_acc) => {
	const acc = DATA.find((link) => link.id_acc === id_acc)
	return {
		id_part: acc?.id_part,
		counter: acc?.counter,
		last_login: acc?.last_login,
		is_private: acc?.is_private
	}
}

const GetUnusedCounter = (id_part) => {
	const part_counter = DATA
		.filter((link) => link.id_part === id_part)
		.map((link) => link.counter)
		.sort((a, b) => a - b);

	const unused_counter = []

	for (let i = 0; i < part_counter.length; i++) {
		if (i >= part_counter.length - 1) {
			unused_counter.push(part_counter[i] + 1)
			break
		}

		const diff = part_counter[i + 1] - part_counter[i]
		if (diff > 1) unused_counter.push(part_counter[i] + 1)
	}

	return unused_counter
}

const Fetch = () => {
	DATA = Database.Read(PRIVATE_PATH)
	if (DATA !== null) return DATA;
	DATA = []
	Database.Write(PRIVATE_PATH, DATA)
	return DATA
}
const Backup = () => (Database.Backup(PRIVATE_PATH) && COUNTER.Backup())

const Add = (acc) => {
	DATA.push({
		id_acc: acc.id,
		id_part: acc.id_part,
		counter: acc.counter,
		last_login: new Date().toLocaleString(),
		is_private: acc.is_private
	})
	return Database.Write(PRIVATE_PATH, DATA)
}

const Delete = (id) => {
	DATA = DATA.filter((link) => link.id_acc !== id)
	return Database.Write(PRIVATE_PATH, DATA)
}

const Edit = (acc) => {
	const acc_data = DATA.find((link) => link.id_acc === acc.id)

	acc_data.id_part = acc.id_part
	acc_data.counter = acc.counter
	acc_data.is_private = acc.is_private
	return Database.Write(PRIVATE_PATH, DATA)
}

const Login = (id) => {
	// Check Acc exist
	if (!IsAccExist(id)) return Status.Fail("Account is not exist");

	// Update login Acc
	const acc = DATA.find((link) => link.id_acc === id)
	acc.last_login = new Date().toLocaleString()
	
	if (!Database.Write(PRIVATE_PATH, DATA)) return Status.Fail("Failed to Login Account");
	return Status.Finish("Login Account Success");
}

export default {
	IsCounterExist,
	IsAccExist,
	GenPublicID,
	GenDummyID,
	GetByIdAcc,
	GetUnusedCounter,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
	Login,
}
