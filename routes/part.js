const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const PARTS_DB = require("../features/part-db");

// Get all parts
router.get("/", (req, res) => {
	res.send(STATUS.Ok(PARTS_DB.Fetch(), "Found Parts"));
});

// Add new part
// part: { name, prefix }
router.post("/", (req, res) => {
	const part = req.body;

	if (!PARTS_DB.IsPartValid(part))
		return res.send(STATUS.Bad("Data invalid"));

	// Create ID
	part.id = PARTS_DB.CreateId(part);
	if (PARTS_DB.IsPartExist(part.id))
		return res.send(STATUS.Bad("Part already exist"));

	if (!PARTS_DB.Add(part)) return res.send(STATUS.Bad("Failed to add part"));
	res.send(STATUS.Ok(PARTS_DB.Fetch(), "Added Part"));
});

// Delete part
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!PARTS_DB.IsPartExist(id))
		return res.send(STATUS.Bad("Part not exist"));
	if (!PARTS_DB.Delete(id))
		return res.send(STATUS.Bad("Failed to delete part"));
	res.send(STATUS.Ok(PARTS_DB.Fetch(), "Deleted Part"));
});

// Edit acc
router.put("/", (req, res) => {
	const part = req.body;

	if (!(PARTS_DB.IsPartValid(part) && Boolean(part.id)))
		return res.send(STATUS.Bad("Data invalid"));
	if (!PARTS_DB.IsPartExist(part.id))
		return res.send(STATUS.Bad("Part not exist"));

	// Edit part
	if (!PARTS_DB.Edit(part))
		return res.send(STATUS.Bad("Failed to edit part"));

	res.send(STATUS.Ok(PARTS_DB.Fetch(), "Edited Part"));
});

module.exports = router;
