import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";
import Status from "#src/utils/status.js";

// Counter
// number

// Counter Link
// id_acc : string
// id_part : string
// counter : number

const COUNTER_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.COUNTER
)

const COUNTER_LINK_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.COUNTER_LINK
)

let COUNTER = 0
let DATA = [];

const Fetch = () => (DATA = Database.Read(COUNTER_PATH) || []);
const Backup = () => {
	if (!Database.Backup(COUNTER_PATH)) return Status.Fail("Failed to backup Part");
	return Status.Finish("Backup Part Success");
}

export default {
	Fetch,
	Backup,
}
