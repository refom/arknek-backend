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

const GenPublicID = (id_part) => {
	const part_name = PART.GetById(id_part).name
	const counter = COUNTER.Add(CONFIG.COUNTER_TYPE.PUBLIC)
	return CONFIG.ID_CODE.PUBLIC + part_name.substring(0, 3).toUpperCase() + counter.toString().padStart(4, '0')
}

const GetByIdAcc = (id_acc) => {
	const acc = DATA.find((link) => link.id_acc === id_acc)
	return {
		id_part: acc?.id_part,
		counter: acc?.counter,
		last_login: acc?.last_login,
		is_private: acc?.is_private
	}
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

const Delete = (id_acc) => {
	DATA = DATA.filter((link) => link.id_acc !== id_acc)
	return Database.Write(PRIVATE_PATH, DATA)
}

const Edit = (acc) => {
	const acc = DATA.find((link) => link.id_acc === acc.id)

	acc.id_part = acc.id_part
	acc.counter = acc.counter
	acc.is_private = acc.is_private
	return Database.Write(PRIVATE_PATH, DATA)
}

export default {
	IsCounterExist,
	IsAccExist,
	GenPublicID,
	GetByIdAcc,
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}
