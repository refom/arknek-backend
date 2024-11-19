const DB = require("./helper/db-utils");
const CONFIG = require("../config").default;
const path = require("path");

const PARTS_DB = require("./part-db");

const DUMMY_PATH = path.join(
	CONFIG.ROOT_PATH,
	CONFIG.LOCAL_PATH,
	CONFIG.DUMMY_DB
);
let DUMMYS = [];


const GetByPartId = (id) => DUMMYS.find((dummy) => dummy.part_id === id);
const IsDummyValid = ({ part_id, counter }) => Boolean(part_id && counter);
const IsDummyCounterExist = (id, counter) => {
	const dumdum = GetByPartId(id);
	if (!dumdum) return false;
	return Boolean(dumdum.counter.find((c) => c.value === counter));
}
const Fetch = () => {
	DUMMYS = DB.Read(DUMMY_PATH)
	if (!DUMMYS) {
		DUMMYS = [];
		const parts = PARTS_DB.Fetch();
		parts.forEach((part) => {
			DUMMYS.push({
				part_id: part.id,
				counter: [],
			});
		});
	};
	return DUMMYS
}

const Add = ({part_id, counter}) => {
	let dumdum = GetByPartId(part_id);
	if (!dumdum) {
		dumdum = { part_id, counter: [] };
		DUMMYS.push(dumdum)
	}

	dumdum.counter.push({
		value: counter,
		added_at: new Date().toLocaleString(),
	});
	return DB.Create(DUMMY_PATH, DUMMYS);
};

const Delete = (part_id, counter) => {
	const dumdum = GetByPartId(part_id);
	if (!dumdum) return false;

	dumdum.counter = dumdum.counter.filter((c) => c.value !== counter);
	return DB.Create(DUMMY_PATH, DUMMYS);
};


module.exports = {
	GetByPartId,
	IsDummyValid,
	IsDummyCounterExist,
	Fetch,
	Add,
	Delete,
};
