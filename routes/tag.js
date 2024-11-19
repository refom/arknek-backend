import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#controller/tag.js";

const SendResult = (res, result) => {
	if (!result.status) return Status.Bad(res, result.message);
	return Status.Ok(res, CONTROLLER.Fetch(), result.message);
}

// GET /
// Get all Tag
router.get("/", (req, res) => {
	return Status.Ok(res, CONTROLLER.Fetch());
});

// GET /backup
// Backup Tag
router.get("/backup", (req, res) => {
	const result = CONTROLLER.Backup();
	return SendResult(res, result);
})

// POST /
// Add new Tag
router.post("/", (req, res) => {
	const tag = req.body;
	const result = CONTROLLER.Add(tag)
	return SendResult(res, result);
})

// DELETE /:id
// Delete Tag
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	const result = CONTROLLER.Delete(id)
	return SendResult(res, result);
})

// PUT /
// Edit Tag
router.put("/", (req, res) => {
	const tag = req.body;
	const result = CONTROLLER.Edit(tag)
	return SendResult(res, result);
})


export default router;
