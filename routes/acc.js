const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const ACC_DB = require("../features/acc-db");
const LOCATION_DB = require("../features/location-db");
const PARTS_DB = require("../features/part-db");
const SOLD_DB = require("../features/sold-db");

// Get all accs
router.get("/", (req, res) => {
	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation()));
});

// Add new acc
// acc: { operator, part_id, counter, story, tag }
router.post("/", (req, res) => {
	const acc = req.body;

	if (!ACC_DB.IsAccValid(acc)) return res.status(400).send("Data invalid");

	// Check if already Exist
	if (!PARTS_DB.IsPartIdExist(acc.part_id))
		return res.status(400).send("Part not exist");
	if (LOCATION_DB.IsCounterExist(acc.part_id, acc.counter))
		return res.status(400).send("Counter already exist");

	// Create ID
	acc.id = LOCATION_DB.GetNextAccId(acc.part_id);

	// Check if already Exist
	if (ACC_DB.IsAccExist(acc.id))
		return res.status(400).send("Acc already exist");

	// Save part_id and counter to local DB
	if (!LOCATION_DB.Add(acc.id, acc.part_id, acc.counter))
		return res.status(400).send("Failed to save location and counter");
	
	// Save acc to public DB
	if (!ACC_DB.Add(acc)) return res.status(400).send("Failed to add acc");
	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Added Acc"));
});

// Delete acc
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!ACC_DB.IsAccExist(id)) return res.status(400).send("Acc not exist");

	// Delete acc from public DB
	if (!ACC_DB.Delete(id)) return res.status(400).send("Failed to delete acc");

	// Delete location and counter from local DB
	if (!LOCATION_DB.Delete(id))
		return res.status(400).send("Failed to delete location and counter");

	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Deleted Acc"));
});

// Edit acc
router.put("/", (req, res) => {
	const acc = req.body;

	if (!(ACC_DB.IsAccValid(acc) && Boolean(acc.id)))
		return res.status(400).send("Data invalid");
	if (!PARTS_DB.IsPartIdExist(acc.part_id))
		return res.status(400).send("Part not exist");
	if (!ACC_DB.IsAccExist(acc.id))
		return res.status(400).send("Acc not exist");

	// Edit location and counter from local DB
	if (!LOCATION_DB.Edit(acc))
		return res.status(400).send("Failed to edit location and counter");

	// Edit acc from public DB
	if (!ACC_DB.Edit(acc)) return res.status(400).send("Failed to edit acc");

	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Edited Acc"));
});

// Sold acc
router.post("/sold/", (req, res) => {
	const acc = req.body;

	if (!ACC_DB.IsAccExist(acc.id)) return res.status(400).send("Acc not exist");

	if (!SOLD_DB.Add(acc)) return res.status(400).send("Failed to sold acc");

	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Sold Acc"));
})

// Backup acc
router.get("/backup", (req, res) => {
	if (!ACC_DB.Backup()) return res.status(400).send("Failed to backup acc");
	if (!LOCATION_DB.Backup()) return res.status(400).send("Failed to backup acc");
	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Backup acc"));
});


module.exports = router;
