const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const DUMMY_DB = require("../features/dummy-db");

// Get all dummies
router.get("/", (req, res) => {
	res.send(STATUS.Ok(DUMMY_DB.Fetch(), "Found Dummies"));
})

// Add new dummy
router.post("/", (req, res) => {
	const dummy = req.body;

	if (!DUMMY_DB.IsDummyValid(dummy)) return res.send(STATUS.Bad("Data invalid"));
	if (DUMMY_DB.IsDummyCounterExist(dummy.part_id, dummy.counter)) return res.send(STATUS.Bad("Counter already exist"));

	if (!DUMMY_DB.Add(dummy)) return res.send(STATUS.Bad("Failed to add dummy"));
	res.send(STATUS.Ok(DUMMY_DB.Fetch(), "Added Dummy"));
});

// Delete counter dummy
router.delete("/:part/:counter", (req, res) => {
	const counter = req.params.counter;
	const part_id = req.params.part;

	if (!DUMMY_DB.IsDummyCounterExist(part_id, counter)) return res.send(STATUS.Bad("Counter not exist"));

	if (!DUMMY_DB.Delete(part_id, counter)) return res.send(STATUS.Bad("Failed to delete counter"));
	res.send(STATUS.Ok(DUMMY_DB.Fetch(), "Deleted Counter"));
});

module.exports = router;
