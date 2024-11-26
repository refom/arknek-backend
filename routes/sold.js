import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#src/controller/sold.js";

const SendResult = (res, result) => {
	if (!result.status) return Status.Bad(res, result.message);
	return Status.Ok(res, CONTROLLER.Fetch(), result.message);
}

// GET /
// Get All
router.get("/", (req, res) => {
	return Status.Ok(res, CONTROLLER.Fetch());
});

// POST /
// Add New
router.post("/", (req, res) => {
	const acc = req.body;
	const result = CONTROLLER.Add(acc)
	return SendResult(res, result);
})



export default router;
