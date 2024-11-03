const express = require("express");
const router = express.Router();
const { CreateGUID } = require("../features/helper/utils");

const STATUS = require("./status");
const PARTS_DB = require("../features/part-db");
const LOCATION_DB = require("../features/location-db");
const DUMMY_DB = require("../features/dummy-db");

// Get all parts
router.get("/", (req, res) => {
	res.status(200).send(STATUS.Ok(PARTS_DB.Fetch()));
});

// Get all part counter
router.get("/counter/:id", (req, res) => {
	const id = req.params.id;
	
	if (!PARTS_DB.IsPartIdExist(id))
		return res.status(400).send("Part not exist");

	const loc_counter = LOCATION_DB.GetLocationPartId(id).map(loc => loc.counter)
	const dum_counter = DUMMY_DB.GetByPartId(id).counter.map(dum => dum.value)
	const temp = [...loc_counter, ...dum_counter]
	const all_counter = [...new Set(temp)].sort((a, b) => a - b)
	res.status(200).send(STATUS.Ok(all_counter));
})

// Add new part
// part: { name, prefix }
router.post("/", (req, res) => {
	const part = req.body;

	if (!PARTS_DB.IsPartValid(part))
		return res.status(400).send("Data invalid");

	// Create ID
	part.id = CreateGUID();
	if (PARTS_DB.IsPartExist(part))
		return res.status(400).send("Part already exist");

	if (!PARTS_DB.Add(part)) return res.status(400).send("Failed to add part");
	res.status(200).send(STATUS.Ok(PARTS_DB.Fetch(), "Added Part"));
});

// Delete part
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!PARTS_DB.IsPartIdExist(id))
		return res.status(400).send("Part not exist");
	if (!PARTS_DB.Delete(id))
		return res.status(400).send("Failed to delete part");
	res.status(200).send(STATUS.Ok(PARTS_DB.Fetch(), "Deleted Part"));
});

// Edit part
router.put("/", (req, res) => {
	const part = req.body;

	if (!(PARTS_DB.IsPartValid(part) && Boolean(part.id)))
		return res.status(400).send("Data invalid");
	if (!PARTS_DB.IsPartIdExist(part.id))
		return res.status(400).send("Part not exist");
	if (PARTS_DB.IsPartExist(part))
		return res.status(400).send("Part already exist");

	// Edit part
	if (!PARTS_DB.Edit(part))
		return res.status(400).send("Failed to edit part");

	res.status(200).send(STATUS.Ok(PARTS_DB.Fetch(), "Edited Part"));
});

// Backup part
router.get("/backup", (req, res) => {
	if (!PARTS_DB.Backup())
		return res.status(400).send("Failed to backup part");
	res.status(200).send(STATUS.Ok(PARTS_DB.Fetch(), "Backup part"));
});

module.exports = router;
