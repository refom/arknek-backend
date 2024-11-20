import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#controller/part.js";

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
	const part = req.body;
	const result = CONTROLLER.Add(part)
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
// Edit
router.put("/", (req, res) => {
	const part = req.body;
	const result = CONTROLLER.Edit(part)
	return SendResult(res, result);
})

// GET /update
// Update Data Structure
// router.get("/update", (req, res) => {
// 	const result = CONTROLLER.UpdateStructure();
// 	return SendResult(res, result);
// })

// // Get all part counter
// router.get("/counter/:id", (req, res) => {
// 	const id = req.params.id;
	
// 	if (!IsPartIdExist(id))
// 		return res.status(400).send("Part not exist");

// 	const loc_counter = GetLocationPartId(id).map(loc => loc.counter)
// 	const dum_counter = GetByPartId(id).counter.map(dum => dum.value)
// 	const temp = [...loc_counter, ...dum_counter]
// 	const all_counter = [...new Set(temp)].sort((a, b) => a - b)
// 	res.status(200).send(Ok(all_counter));
// })


export default router;
