const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const TAG_DB = require("../features/tag-db");
const { CreateGUID } = require("../features/helper/utils");

// Get all tags
router.get("/", (req, res) => {
	res.status(200).send(STATUS.Ok(TAG_DB.Fetch()));
});

// Add new tags
router.post("/", (req, res) => {
	const tag = req.body;

	if (!TAG_DB.IsTagValid(tag))
		return res.status(400).send("Data invalid");

	// Create ID
	tag.id = CreateGUID();
	if (TAG_DB.IsTagExist(tag)) return res.status(400).send("Tag already exist");

	if (!TAG_DB.Add(tag)) return res.send(STATUS.Bad("Failed to add tag"));
	res.status(200).send(STATUS.Ok(TAG_DB.Fetch(), "Added Tag"));
});

// Delete tag
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!TAG_DB.IsTagIdExist(id))
		return res.status(400).send("Tag not exist");
	if (!TAG_DB.Delete(id))
		return res.status(400).send("Failed to delete tag");
	res.status(200).send(STATUS.Ok(TAG_DB.Fetch(), "Deleted Tag"));
});

// Edit acc
router.put("/", (req, res) => {
	const tag = req.body;

	if (!(TAG_DB.IsTagValid(tag) && Boolean(tag.id))) return res.status(400).send("Data invalid");
	if (!TAG_DB.IsTagIdExist(tag.id)) return res.status(400).send("Tag not exist");
	if (TAG_DB.IsTagExist(tag)) return res.status(400).send("Tag already exist");

	// Edit tag
	if (!TAG_DB.Edit(tag))
		return res.status(400).send("Failed to edit tag");

	res.status(200).send(STATUS.Ok(TAG_DB.Fetch(), "Edited Tag"));
});

// Backup tag
router.get("/backup", (req, res) => {
	if (!TAG_DB.Backup())
		return res.status(400).send("Failed to backup tag");
	res.status(200).send(STATUS.Ok(TAG_DB.Fetch(), "Backup tag"));
});


module.exports = router;
