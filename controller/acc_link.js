import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";

import PART from "./part.js";
import COUNTER from "./counter.js";

// Acc Link : array
// id_acc : string
// id_part : string
// counter : number
// last_login : string date

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.LINK
)

let DATA = []

const IsCounterExist = (id_part, counter) => {
	const part_counter = DATA.filter((link) => link.id_part === id_part)
	return Boolean(part_counter.find((link) => link.counter === counter))
}

const GenPublicID = (id_part) => {
	const part_name = PART.GetById(id_part).name
	const counter = COUNTER.Add(CONFIG.COUNTER_TYPE.PUBLIC)
	return "ARK" + part_name.substring(0, 3).toUpperCase() + counter.toString().padStart(4, '0')
}

const GetByIdAcc = (id_acc) => DATA.find((link) => link.id_acc === id_acc)

const Fetch = () => (DATA = Database.Read(PRIVATE_PATH) || []);
const Backup = () => Database.Backup(PRIVATE_PATH)

const Add = (acc_link) => {
	DATA.push({
		id_acc: acc_link.id_acc,
		id_part: acc_link.id_part,
		counter: acc_link.counter,
		last_login: new Date().toLocaleString(),
	})
	return Database.Write(PRIVATE_PATH, DATA)
}

const Delete = (id_acc) => {
	DATA = DATA.filter((link) => link.id_acc !== id_acc)
	return Database.Write(PRIVATE_PATH, DATA)
}

const Edit = (acc_link) => {
	const acc = DATA.find((link) => link.id_acc === acc_link.id_acc)
	if (!acc) return false

	acc.id_part = acc_link.id_part
	acc.counter = acc_link.counter
	return Database.Write(PRIVATE_PATH, DATA)
}

export default {
	IsCounterExist,
	GenPublicID,
	GetByIdAcc,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}
