const express = require("express");
const router = express.Router();

const STATUS = require("./status");
const OPERATOR_DB = require("../features/operator-db");

// Get all operators
router.get("/", (req, res) => {
	res.status(200).send(STATUS.Ok(OPERATOR_DB.Fetch()));
});

// Add new operator
router.post("/", (req, res) => {
	const operator = req.body;

	if (!OPERATOR_DB.IsOperatorValid(operator))
		return res.status(400).send("Data invalid");
	if (OPERATOR_DB.IsOperatorExist(operator.id))
		return res.status(400).send("Operator already exist");

	if (!OPERATOR_DB.Add(operator))
		return res.status(400).send("Failed to add operator");
	res.status(200).send(STATUS.Ok(OPERATOR_DB.Fetch(), "Add Operator Success"));
});

// Delete operator
router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!OPERATOR_DB.IsOperatorExist(id))
		return res.status(400).send("Operator not exist");

	if (!OPERATOR_DB.Delete(id))
		return res.status(400).send("Failed to delete operator");
	res.status(200).send(STATUS.Ok(OPERATOR_DB.Fetch(), "Delete Operator Success"));
});

// Edit operator
router.put("/", (req, res) => {
	const operator = req.body;

	if (!OPERATOR_DB.IsOperatorValid(operator))
		return res.status(400).send("Data invalid");
	if (!OPERATOR_DB.IsOperatorExist(operator.oldId))
		return res.status(400).send("Operator not exist");

	if (!OPERATOR_DB.Edit(operator))
		return res.status(400).send("Failed to edit operator");
	res.status(200).send(STATUS.Ok(OPERATOR_DB.Fetch(), "Edit Operator Success"));
});

// Backup
router.get("/backup", (req, res) => {
	if (!OPERATOR_DB.Backup())
		return res.status(400).send("Failed to backup operators");
	res.status(200).send(STATUS.Ok(OPERATOR_DB.Fetch(), "Backup Operator Success"));
});

module.exports = router;
