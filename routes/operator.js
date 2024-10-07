const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const OPERATOR_DB = require("../features/operator-db");

// Get all operators
router.get("/", (req, res) => {
	res.send(STATUS.Ok(OPERATOR_DB.Fetch(), "Found Operators"));
});

// Add new operator
router.post("/", (req, res) => {
	const operator = req.body;

	if (!OPERATOR_DB.IsOperatorValid(operator))
		return res.send(STATUS.Bad("Data invalid"));
	if (OPERATOR_DB.IsOperatorExist(operator.id))
		return res.send(STATUS.Bad("Operator already exist"));

	if (!OPERATOR_DB.Add(operator))
		return res.send(STATUS.Bad("Failed to add operator"));
	res.send(STATUS.Ok(OPERATOR_DB.Fetch(), "Added Operator"));
});

// Delete operator
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!OPERATOR_DB.IsOperatorExist(id))
		return res.send(STATUS.Bad("Operator not exist"));

	if (!OPERATOR_DB.Delete(id))
		return res.send(STATUS.Bad("Failed to delete operator"));
	res.send(STATUS.Ok(OPERATOR_DB.Fetch(), "Deleted Operator"));
});

// Edit operator
router.put("/", (req, res) => {
	const operator = req.body;

	if (!OPERATOR_DB.IsOperatorValid(operator))
		return res.send(STATUS.Bad("Data invalid"));
	if (!OPERATOR_DB.IsOperatorExist(operator.oldId))
		return res.send(STATUS.Bad("Operator not exist"));

	if (!OPERATOR_DB.Edit(operator))
		return res.send(STATUS.Bad("Failed to edit operator"));
	res.send(STATUS.Ok(OPERATOR_DB.Fetch(), "Edited Operator"));
});

// Backup
router.post("/backup", (req, res) => {
	if (!OPERATOR_DB.Backup())
		return res.send(STATUS.Bad("Failed to backup operators"));
	res.send(STATUS.Ok(OPERATOR_DB.Fetch(), "Backup operators"));
});

module.exports = router;
