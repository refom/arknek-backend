import path from "path"
import CONFIG from "#src/config.js"
import Database from "#src/utils/database.js";

// Acc Detail
// id : string
// name : string
// level : number
// lmd : number
// description : string
// image : [ {
//  	name : string,
//  	link : string,
//  	description : string,
// } ]

const PUBLIC_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.PUBLIC_PATH,
	CONFIG.DB.ACC.DETAIL
)

const PRIVATE_PATH = path.join(
	CONFIG.PRIVATE_PATH,
	CONFIG.DB.ACC.DETAIL
)

let DATA = {}
let DATA_PRIVATE = {}

const Build = (acc) => {
	return {
		name: acc.name,
		level: acc.level,
		lmd: acc.lmd,
		description: acc.description,
		image: acc.image
	}
}

const Remove = (acc) => {

}

const Fetch = (is_private) => {
	const path = is_private ? PRIVATE_PATH : PUBLIC_PATH;
	let detail = Database.Read(path);
	if (detail === null) {
		detail = {};
		Database.Write(path, detail);
	}

	is_private ? DATA_PRIVATE = detail : DATA = detail
	return detail;
}
const Backup = () => (Database.Backup(PRIVATE_PATH) && Database.Backup(PUBLIC_PATH))

const Add = (acc) => {
	const detail = acc.is_private ? DATA_PRIVATE : DATA;
	detail[acc.id] = Build(acc);
	return Database.Write(acc.is_private ? PRIVATE_PATH : PUBLIC_PATH, detail);
}

const Delete = (id, is_private) => {
	const detail = is_private ? DATA_PRIVATE : DATA
	delete detail[id];
	return Database.Write(is_private ? PRIVATE_PATH : PUBLIC_PATH, detail)
}

const Edit = (acc, old_link) => {
	const target = acc.is_private ? DATA_PRIVATE : DATA;
	const old_target = old_link.is_private ? DATA_PRIVATE : DATA;

	if (target !== old_target) {
		delete old_target[acc.id];
		Database.Write(old_link.is_private ? PRIVATE_PATH : PUBLIC_PATH, old_target);
	}

	target[acc.id] = Build(acc);
	return Database.Write(acc.is_private ? PRIVATE_PATH : PUBLIC_PATH, target);
}


export default {
	Fetch,
	Backup,
	Add,
	Delete,
	Edit,
}
