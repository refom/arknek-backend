import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.PRIVATE
)

let DATA = {}

const GetById = (id) => {
	const acc = DATA[id]
	return {
		tag: acc.tag,
		story: acc.story,
		six_op_length: acc.six_op_length,
		operator: acc.operator,
		orundum: acc.orundum,
		originite_prime: acc.originite_prime,
		hh_ticket: acc.hh_ticket,
		created_at: acc.created_at,
		updated_at: acc.updated_at
	}
}

const Fetch = () => (DATA = Database.Read(PRIVATE_PATH) || {})
const Backup = () => Database.Backup(PRIVATE_PATH)

const Add = (id, acc) => {
	DATA[id] = acc
	return Database.Write(PRIVATE_PATH, DATA)
}

const Delete = (id) => {
	delete DATA[id];
	return Database.Write(PRIVATE_PATH, DATA)
}

export default {
	GetById,
	Fetch,
	Backup,
	Add,
	Delete,
}
