import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#src/controller/dummy.js";

const SendResult = (res, result) => {
	if (!result.status) return Status.Bad(res, result.message);
	return Status.Ok(res, CONTROLLER.Fetch(), result.message);
}

// GET /
// Get All
router.get("/", (req, res) => {
	return Status.Ok(res, CONTROLLER.Fetch());
});

// GET /backup
// Backup
router.get("/backup", (req, res) => {
	const result = CONTROLLER.Backup();
	return SendResult(res, result);
})

// POST /
// Add New
router.post("/", (req, res) => {
	const acc = req.body;
	const result = CONTROLLER.Add(acc)
	return SendResult(res, result);
})

// DELETE /:id
// Delete
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	const result = CONTROLLER.Delete(id)
	return SendResult(res, result);
})

// PUT /
// Reuse
router.put("/:id", (req, res) => {
	const id = req.params.id;
	const result = CONTROLLER.Reuse(id)
	return SendResult(res, result);
})

// GET /update
// Update Data Structure
router.get("/update", (req, res) => {
	const result = CONTROLLER.Update();
	return SendResult(res, result);
})


export default router;
