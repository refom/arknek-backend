const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const TAG_DB = require("../features/tag-db");
const { CreateGUID } = require("../features/utils");

// Get all tags
router.get("/", (req, res) => {
	res.send(STATUS.Ok(TAG_DB.Fetch(), "Found Parts"));
});

// Add new tags
router.post("/", (req, res) => {
	const tag = req.body;

	if (!TAG_DB.IsTagValid(tag))
		return res.send(STATUS.Bad("Data invalid"));

	// Create ID
	tag.id = CreateGUID();

	if (!TAG_DB.Add(tag)) return res.send(STATUS.Bad("Failed to add tag"));
	res.send(STATUS.Ok(TAG_DB.Fetch(), "Added Tag"));
});

// Delete tag
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!TAG_DB.IsTagExist(id))
		return res.send(STATUS.Bad("Tag not exist"));
	if (!TAG_DB.Delete(id))
		return res.send(STATUS.Bad("Failed to delete tag"));
	res.send(STATUS.Ok(TAG_DB.Fetch(), "Deleted Tag"));
});

// Edit acc
router.put("/", (req, res) => {
	const tag = req.body;

	if (!(TAG_DB.IsTagValid(tag) && Boolean(tag.id)))
		return res.send(STATUS.Bad("Data invalid"));
	if (!TAG_DB.IsTagExist(tag.id))
		return res.send(STATUS.Bad("Tag not exist"));

	// Edit tag
	if (!TAG_DB.Edit(tag))
		return res.send(STATUS.Bad("Failed to edit tag"));

	res.send(STATUS.Ok(TAG_DB.Fetch(), "Edited Tag"));
});


module.exports = router;
