const DB = require("./helper/db-utils");
const CONFIG = require("../config");
const path = require("path");
const { CreateGUID } = require("./helper/utils");

const ACC_DB = require("./acc-db");
const LOCATION_DB = require("./location-db");

let SOLDS = []
const SOLD_PATH = path.join(CONFIG.ROOT_PATH, CONFIG.LOCAL_DB, CONFIG.SOLD_DB)

const GetById = (id) => SOLDS.find((sold) => sold.id === id)

const Fetch = () => SOLDS = DB.Read(SOLD_PATH) || [];

const Add = ({ id, sold }) => {
	const acc = ACC_DB.GetById(id)
	const loc = LOCATION_DB.GetById(id)

	// Add new sold
	SOLDS.push({
		id: CreateGUID(),
		acc_id: acc.id,
		operator: acc.operator,
		tag: acc.tag,
		story: acc.story,
		part_id: loc.part_id,
		counter: loc.counter,
		sold_date: new Date().toLocaleDateString(),
		edited_date: new Date().toLocaleDateString(),
		sold: sold
	})

	// Remove acc and location from DB
	ACC_DB.Delete(id)
	LOCATION_DB.Delete(id)

	return DB.Create(SOLD_PATH, SOLDS)
}

const Delete = (id) => {
	SOLDS = SOLDS.filter((sold) => sold.id !== id)
	return DB.Create(SOLD_PATH, SOLDS)
}

const Edit = (acc) => {
	const acc_sold = GetById(acc.id)
	if (!acc_sold) return false

	acc_sold.acc_id = acc.acc_id
	acc_sold.operator = acc.operator
	acc_sold.tag = acc.tag
	acc_sold.story = acc.story
	acc_sold.part_id = acc.part_id
	acc_sold.counter = acc.counter
	acc_sold.sold_date = acc.sold_date
	acc_sold.edited_date = new Date().toLocaleDateString()
	acc_sold.sold = acc.sold
	return DB.Create(SOLD_PATH, SOLDS)
}

module.exports = {
	Fetch,
	Add,
	Delete,
	Edit,
}
