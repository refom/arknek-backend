import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#src/controller/acc.js";

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
// Edit
router.put("/", (req, res) => {
	const acc = req.body;
	const result = CONTROLLER.Edit(acc)
	return SendResult(res, result);
})

// GET /update
// Update Data Structure
// router.get("/update", (req, res) => {
// 	const result = CONTROLLER.UpdateStructure();
// 	return SendResult(res, result);
// })

// // Sold acc
// router.post("/sold/", (req, res) => {
// 	const acc = req.body;

// 	if (!ACC_DB.IsAccExist(acc.id)) return res.status(400).send("Acc not exist");

// 	if (!SOLD_DB.Add(acc)) return res.status(400).send("Failed to sold acc");

// 	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Sold Acc"));
// })

// // Backup acc
// router.get("/backup", (req, res) => {
// 	if (!ACC_DB.Backup()) return res.status(400).send("Failed to backup acc");
// 	if (!LOCATION_DB.Backup()) return res.status(400).send("Failed to backup acc");
// 	res.status(200).send(STATUS.Ok(ACC_DB.GetAllWithLocation(), "Backup acc"));
// });


export default router;
