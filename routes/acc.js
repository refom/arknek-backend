const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const ACC_DB = require("../features/acc-db");
const LOCATION_DB = require("../features/location-db");
const PARTS_DB = require("../features/part-db");
const SOLD_DB = require("../features/sold-db");

// Get all accs
router.get("/", (req, res) => {
	res.send(STATUS.Ok(ACC_DB.Fetch(), "Found Accs"));
});

// Get all locations
router.get("/location", (req, res) => {
	res.send(STATUS.Ok(LOCATION_DB.Fetch(), "Found Locations"));
})

// Add new acc
// acc: { operator, part_id, counter, story, tag }
router.post("/", (req, res) => {
	const acc = req.body;

	if (!ACC_DB.IsAccValid(acc)) return res.send(STATUS.Bad("Data invalid"));

	// Check if already Exist
	if (!PARTS_DB.IsPartExist(acc.part_id))
		return res.send(STATUS.Bad("Part not exist"));
	if (LOCATION_DB.IsCounterExist(acc.part_id, acc.counter))
		return res.send(STATUS.Bad("Counter already exist"));

	// Create ID
	acc.id = LOCATION_DB.GetNextAccId(acc.part_id);

	// Save part_id and counter to local DB
	if (!LOCATION_DB.Add(acc.id, acc.part_id, acc.counter))
		return res.send(STATUS.Bad("Failed to save location and counter"));
	
	// Save acc to public DB
	if (!ACC_DB.Add(acc)) return res.send(STATUS.Bad("Failed to add acc"));
	res.send(STATUS.Ok(ACC_DB.Fetch(), "Added Acc"));
});

// Delete acc
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!ACC_DB.IsAccExist(id)) return res.send(STATUS.Bad("Acc not exist"));

	// Delete acc from public DB
	if (!ACC_DB.Delete(id)) return res.send(STATUS.Bad("Failed to delete acc"));

	// Delete location and counter from local DB
	if (!LOCATION_DB.Delete(id))
		return res.send(STATUS.Bad("Failed to delete location and counter"));

	res.send(STATUS.Ok(ACC_DB.Fetch(), "Deleted Acc"));
});

// Edit acc
router.put("/", (req, res) => {
	const acc = req.body;

	if (!(ACC_DB.IsAccValid(acc) && Boolean(acc.id)))
		return res.send(STATUS.Bad("Data invalid"));
	if (!PARTS_DB.IsPartExist(acc.part_id))
		return res.send(STATUS.Bad("Part not exist"));
	if (!ACC_DB.IsAccExist(acc.id))
		return res.send(STATUS.Bad("Acc not exist"));

	// Edit location and counter from local DB
	if (!LOCATION_DB.Edit(acc))
		return res.send(STATUS.Bad("Failed to edit location and counter"));

	// Edit acc from public DB
	if (!ACC_DB.Edit(acc)) return res.send(STATUS.Bad("Failed to edit acc"));

	res.send(STATUS.Ok(ACC_DB.Fetch(), "Edited Acc"));
});

// Sold acc
router.post("/sold/", (req, res) => {
	const acc = req.body;

	if (!ACC_DB.IsAccExist(acc.id)) return res.send(STATUS.Bad("Acc not exist"));

	if (!SOLD_DB.Add(acc)) return res.send(STATUS.Bad("Failed to sold acc"));

	res.send(STATUS.Ok(ACC_DB.Fetch(), "Sold Acc"));
})

// Backup acc
router.get("/backup", (req, res) => {
	if (!ACC_DB.Backup())
		return res.send(STATUS.Bad("Failed to backup acc"));
	res.send(STATUS.Ok(ACC_DB.Fetch(), "Backup acc"));
});


module.exports = router;
