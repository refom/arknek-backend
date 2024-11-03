const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const DUMMY_DB = require("../features/dummy-db");

// Get all dummies
router.get("/", (req, res) => {
	res.status(200).send(STATUS.Ok(DUMMY_DB.Fetch()));
})

// Add new dummy
router.post("/", (req, res) => {
	const dummy = req.body;

	if (!DUMMY_DB.IsDummyValid(dummy)) return res.status(400).send("Data invalid");
	if (DUMMY_DB.IsDummyCounterExist(dummy.part_id, dummy.counter)) return res.status(400).send("Counter already exist");

	if (!DUMMY_DB.Add(dummy)) return res.status(400).send("Failed to add dummy");
	res.status(200).send(STATUS.Ok(DUMMY_DB.Fetch(), "Added Dummy"));
});

// Delete counter dummy
router.delete("/:part/:counter", (req, res) => {
	const counter = parseInt(req.params.counter);
	const part_id = req.params.part;

	console.log(DUMMY_DB.IsDummyCounterExist(part_id, counter))
	if (!DUMMY_DB.IsDummyCounterExist(part_id, counter)) return res.status(400).send("Counter not exist");

	if (!DUMMY_DB.Delete(part_id, counter)) return res.status(400).send("Failed to delete counter");
	res.status(200).send(STATUS.Ok(DUMMY_DB.Fetch(), "Deleted Counter"));
});

module.exports = router;
