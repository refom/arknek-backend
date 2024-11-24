import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

// Counter - counter_type : object
// public : number
// dummy : number
// gacha : number

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.COUNTER
)

let DATA = {}

const Fetch = () => {
	DATA = Database.Read(PRIVATE_PATH)
	if (DATA !== null) return DATA;
	DATA = {}
	Database.Write(PRIVATE_PATH, DATA)
	return DATA
}

const Backup = () => {
	if (!Database.Backup(PRIVATE_PATH)) return Status.Fail("Failed to backup Counter");
	return Status.Finish("Backup Counter Success");
}

const Add = (counter_type) => {
	DATA[counter_type] = Boolean(DATA[counter_type]) ? DATA[counter_type] + 1 : 1;
	Database.Write(PRIVATE_PATH, DATA)
	return DATA[counter_type]
}

export default {
	Fetch,
	Backup,
	Add,
}
